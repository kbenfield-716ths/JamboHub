# backend/app.py
from flask import Flask, jsonify, request, g, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os
import logging
import json

from .models import init_db, SessionLocal, User, Channel, Message, Unit, InfoCard, PushSubscription
from .auth import hash_password, verify_password, create_token, require_auth, require_admin
from .email_service import send_bulk_channel_notification

# Push notification imports
try:
    from pywebpush import webpush, WebPushException
    from cryptography.hazmat.primitives.asymmetric import ec
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives import serialization
    import base64
    PUSH_ENABLED = True
except ImportError as e:
    PUSH_ENABLED = False
    print(f"Push notifications disabled: {e}")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# VAPID configuration - persistent keys
VAPID_EMAIL = "mailto:vahc.jamboree@gmail.com"
VAPID_PRIVATE_KEY_FILE = "/data/vapid_private.pem"
VAPID_PRIVATE_KEY = None
VAPID_PUBLIC_KEY_BASE64 = None

def init_vapid():
    """Initialize VAPID keys - load from file or generate new ones"""
    global VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY_BASE64, PUSH_ENABLED
    
    if not PUSH_ENABLED:
        return
    
    try:
        if os.path.exists(VAPID_PRIVATE_KEY_FILE):
            # Load existing key
            with open(VAPID_PRIVATE_KEY_FILE, 'rb') as f:
                VAPID_PRIVATE_KEY = serialization.load_pem_private_key(
                    f.read(), password=None, backend=default_backend()
                )
            logger.info("Loaded existing VAPID keys")
        else:
            # Generate new keys
            VAPID_PRIVATE_KEY = ec.generate_private_key(ec.SECP256R1(), default_backend())
            
            # Save private key
            pem = VAPID_PRIVATE_KEY.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
            with open(VAPID_PRIVATE_KEY_FILE, 'wb') as f:
                f.write(pem)
            logger.info("Generated new VAPID keys")
        
        # Get public key as base64 for frontend (uncompressed point format)
        public_key = VAPID_PRIVATE_KEY.public_key()
        public_numbers = public_key.public_numbers()
        x_bytes = public_numbers.x.to_bytes(32, 'big')
        y_bytes = public_numbers.y.to_bytes(32, 'big')
        # Uncompressed point: 0x04 + x + y
        public_bytes = b'\x04' + x_bytes + y_bytes
        VAPID_PUBLIC_KEY_BASE64 = base64.urlsafe_b64encode(public_bytes).decode('utf-8').rstrip('=')
        
        logger.info(f"VAPID public key ready: {VAPID_PUBLIC_KEY_BASE64[:30]}...")
        
    except Exception as e:
        logger.error(f"Failed to initialize VAPID: {e}")
        import traceback
        traceback.print_exc()
        PUSH_ENABLED = False

app = Flask(__name__, static_folder='../static', static_url_path='')
CORS(app, origins=["*"])

with app.app_context():
    init_db()
    init_vapid()


# ==========================================
# STATIC FILES & HEALTH
# ==========================================

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})


# ==========================================
# AUTHENTICATION
# ==========================================

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    login_id = data.get('email', '').strip()
    password = data.get('password', '')
    
    if not login_id or not password:
        return jsonify({"error": "Username/email and password required"}), 400
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == login_id).first()
        if not user:
            user = db.query(User).filter(User.email == login_id.lower()).first()
        
        if not user:
            return jsonify({"error": "No account found"}), 401
        if not user.active:
            return jsonify({"error": "Account is disabled"}), 401
        if not verify_password(password, user.password_hash):
            return jsonify({"error": "Incorrect password"}), 401
        
        token = create_token(user.id, user.role)
        
        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "firstName": user.first_name,
                "lastName": user.last_name,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "age": user.age,
                "gender": user.gender,
                "role": user.role,
                "position": user.position,
                "unit": user.unit,
                "patrol": user.patrol,
                "emergencyContactName": user.emergency_contact_name,
                "emergencyContactPhone": user.emergency_contact_phone,
                "emailNotifications": user.email_notifications
            }
        })
    finally:
        db.close()


