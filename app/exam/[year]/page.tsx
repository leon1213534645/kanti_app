import Link from "next/link";
import { getExam, listYears } from "@/lib/exams";

export async function generateStaticParams() {
  return listYears().map((year) => ({ year: String(year) }));
}

export default function ExamYear({
  params,
}: {
  params: { year: string };
}) {
  const exam = getExam(params.year);

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>Exam {exam.year}</h1>
        <h2 style={{ marginTop: 12 }}>Questions</h2>
        <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.9 }}>
          {exam.questions.map((q) => (
            <li key={q.number}>
              <Link href={`/exam/${exam.year}/q/${q.number}`}>
                Q{q.number} – {q.title}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 16 }}>
          <Link href="/exam" className="btn">← Back to Exams</Link>
        </div>
      </div>
    </main>
  );
}
