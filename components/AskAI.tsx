"use client";
import { useState } from "react";

export default function AskAI({
  context,
}: { context: { type: "summary" | "exercise"; slug: string; sectionId?: string; taskId?: string } }) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const disabled = value.trim().length === 0 || sending;

  async function submit() {
    setSending(true);
    try {
      // Hook this to your API later:
      // await fetch("/api/ai", { method:"POST", body: JSON.stringify({ prompt:value, context }) });
      console.log("AI PROMPT", { prompt: value, context });
      alert("Gesendet an AI (Demo). Backend kommt später.");
      setValue("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card">
      <label style={{ fontWeight:600 }}>Deine Frage an die KI</label>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={4}
        placeholder="Frag z.B.: 'Wie stelle ich diese Formel nach a um?'"
        style={{ width:"100%", marginTop:8, padding:8, border:"1px solid #e5e7eb", borderRadius:8 }}
      />
      <div style={{ display:"flex", gap:8, marginTop:8 }}>
        <button className="btn" onClick={submit} disabled={disabled}>
          Abschicken
        </button>
        <span style={{ color:"#666", fontSize:12 }}>{value.length} Zeichen</span>
      </div>
    </div>
  );
}
