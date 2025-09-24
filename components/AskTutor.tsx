"use client";
import { useEffect, useState } from "react";

type QA = { q: string; a?: string; when?: string; by?: string };

export default function AskTutor({
  slug, answered = [],
}: { slug: string; answered?: QA[] }) {
  const storageKey = `preparis:qa:${slug}`;
  const [own, setOwn] = useState<QA[]>([]);
  const [newQ, setNewQ] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setOwn(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  function saveLocal(q: QA) {
    const next = [q, ...own];
    setOwn(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  async function submit() {
    const txt = newQ.trim();
    if (!txt) return;
    setSending(true);
    try {
      // TODO: replace with your backend call (Firestore/Airtable/Notion/Email)
      // await fetch("/api/tutor-questions", { method:"POST", body: JSON.stringify({ slug, q: txt }) });
      saveLocal({ q: txt, when: new Date().toISOString() });
      setNewQ("");
      alert("Frage gesendet (Demo). Tutor/in sieht sie bald.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {/* form */}
      <div className="card">
        <label style={{ fontWeight:600 }}>Neue Frage stellen</label>
        <textarea
          value={newQ}
          onChange={e => setNewQ(e.target.value)}
          rows={3}
          placeholder="Beschreibe dein Problem möglichst konkret…"
          style={{ width:"100%", marginTop:8, padding:8, border:"1px solid #e5e7eb", borderRadius:8 }}
        />
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <button className="btn" onClick={submit} disabled={sending || newQ.trim()===""}>Frage senden</button>
          <span style={{ fontSize:12, color:"#666" }}>Anonym, nur Thema wird gespeichert.</span>
        </div>
      </div>

      {/* answered first */}
      {answered.length > 0 && (
        <div style={{ marginTop:12 }}>
          <h3 style={{ fontWeight:700, marginBottom:8 }}>Beantwortete Fragen</h3>
          <ul style={{ display:"grid", gap:8, paddingLeft:0, listStyle:"none" }}>
            {answered.map((item, i) => (
              <li key={`a-${i}`} className="card">
                <p><strong>Frage:</strong> {item.q}</p>
                {item.a && <p style={{ marginTop:6 }}><strong>Antwort:</strong> {item.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* own (pending) */}
      {own.length > 0 && (
        <div style={{ marginTop:12 }}>
          <h3 style={{ fontWeight:700, marginBottom:8 }}>Von dir gesendet</h3>
          <ul style={{ display:"grid", gap:8, paddingLeft:0, listStyle:"none" }}>
            {own.map((item, i) => (
              <li key={`o-${i}`} className="card">
                <p><strong>Frage:</strong> {item.q}</p>
                <p style={{ marginTop:6, color:"#666" }}>(Wartet auf Antwort)</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
