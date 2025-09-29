// app/api/ai/route.ts
import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Helper to send JSON with status
function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return json({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const context = body?.context || {};

    if (messages.length === 0) {
      return json({ error: "No messages provided" }, 400);
    }

    const system = [
      "Du bist eine freundliche Mathe-Hilfe für Schweizer Kanti-Aufnahmeprüfungen.",
      "Antworte knapp, auf Deutsch, mit klaren Schritten. Zeige Zwischenschritte.",
      context?.topic ? `Thema: ${context.topic}` : "",
      context?.sectionId ? `Abschnitt: ${context.sectionId}` : "",
      context?.exercise ? `Aufgabe: ${context.exercise}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Call OpenAI via fetch (works everywhere)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // change to another model if needed
        temperature: 0.2,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return json({ error: `OpenAI ${res.status}: ${errText}` }, 500);
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.message?.text ??
      null;

    if (!reply) {
      return json({ error: "No reply from model" }, 500);
    }

    return json({ reply });
  } catch (e: any) {
    // Print exact error server-side; return message to client
    console.error("/api/ai error:", e?.message || e);
    return json({ error: e?.message || "AI request failed" }, 500);
  }
}
