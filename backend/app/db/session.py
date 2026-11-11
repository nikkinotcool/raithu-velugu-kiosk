from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

db_url = settings.normalized_database_url
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine_kwargs = {"connect_args": connect_args}
if not db_url.startswith("sqlite"):
    engine_kwargs.update({
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_timeout": 10,
    })

try:
    engine = create_engine(db_url, **engine_kwargs)
except Exception as e:
    print(f"Warning: Primary database connection failed ({e}). Falling back to local SQLite.")
    engine = create_engine("sqlite:///./raithu_velugu.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
