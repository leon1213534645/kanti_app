import fs from "fs";
import path from "path";

const examsDir = path.join(process.cwd(), "content", "exams");

export type Variant = "mit" | "ohne";

export type ExamRef = {
  year: number;
  variant: Variant;
  label: string;            // e.g., "2023 – Mit Taschenrechner"
  slug: string;             // e.g., "2023-mit"
};

export type Exam = {
  year: number | string;
  variant: Variant;
  questions: { number: number; title: string; prompt?: string; image?: string; video?: string; answer?: string }[];
  // ...whatever else you already have
};

const FILE_RE = /^(\d{4})-(mit|ohne)\.json$/;

export function listExams(): ExamRef[] {
  if (!fs.existsSync(examsDir)) return [];
  const files = fs.readdirSync(examsDir);

  const refs: ExamRef[] = [];
  for (const f of files) {
    const m = f.match(FILE_RE);
    if (!m) continue;
    const year = Number(m[1]);
    const variant = m[2] as Variant;
    refs.push({
      year,
      variant,
      slug: `${year}-${variant}`,
      label: `${year} – ${variant === "mit" ? "Mit Taschenrechner" : "Ohne Taschenrechner"}`,
    });
  }
  // newest first, and “ohne/mit” consistent order within year
  return refs.sort((a, b) => (b.year - a.year) || (a.variant.localeCompare(b.variant)));
}

export function listYears(): number[] {
  // if you still need the old API; otherwise you can remove it
  return Array.from(new Set(listExams().map(x => x.year))).sort((a, b) => b - a);
}

export function getExam(year: string | number, variant: Variant): Exam {
  const p = path.join(examsDir, `${year}-${variant}.json`);
  const raw = fs.readFileSync(p, "utf8");
  const data = JSON.parse(raw);
  return {
    year: Number(year),
    variant,
    ...data,
  };
}

// helper if you prefer a single slug param "2023-mit"
export function getExamBySlug(slug: string): Exam {
  const m = slug.match(FILE_RE);
  if (!m) throw new Error("Bad exam slug");
  return getExam(m[1], m[2] as Variant);
}
