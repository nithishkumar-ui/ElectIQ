from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import schemas, db_models
from middleware.auth_middleware import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: db_models.User = Depends(get_current_active_user)):
    return current_user

@router.get("/me/history")
def read_user_history(
    current_user: db_models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    quizzes = db.query(db_models.QuizResult).filter(
        db_models.QuizResult.user_id == current_user.id
    ).order_by(db_models.QuizResult.timestamp.desc()).all()
    
    return {"quizzes": quizzes}
