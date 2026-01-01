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
    username = Column(String, unique=True, nullable=True, index=True)
    
    # Name fields
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    
    # Contact info - email is NOT unique to allow family members to share
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    
    # Demographics
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)  # Male, Female, Other, Prefer not to say
    
    # Role: admin, parent, adult_leader, youth
    role = Column(String, nullable=False, default="youth")
    
    # Position: Scoutmaster, Senior Patrol Leader, Patrol Leader, etc.
    position = Column(String, nullable=True)
    
    # Unit and Patrol assignment
    unit = Column(String, nullable=True)
    patrol = Column(String, nullable=True)  # e.g., "Eagle Patrol", "Wolf Patrol"
    
    # Emergency contact
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    
    # Auth
    password_hash = Column(String, nullable=False)
    
    # Status
    active = Column(Boolean, default=True)
    password_changed = Column(Boolean, default=False)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = relationship("Message", back_populates="author")
    
    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"


class Unit(Base):
    """Scout unit (Troop, Crew, etc.)"""
    __tablename__ = "units"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Channel(Base):
    """Communication channel"""
    __tablename__ = "channels"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, default="📢")
    type = Column(String, nullable=False, default="public")
    unit = Column(String, nullable=True)
    allowed_roles = Column(String, nullable=False, default="admin,adult_leader,youth,parent")
    can_post_roles = Column(String, nullable=False, default="admin,adult_leader")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
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
    channel = relationship("Channel", back_populates="messages")
    author = relationship("User", back_populates="messages")


class InfoCard(Base):
    """Dynamic content cards for the home/info page"""
    __tablename__ = "info_cards"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    icon = Column(String, default="📌")  # Emoji icon
    color = Column(String, default="#7C3AED")  # Accent color
    link_url = Column(String, nullable=True)  # Optional link
    link_text = Column(String, nullable=True)  # Link button text
    sort_order = Column(Integer, default=0)  # For ordering cards
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def init_db():
    """Initialize database with tables and seed data"""
    print("[Database] Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    try:
        with engine.connect() as conn:
            conn.execute(text("PRAGMA journal_mode=WAL"))
            conn.execute(text("PRAGMA cache_size=-20000"))
            conn.execute(text("PRAGMA synchronous=NORMAL"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_messages_channel_created ON messages(channel_id, created_at DESC)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)"))
            conn.commit()
        print("[Database] Initialization complete")
    except Exception as e:
        print(f"[Database] Warning: {e}")
    
    seed_default_data()


def seed_default_data():
    """Seed default channels and admin user"""
    from .auth import hash_password
    
    db = SessionLocal()
    try:
        if db.query(User).first():
            print("[Database] Already seeded, skipping")
            return
        
        print("[Database] Seeding default data...")
        
        admin = User(
            id="admin1",
            username="admin",
            first_name="Admin",
            last_name="User",
            email="admin@jambohub.org",
            password_hash=hash_password("The3Bears"),
            role="admin",
            position="System Administrator",
            unit="VAHC Leadership"
        )
        db.add(admin)
        
        channels_data = [
            ("announcements", "Contingent Announcements", "Official updates from leadership", "📢", "public", None, "admin,adult_leader,youth,parent", "admin,adult_leader"),
            ("leadership", "Adult Leadership", "Leadership coordination - adults only", "👥", "leadership", None, "admin,adult_leader", "admin,adult_leader"),
            ("activities", "Activities & Schedule", "Daily schedules, merit badges, events", "📅", "public", None, "admin,adult_leader,youth,parent", "admin,adult_leader"),
            ("parents", "Family Updates", "Updates for families back home", "👨‍👩‍👧‍👦", "parent", None, "admin,adult_leader,parent", "admin,adult_leader"),
        ]
        
        for cid, name, desc, icon, ctype, unit, allowed, can_post in channels_data:
            channel = Channel(id=cid, name=name, description=desc, icon=icon, type=ctype, unit=unit, allowed_roles=allowed, can_post_roles=can_post)
            db.add(channel)
        
        welcome = Message(channel_id="announcements", user_id="admin1", content="Welcome to JamboHub! This is your central place for all contingent communication during the 2026 National Jamboree.", pinned=True)
        db.add(welcome)
        
        db.commit()
        print("[Database] Seeding complete")
        
    except Exception as e:
        print(f"[Database] Seeding error: {e}")
        db.rollback()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
