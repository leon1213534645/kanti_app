"use client";
import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AskAIChat({
  context,
  starter = "Frag mich etwas zu diesem Thema …",
}: {
  context?: { topic?: string; sectionId?: string; exercise?: string };
  starter?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const q = input.trim();
    if (!q || sending) return;
    setInput("");
    const next = [...messages, { role: "user", content: q } as Msg];
    setMessages(next);
    setSending(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      const json = await res.json();
      const reply = json.reply ?? "Hmm, keine Antwort erhalten.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Fehler beim Senden." }]);
    } finally {
      setSending(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="card" style={{ display:"grid", gap:12 }}>
      <div
        ref={scroller}
        style={{ maxHeight: 260, overflowY: "auto", padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
      >
        {messages.length === 0 && <p style={{ color:"#666" }}>{starter}</p>}
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <div style={{ fontWeight: 600 }}>{m.role === "user" ? "Du" : "AI"}</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        rows={3}
        placeholder="Frage eingeben und Enter drücken … (Shift+Enter für Zeilenumbruch)"
        style={{ width:"100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
      />

      <div style={{ display:"flex", gap:8 }}>
        <button className="btn" disabled={sending || !input.trim()} onClick={send}>
          Senden
        </button>
        <button className="btn" onClick={() => setMessages([])} type="button">
          Verlauf löschen
        </button>
      </div>
    </div>
  );
}
