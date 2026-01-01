# backend/app.py
"""
JamboHub Backend API
Flask app with REST API for messaging, channels, and user management
"""

from flask import Flask, jsonify, request, g, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os
import logging

from .models import (
    init_db, SessionLocal, 
    User, Channel, Message
)
from .auth import (
    hash_password, verify_password, create_token,
    require_auth, require_admin
)
from .email_service import send_bulk_channel_notification

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='../static', static_url_path='')
CORS(app, origins=["*"])  # Configure appropriately for production

# Initialize database on startup
with app.app_context():
    init_db()


# ==========================================
# STATIC FILES & HEALTH CHECK
# ==========================================

@app.route('/')
def serve_index():
    """Serve the React app"""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/health')
def health_check():
    """Health check endpoint for Fly.io"""
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})


# ==========================================
# AUTHENTICATION
# ==========================================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login with email and password"""
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return jsonify({"error": "No account found with that email"}), 401
        
        if not user.active:
            return jsonify({"error": "Account is disabled"}), 401
        
        if not verify_password(password, user.password_hash):
            return jsonify({"error": "Incorrect password"}), 401
        
        # Create JWT token
        token = create_token(user.id, user.role)
        
        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "unit": user.unit
            }
        })
    finally:
        db.close()


@app.route('/api/auth/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "unit": user.unit,
            "email_notifications": user.email_notifications
        })
    finally:
        db.close()


@app.route('/api/auth/change-password', methods=['POST'])
@require_auth
def change_password():
    """Change user password"""
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
    """Get channels accessible to current user"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        channels = db.query(Channel).filter(Channel.active == True).all()
        
        # Filter channels based on user role and unit
        accessible = []
        for channel in channels:
            allowed_roles = channel.allowed_roles.split(',')
            
            # Check role access
            if user.role not in allowed_roles and 'admin' not in [user.role]:
                continue
            
            # Check unit access for unit channels
            if channel.type == 'unit' and channel.unit != user.unit:
                if user.role != 'admin':
                    continue
            
            accessible.append({
                "id": channel.id,
                "name": channel.name,
                "description": channel.description,
                "icon": channel.icon,
                "type": channel.type,
                "unit": channel.unit,
                "canPost": user.role in channel.can_post_roles.split(',') or user.role == 'admin'
            })
        
        return jsonify(accessible)
    finally:
        db.close()


# ==========================================
# MESSAGES
# ==========================================

@app.route('/api/channels/<channel_id>/messages', methods=['GET'])
@require_auth
def get_messages(channel_id):
    """Get messages in a channel"""
    db = SessionLocal()
    try:
        # Verify channel access
        user = db.query(User).filter(User.id == g.user_id).first()
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        
        if not channel:
            return jsonify({"error": "Channel not found"}), 404
        
        # Check access
        allowed_roles = channel.allowed_roles.split(',')
        if user.role not in allowed_roles and user.role != 'admin':
            return jsonify({"error": "Access denied"}), 403
        
        if channel.type == 'unit' and channel.unit != user.unit and user.role != 'admin':
            return jsonify({"error": "Access denied"}), 403
        
        # Get messages
        messages = (
            db.query(Message)
            .filter(Message.channel_id == channel_id)
            .order_by(Message.created_at.asc())
            .all()
        )
        
        result = []
        for msg in messages:
            author = db.query(User).filter(User.id == msg.user_id).first()
            result.append({
                "id": msg.id,
                "content": msg.content,
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
    """Post a new message to a channel"""
    data = request.get_json()
    content = data.get('content', '').strip()
    
    if not content:
        return jsonify({"error": "Message content required"}), 400
    
    db = SessionLocal()
    try:
        # Verify channel and permissions
        user = db.query(User).filter(User.id == g.user_id).first()
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        
        if not channel:
            return jsonify({"error": "Channel not found"}), 404
        
        # Check post permission
        can_post_roles = channel.can_post_roles.split(',')
        if user.role not in can_post_roles and user.role != 'admin':
            return jsonify({"error": "You cannot post in this channel"}), 403
        
        # Create message
        message = Message(
            channel_id=channel_id,
            user_id=user.id,
            content=content
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        
        # Send email notifications to channel members
        try:
            recipients = get_channel_notification_recipients(db, channel, user)
            if recipients:
                send_bulk_channel_notification(
                    recipients=recipients,
                    channel_name=channel.name,
                    sender_name=user.name,
                    message_preview=content
                )
        except Exception as e:
            logger.error(f"Error sending notifications: {e}")
        
        return jsonify({
            "id": message.id,
            "content": message.content,
            "pinned": message.pinned,
            "createdAt": message.created_at.isoformat(),
            "author": {
                "id": user.id,
                "name": user.name,
                "role": user.role
            }
        }), 201
    finally:
        db.close()


def get_channel_notification_recipients(db, channel, sender):
    """Get list of users to notify about a new message"""
    allowed_roles = channel.allowed_roles.split(',')
    
    # Query users who can access this channel and have notifications enabled
    query = db.query(User).filter(
        User.active == True,
        User.email_notifications == True,
        User.id != sender.id,  # Don't notify sender
        User.role.in_(allowed_roles)
    )
    
    # For unit channels, filter by unit
    if channel.type == 'unit' and channel.unit:
        query = query.filter(User.unit == channel.unit)
    
    users = query.all()
    
    return [{"email": u.email, "name": u.name} for u in users]


@app.route('/api/messages/<int:message_id>/pin', methods=['POST'])
@require_auth
def toggle_pin_message(message_id):
    """Toggle pin status of a message (admin/adult only)"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == g.user_id).first()
        
        if user.role not in ['admin', 'adult']:
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

