"use client";
import { useState } from "react";

export default function Collapse({
  title, children, defaultOpen = false,
}: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 12 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ display:"flex", alignItems:"center", gap:10, fontWeight:700 }}
        aria-expanded={open}
      >
        <span style={{ transform: `rotate(${open?180:0}deg)`, color:"#ff6a00" }}>▾</span>
        {title}
      </button>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}
