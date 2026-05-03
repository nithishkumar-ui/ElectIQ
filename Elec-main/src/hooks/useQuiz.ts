import { useState, useEffect } from "react";
import { api } from "../lib/api";

export function useQuiz(topicId: string | undefined, difficulty?: string) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);
    api.quiz.getQuestions(topicId, 10, difficulty)
      .then(data => { setQuestions(data.questions); setLoading(false); })
      .catch(e => { setError(e); setLoading(false); });
  }, [topicId, difficulty]);

  const selectAnswer = (questionId: string, answerIndex: number) => {
    if (answers[questionId] !== undefined) return;
    const q = questions.find(q => q.id === questionId);
    if (!q) return;
    const correct = answerIndex === q.correct;
    setAnswers(prev => ({ ...prev, [questionId]: { selected: answerIndex, correct } }));
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
    else setIsComplete(true);
  };

  return { questions, currentIndex, score, answers, loading, error, isComplete, selectAnswer, nextQuestion };
}
