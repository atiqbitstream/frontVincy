from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.base import get_db
from app.schemas.news import NewsOut
from app.crud.news import get_all_news, get_news
from app.core.security import require_role

router = APIRouter(
    prefix="/user/news",
    tags=["user-news"],
    dependencies=[Depends(require_role(["User"]))]
)

@router.get("/", response_model=List[NewsOut], summary="User: List all news")
def user_list_news(db: Session = Depends(get_db)):
    return get_all_news(db)

@router.get("/{news_id}", response_model=NewsOut, summary="User: Get a specific news entry")
def user_get_news(news_id: UUID, db: Session = Depends(get_db)):
    news = get_news(db, news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news