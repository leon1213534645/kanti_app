import Link from "next/link";
import { getExam, listExams, Variant } from "@/lib/exams";

export async function generateStaticParams() {
  return listExams().map(r => ({ year: String(r.year), variant: r.variant }));
}

export default function ExamVariantPage({ params }: { params: { year: string; variant: Variant } }) {
  const exam = getExam(params.year, params.variant);

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign:"left" }}>
        <h1>{exam.year} – {exam.variant === "mit" ? "Mit Taschenrechner" : "Ohne Taschenrechner"}</h1>
        <h2 style={{ marginTop: 12 }}>Aufgaben</h2>
        <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.9 }}>
          {exam.questions.map(q => (
            <li key={q.number}>
              <Link href={`/exam/${exam.year}/${exam.variant}/q/${q.number}`}>
                Aufgabe {q.number} – {q.title}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 16 }}>
          <Link href="/exam" className="btn">← Zurück</Link>
        </div>
      </div>
    </main>
  );
}
