import { Router, Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, createAccessToken } from "../services/authService";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import crypto from "crypto";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, display_name, country } = req.body;
  if (!email || !password || !display_name) {
    return res.status(400).json({ detail: "Missing fields" });
  }

  const existing = db.select().from(users).where(eq(users.email, email)).all();
  if (existing.length > 0) {
    return res.status(400).json({ detail: "Email already registered" });
  }

  const userId = crypto.randomUUID();
  db.insert(users).values({
    id: userId,
    email,
    hashedPassword: hashPassword(password),
    displayName: display_name,
    country: country || "US",
  }).run();

  const userRecord = db.select().from(users).where(eq(users.id, userId)).get();
  const access_token = createAccessToken({ sub: userId });

  // Map to exclude password
  const { hashedPassword, stateDistrict, ageGroup, learningGoal, ...userOut } = userRecord;

  res.json({
    access_token,
    token_type: "bearer",
    user: { 
      ...userOut, 
      display_name: userOut.displayName,
      state_district: stateDistrict,
      age_group: ageGroup,
      learning_goal: learningGoal
    }
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: "Missing fields" });
  }

  const existing = db.select().from(users).where(eq(users.email, email)).all();
  const user = existing[0];

  if (!user || !verifyPassword(password, user.hashedPassword)) {
    return res.status(401).json({ detail: "Invalid email or password" });
  }

  const access_token = createAccessToken({ sub: user.id });
  const { hashedPassword, stateDistrict, ageGroup, learningGoal, ...userOut } = user;

  res.json({
    access_token,
    token_type: "bearer",
    user: { 
      ...userOut, 
      display_name: userOut.displayName,
      state_district: stateDistrict,
      age_group: ageGroup,
      learning_goal: learningGoal
    }
  });
});

router.get("/me", authenticate, (req: AuthRequest, res: Response) => {
  const { hashedPassword, stateDistrict, ageGroup, learningGoal, ...userOut } = req.user;
  res.json({ 
    ...userOut, 
    display_name: userOut.displayName,
    state_district: stateDistrict,
    age_group: ageGroup,
    learning_goal: learningGoal
  });
});

export default router;
