from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: str | None = None

class TokenAdmin(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    is_admin: bool

    class Config:
        orm_mode = True