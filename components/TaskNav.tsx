import Link from "next/link";

export default function TaskNav({
  prevHref, nextHref, backHref,
}: { prevHref?: string; nextHref?: string; backHref: string }) {
  return (
    <div style={{ display:"flex", gap:12, marginTop:16, flexWrap:"wrap" }}>
      <Link href={backHref} className="btn">← Zurück zum Thema</Link>
      {prevHref && <Link href={prevHref} className="btn">← Vorheriges Kapitel</Link>}
      {nextHref && <Link href={nextHref} className="btn">Nächstes Kapitel →</Link>}
    </div>
  );
}
