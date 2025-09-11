import Link from "next/link";
import { getTopic, listTopics } from "@/lib/topics";
import { getQuestion } from "@/lib/exams";

export async function generateStaticParams() {
  return listTopics().map(t => ({ slug: t.slug }));
}

export default function TopicExercises({ params }: { params: { slug: string }}) {
  const topic = getTopic(params.slug);
  if (!topic) {
    return <main className="center-screen"><div className="container"><h1>Nicht gefunden</h1></div></main>;
  }

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        <h1>{topic.label} – Übungen</h1>

        <h2 style={{ marginTop: 12 }}>Aus alten Prüfungen</h2>
        <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.9 }}>
          {topic.recommended.map(ref => {
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

        {topic.extraExercises && topic.extraExercises.length > 0 && (
          <>
            <h2 style={{ marginTop: 16 }}>Zusätzliche Aufgaben</h2>
            <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.9 }}>
              {topic.extraExercises.map(ex => (
                <li key={ex.id}>
                  <div className="card">
                    <p><strong>Aufgabe:</strong> {ex.prompt}</p>
                    <details style={{ marginTop: 8 }}>
                      <summary>Lösung anzeigen</summary>
                      <p style={{ marginTop: 6 }}><strong>Lösung:</strong> {ex.answer}</p>
                      {ex.video && ex.video.length > 0 && (
                        <div className="video" style={{ marginTop: 8 }}>
                          <iframe
                            src={ex.video}
                            title={`Exercise ${ex.id}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </details>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div style={{ marginTop: 16 }}>
          <Link href={`/topics/${topic.slug}`} className="btn">← Zurück zum Thema</Link>
        </div>
      </div>
    </main>
  );
}
