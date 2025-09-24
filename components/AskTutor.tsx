"use client";
import { useEffect, useState } from "react";

type QA = { id?: string; q: string; a?: string; when?: string; by?: string };

export default function AskTutor({ slug }: { slug: string }) {
  const [answered, setAnswered] = useState<QA[]>([]);
  const [newQ, setNewQ] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Load answered from API
  useEffect(() => {
    (async () => {
      try {
        setError("");
        const res = await fetch(`/api/tutor-questions?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
        const json = await res.json();
        setAnswered(json.items || []);
      } catch (e) {
        console.error(e);
        setError("Konnte beantwortete Fragen nicht laden.");
      }
    })();
  }, [slug]);

  async function submit() {
    const q = newQ.trim();
    if (!q) return;
    setSending(true);
    try {
      setError("");
      const res = await fetch("/api/tutor-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, q }),
      });
      if (!res.ok) throw new Error(await res.text());
      setNewQ("");
      alert("Frage gesendet. Tutor/in meldet sich bald 🙂");
    } catch (e) {
      console.error(e);
      setError("Senden fehlgeschlagen.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
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
          <button className="btn" onClick={submit} disabled={sending || newQ.trim()===""}>
            Frage senden
          </button>
          {error && <span style={{ color:"#b91c1c" }}>{error}</span>}
        </div>
      </div>

      <div style={{ marginTop:12 }}>
        <h3 style={{ fontWeight:700, marginBottom:8 }}>Beantwortete Fragen</h3>
        {answered.length === 0 ? (
          <p>Keine Antworten vorhanden.</p>
        ) : (
          <ul style={{ display:"grid", gap:8, paddingLeft:0, listStyle:"none" }}>
            {answered.map((item) => (
              <li key={item.id} className="card">
                <p><strong>Frage:</strong> {item.q}</p>
                {item.a && <p style={{ marginTop:6 }}><strong>Antwort:</strong> {item.a}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
