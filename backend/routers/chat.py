from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import schemas, db_models
from middleware.auth_middleware import get_current_active_user
from services import gemini_service

router = APIRouter()

@router.post("/", response_model=schemas.ChatMessageResponse)
async def chat_with_electiq(
    request: schemas.ChatMessageRequest,
    current_user: db_models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Handle session
    if request.session_id:
        session = db.query(db_models.ChatSession).filter(
            db_models.ChatSession.id == request.session_id,
            db_models.ChatSession.user_id == current_user.id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        # Create new session
        session = db_models.ChatSession(user_id=current_user.id, topic=request.context)
        db.add(session)
        db.commit()
        db.refresh(session)
        
    # Save user message
    user_msg = db_models.ChatMessage(session_id=session.id, role="user", content=request.message)
    db.add(user_msg)
    
    # Get Gemini response
    bot_response_text = await gemini_service.generate_chat_response(request.message, request.context)
    
    # Save bot message
    bot_msg = db_models.ChatMessage(session_id=session.id, role="assistant", content=bot_response_text)
    db.add(bot_msg)
    
    db.commit()
    
    return schemas.ChatMessageResponse(
        response=bot_response_text,
        session_id=session.id,
        timestamp=bot_msg.timestamp
    )

@router.get("/sessions")
def get_chat_sessions(
    current_user: db_models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(db_models.ChatSession).filter(
        db_models.ChatSession.user_id == current_user.id
    ).order_by(db_models.ChatSession.started_at.desc()).all()
    return sessions

@router.get("/sessions/{session_id}/messages")
def get_chat_messages(
    session_id: int,
    current_user: db_models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    session = db.query(db_models.ChatSession).filter(
        db_models.ChatSession.id == session_id,
        db_models.ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    messages = db.query(db_models.ChatMessage).filter(
        db_models.ChatMessage.session_id == session_id
    ).order_by(db_models.ChatMessage.timestamp.asc()).all()
    return messages
