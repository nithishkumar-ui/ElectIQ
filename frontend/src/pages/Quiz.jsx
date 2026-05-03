import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Quiz() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  // For this demo, we'll hardcode the topic to 'us_presidential', or fetch a random one.
  // In a real app, you'd let the user select a topic.
  const topic = 'us_presidential';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${topic}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [isAuthenticated, navigate, topic]);

  const handleSubmit = () => {
    if (selectedOpt === null) return;
    
    setIsSubmitted(true);
    const correct = selectedOpt === questions[currentIdx].correct_option;
    if (correct) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      // Finish quiz
      try {
        await api.post('/quiz/submit', {
          topic: topic,
          score: score,
          total_questions: questions.length
        });
      } catch (err) {
        console.error("Failed to submit score", err);
      }
      setQuizFinished(true);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading Quiz...</div>;
  if (!questions.length) return <div className="p-12 text-center text-slate-400">No questions found for this topic.</div>;

  if (quizFinished) {
    return (
      <div className="container mx-auto px-6 py-24 max-w-2xl text-center">
        <div className="glass-panel p-12 rounded-3xl">
          <h2 className="text-4xl font-bold mb-6 text-primary-400">Quiz Completed!</h2>
          <p className="text-6xl font-black mb-8">{score} <span className="text-2xl text-slate-500">/ {questions.length}</span></p>
          <p className="text-xl text-slate-300 mb-10">Your civic score has been updated.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold capitalize">{topic.replace(/_/g, ' ')} Quiz</h1>
        <span className="text-slate-400 font-medium">Question {currentIdx + 1} of {questions.length}</span>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-3xl">
        <h2 className="text-2xl font-medium leading-relaxed mb-8">{q.question_text}</h2>
        
        <div className="space-y-4 mb-8">
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = i === q.correct_option;
            
            let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
            
            if (!isSubmitted) {
              btnClass += isSelected 
                ? "bg-primary-500/20 border-primary-500 text-white" 
                : "bg-dark-800/50 border-white/10 hover:bg-white/5 text-slate-300";
            } else {
              if (isCorrect) {
                btnClass += "bg-green-500/20 border-green-500 text-green-400";
              } else if (isSelected && !isCorrect) {
                btnClass += "bg-red-500/20 border-red-500 text-red-400";
              } else {
                btnClass += "bg-dark-800/20 border-transparent text-slate-500 opacity-50";
              }
            }

            return (
              <button 
                key={i}
                disabled={isSubmitted}
                onClick={() => setSelectedOpt(i)}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {isSubmitted && isCorrect && <CheckCircle className="text-green-500 w-5 h-5" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="text-red-500 w-5 h-5" />}
                </div>
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mb-8 p-4 bg-primary-900/30 border border-primary-500/20 rounded-xl text-primary-100">
            <p className="font-semibold mb-1">Explanation:</p>
            <p className="text-sm">{q.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!isSubmitted ? (
            <button 
              onClick={handleSubmit}
              disabled={selectedOpt === null}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-white text-dark-900 hover:bg-slate-200 rounded-xl font-bold transition-colors"
            >
              {currentIdx + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
