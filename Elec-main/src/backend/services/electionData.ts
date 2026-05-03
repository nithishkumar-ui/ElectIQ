import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "src", "backend", "data");

export function getElectionPhases(country: string) {
  const filePath = path.join(DATA_DIR, "election_phases", `${country}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getQuestions(topicId: string) {
  const filePath = path.join(DATA_DIR, "questions", `${topicId}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
