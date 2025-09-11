import fs from "node:fs";
import path from "node:path";

export type TopicRef = { year: number; number: number };
export type ExtraExercise = { id: string; prompt: string; answer: string; video?: string };
export type Topic = {
  slug: string;
  label: string;
  summary: string;
  recommended: TopicRef[];
  extraExercises?: ExtraExercise[];
};

const topicsDir = path.join(process.cwd(), "content", "topics");

export function listTopics(): Topic[] {
  if (!fs.existsSync(topicsDir)) return [];
  return fs
    .readdirSync(topicsDir)
    .filter(f => f.endsWith(".json"))
    .map(f => JSON.parse(fs.readFileSync(path.join(topicsDir, f), "utf8")) as Topic)
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getTopic(slug: string): Topic | null {
  const p = path.join(topicsDir, `${slug}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as Topic;
}
