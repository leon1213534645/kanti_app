import TaskNav from "@/components/TaskNav";
import Collapse from "@/components/Collapse";
import AskTutor from "@/components/AskTutor";
import { getTopic, listTopics } from "@/lib/topics";
import { getExam, Variant } from "@/lib/exams";

// NEW: block renderers
import RichBlocks from "@/components/RichBlocks";      // renders content blocks (text/image/video)
import SolutionBlock from "@/components/SolutionBlock"; // toggle, renders solution blocks

export async function generateStaticParams() {
  const out: { slug: string; id: string }[] = [];
  listTopics().forEach((t) =>
    (t.recommended ?? []).forEach((r: any) => {
      const v: Variant = (r.variant ?? "ohne") as Variant;
      out.push({ slug: t.slug, id: `${r.year}-${v}-${r.number}` });
    })
  );
  return out;
}

export default function PastItem({ params }: { params: { slug: string; id: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) return <div className="container">Not found</div>;

  // parse id → year-variant-number
  const [yearStr, variantStr, numberStr] = params.id.split("-");
  const year = Number(yearStr);
  const variant = (variantStr as Variant) || "ohne";

  // normalize recommended list with variant
  const list = (topic.recommended ?? []).map((r: any) => ({
    year: Number(r.year),
    variant: (r.variant ?? "ohne") as Variant,
    number: String(r.number),              // <-- treat as string for "1a" etc.
  }));

  const idx = list.findIndex(
    (r) => r.year === year && r.variant === variant && r.number === String(numberStr)
  );

  if (idx === -1) {
    return (
      <div className="container">
        <h1>Aufgabe nicht gefunden</h1>
        <p>params.id: <code>{params.id}</code></p>
        <p>Erwartet Format: <code>YYYY-variant-number</code> (z.B. 2024-ohne-1)</p>
        <p>
          Vorhandene IDs:{" "}
          {(topic.recommended ?? [])
            .map((r: any) => `${r.year}-${r.variant ?? "ohne"}-${r.number}`)
            .join(", ")}
        </p>
      </div>
    );
  }

  const ref = list[idx];
  const exam = getExam(ref.year, ref.variant);

  // Find question by string number (handles "1a", "2c", and plain "1")
  const q = exam.questions.find((x) => String(x.number) === String(ref.number));
  if (!q) return <div className="container">Aufgabe nicht gefunden.</div>;

  const mkId = (r: any) => `${r.year}-${r.variant}-${r.number}`;
  const prev = idx > 0 ? `/topics/${topic.slug}/past-exams/${mkId(list[idx - 1])}` : undefined;
  const next = idx < list.length - 1 ? `/topics/${topic.slug}/past-exams/${mkId(list[idx + 1])}` : undefined;

  const variantLabel = ref.variant === "mit" ? "Mit Taschenrechner" : "Ohne Taschenrechner";

  return (
    <div className="container" style={{ textAlign: "left" }}>
      <h1>
        {topic.chapter} — {topic.label}: {ref.year} • {variantLabel} • Aufgabe {q.number}
        {q.title ? ` — ${q.title}` : ""}
      </h1>

      {/* NEW: render rich content blocks (markdown / math / images / video) */}
      <RichBlocks blocks={q.content} />

      {/* NEW: solution toggle rendering blocks */}
      <SolutionBlock blocks={q.solution} />

      <TaskNav prevHref={prev} nextHref={next} backHref={`/topics/${topic.slug}`} />

      <Collapse title={<><span>💬</span> Coach fragen</>} defaultOpen={false}>
        <AskTutor slug={topic.slug} />
      </Collapse>
    </div>
  );
}
