import Link from "next/link";
import { getTopic, listTopics } from "@/lib/topics";

export async function generateStaticParams() {
  return listTopics().map(t => ({ slug: t.slug }));
}

export default function TopicSummary({ params }: { params: { slug: string }}) {
  const topic = getTopic(params.slug);
  if (!topic) {
    return <main className="center-screen"><div className="container"><h1>Nicht gefunden</h1></div></main>;
  }

  // Later you can render Markdown/MDX. For now: plain text from JSON.
  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>{topic.label} – Zusammenfassung</h1>
        <div className="card" style={{ marginTop: 12 }}>
          <p style={{ whiteSpace: "pre-line" }}>{topic.summary}</p>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link href={`/topics/${topic.slug}`} className="btn">← Zurück zum Thema</Link>
        </div>
      </div>
    </main>
  );
}
