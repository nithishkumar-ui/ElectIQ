import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "electiq.db");

export function migrateDb() {
  const db = new Database(dbPath);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      display_name TEXT NOT NULL,
      country TEXT DEFAULT 'US',
      state_district TEXT,
      age_group TEXT,
      learning_goal TEXT,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS quiz_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id),
      topic_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      best_score INTEGER NOT NULL,
      attempts INTEGER DEFAULT 1,
      last_played INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT DEFAULT 'New Conversation',
      messages TEXT DEFAULT '[]',
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS guide_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id),
      step_id INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      checklist_state TEXT DEFAULT '{}',
      completed_at INTEGER
    );
  `);
  
  console.log("Database initialized.");
}
