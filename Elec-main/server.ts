import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/backend/routes/auth";
import chatRoutes from "./src/backend/routes/chat";
import quizRoutes from "./src/backend/routes/quiz";
import electionRoutes from "./src/backend/routes/elections";
import userRoutes from "./src/backend/routes/users";
import { migrateDb } from "./src/backend/db/migrate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Run DB migrations
  migrateDb();

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/quiz", quizRoutes);
  app.use("/api/elections", electionRoutes);
  app.use("/api/users", userRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "ElectIQ API - Node.js" });
  });

  // Vite integration for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
