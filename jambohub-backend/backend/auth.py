# backend/auth.py
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, g

# Secret key for JWT - use environment variable in production
SECRET_KEY = os.getenv("JWT_SECRET", "jambohub-dev-secret-change-in-production")
TOKEN_EXPIRY_HOURS = 24 * 7  # 1 week


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its hash"""
    try:
        return bcrypt.checkpw(
            password.encode('utf-8'), 
            password_hash.encode('utf-8')
        )
    except Exception:
        return False


def create_token(user_id: str, role: str) -> str:
    """Create a JWT token for a user"""
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({"error": "Authentication required"}), 401
        
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # Store user info in Flask g object
        g.user_id = payload.get("user_id")
        g.user_role = payload.get("role")
        
        return f(*args, **kwargs)
    
    return decorated


def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    @require_auth
    def decorated(*args, **kwargs):
        if g.user_role != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    
    return decorated


def require_adult(f):
    """Decorator to require adult or admin role"""
    @wraps(f)
    @require_auth
    def decorated(*args, **kwargs):
        if g.user_role not in ["admin", "adult"]:
            return jsonify({"error": "Adult access required"}), 403
        return f(*args, **kwargs)
    
    return decorated
