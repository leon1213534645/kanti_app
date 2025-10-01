// lib/exams.ts
import fs from "fs";
import path from "path";
export type VideoBlock = { type: "video"; url: string; title?: string }; // ✅ new

export type Variant = "mit" | "ohne";

export type TextBlock = { type: "text"; markdown: string };
export type ImageBlock = { type: "image"; url: string; alt?: string };
export type Block = TextBlock | ImageBlock;

export type Question = {
  number: string;               // was number; now "1a", "2c", …
  topic?: string;
  title?: string;
  content?: Block[];
  solution?: Block[];
  video?: string;
};

export type Exam = {
  year: number;
  variant: Variant;
  examTitle?: string;
  questions: Question[];
};

const examsDir = path.join(process.cwd(), "content", "exams");
const FILE_RE = /^(\d{4})-(mit|ohne)\.json$/;

export function listExams() {
  if (!fs.existsSync(examsDir)) return [];
  return fs.readdirSync(examsDir)
    .map(f => f.match(FILE_RE))
    .filter(Boolean)
    .map(m => ({
      year: Number(m![1]),
      variant: m![2] as Variant,
      slug: `${m![1]}-${m![2]}`,
      label: `${m![1]} – ${m![2] === "mit" ? "Mit Taschenrechner" : "Ohne Taschenrechner"}`
    }))
    .sort((a, b) => (b.year - a.year) || a.variant.localeCompare(b.variant));
}

export function getExam(year: string | number, variant: Variant): Exam {
  if (!variant) throw new Error(`getExam(${year}, variant) missing variant`);
  const p = path.join(examsDir, `${year}-${variant}.json`);
  const raw = fs.readFileSync(p, "utf8");
  const data = JSON.parse(raw);
  return {
    year: Number(year),
    variant,
    examTitle: data.examTitle,
    questions: (data.questions ?? []) as Question[],
  };
}
