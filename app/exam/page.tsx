import Link from "next/link";
import { listExams } from "@/lib/exams";

export default function ExamIndex() {
  const refs = listExams();

  // group by year
  const byYear = new Map<number, typeof refs>();
  refs.forEach(r => {
    if (!byYear.has(r.year)) byYear.set(r.year, []);
    byYear.get(r.year)!.push(r);
  });

  const years = Array.from(byYear.keys()).sort((a,b) => b-a);

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign:"left" }}>
        <h1>Alte Prüfungen</h1>
        {years.map(year => (
          <div key={year} style={{ marginTop: 18 }}>
            <h2 style={{ marginBottom: 8 }}>{year}</h2>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {byYear.get(year)!.map(ref => (
                <Link key={ref.slug} href={`/exam/${year}/${ref.variant}`} className="btn">
                  {ref.variant === "mit" ? "Mit Taschenrechner" : "Ohne Taschenrechner"}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
