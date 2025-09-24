import fs from "node:fs";
import path from "node:path";

export type TopicRef = { year: number; number: number };
export type TopicSummarySection = { id: string; title: string; paras: string[] };
export type Topic = {
  slug: string;
  chapter: string;           // e.g. "8b"
  label: string;             // e.g. "Gleichungen"
  objectives: string[];      // bullets shown on landing
  summary?: { sections: TopicSummarySection[] }; // shown on /summary
  recommended?: TopicRef[];
  extraExercises?: { id: string; prompt: string; answer: string; video: string }[]; // shown on /exercises
  qa?: [];
};

const topicsDir = path.join(process.cwd(), "content", "topics");

export function listTopics(): Topic[] {
  if (!fs.existsSync(topicsDir)) return [];
  return fs.readdirSync(topicsDir)
    .filter(f => f.endsWith(".json"))
    .map(f => JSON.parse(fs.readFileSync(path.join(topicsDir, f), "utf8")) as Topic)
    .sort((a,b) => a.chapter.localeCompare(b.chapter));
}

export function getTopic(slug: string): Topic | null {
  const p = path.join(topicsDir, `${slug}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as Topic;
}
