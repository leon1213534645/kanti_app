import AnswerBlock from "@/components/AnswerBlock";
import TaskNav from "@/components/TaskNav";
import VideoToggle from "@/components/VideoToggle";
import Collapse from "@/components/Collapse";
import AskTutor from "@/components/AskTutor";
import { getTopic, listTopics } from "@/lib/topics";
import { getExam, Variant } from "@/lib/exams";


export async function generateStaticParams() {
  const out: { slug: string; id: string }[] = [];
  listTopics().forEach(t =>
    (t.recommended ?? []).forEach((r: any) => {
      const v: Variant = (r.variant ?? "ohne") as Variant;
      out.push({ slug: t.slug, id: `${r.year}-${v}-${r.number}` });
    })
  );
  return out;
}




export default function PastItem({ params }: { params: { slug: string; id: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) return <div>Not found</div>;

  // parse id → year-variant-number
  const [yearStr, variantStr, numberStr] = params.id.split("-");
  const year = Number(yearStr);
  const variant = (variantStr as Variant) || "ohne";
  const number = Number(numberStr);

  // normalize recommended list with variant
  const list = (topic.recommended ?? []).map((r: any) => ({
    year: Number(r.year),
    variant: (r.variant ?? "ohne") as Variant,
    number: Number(r.number),
  }));

  const idx = list.findIndex(r => r.year === year && r.variant === variant && r.number === number);

if (idx === -1) {
  return (
    <div className="container">
      <h1>Aufgabe nicht gefunden</h1>
      <p>params.id: <code>{params.id}</code></p>
      <p>Erwartet Format: <code>YYYY-variant-number</code> (z.B. 2024-ohne-1)</p>
      <p>Vorhandene IDs:
        {" "}
        {(topic.recommended ?? [])
          .map((r: any) => `${r.year}-${r.variant ?? "ohne"}-${r.number}`)
          .join(", ")}
      </p>
    </div>
  );
}
  const ref = list[idx];
  if (!ref) return <div className="container">Aufgabe nicht gefunden.</div>;

  const exam = getExam(ref.year, ref.variant);
  const q = exam.questions.find(q => Number(q.number) === ref.number);
  if (!q) return <div className="container">Aufgabe nicht gefunden.</div>;

  const mkId = (r: any) => `${r.year}-${r.variant}-${r.number}`;
  const prev = idx > 0 ? `/topics/${topic.slug}/past-exams/${mkId(list[idx - 1])}` : undefined;
  const next = idx < list.length - 1 ? `/topics/${topic.slug}/past-exams/${mkId(list[idx + 1])}` : undefined;

  const variantLabel = ref.variant === "mit" ? "Mit Taschenrechner" : "Ohne Taschenrechner";

  return (
    <div className="container" style={{ textAlign: "left" }}>
      <h1>
        {topic.chapter} — {topic.label}: {ref.year} • {variantLabel} • Aufgabe {q.number} — {q.title}
      </h1>

      <div className="card" style={{ marginTop: 12 }}>
        <p><strong>Aufgabe:</strong> {q.prompt}</p>
      </div>

      {q.image && (
        <div className="card" style={{ marginTop: 12 }}>
          <img src={q.image} alt={`Q${q.number} prompt`} style={{ maxWidth: "100%" }} />
        </div>
      )}

      <VideoToggle src={q.video} />
      <AnswerBlock answer={q.answer} />

      <TaskNav prevHref={prev} nextHref={next} backHref={`/topics/${topic.slug}`} />

      <Collapse title={<><span>💬</span> Coach fragen</>} defaultOpen={false}>
        <AskTutor slug={topic.slug} />
      </Collapse>
    </div>
  );
}
