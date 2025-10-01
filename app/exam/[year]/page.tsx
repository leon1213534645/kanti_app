import Link from "next/link";
import { getExam, listYears } from "@/lib/exams";

/* eslint-disable @typescript-eslint/no-explicit-any */
function unwrapParams(params: any): Promise<any> | any {
  return (params && typeof params.then === "function") ? params : Promise.resolve(params);
}

export async function generateStaticParams() {
  return listYears().map((year) => ({ year: String(year) }));
}

export function generateMetadata({ params }:{ params:{year:string}}){
  return { title: `Preparis – Aufnahmeprüfung ${params.year}`, description: `Fragen & Videoerklärungen ${params.year}.` };
}


export default async function ExamYear({ params }: any) {
  const p = await unwrapParams(params);
  const year = String(p.year);

  const exam = getExam(year);

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>Prüfung {exam.year}</h1>
        <h2 style={{ marginTop: 12 }}>Fragen</h2>
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
          <Link href="/exam" className="btn">← Zurück zur Prüfungsliste</Link>
        </div>
      </div>
    </main>
  );
}
