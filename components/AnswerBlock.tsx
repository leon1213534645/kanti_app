"use client";
import { useState } from "react";

export default function AnswerBlock({ answer }: { answer: string }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button className="btn" onClick={() => setShow(v => !v)} style={{ marginTop: 12 }}>
        {show ? "Antwort ausblenden" : "Antwort anzeigen"}
      </button>

      {show && (
        <div className="card" style={{ marginTop: 12 }}>
          <p><strong>Antwort:</strong> {answer}</p>
        </div>
      )}
    </>
  );
}
