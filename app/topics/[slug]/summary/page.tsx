import Link from "next/link";
import { getTopic, listTopics } from "@/lib/topics";
import VideoToggle from "@/components/VideoToggle";
import Collapse from "@/components/Collapse";
import AskAI from "@/components/AskAI";
import AskTutor from "@/components/AskTutor";
import AskAIChat from "@/components/AskAIChat";


export async function generateStaticParams() {
  return listTopics().map(t => ({ slug: t.slug }));
}

export default function TopicSummary({ params }: { params: { slug: string }}) {
  const topic = getTopic(params.slug);
  if (!topic) {
    return (
      <main className="center-screen">
        <div className="container"><h1>Not found</h1></div>
      </main>
    );
  }

  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign: "left" }}>
        {/* Big header */}
        <h1 style={{ fontSize: "1.6rem", marginBottom: 80 }}>
          {topic.chapter} — {topic.label}
        </h1>

    {topic.summary?.sections?.map((section: any) => (
      <section key={section.id} id={section.id} style={{ marginTop: 30 }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: 20 }}>
          {section.id} {section.title}
        </h2>

{section.paras?.map((p: any, i: number) => {
  // --- BOX inside paras (Merke / Beispiel / Regel / Tipp) ---
  if (p && p.box) {
    return (
      <div
        key={i}
        className={`info info--${p.box.type ?? "merke"}`}
        data-label={p.box.title ?? "Hinweis"}
        style={{ marginTop: 16 }}
      >
        {p.paras?.map((pp: any, j: number) => {
          if (pp?.fraction) {
            return (
              <p key={j} style={{ marginTop: 6 }}>
                <span style={{ display:"inline-block", verticalAlign:"middle", lineHeight:1, fontFamily:"serif" }}>
                  <span style={{ display:"block", textAlign:"center", borderBottom:"1px solid #000", padding:"0 6px 2px" }}>
                    {pp.fraction.num}
                  </span>
                  <span style={{ display:"block", textAlign:"center", paddingTop:2 }}>
                    {pp.fraction.den}
                  </span>
                </span>
                {pp.append?.map((part: any, k: number) =>
                  part.bold ? <strong key={k}>{part.text}</strong> : <span key={k}>{part.text}</span>
                )}
              </p>
            );
          }
          if (pp?.pre) {
            return <p key={j} style={{ marginTop:6, whiteSpace:"pre", fontFamily:"monospace" }}>{pp.text}</p>;
          }
          if (pp?.append) {
            return (
              <p key={j} style={{ marginTop:6 }}>
                {pp.text ?? ""}
                {pp.append.map((part: any, k: number) =>
                  part.bold ? <strong key={k}>{part.text}</strong> : <span key={k}>{part.text}</span>
                )}
              </p>
            );
          }
          
          return <p key={j} style={{ marginTop:6 }}>{typeof pp === "string" ? pp : pp?.text}</p>;
        })}
      </div>
    );
  }

  // --- FRACTION ---
  if (p?.fraction) {
    return (
      <p key={i} style={{ marginTop: 6 }}>
        <span style={{ display:"inline-block", verticalAlign:"middle", lineHeight:1, fontFamily:"serif" }}>
          <span style={{ display:"block", textAlign:"center", borderBottom:"1px solid #000", padding:"0 6px 2px" }}>
            {p.fraction.num}
          </span>
          <span style={{ display:"block", textAlign:"center", paddingTop:2 }}>
            {p.fraction.den}
          </span>
        </span>
        {p.append?.map((part: any, j: number) =>
          part.bold ? <strong key={j}>{part.text}</strong> : <span key={j}>{part.text}</span>
        )}
      </p>
    );
  }

  // --- PRE (monospace / preserve spaces) ---
  if (p?.pre) {
    return (
      <p key={i} style={{ marginTop: 6, whiteSpace: "pre", fontFamily: "monospace" }}>
        {p.text ?? p}
      </p>
    );
  }

  // --- APPEND (bold spans) ---
  if (p?.append) {
    return (
      <p key={i} style={{ marginTop: 6 }}>
        {p.text ?? ""}
        {p.append.map((part: any, j: number) =>
          part.bold ? <strong key={j}>{part.text}</strong> : <span key={j}>{part.text}</span>
        )}
      </p>
    );
  }

  // --- default paragraph or raw string ---
  return (
    <p key={i} style={{ marginTop: 6 }}>
      {typeof p === "string" ? p : p?.text}
    </p>
  );
})}



      </section>
    ))}
    <Collapse title={<><span>✨</span> AI fragen</>} defaultOpen={false}>
    <AskAIChat context={{ topic: `${topic.chapter} — ${topic.label}` }} />
    </Collapse>

<Collapse title={<><span>💬</span> Tutor/in fragen</>} defaultOpen={false}>
  <AskTutor slug={topic.slug} />
</Collapse>




        <div style={{ marginTop: 16 }}>
          <Link href={`/topics/${topic.slug}`} className="btn">← Zurück zum Thema</Link>
        </div>
      </div>
    </main>
  );
}
