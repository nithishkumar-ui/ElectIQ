import { Router, Response } from "express";
import { db } from "../db";
import { conversations } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { authenticate, optionalAuthenticate, AuthRequest } from "../middleware/authMiddleware";
import { streamChat } from "../services/geminiService";
import crypto from "crypto";

const router = Router();

router.post("/stream", optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  const { messages, country, phase_context, guide_step_context, conversation_id } = req.body;
  const user = req.user;

  const context = {
    country: country || (user ? user.country : "US"),
    phase: phase_context,
    guide_step: guide_step_context,
  };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    let fullResponse = "";
    for await (const token of streamChat(messages, context)) {
      fullResponse += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();

    if (user && conversation_id) {
      const convs = db.select().from(conversations).where(and(eq(conversations.id, conversation_id), eq(conversations.userId, user.id))).all();
      if (convs.length > 0) {
        const conv = convs[0];
        const newMessages = [
          ...messages,
          { role: "assistant", content: fullResponse }
        ];
        db.update(conversations).set({ messages: newMessages, updatedAt: new Date() }).where(eq(conversations.id, conversation_id)).run();
      }
    }
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

router.post("/save", authenticate, (req: AuthRequest, res: Response) => {
  const { messages, assistantResponse, conversation_id } = req.body;
  const user = req.user;

  if (user && conversation_id) {
    const convs = db.select().from(conversations).where(and(eq(conversations.id, conversation_id), eq(conversations.userId, user.id))).all();
    if (convs.length > 0) {
      const conv = convs[0];
      const newMessages = [
        ...messages,
        { role: "assistant", content: assistantResponse }
      ];
      db.update(conversations).set({ messages: newMessages, updatedAt: new Date() }).where(eq(conversations.id, conversation_id)).run();
      return res.json({ success: true });
    }
  }
  res.json({ success: false });
});

router.get("/conversations", authenticate, (req: AuthRequest, res: Response) => {
  const convs = db.select().from(conversations).where(eq(conversations.userId, req.user.id)).orderBy(conversations.updatedAt).all();
  res.json(convs.reverse().slice(0, 50));
});

router.post("/conversations", authenticate, (req: AuthRequest, res: Response) => {
  const convId = crypto.randomUUID();
  db.insert(conversations).values({
    id: convId,
    userId: req.user.id,
    title: "New Conversation",
    messages: []
  }).run();
  const newConv = db.select().from(conversations).where(eq(conversations.id, convId))[0];
  res.json(newConv);
});

router.delete("/conversations/:id", authenticate, (req: AuthRequest, res: Response) => {
  db.delete(conversations).where(and(eq(conversations.id, req.params.id), eq(conversations.userId, req.user.id))).run();
  res.json({ status: "deleted" });
});

export default router;
