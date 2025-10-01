"use client";

import { usePathname } from "next/navigation";
import TopicSidebar from "@/components/TopicSidebar";
import TaskSidebar, { TaskItem } from "@/components/TaskSidebar";
import { getExam, Variant } from "@/lib/exams";

type TocItem = { id: string; title: string };
type Extra = { id: string; title?: string };
type Rec = { year: number; number: number; variant?: Variant };
export default function TopicLeftColumn({
  slug,
  chapter,
  label,
  toc,
  extraExercises,
  recommended,
}: {
  slug: string;
  chapter: string;
  label: string;
  toc: TocItem[];
  extraExercises: Extra[];
  recommended: Rec[];
}) {
  const pathname = usePathname();
  const isSummary = pathname.endsWith("/summary");
  const isExercises = pathname.includes(`/topics/${slug}/exercises`);
  const isPast = pathname.includes(`/topics/${slug}/past-exams`);

  const exItems: TaskItem[] = (extraExercises || []).map((ex, i) => ({
    id: String(ex.id),
    label: `Aufgabe ${i + 1}${ex.title ? ` – ${ex.title}` : ""}`,
    href: `/topics/${slug}/exercises/${ex.id}`,
  }));

const pastItems: TaskItem[] = (recommended || []).map((r, i) => ({
  id: `${r.year}-${r.variant ?? "ohne"}-${r.number}`,
  label: `Aufgabe ${i + 1}`,
  href: `/topics/${slug}/past-exams/${r.year}-${r.variant ?? "ohne"}-${r.number}`,
}));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Always show the Topic sidebar (it will render the TOC only on /summary) */}
      <TopicSidebar slug={slug} chapter={chapter} label={label} toc={toc} />

      {/* Stack the task sidebar UNDER the topic sidebar */}
      {isExercises && (
        <TaskSidebar title="Übungen" baseHref={`/topics/${slug}/exercises`} items={exItems} />
      )}

      {isPast && (
        <TaskSidebar
          title="Übungen aus Altklausuren"
          baseHref={`/topics/${slug}/past-exams`}
          items={pastItems}
        />
      )}
    </div>
  );
}
