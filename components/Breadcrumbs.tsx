import Link from "next/link";

export default function Breadcrumbs({ items }:{items:{href:string;label:string}[]}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-4">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2 text-gray-400">/</span>}
          {i < items.length - 1 ? <Link href={it.href} className="underline">{it.label}</Link> : <span>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
