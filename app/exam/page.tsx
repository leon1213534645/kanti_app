import Link from "next/link";
import { listYears } from "@/lib/exams";

export default function ExamsIndex() {
  const years = listYears(); // server-side
  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>Prüfung</h1>
        <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.9 }}>
          {years.map((y) => (
            <li key={y}>
              <Link href={`/exam/${y}`}>Prüfung {y}</Link>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 16 }}>
          <Link href="/" className="btn">← Zurück zur Homepage</Link>
        </div>
      </div>
    </main>
  );
}
