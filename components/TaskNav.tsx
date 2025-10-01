import Link from "next/link";

export default function TaskNav({
  prevHref, nextHref, backHref,
}: { prevHref?: string; nextHref?: string; backHref: string }) {
  return (
    <div style={{ display:"flex", gap:350, marginTop:400, flexWrap:"wrap" }}>
      {prevHref && <Link href={prevHref} className="btn">← Vorheriges Kapitel</Link>}
      {nextHref && <Link href={nextHref} className="btn">Nächstes Kapitel →</Link>}
    </div>
  );
}
