// components/RichBlocks.tsx
"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export type TextBlock = { type: "text"; markdown: string };
export type ImageBlock = { type: "image"; url: string; alt?: string };
export type VideoBlock = { type: "video"; url: string; title?: string }; // ✅ new

export type Block = TextBlock | ImageBlock | VideoBlock;


function resolveBlob(url: string) {
  // Replace your placeholder scheme with a real URL if needed
  // e.g. env NEXT_PUBLIC_BLOB_BASE = https://<org>-public.blob.vercel-storage.com
  if (url.startsWith("BLOB_TBD://")) {
    const base = process.env.NEXT_PUBLIC_BLOB_BASE || "";
    return url.replace("BLOB_TBD://", base.endsWith("/") ? base : base + "/");
  }
  return url;
}

export default function RichBlocks({ blocks }: { blocks?: Block[] }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "text") {
          return (
            <div className="card" style={{ marginTop: 12 }} key={i}>
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {b.markdown}
              </ReactMarkdown>
            </div>
          );
        }
        if (b.type === "image") {
          return (
            <div className="card" style={{ marginTop: 12 }} key={i}>
              <img
                src={resolveBlob(b.url)}
                alt={b.alt ?? ""}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          );
        }
        if (b.type === "video") {
            return (
                <div className="card" style={{ marginTop: 12 }} key={i}>
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                    src={b.url}
                    title={b.title ?? "Video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                </div>
                </div>
            );
            }

        return null;
      })}
    </>
  );
}
