"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type TocItem = { id: string; title: string };

export default function TopicSidebar({
  slug,
  chapter,
  label,
  toc = [],
}: {
  slug: string;
  chapter: string;
  label: string;
  toc?: TocItem[];
}) {
  const pathname = usePathname();
  const isSummary = pathname.endsWith("/summary");
  const isExercises = pathname.endsWith("/exercises");
  const isPast = pathname.endsWith("/past-exams");
  const base = `/topics/${slug}`;

  const link = (href: string, label: string, active: boolean) => (
    <li>
      <Link
        href={href}
        className={active ? "underline font-semibold" : "underline"}
      >
        • {label}
      </Link>
    </li>
  );

  return (
    <aside className="topic-sidebar" style={{ position: "static", top: 16, alignSelf: "start", padding: "12px 0" }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>
        {chapter} — {label}
      </div>

      {/* Tabs */}
      <ul style={{ lineHeight: 1.9, marginBottom: 18 }}>
        {link(`${base}/summary`, "Zusammenfassung", isSummary)}
        {link(`${base}/exercises`, "Übungen", isExercises)}
        {link(`${base}/past-exams`, "Übungen aus Altklausuren", isPast)}
      </ul>

      {/* TOC only on Summary */}
      {isSummary && toc.length > 0 && (
        <>
          <div style={{ fontWeight: 700, margin: "8px 0 6px" }}>Zusammenfassung:</div>
          <nav aria-label="Inhaltsverzeichnis">
            <ul style={{ lineHeight: 1.8, paddingLeft: 16 }}>
              {toc.map((s) => (
                <li key={s.id}>
                  <a className="underline" href={`#${s.id}`}>
                    {s.id} {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </aside>
  );
}
