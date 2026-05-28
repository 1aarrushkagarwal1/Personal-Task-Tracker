from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL for SQLite. It creates a 'tasks.db' file in the backend directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"

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
