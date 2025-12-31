from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Email Configuration (optional - system works without it)
    SMTP_HOST: Optional[str] = "smtp.gmail.com"
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = "Info@soulresidue.net"
    SMTP_PASSWORD: Optional[str] = "iypi pfsc ywzt cqtm"
    ADMIN_EMAILS: str = "squarelizard@gmail.com"
    
    @property
    def admin_emails_list(self) -> List[str]:
        """Convert comma-separated admin emails to list"""
        return [email.strip() for email in self.ADMIN_EMAILS.split(",")]
    
    @property
    def email_enabled(self) -> bool:
        """Check if email configuration is complete"""
        return bool(self.SMTP_USER and self.SMTP_PASSWORD)
    

    class Config:
        env_file = ".env"


settings = Settings()
