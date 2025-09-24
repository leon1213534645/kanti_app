import Link from "next/link";
import { getExam, getQuestion, listYears } from "@/lib/exams";
import AnswerBlock from "@/components/AnswerBlock";

/* eslint-disable @typescript-eslint/no-explicit-any */
function unwrapParams(params: any): Promise<any> | any {
  return (params && typeof params.then === "function") ? params : Promise.resolve(params);
}

export async function generateStaticParams() {
  const years = listYears();
  const out: { year: string; number: string }[] = [];
  years.forEach((y) => {
    const exam = getExam(y);
    exam.questions.forEach((q) => out.push({ year: String(y), number: String(q.number) }));
  });
  return out;
}

export default async function QuestionPage({ params }: any) {
  const p = await unwrapParams(params);
  const year = String(p.year);
  const number = String(p.number);

  const q = getQuestion(year, number);
  const exam = getExam(year);

  if (!q) {
    return (
      <main className="center-screen">
        <div className="container"><h1>Not found</h1></div>
      </main>
    );
  }




  const idx = exam.questions.findIndex((x) => x.number === q.number);
  const prev = exam.questions[idx - 1]?.number;
  const next = exam.questions[idx + 1]?.number;

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <Link href={`/exam/${year}`} className="btn" style={{ marginBottom: 12 }}>
          ← Back to Exam {year}
        </Link>

        <h1 style={{ marginTop: 8 }}>Question {q.number} – {q.title}</h1>
        <p style={{ color: "#555", marginTop: 8 }}>
          <strong>Prompt:</strong> {q.prompt}
        </p>

        {q.image && (
          <div className="card" style={{ marginTop: 12 }}>
            <img src={q.image} alt={`Q${q.number} prompt`} style={{ maxWidth: "100%" }} />
          </div>
        )}

        <div className="video">
          <iframe
            src={q.video}
            title={`Q${q.number} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <AnswerBlock answer={q.answer} />

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Link href={`/exam/${year}`} className="btn">← Back to list</Link>
          {prev && <Link href={`/exam/${year}/q/${prev}`} className="btn">← Previous</Link>}
          {next && <Link href={`/exam/${year}/q/${next}`} className="btn">Next →</Link>}
        </div>
      </div>
    </main>
  );
}
