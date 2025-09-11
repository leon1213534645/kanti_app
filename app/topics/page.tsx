import Link from "next/link";
import { listTopics } from "@/lib/topics";

export default function TopicsIndex() {
  const topics = listTopics();
  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>Themen</h1>
        <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.9 }}>
          {topics.map(t => (
            <li key={t.slug}>
              <Link href={`/topics/${t.slug}`}>{t.label}</Link>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 16 }}>
          <Link href="/" className="btn">← Zur Startseite</Link>
        </div>
      </div>
    </main>
  );
}
