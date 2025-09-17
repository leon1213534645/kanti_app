import Link from "next/link";
import { getTopic, listTopics } from "@/lib/topics";

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

        {/* Sections */}
        {topic.summary?.sections?.map((section: any) => (
          <section key={section.id} style={{ marginTop: 30 }}>
            {/* Subheader */}
            <h2 style={{ fontSize: "1.3rem", marginBottom: 20 }}>
              {section.id} {section.title}
            </h2>

            {/* Paragraphs with formatting support */}
            {section.paras?.map((p: any, i: number) => {
              // 1) FRACTION first (can also include `append`)
              if (p && p.fraction) {
                return (
                  <p key={i} style={{ marginTop: 6 }}>
                    <span
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        lineHeight: 1,
                        fontFamily: "serif"
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          textAlign: "center",
                          borderBottom: "1px solid #000",
                          padding: "0 6px 2px"
                        }}
                      >
                        {p.fraction.num}
                      </span>
                      <span style={{ display: "block", textAlign: "center", paddingTop: 2 }}>
                        {p.fraction.den}
                      </span>
                    </span>
                    {/* optional text after the fraction */}
                    {p.append?.map((part: any, j: number) =>
                      part.bold ? <strong key={j}>{part.text}</strong> : <span key={j}>{part.text}</span>
                    )}
                  </p>
                );
              }

              // 2) PRE lines (monospace, preserve spaces)
              if (p && p.pre) {
                return (
                  <p key={i} style={{ marginTop: 6, whiteSpace: "pre", fontFamily: "monospace" }}>
                    {p.text ?? p}
                  </p>
                );
              }

              // 3) APPEND (bold spans etc.)
              if (p && p.append) {
                return (
                  <p key={i} style={{ marginTop: 6 }}>
                    {p.text ?? ""}
                    {p.append.map((part: any, j: number) =>
                      part.bold ? <strong key={j}>{part.text}</strong> : <span key={j}>{part.text}</span>
                    )}
                  </p>
                );
              }

              // 4) default (also supports plain string for backwards compatibility)
              return (
                <p key={i} style={{ marginTop: 6 }}>
                  {typeof p === "string" ? p : p?.text}
                </p>
              );
            })}
          </section>
        ))}


        <div style={{ marginTop: 16 }}>
          <Link href={`/topics/${topic.slug}`} className="btn">← Zurück zum Thema</Link>
        </div>
      </div>
    </main>
  );
}
