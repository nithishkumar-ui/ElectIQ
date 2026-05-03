from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import schemas, db_models
from middleware.auth_middleware import get_current_active_user
from services import election_data

router = APIRouter()

@router.get("/questions/{topic}")
def get_questions(topic: str):
    questions = election_data.get_quiz_questions(topic)
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this topic")
    return questions

@router.post("/submit", response_model=schemas.QuizResultResponse)
def submit_quiz(
    quiz_data: schemas.QuizSubmit,
    current_user: db_models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Save result
    result = db_models.QuizResult(
        user_id=current_user.id,
        topic=quiz_data.topic,
        score=quiz_data.score,
        total_questions=quiz_data.total_questions
    )
    db.add(result)
    
    # Update user's total civic score
    current_user.civic_score += quiz_data.score
    
    db.commit()
    db.refresh(result)
    
    return result

@router.get("/leaderboard", response_model=List[schemas.QuizLeaderboard])
def get_leaderboard(db: Session = Depends(get_db), limit: int = 10):
    users = db.query(db_models.User).order_by(db_models.User.civic_score.desc()).limit(limit).all()
    
    leaderboard = []
    for user in users:
        quizzes_taken = db.query(func.count(db_models.QuizResult.id)).filter(db_models.QuizResult.user_id == user.id).scalar()
        leaderboard.append({
            "username": user.username,
            "total_score": user.civic_score,
            "quizzes_taken": quizzes_taken
        })
        
    return leaderboard