@app.route('/api/admin/users', methods=['GET'])
@require_admin
def get_all_users():
    """Get all users (admin only)"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        return jsonify([{
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "unit": u.unit,
            "active": u.active,
            "email_notifications": u.email_notifications,
            "created_at": u.created_at.isoformat() if u.created_at else None
        } for u in users])
    finally:
        db.close()


@app.route('/api/admin/users', methods=['POST'])
@require_admin
def create_user():
    """Create a new user (admin only)"""
    data = request.get_json()
    
    required = ['name', 'email', 'role']
    if not all(data.get(f) for f in required):
        return jsonify({"error": "Name, email, and role are required"}), 400
    
    db = SessionLocal()
    try:
        # Check if email already exists
        existing = db.query(User).filter(User.email == data['email'].lower()).first()
        if existing:
            return jsonify({"error": "Email already exists"}), 400
        
        # Generate user ID
        user_id = f"user-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        user = User(
            id=user_id,
            name=data['name'],
            email=data['email'].lower(),
            password_hash=hash_password(data.get('password', 'Jambo2026!')),
            role=data['role'],
            unit=data.get('unit')
        )
        db.add(user)
        db.commit()
        
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "unit": user.unit
        }), 201
    finally:
        db.close()


@app.route('/api/admin/users/<user_id>', methods=['PUT'])
@require_admin
def update_user(user_id):
    """Update a user (admin only)"""
    data = request.get_json()
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email'].lower()
        if 'role' in data:
            user.role = data['role']
        if 'unit' in data:
            user.unit = data['unit']
        if 'active' in data:
            user.active = data['active']
        if 'password' in data:
            user.password_hash = hash_password(data['password'])
        
        db.commit()
        
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "unit": user.unit,
            "active": user.active
        })
    finally:
        db.close()


@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
@require_admin
def delete_user(user_id):
    """Delete a user (admin only)"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Don't allow deleting yourself
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
    """Reset a user's password to default (admin only)"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user.password_hash = hash_password("Jambo2026!")
        user.password_changed = False
        db.commit()
        
        return jsonify({"message": "Password reset to Jambo2026!"})
    finally:
        db.close()


# ==========================================
# USER SETTINGS
# ==========================================

@app.route('/api/settings/notifications', methods=['PUT'])
@require_auth
def update_notification_settings():
    """Update user notification preferences"""
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
# RUN SERVER
# ==========================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
