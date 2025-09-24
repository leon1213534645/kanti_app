"use client";
import { useState } from "react";

export default function VideoToggle({ src }: { src?: string }) {
  const [open, setOpen] = useState(false);
  if (!src) return null; // show nothing if no video

  return (
    <div style={{ marginTop: 12 }}>
      <button className="btn-video" onClick={() => setOpen(v => !v)}>
        📹 {open ? "VIDEO AUSBLENDEN" : "VIDEO ANZEIGEN"}
      </button>

      {open && (
        <div className="video" style={{ marginTop: 12 }}>
          <iframe
            src={src}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
