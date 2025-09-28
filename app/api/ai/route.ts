import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json() as {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
      context?: { topic?: string; sectionId?: string; exercise?: string };
    };

    // Simple guardrail
    const system = [
      "Du bist eine freundliche Mathe-Hilfe für Schweizer Kanti-Aufnahmeprüfungen.",
      "Antworte knapp, auf Deutsch, mit klaren Schritten. Zeige Zwischenschritte.",
      "Gib keine Lösungen zu nicht-mathematischen Themen.",
      context?.topic ? `Thema: ${context.topic}` : "",
      context?.sectionId ? `Abschnitt: ${context.sectionId}` : "",
      context?.exercise ? `Aufgabe: ${context.exercise}` : "",
    ].filter(Boolean).join("\n");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",           // cheap + good; change if you prefer
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        ...messages,                   // last element should be user's latest question
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "Leider keine Antwort.";
    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("/api/ai", err?.message || err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
