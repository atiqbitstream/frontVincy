from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.base import get_db
from app.schemas.news import NewsOut
from app.schemas.live_session import LiveSessionOut
from app.schemas.contact import ContactOut
from app.schemas.about import AboutOut
from app.crud.news import get_latest_news
from app.crud.live_session import get_latest_live_session
from app.crud.contact import get_latest_contact
from app.crud.about import get_latest_about

router = APIRouter(
    prefix="/public",
    tags=["public"]
)

@router.get("/latest-news", response_model=List[NewsOut], summary="Get latest 2 news items for landing page")
def get_latest_news_public(db: Session = Depends(get_db)):
    """
    Get the latest 2 news items without authentication.
    This endpoint is designed for use on the landing page.
    """
    return get_latest_news(db, limit=2)

@router.get("/latest-live-session", response_model=Optional[LiveSessionOut], summary="Get latest live session for landing page")
def get_latest_live_session_public(db: Session = Depends(get_db)):
    """
    Get the latest live session without authentication.
    This endpoint is designed for use on the landing page.
    """
    return get_latest_live_session(db)

@router.get("/contact", response_model=Optional[ContactOut], summary="Get contact information")
def get_contact_info_public(db: Session = Depends(get_db)):
    """
    Get contact information without authentication.
    This endpoint is designed for use on the landing page.
    """
    return get_latest_contact(db)

@router.get("/about", response_model=Optional[AboutOut], summary="Get about us information")
def get_about_info_public(db: Session = Depends(get_db)):
    """
    Get about us information without authentication.
    This endpoint is designed for use on the landing page.
    """
    return get_latest_about(db)
