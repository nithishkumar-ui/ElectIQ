import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "super_secret_jwt_key_for_electiq";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Missing authorization token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const userRecords = db.select().from(users).where(eq(users.id, payload.sub)).all();
    const user = userRecords[0];

    if (!user || user.isActive === false) {
      return res.status(401).json({ detail: "User not found or inactive" });
    }
    
    // Convert boolean to match standard properties
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
};

export const optionalAuthenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const userRecords = db.select().from(users).where(eq(users.id, payload.sub)).all();
    if (userRecords.length > 0) {
      req.user = userRecords[0];
    }
  } catch (err) {}
  next();
};
