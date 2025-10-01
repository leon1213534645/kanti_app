// components/SolutionBlock.tsx
"use client";
import { useState } from "react";
import RichBlocks, { Block } from "./RichBlocks";

export default function SolutionBlock({ blocks }: { blocks?: Block[] }) {
  const [show, setShow] = useState(false);
  if (!blocks?.length) return null;

  return (
    <>
      <button className="btn" onClick={() => setShow(v => !v)} style={{ marginTop: 12 }}>
        {show ? "Lösung ausblenden" : "Lösung anzeigen"}
      </button>
      {show && <RichBlocks blocks={blocks} />}
    </>
  );
}
