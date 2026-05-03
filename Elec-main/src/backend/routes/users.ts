import { Router, Response } from "express";
import { db } from "../db";
import { users, guideProgress } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.patch("/me", authenticate, (req: AuthRequest, res: Response) => {
  const updates = req.body;
  const allowedFields = ["display_name", "country", "state_district", "age_group", "learning_goal"];
  const dbUpdate: any = {};
  
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      if (field === "display_name") dbUpdate.displayName = updates[field];
      else if (field === "state_district") dbUpdate.stateDistrict = updates[field];
      else if (field === "age_group") dbUpdate.ageGroup = updates[field];
      else if (field === "learning_goal") dbUpdate.learningGoal = updates[field];
      else dbUpdate[field] = updates[field];
    }
  }

  if (Object.keys(dbUpdate).length > 0) {
    db.update(users).set(dbUpdate).where(eq(users.id, req.user.id)).run();
  }

  const userRecord = db.select().from(users).where(eq(users.id, req.user.id)).get();
  const { hashedPassword, stateDistrict, ageGroup, learningGoal, ...userOut } = userRecord;
  res.json({
    ...userOut,
    display_name: userOut.displayName,
    state_district: stateDistrict,
    age_group: ageGroup,
    learning_goal: learningGoal
  });
});

router.get("/me/guide-progress", authenticate, (req: AuthRequest, res: Response) => {
  const progress = db.select().from(guideProgress).where(eq(guideProgress.userId, req.user.id)).all();
  res.json(progress.map(p => ({
    step_id: p.stepId,
    completed: p.completed,
    checklist_state: p.checklistState
  })));
});

router.post("/me/guide-progress/:stepId", authenticate, (req: AuthRequest, res: Response) => {
  const stepId = parseInt(req.params.stepId);
  const completed = req.query.completed === 'true';
  const checklistState = req.query.checklist_state ? JSON.parse(req.query.checklist_state as string) : {};

  const existing = db.select().from(guideProgress).where(and(eq(guideProgress.userId, req.user.id), eq(guideProgress.stepId, stepId))).get();

  if (existing) {
    db.update(guideProgress).set({
      completed,
      checklistState,
      completedAt: completed ? new Date() : null
    }).where(eq(guideProgress.id, existing.id)).run();
  } else {
    db.insert(guideProgress).values({
      userId: req.user.id,
      stepId,
      completed,
      checklistState,
      completedAt: completed ? new Date() : null as any
    }).run();
  }

  res.json({ status: "updated" });
});

export default router;
