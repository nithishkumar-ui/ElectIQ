import { Router, Request, Response } from "express";
import { db } from "../db";
import { quizScores } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import { getQuestions } from "../services/electionData";

const router = Router();

router.get("/questions/:topicId", (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  let questions = getQuestions(req.params.topicId);
  if (!questions || questions.length === 0) {
    return res.status(404).json({ detail: `Topic not found: ${req.params.topicId}` });
  }

  if (req.query.difficulty) {
    const diff = (req.query.difficulty as string).toLowerCase();
    questions = questions.filter((q: any) => q.difficulty && q.difficulty.toLowerCase() === diff);
  }

  // Shuffle and limit
  const shuffled = questions.sort(() => 0.5 - Math.random());
  res.json({
    topic_id: req.params.topicId,
    questions: shuffled.slice(0, Math.min(limit, questions.length)),
    total: questions.length
  });
});

router.post("/scores", authenticate, (req: AuthRequest, res: Response) => {
  const { topic_id, score, total } = req.body;
  const user = req.user;

  let existing = db.select().from(quizScores).where(and(eq(quizScores.userId, user.id), eq(quizScores.topicId, topic_id))).get();

  if (existing) {
    db.update(quizScores).set({
      score, total,
      bestScore: Math.max(existing.bestScore, score),
      attempts: (existing.attempts || 1) + 1,
      lastPlayed: new Date()
    }).where(eq(quizScores.id, existing.id)).run();
    existing = db.select().from(quizScores).where(eq(quizScores.id, existing.id)).get();
  } else {
    db.insert(quizScores).values({
      userId: user.id,
      topicId: topic_id,
      score, total,
      bestScore: score,
      attempts: 1
    }).run();
    existing = db.select().from(quizScores).where(and(eq(quizScores.userId, user.id), eq(quizScores.topicId, topic_id))).get();
  }

  res.json({
    topic_id: existing.topicId,
    score: existing.score,
    best_score: existing.bestScore,
    total: existing.total,
    attempts: existing.attempts,
    last_played: existing.lastPlayed
  });
});

router.get("/scores", authenticate, (req: AuthRequest, res: Response) => {
  const scores = db.select().from(quizScores).where(eq(quizScores.userId, req.user.id)).all();
  res.json(scores.map(s => ({
    topic_id: s.topicId, score: s.score, best_score: s.bestScore, total: s.total, attempts: s.attempts, last_played: s.lastPlayed
  })));
});

export default router;
