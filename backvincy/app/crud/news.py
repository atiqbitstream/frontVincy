# app/crud/news.py
from sqlalchemy.orm import Session
from app.models.news import News
from app.schemas.news import NewsCreate, NewsUpdate
from uuid import UUID

def create_news(db: Session, news: NewsCreate) -> News:
    db_news = News(**news.dict())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

def get_news(db: Session, news_id: UUID) -> News:
    return db.query(News).filter(News.id == news_id).first()

def get_all_news(db: Session, skip: int = 0, limit: int = 100):
    return db.query(News).order_by(News.publish_date.desc()).offset(skip).limit(limit).all()

def get_latest_news(db: Session, limit: int = 2):
    """Get the latest news items for public display"""
    return db.query(News).order_by(News.publish_date.desc()).limit(limit).all()

def update_news(db: Session, news_id: UUID, news_update: NewsUpdate) -> News:
    db_news = get_news(db, news_id)
    if db_news:
        for key, value in news_update.dict(exclude_unset=True).items():
            setattr(db_news, key, value)
        db.commit()
        db.refresh(db_news)
    return db_news

def delete_news(db: Session, news_id: UUID):
    db_news = get_news(db, news_id)
    if db_news:
        db.delete(db_news)
        db.commit()
        return True
    return False
