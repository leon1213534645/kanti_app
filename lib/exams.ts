import fs from "node:fs";
import path from "node:path";

export type Question = {
  number: number;
  topic: string;
  title: string;
  prompt: string;
  video: string;
  answer: string;
  image?: string;
};

export type Exam = { year: number; questions: Question[] };

const examsDir = path.join(process.cwd(), "content", "exams");

export function listYears(): number[] {
  return fs
    .readdirSync(examsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => Number(f.replace(".json", "")))
    .sort((a, b) => b - a);
}

export function getExam(year: string | number): Exam {
  const p = path.join(examsDir, `${year}.json`);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export function getQuestion(
  year: string | number,
  num: string | number
): Question | null {
  const exam = getExam(year);
  const n = Number(num);
  return exam.questions.find((q) => q.number === n) ?? null;
}
