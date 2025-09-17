import Link from "next/link";
import { getTopic, listTopics } from "@/lib/topics";
import { getQuestion } from "@/lib/exams";

export async function generateStaticParams() {
  return listTopics().map(t => ({ slug: t.slug }));
}

export default function TopicPastExams({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) {
    return <main className="center-screen"><div className="container"><h1>Nicht gefunden</h1></div></main>;
  }

  const recs = topic.recommended ?? [];

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>{topic.chapter} — {topic.label}: Übungen aus Altklausuren</h1>

        {recs.length === 0 && (
          <div className="card" style={{ marginTop: 12 }}>
            <p>Für dieses Thema wurden noch keine passenden Prüfungsaufgaben verlinkt.</p>
          </div>
        )}

        <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.9 }}>
          {recs.map(ref => {
            const q = getQuestion(ref.year, ref.number);
            if (!q) return null;
            return (
              <li key={`${ref.year}-${ref.number}`}>
                <Link href={`/exam/${ref.year}/q/${ref.number}`}>
                  {ref.year} – Q{ref.number}: {q.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 16 }}>
          <Link href={`/topics/${topic.slug}`} className="btn">← Zurück zum Thema</Link>
        </div>
      </div>
    </main>
  );
}
