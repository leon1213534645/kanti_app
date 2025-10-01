// components/TaskSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type TaskItem = { id: string; label: string; href: string };

export default function TaskSidebar({
  title,
  baseHref,
  items,
}: {
  title: string;
  baseHref: string;
  items: TaskItem[];
}) {
  const pathname = usePathname();

  return (
    <aside style={{ position: "sticky", top: 16, alignSelf: "start" }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>

      {/* Remove the default UL indentation */}
      <ul style={{ lineHeight: 1.9, listStyle: "none", paddingLeft: 0, margin: 0 }}>
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <li key={it.id}>
              <Link
                href={it.href}
                className={active ? "underline font-semibold" : "underline"}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 12 }}>
        <Link
          href={baseHref.replace(/\/(?:exercises|past-exams)(?:\/.*)?$/, "")}
          className="underline"
        >
          ← Zurück zum Thema
        </Link>
      </div>
    </aside>
  );
}
