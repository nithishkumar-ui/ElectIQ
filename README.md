# ElectIQ

ElectIQ is an AI-powered education assistant designed to demystify democratic elections and civic processes. It features an interactive UI with 3D elements, quizzes, leaderboards, and an AI chat assistant powered by Google Gemini.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Three.js, Zustand, React Router, Framer Motion
- **Backend**: FastAPI, PostgreSQL/SQLite, SQLAlchemy, Uvicorn, Google Gemini API

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.11+)

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in your `GEMINI_API_KEY` and `SECRET_KEY`.
6. Run the server: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### Easy Start
On Windows, you can simply run `.\run.ps1` from the root directory to start both servers.
