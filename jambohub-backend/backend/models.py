# backend/models.py
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text,
    ForeignKey, create_engine, text
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import os

# Use persistent volume if available, fallback to local
db_path = "/data/jambohub.db" if os.path.exists("/data") else "./jambohub.db"
DATABASE_URL = f"sqlite:///{db_path}"

Base = declarative_base()
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class User(Base):
    """User account for JamboHub"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    
    # Role: admin, adult, youth, parent
    role = Column(String, nullable=False, default="youth")
    unit = Column(String, nullable=True)  # e.g., "Troop 123", "Crew 22"
    
    # Status
    active = Column(Boolean, default=True)
    password_changed = Column(Boolean, default=False)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = relationship("Message", back_populates="author")


class Channel(Base):
    """Communication channel"""
    __tablename__ = "channels"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, default="📢")
    
    # Channel type: public, unit, leadership, parent
    type = Column(String, nullable=False, default="public")
    
    # For unit channels, which unit this belongs to
    unit = Column(String, nullable=True)
    
    # Comma-separated roles that can view: "admin,adult,youth,parent"
    allowed_roles = Column(String, nullable=False, default="admin,adult,youth,parent")
    
    # Comma-separated roles that can post: "admin,adult"
    can_post_roles = Column(String, nullable=False, default="admin,adult")
    
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    messages = relationship("Message", back_populates="channel")


class Message(Base):
    """Message in a channel"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    channel_id = Column(String, ForeignKey("channels.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    content = Column(Text, nullable=False)
    pinned = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    channel = relationship("Channel", back_populates="messages")
    author = relationship("User", back_populates="messages")


def init_db():
    """Initialize database with tables and seed data"""
    print("[Database] Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    # Database optimizations
    try:
        with engine.connect() as conn:
            conn.execute(text("PRAGMA journal_mode=WAL"))
            conn.execute(text("PRAGMA cache_size=-20000"))
            conn.execute(text("PRAGMA synchronous=NORMAL"))
            
            # Indexes
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_messages_channel_created 
                ON messages(channel_id, created_at DESC)
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_users_role 
                ON users(role)
            """))
            
            conn.commit()
        print("[Database] Initialization complete")
    except Exception as e:
        print(f"[Database] Warning: {e}")
    
    # Seed default data if empty
    seed_default_data()


def seed_default_data():
    """Seed default channels and admin user"""
    from .auth import hash_password
    
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).first():
            print("[Database] Already seeded, skipping")
            return
        
        print("[Database] Seeding default data...")
        
        # Default admin user
        admin = User(
            id="admin1",
            name="Admin",
            email="admin@jambohub.org",
            password_hash=hash_password("Jambo2026!"),
            role="admin",
            unit="VAHC Leadership"
        )
        db.add(admin)
        
        # Sample users
        users_data = [
            ("leader1", "Kyle Haines", "kyle.haines@vahc.org", "adult", "Crew 22"),
            ("leader2", "Sarah Thompson", "sarah.thompson@vahc.org", "adult", "Troop 3125"),
            ("leader3", "Mike Chen", "mike.chen@vahc.org", "adult", "Troop 114"),
            ("scout1", "Liam H.", "liam.h@vahc.org", "youth", "Crew 22"),
            ("scout2", "Alex M.", "alex.m@vahc.org", "youth", "Troop 3125"),
            ("parent1", "Parent of Liam", "parent.liam@vahc.org", "parent", "Crew 22"),
        ]
        
        for uid, name, email, role, unit in users_data:
            user = User(
                id=uid,
                name=name,
                email=email,
                password_hash=hash_password("Jambo2026!"),
                role=role,
                unit=unit
            )
            db.add(user)
        
        # Default channels
        channels_data = [
            ("announcements", "Contingent Announcements", "Official updates from leadership", "📢", "public", None, "admin,adult,youth,parent", "admin,adult"),
            ("crew22", "Crew 22", "Crew 22 unit communication", "🏕️", "unit", "Crew 22", "admin,adult,youth,parent", "admin,adult,youth"),
            ("troop3125", "Troop 3125", "Troop 3125 unit communication", "🏕️", "unit", "Troop 3125", "admin,adult,youth,parent", "admin,adult,youth"),
            ("troop114", "Troop 114", "Troop 114 unit communication", "🏕️", "unit", "Troop 114", "admin,adult,youth,parent", "admin,adult,youth"),
            ("leadership", "Adult Leadership", "Leadership coordination - adults only", "👥", "leadership", None, "admin,adult", "admin,adult"),
            ("activities", "Activities & Schedule", "Daily schedules, merit badges, events", "📅", "public", None, "admin,adult,youth,parent", "admin,adult"),
            ("parents", "Family Updates", "Updates for families back home", "👨‍👩‍👧‍👦", "parent", None, "admin,adult,parent", "admin,adult"),
        ]
        
        for cid, name, desc, icon, ctype, unit, allowed, can_post in channels_data:
            channel = Channel(
                id=cid,
                name=name,
                description=desc,
                icon=icon,
                type=ctype,
                unit=unit,
                allowed_roles=allowed,
                can_post_roles=can_post
            )
            db.add(channel)
        
        # Welcome message
        welcome = Message(
            channel_id="announcements",
            user_id="admin1",
            content="Welcome to JamboHub! This is your central place for all contingent communication during the 2026 National Jamboree. Please explore the different channels.",
            pinned=True
        )
        db.add(welcome)
        
        db.commit()
        print("[Database] Seeding complete")
        
    except Exception as e:
        print(f"[Database] Seeding error: {e}")
        db.rollback()
    finally:
        db.close()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
