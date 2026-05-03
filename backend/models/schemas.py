from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    civic_score: int
    created_at: datetime
    is_active: bool

    class Config:
        orm_mode = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Chat Schemas
class ChatMessageRequest(BaseModel):
    message: str
    context: Optional[str] = None
    session_id: Optional[int] = None

class ChatMessageResponse(BaseModel):
    response: str
    session_id: int
    timestamp: datetime

# Quiz Schemas
class QuizSubmit(BaseModel):
    topic: str
    score: int
    total_questions: int

class QuizResultResponse(BaseModel):
    id: int
    topic: str
    score: int
    total_questions: int
    timestamp: datetime

    class Config:
        orm_mode = True

class QuizLeaderboard(BaseModel):
    username: str
    total_score: int
    quizzes_taken: int
