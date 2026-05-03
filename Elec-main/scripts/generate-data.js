import fs from 'fs';
import path from 'path';

const questionsDir = path.join(process.cwd(), 'src/backend/data/questions');
const phasesDir = path.join(process.cwd(), 'src/backend/data/election_phases');

if (!fs.existsSync(questionsDir)) fs.mkdirSync(questionsDir, { recursive: true });
if (!fs.existsSync(phasesDir)) fs.mkdirSync(phasesDir, { recursive: true });

const topics = [
  "registration", "ballot_types", "candidate_selection", "electoral_systems",
  "voting_rights", "election_security", "post_election", "international",
  "local_federal", "civic_participation"
];

topics.forEach((topic) => {
  const data = Array.from({ length: 15 }).map((_, i) => ({
    id: `${topic}_${i+1}`,
    question: `What is an important aspect of ${topic.replace('_', ' ')} (Question ${i+1})?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: 0,
    explanation: `This explains the important aspect of ${topic.replace('_', ' ')}.`,
    difficulty: i < 5 ? "beginner" : i < 10 ? "intermediate" : "advanced"
  }));
  fs.writeFileSync(path.join(questionsDir, `${topic}.json`), JSON.stringify(data, null, 2));
});

const ukData = {
  country: "United Kingdom",
  code: "uk",
  election_year: 2024,
  phases: [
    { id: "dissolution", label: "Parliament Dissolution", date_range: "May 2024", description: "Parliament is dissolved.", key_facts: ["5 weeks before election"], position: [0, 0, -6] },
    { id: "campaign", label: "Campaign Period", date_range: "June 2024", description: "Parties campaign.", key_facts: ["Strict spending limits"], position: [2, 1, -2] },
    { id: "election_day", label: "Polling Day", date_range: "July 2024", description: "Voters elect MPs.", key_facts: ["First-past-the-post"], position: [0, 2, 2] }
  ]
};

const indiaData = {
  country: "India",
  code: "india",
  election_year: 2024,
  phases: [
    { id: "announcement", label: "Election Announcement", date_range: "March 2024", description: "ECI announces dates.", key_facts: ["Model Code of Conduct starts"], position: [0, 0, -6] },
    { id: "polling", label: "Multi-phase Polling", date_range: "April-June 2024", description: "Voting in 7 phases.", key_facts: ["EVMs used"], position: [2, 1, -2] },
    { id: "counting", label: "Vote Counting", date_range: "June 2024", description: "Results declared.", key_facts: ["All phases counted same day"], position: [0, 2, 2] }
  ]
};

fs.writeFileSync(path.join(phasesDir, `uk.json`), JSON.stringify(ukData, null, 2));
fs.writeFileSync(path.join(phasesDir, `india.json`), JSON.stringify(indiaData, null, 2));