@app.route('/api/auth/me', methods=['GET'])
@require_auth
def get_current_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "id": user.id,
            "username": user.username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "age": user.age,
            "gender": user.gender,
            "role": user.role,
            "position": user.position,
            "unit": user.unit,
            "patrol": user.patrol,
            "emergencyContactName": user.emergency_contact_name,
            "emergencyContactPhone": user.emergency_contact_phone,
            "emailNotifications": user.email_notifications
        })
    finally:
        db.close()


@app.route('/api/auth/change-password', methods=['POST'])
@require_auth
def change_password():
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({"error": "Current and new password required"}), 400
    if len(new_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        if not verify_password(current_password, user.password_hash):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        user.password_hash = hash_password(new_password)
        user.password_changed = True
        db.commit()
        return jsonify({"message": "Password changed successfully"})
    finally:
        db.close()


# ==========================================
# CHANNELS
# ==========================================

@app.route('/api/channels', methods=['GET'])
@require_auth
def get_channels():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        channels = db.query(Channel).filter(Channel.active == True).all()
        
        accessible = []
        for channel in channels:
            allowed_roles = channel.allowed_roles.split(',')
            if user.role != 'admin' and user.role not in allowed_roles:
                continue
            if channel.type == 'unit' and channel.unit != user.unit and user.role != 'admin':
                continue
            
            channel_data = {
                "id": channel.id,
                "name": channel.name,
                "description": channel.description,
                "icon": channel.icon,
                "type": channel.type,
                "unit": channel.unit,
                "canPost": user.role in channel.can_post_roles.split(',') or user.role == 'admin'
            }
            
            # Include notification settings for admins
            if user.role == 'admin':
                channel_data["emailNotifications"] = channel.email_notifications if hasattr(channel, 'email_notifications') else False
                channel_data["pushNotifications"] = channel.push_notifications if hasattr(channel, 'push_notifications') else True
            
            accessible.append(channel_data)
        
        return jsonify(accessible)
    finally:
        db.close()


@app.route('/api/admin/channels/<channel_id>', methods=['PUT'])
@require_admin
def update_channel(channel_id):
    """Update channel settings (admin only)"""
    data = request.get_json()
    db = SessionLocal()
    try:
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        if not channel:
            return jsonify({"error": "Channel not found"}), 404
        
        # Update notification settings
        if 'emailNotifications' in data:
            channel.email_notifications = data['emailNotifications']
        if 'pushNotifications' in data:
            channel.push_notifications = data['pushNotifications']
        if 'name' in data:
            channel.name = data['name']
        if 'description' in data:
            channel.description = data['description']
        if 'icon' in data:
            channel.icon = data['icon']
        
        db.commit()
        
        return jsonify({
            "id": channel.id,
            "name": channel.name,
            "emailNotifications": channel.email_notifications,
            "pushNotifications": channel.push_notifications,
            "message": "Channel updated"
        })
    finally:
        db.close()


# ==========================================
# MESSAGES
# ==========================================

@app.route('/api/channels/<channel_id>/messages', methods=['GET'])
@require_auth
def get_messages(channel_id):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        
        if not channel:
            return jsonify({"error": "Channel not found"}), 404
        
        allowed_roles = channel.allowed_roles.split(',')
        if user.role not in allowed_roles and user.role != 'admin':
            return jsonify({"error": "Access denied"}), 403
        if channel.type == 'unit' and channel.unit != user.unit and user.role != 'admin':
            return jsonify({"error": "Access denied"}), 403
        
        messages = db.query(Message).filter(Message.channel_id == channel_id).order_by(Message.created_at.asc()).all()
        
        result = []
        for msg in messages:
            author = db.query(User).filter(User.id == msg.user_id).first()
            result.append({
                "id": msg.id,
                "content": msg.content,
                "imageUrl": msg.image_url,
                "pinned": msg.pinned,
                "createdAt": msg.created_at.isoformat(),
                "author": {
                    "id": author.id if author else None,
                    "name": author.name if author else "Unknown",
                    "role": author.role if author else None
                }
            })
        
        return jsonify(result)
    finally:
        db.close()


@app.route('/api/channels/<channel_id>/messages', methods=['POST'])
@require_auth
def post_message(channel_id):
    data = request.get_json()
    content = data.get('content', '').strip()
    image_url = data.get('imageUrl')  # Optional image URL
    
    if not content and not image_url:
        return jsonify({"error": "Message content or image required"}), 400
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        
        if not channel:
            return jsonify({"error": "Channel not found"}), 404
        
        can_post_roles = channel.can_post_roles.split(',')
        if user.role not in can_post_roles and user.role != 'admin':
            return jsonify({"error": "You cannot post in this channel"}), 403
        
        message = Message(
            channel_id=channel_id, 
            user_id=user.id, 
            content=content or "",
            image_url=image_url
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        
        # Send email notifications (only if enabled for this channel)
        if channel.email_notifications:
            try:
                recipients = get_channel_notification_recipients(db, channel, user)
                if recipients:
                    send_bulk_channel_notification(recipients=recipients, channel_name=channel.name, sender_name=user.name, message_preview=content or "[Photo]")
            except Exception as e:
                logger.error(f"Error sending email notifications: {e}")
        
        # Send push notifications (only if enabled for this channel)
        if channel.push_notifications:
            try:
                preview = content[:100] + "..." if len(content) > 100 else (content or "📷 Photo")
                send_push_notification(
                    title=f"#{channel.name}",
                    body=f"{user.first_name or user.name}: {preview}",
                    url=f"/?channel={channel_id}",
                    exclude_user_id=user.id
                )
            except Exception as e:
                logger.error(f"Error sending push notifications: {e}")
        
        return jsonify({
            "id": message.id,
            "content": message.content,
            "imageUrl": message.image_url,
            "pinned": message.pinned,
            "createdAt": message.created_at.isoformat(),
            "author": {"id": user.id, "name": user.name, "role": user.role}
        }), 201
    finally:
        db.close()


import uuid
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/data/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
@require_auth
def upload_image():
    """Upload an image file"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Use PNG, JPG, GIF, or WebP."}), 400
    
    # Check file size
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Seek back to start
    
    if size > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Maximum 10MB."}), 400
    
    try:
        # Ensure upload directory exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        file.save(filepath)
        
        # Return URL path
        image_url = f"/uploads/{filename}"
        
        return jsonify({"url": image_url})
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        return jsonify({"error": "Upload failed"}), 500


@app.route('/uploads/<filename>')
def serve_upload(filename):
    """Serve uploaded files"""
    return send_from_directory(UPLOAD_FOLDER, filename)


def get_channel_notification_recipients(db, channel, sender):
    allowed_roles = channel.allowed_roles.split(',')
    query = db.query(User).filter(User.active == True, User.email_notifications == True, User.id != sender.id, User.role.in_(allowed_roles))
    if channel.type == 'unit' and channel.unit:
        query = query.filter(User.unit == channel.unit)
    users = query.all()
    return [{"email": u.email, "name": u.name} for u in users]


@app.route('/api/messages/<int:message_id>/pin', methods=['POST'])
@require_auth
def toggle_pin_message(message_id):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        if user.role not in ['admin', 'adult_leader']:
            return jsonify({"error": "Permission denied"}), 403
        
        message = db.query(Message).filter(Message.id == message_id).first()
        if not message:
            return jsonify({"error": "Message not found"}), 404
        
        message.pinned = not message.pinned
        db.commit()
        return jsonify({"pinned": message.pinned})
    finally:
        db.close()


# ==========================================
# ADMIN: USER MANAGEMENT
# ==========================================

def user_to_dict(u):
    return {
        "id": u.id,
        "username": u.username,
        "firstName": u.first_name,
        "lastName": u.last_name,
        "name": u.name,
        "email": u.email,
        "phone": u.phone,
        "age": u.age,
        "gender": u.gender,
        "role": u.role,
        "position": u.position,
        "unit": u.unit,
        "patrol": u.patrol,
        "emergencyContactName": u.emergency_contact_name,
        "emergencyContactPhone": u.emergency_contact_phone,
        "active": u.active,
        "emailNotifications": u.email_notifications,
        "createdAt": u.created_at.isoformat() if u.created_at else None
    }


@app.route('/api/admin/users', methods=['GET'])
@require_admin
def get_all_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        return jsonify([user_to_dict(u) for u in users])
    finally:
        db.close()


@app.route('/api/admin/users', methods=['POST'])
@require_admin
def create_user():
    data = request.get_json()
    
    if not data.get('firstName') or not data.get('lastName') or not data.get('email') or not data.get('role'):
        return jsonify({"error": "First name, last name, email, and role are required"}), 400
    
    db = SessionLocal()
    try:
        # Check if username already exists (must be unique)
        username = data.get('username', '').strip() or None
        if username:
            existing_username = db.query(User).filter(User.username == username).first()
            if existing_username:
                return jsonify({"error": f"Username '{username}' already taken"}), 400
        
        user_id = f"user-{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}"
        
        # Password based on role
        default_password = "The3Bears" if data['role'] == 'admin' else "Jambo2026!"
        password = data.get('password') or default_password
        
        user = User(
            id=user_id,
            username=username,
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'].lower(),
            phone=data.get('phone'),
            age=data.get('age'),
            gender=data.get('gender'),
            role=data['role'],
            position=data.get('position'),
            unit=data.get('unit'),
            patrol=data.get('patrol'),
            emergency_contact_name=data.get('emergencyContactName'),
            emergency_contact_phone=data.get('emergencyContactPhone'),
            password_hash=hash_password(password)
        )
        db.add(user)
        db.commit()
        
        return jsonify(user_to_dict(user)), 201
    finally:
        db.close()


@app.route('/api/admin/users/<user_id>', methods=['PUT'])
@require_admin
def update_user(user_id):
    data = request.get_json()
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if 'username' in data:
            new_username = data['username'].strip() if data['username'] else None
            if new_username and new_username != user.username:
                existing = db.query(User).filter(User.username == new_username).first()
                if existing:
                    return jsonify({"error": "Username already taken"}), 400
            user.username = new_username
        
        if 'firstName' in data: user.first_name = data['firstName']
        if 'lastName' in data: user.last_name = data['lastName']
        if 'email' in data: user.email = data['email'].lower()
        if 'phone' in data: user.phone = data['phone']
        if 'age' in data: user.age = data['age']
        if 'gender' in data: user.gender = data['gender']
        if 'role' in data: user.role = data['role']
        if 'position' in data: user.position = data['position']
        if 'unit' in data: user.unit = data['unit']
        if 'patrol' in data: user.patrol = data['patrol']
        if 'emergencyContactName' in data: user.emergency_contact_name = data['emergencyContactName']
        if 'emergencyContactPhone' in data: user.emergency_contact_phone = data['emergencyContactPhone']
        if 'active' in data: user.active = data['active']
        if 'password' in data and data['password']:
            user.password_hash = hash_password(data['password'])
        
        db.commit()
        return jsonify(user_to_dict(user))
    finally:
        db.close()


@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
@require_admin
def delete_user(user_id):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        if user.id == g.user_id:
            return jsonify({"error": "Cannot delete your own account"}), 400
        
        db.delete(user)
        db.commit()
        return jsonify({"message": "User deleted"})
    finally:
        db.close()


@app.route('/api/admin/users/<user_id>/reset-password', methods=['POST'])
@require_admin
def reset_user_password(user_id):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        default_password = "The3Bears" if user.role == "admin" else "Jambo2026!"
        user.password_hash = hash_password(default_password)
        user.password_changed = False
        db.commit()
        
        return jsonify({"message": f"Password reset to {default_password}"})
    finally:
        db.close()


# ==========================================
# ADMIN: UNIT MANAGEMENT
# ==========================================

@app.route('/api/admin/units', methods=['GET'])
@require_admin
def get_all_units():
    db = SessionLocal()
    try:
        units = db.query(Unit).all()
        return jsonify([{"id": u.id, "name": u.name, "createdAt": u.created_at.isoformat() if u.created_at else None} for u in units])
    finally:
        db.close()


@app.route('/api/admin/units', methods=['POST'])
@require_admin
def create_unit():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({"error": "Unit name is required"}), 400
    
    db = SessionLocal()
    try:
        existing = db.query(Unit).filter(Unit.name == data['name']).first()
        if existing:
            return jsonify({"error": "Unit already exists"}), 400
        
        unit_id = f"unit-{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}"
        unit = Unit(id=unit_id, name=data['name'])
        db.add(unit)
        
        channel_id = data['name'].lower().replace(' ', '-').replace('#', '')
        channel = Channel(
            id=channel_id,
            name=data['name'],
            description=f"{data['name']} unit communication",
            icon="🏕️",
            type="unit",
            unit=data['name'],
            allowed_roles="admin,adult_leader,youth,parent",
            can_post_roles="admin,adult_leader,youth"
        )
        db.add(channel)
        db.commit()
        
        return jsonify({"id": unit.id, "name": unit.name}), 201
    finally:
        db.close()


@app.route('/api/admin/units/<unit_id>', methods=['PUT'])
@require_admin
def update_unit(unit_id):
    data = request.get_json()
    
    db = SessionLocal()
    try:
        unit = db.query(Unit).filter(Unit.id == unit_id).first()
        if not unit:
            return jsonify({"error": "Unit not found"}), 404
        
        old_name = unit.name
        if 'name' in data and data['name'] != old_name:
            unit.name = data['name']
            channel = db.query(Channel).filter(Channel.unit == old_name).first()
            if channel:
                channel.name = data['name']
                channel.unit = data['name']
                channel.description = f"{data['name']} unit communication"
            
            users = db.query(User).filter(User.unit == old_name).all()
            for user in users:
                user.unit = data['name']
        
        db.commit()
        return jsonify({"id": unit.id, "name": unit.name})
    finally:
        db.close()


@app.route('/api/admin/units/<unit_id>', methods=['DELETE'])
@require_admin
def delete_unit(unit_id):
    db = SessionLocal()
    try:
        unit = db.query(Unit).filter(Unit.id == unit_id).first()
        if not unit:
            return jsonify({"error": "Unit not found"}), 404
        
        channel = db.query(Channel).filter(Channel.unit == unit.name).first()
        if channel:
            db.query(Message).filter(Message.channel_id == channel.id).delete()
            db.delete(channel)
        
        users = db.query(User).filter(User.unit == unit.name).all()
        for user in users:
            user.unit = None
        
        db.delete(unit)
        db.commit()
        return jsonify({"message": "Unit deleted"})
    finally:
        db.close()


# ==========================================
# USER SETTINGS
# ==========================================

@app.route('/api/settings/notifications', methods=['PUT'])
@require_auth
def update_notification_settings():
    data = request.get_json()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        if 'email_notifications' in data:
            user.email_notifications = data['email_notifications']
        db.commit()
        return jsonify({"email_notifications": user.email_notifications})
    finally:
        db.close()


# ==========================================
# STATS
# ==========================================

@app.route('/api/stats', methods=['GET'])
@require_auth
def get_stats():
    """Get contingent statistics"""
    db = SessionLocal()
    try:
        youth_count = db.query(User).filter(User.role == 'youth', User.active == True).count()
        adult_count = db.query(User).filter(User.role.in_(['admin', 'adult_leader']), User.active == True).count()
        parent_count = db.query(User).filter(User.role == 'parent', User.active == True).count()
        total_count = db.query(User).filter(User.active == True).count()
        
        return jsonify({
            "youth": youth_count,
            "adults": adult_count,
            "parents": parent_count,
            "total": total_count,
            "youthCapacity": 36,
            "youthRemaining": 36 - youth_count
        })
    finally:
        db.close()


# ==========================================
# INFO CARDS (Dynamic Home Page Content)
# ==========================================

@app.route('/api/info-cards', methods=['GET'])
@require_auth
def get_info_cards():
    """Get all active info cards"""
    db = SessionLocal()
    try:
        cards = db.query(InfoCard).filter(InfoCard.active == True).order_by(InfoCard.sort_order, InfoCard.created_at.desc()).all()
        return jsonify([{
            "id": c.id,
            "title": c.title,
            "content": c.content,
            "icon": c.icon,
            "color": c.color,
            "linkUrl": c.link_url,
            "linkText": c.link_text,
            "sortOrder": c.sort_order
        } for c in cards])
    finally:
        db.close()


@app.route('/api/admin/info-cards', methods=['GET'])
@require_admin
def get_all_info_cards():
    """Get all info cards including inactive (admin only)"""
    db = SessionLocal()
    try:
        cards = db.query(InfoCard).order_by(InfoCard.sort_order, InfoCard.created_at.desc()).all()
        return jsonify([{
            "id": c.id,
            "title": c.title,
            "content": c.content,
            "icon": c.icon,
            "color": c.color,
            "linkUrl": c.link_url,
            "linkText": c.link_text,
            "sortOrder": c.sort_order,
            "active": c.active,
            "createdAt": c.created_at.isoformat() if c.created_at else None
        } for c in cards])
    finally:
        db.close()


@app.route('/api/admin/info-cards', methods=['POST'])
@require_admin
def create_info_card():
    """Create a new info card (admin only)"""
    data = request.get_json()
    
    if not data.get('title') or not data.get('content'):
        return jsonify({"error": "Title and content are required"}), 400
    
    db = SessionLocal()
    try:
        card = InfoCard(
            title=data['title'],
            content=data['content'],
            icon=data.get('icon', '📌'),
            color=data.get('color', '#7C3AED'),
            link_url=data.get('linkUrl'),
            link_text=data.get('linkText'),
            sort_order=data.get('sortOrder', 0),
            active=data.get('active', True)
        )
        db.add(card)
        db.commit()
        db.refresh(card)
        
        return jsonify({
            "id": card.id,
            "title": card.title,
            "content": card.content,
            "icon": card.icon,
            "color": card.color,
            "linkUrl": card.link_url,
            "linkText": card.link_text,
            "sortOrder": card.sort_order,
            "active": card.active
        }), 201
    finally:
        db.close()


@app.route('/api/admin/info-cards/<int:card_id>', methods=['PUT'])
@require_admin
def update_info_card(card_id):
    """Update an info card (admin only)"""
    data = request.get_json()
    
    db = SessionLocal()
    try:
        card = db.query(InfoCard).filter(InfoCard.id == card_id).first()
        if not card:
            return jsonify({"error": "Card not found"}), 404
        
        if 'title' in data: card.title = data['title']
        if 'content' in data: card.content = data['content']
        if 'icon' in data: card.icon = data['icon']
        if 'color' in data: card.color = data['color']
        if 'linkUrl' in data: card.link_url = data['linkUrl']
        if 'linkText' in data: card.link_text = data['linkText']
        if 'sortOrder' in data: card.sort_order = data['sortOrder']
        if 'active' in data: card.active = data['active']
        
        db.commit()
        
        return jsonify({
            "id": card.id,
            "title": card.title,
            "content": card.content,
            "icon": card.icon,
            "color": card.color,
            "linkUrl": card.link_url,
            "linkText": card.link_text,
            "sortOrder": card.sort_order,
            "active": card.active
        })
    finally:
        db.close()


@app.route('/api/admin/info-cards/<int:card_id>', methods=['DELETE'])
@require_admin
def delete_info_card(card_id):
    """Delete an info card (admin only)"""
    db = SessionLocal()
    try:
        card = db.query(InfoCard).filter(InfoCard.id == card_id).first()
        if not card:
            return jsonify({"error": "Card not found"}), 404
        
        db.delete(card)
        db.commit()
        return jsonify({"message": "Card deleted"})
    finally:
        db.close()


# ==========================================
# PUSH NOTIFICATIONS
# ==========================================

@app.route('/api/push/vapid-public-key', methods=['GET'])
@require_auth
def get_vapid_public_key():
    """Get the VAPID public key for push subscription"""
    if not PUSH_ENABLED:
        return jsonify({"error": "Push notifications not available"}), 503
    return jsonify({"publicKey": VAPID_PUBLIC_KEY_BASE64})


@app.route('/api/push/subscribe', methods=['POST'])
@require_auth
def subscribe_push():
    """Subscribe to push notifications"""
    data = request.get_json()
    
    if not data.get('endpoint') or not data.get('keys'):
        return jsonify({"error": "Invalid subscription data"}), 400
    
    db = SessionLocal()
    try:
        # Check if subscription already exists
        existing = db.query(PushSubscription).filter(
            PushSubscription.endpoint == data['endpoint']
        ).first()
        
        if existing:
            # Update existing subscription
            existing.user_id = g.user_id
            existing.p256dh_key = data['keys'].get('p256dh')
            existing.auth_key = data['keys'].get('auth')
        else:
            # Create new subscription
            subscription = PushSubscription(
                user_id=g.user_id,
                endpoint=data['endpoint'],
                p256dh_key=data['keys'].get('p256dh'),
                auth_key=data['keys'].get('auth')
            )
            db.add(subscription)
        
        db.commit()
        return jsonify({"message": "Subscribed to push notifications"})
    finally:
        db.close()


@app.route('/api/push/unsubscribe', methods=['POST'])
@require_auth
def unsubscribe_push():
    """Unsubscribe from push notifications"""
    data = request.get_json()
    
    db = SessionLocal()
    try:
        if data.get('endpoint'):
            db.query(PushSubscription).filter(
                PushSubscription.endpoint == data['endpoint']
            ).delete()
        else:
            # Unsubscribe all for this user
            db.query(PushSubscription).filter(
                PushSubscription.user_id == g.user_id
            ).delete()
        
        db.commit()
        return jsonify({"message": "Unsubscribed from push notifications"})
    finally:
        db.close()


def send_push_notification(title, body, url=None, exclude_user_id=None):
    """Send push notification to all subscribers"""
    if not PUSH_ENABLED:
        logger.warning("Push notifications not enabled - pywebpush not installed")
        return
    
    db = SessionLocal()
    try:
        query = db.query(PushSubscription)
        if exclude_user_id:
            query = query.filter(PushSubscription.user_id != exclude_user_id)
        
        subscriptions = query.all()
        
        payload = json.dumps({
            "title": title,
            "body": body,
            "url": url or "/",
            "icon": "/jambo-icon-192.png",
            "badge": "/jambo-icon-192.png"
        })
        
        failed_endpoints = []
        
        for sub in subscriptions:
            try:
                webpush(
                    subscription_info={
                        "endpoint": sub.endpoint,
                        "keys": {
                            "p256dh": sub.p256dh_key,
                            "auth": sub.auth_key
                        }
                    },
                    data=payload,
                    vapid_private_key=VAPID_PRIVATE_KEY_FILE,
                    vapid_claims={"sub": VAPID_EMAIL}
                )
                logger.info(f"Push sent to user {sub.user_id}")
            except WebPushException as e:
                logger.error(f"Push failed for {sub.endpoint}: {e}")
                # If subscription is invalid (410 Gone or 404), mark for removal
                if e.response and e.response.status_code in [404, 410]:
                    failed_endpoints.append(sub.endpoint)
        
        # Clean up invalid subscriptions
        if failed_endpoints:
            db.query(PushSubscription).filter(
                PushSubscription.endpoint.in_(failed_endpoints)
            ).delete(synchronize_session=False)
            db.commit()
            
    except Exception as e:
        logger.error(f"Error sending push notifications: {e}")
    finally:
        db.close()


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
