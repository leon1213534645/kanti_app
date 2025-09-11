"use client";
import { useState } from "react";

export default function AnswerBlock({ answer }: { answer: string }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button className="btn" onClick={() => setShow(v => !v)} style={{ marginTop: 12 }}>
        {show ? "Hide Answer" : "Show Answer"}
      </button>

      {show && (
        <div className="card" style={{ marginTop: 12 }}>
          <p><strong>Solution:</strong> {answer}</p>
        </div>
      )}
    </>
  );
}
