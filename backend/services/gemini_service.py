import google.generativeai as genai
from config import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# Use the latest pro model
model = genai.GenerativeModel('gemini-pro')

SYSTEM_PROMPT = """
You are ElectIQ, an AI assistant dedicated to educating people about democratic elections, 
voting processes, and civic duties globally. 

Guidelines:
1. Provide accurate, non-partisan, and objective information about election systems.
2. If asked about a specific country's elections, explain the mechanics (e.g., Electoral College in US, First-Past-The-Post in UK, EVMs in India).
3. Do not express political opinions, endorse candidates, or predict election outcomes.
4. Encourage civic participation and explain why voting matters.
5. Keep answers clear, concise, and easy to understand for a general audience.
"""

async def generate_chat_response(message: str, context: str = None) -> str:
    try:
        prompt = f"{SYSTEM_PROMPT}\n\n"
        if context:
            prompt += f"Context regarding the user's current topic: {context}\n\n"
        
        prompt += f"User: {message}\nElectIQ:"
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again later."
