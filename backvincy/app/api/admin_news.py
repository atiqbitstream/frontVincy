# app/api/admin_news.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.core.security import require_role
from app.db.base import get_db
from app.schemas.news import NewsCreate, NewsUpdate, NewsOut
from app.crud.news import create_news, get_news, get_all_news, update_news, delete_news

router = APIRouter(
    prefix="/admin/news",
    tags=["admin-news"],
    dependencies=[Depends(require_role(["Admin"]))]
)

@router.post("/", response_model=NewsOut)
def admin_create_news(payload: NewsCreate, db: Session = Depends(get_db)):
    return create_news(db, payload)

@router.get("/", response_model=List[NewsOut])
def admin_list_news(db: Session = Depends(get_db)):
    return get_all_news(db)

@router.get("/{news_id}", response_model=NewsOut)
def admin_get_news(news_id: UUID, db: Session = Depends(get_db)):
    news = get_news(db, news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@router.put("/{news_id}", response_model=NewsOut)
def admin_update_news(news_id: UUID, payload: NewsUpdate, db: Session = Depends(get_db)):
    news = update_news(db, news_id, payload)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_news(news_id: UUID, db: Session = Depends(get_db)):
    if not delete_news(db, news_id):
        raise HTTPException(status_code=404, detail="News not found")
