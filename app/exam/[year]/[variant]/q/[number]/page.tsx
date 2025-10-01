// app/exam/[year]/[variant]/q/[number]/page.tsx
import Link from "next/link";
import { getExam, listExams, Variant } from "@/lib/exams";
import RichBlocks from "@/components/RichBlocks";
import SolutionBlock from "@/components/SolutionBlock";
import TaskNav from "@/components/TaskNav";
import TaskSidebar, { TaskItem } from "@/components/TaskSidebar";

export async function generateStaticParams() {
  const out: { year: string; variant: Variant; number: string }[] = [];
  for (const ref of listExams()) {
    const exam = getExam(ref.year, ref.variant);
    exam.questions.forEach((q) => {
      out.push({ year: String(ref.year), variant: ref.variant, number: String(q.number) });
    });
  }
  return out;
}

export default function Page({
  params,
}: {
  params: { year: string; variant: Variant; number: string };
}) {
  const exam = getExam(params.year, params.variant);
  const questions = exam.questions;

  // find current question
  const idx = questions.findIndex((q) => String(q.number) === String(params.number));
  if (idx === -1) return <div className="container">Aufgabe nicht gefunden.</div>;
  const q = questions[idx];

  // prev / next links
  const prev =
    idx > 0
      ? `/exam/${exam.year}/${exam.variant}/q/${questions[idx - 1].number}`
      : undefined;
  const next =
    idx < questions.length - 1
      ? `/exam/${exam.year}/${exam.variant}/q/${questions[idx + 1].number}`
      : undefined;

  // sidebar items
  const items: TaskItem[] = questions.map((qq, i) => ({
    id: String(qq.number),
    label: `Aufgabe ${String(qq.number)}`, // or `Aufgabe ${i + 1}`
    href: `/exam/${exam.year}/${exam.variant}/q/${qq.number}`,
  }));

  const variantLabel = exam.variant === "mit" ? "Mit Taschenrechner" : "Ohne Taschenrechner";

  return (
<main
  style={{
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "-100px",
    maxWidth: "100%",        // instead of .container width
    margin: "0 auto",
  }}
>
  <aside style={{ marginLeft: "100px" }}>
    <TaskSidebar
      title={`${exam.year} • ${variantLabel}`}
      baseHref={`/exam/${exam.year}/${exam.variant}`}
      items={items}
    />
  </aside>
        {/* Left sidebar */}


        {/* Main content */}
      <div className="container" style={{ textAlign: "left" }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>
            {exam.examTitle ?? `${exam.year} – ${variantLabel}`} • Aufgabe {q.number}
            {q.title ? ` — ${q.title}` : ""}
          </h1>

          {/* content blocks (markdown + math + images + optional video) */}
          <RichBlocks blocks={q.content} />

          {/* solution toggle */}
          <SolutionBlock blocks={q.solution} />

          {/* navigation */}
          <TaskNav
            prevHref={prev}
            nextHref={next}
            backHref={`/exam/${exam.year}/${exam.variant}`}
          />


        </div>
      </div>
    </main>
  );
}
