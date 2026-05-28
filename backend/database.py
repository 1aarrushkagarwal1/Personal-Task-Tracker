from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

# Database URL for SQLite.
# - If DATABASE_URL env var is provided (e.g. for persistent volumes), use it.
# - If running on Railway (where root filesystem is read-only), default to a writable /tmp/tasks.db path.
# - Otherwise (local development), default to a local tasks.db file in the project.
default_db_url = "sqlite:///./tasks.db"
if "PORT" in os.environ or "RAILWAY_ENVIRONMENT" in os.environ:
    default_db_url = "sqlite:////tmp/tasks.db"

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", default_db_url)

# connect_args={"check_same_thread": False} is required only for SQLite.
# It allows multiple threads to interact with the database session simultaneously.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal is the session factory that we'll use to talk to the database.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for defining our database models.
Base = declarative_base()

# Dependency generator to manage database sessions in FastAPI route handlers.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
