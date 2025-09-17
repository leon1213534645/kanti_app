import Link from "next/link";
import { getTopic, listTopics } from "@/lib/topics";

export async function generateStaticParams() {
  return listTopics().map(t => ({ slug: t.slug }));
}

export default function TopicLanding({ params }: { params: { slug: string }}) {
  const topic = getTopic(params.slug);
  if (!topic) return <main className="center-screen"><div className="container"><h1>Not found</h1></div></main>;

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>{topic.chapter} — {topic.label}</h1>

        {/* Bullet-point Lernziele */}
        <div className="card" style={{ marginTop: 12 }}>
          <h2 style={{ marginBottom: 8 }}>Lernziele</h2>
          <ul style={{ paddingLeft: 18, lineHeight: 1.9 }}>
            {topic.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>

        <div className="btn-row" style={{ marginTop: 16 }}>
          <Link href={`/topics/${topic.slug}/summary`} className="btn">Zusammenfassung</Link>
          <Link href={`/topics/${topic.slug}/past-exams`} className="btn">Übungen aus Altklaussuren</Link>
          <Link href={`/topics/${topic.slug}/exercises`} className="btn">Übungen</Link>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link href="/topics" className="btn">← Zur Themenliste</Link>
        </div>
      </div>
    </main>
  );
}
