import { NextResponse } from "next/server";

// ── Env ────────────────────────────────────────────────────────────────────────
const AT_KEY   = process.env.AIRTABLE_API_KEY!;
const AT_BASE  = process.env.AIRTABLE_BASE_ID!;              // e.g. appprC0WqHOZHncdD
const AT_TABLE = process.env.AIRTABLE_TABLE_NAME || "Questions"; // or table id: tbleRU6pukRgnmBBI

// Build URL
const AT_URL = `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(AT_TABLE)}`;

// ── Your field IDs (from your screenshot) ─────────────────────────────────────
const F = {
  Slug: "fldD1EPK29l2UZe58",
  Question: "fldGLXJSgQkjf24la",
  Answer: "fldnk068KnJhd6ezZ",
  Status: "fldOtzzZ1md1kZESI",
  Created: "fld2ge6eVLsFD66T9",
  Email: "fldJdRGy58hVMOKui",
};

function clean(x: unknown) { return typeof x === "string" ? x.trim() : ""; }

async function at(method: "GET"|"POST", body?: any, query?: string) {
  const url = query ? `${AT_URL}?${query}` : AT_URL;
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${AT_KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${method} ${res.status}: ${text}`);
  }
  return res.json();
}

// POST /api/tutor-questions   body: { slug, q, email? }
export async function POST(req: Request) {
  try {
    const { slug, q, email } = await req.json();
    const _slug = clean(slug);
    const _q    = clean(q);
    const _em   = clean(email);

    if (!_slug || !_q) {
      return NextResponse.json({ error: "slug and q required" }, { status: 400 });
    }

    const payload = {
      records: [
        {
          // use field IDs so names can change safely
          fields: {
            [F.Slug]: _slug,
            [F.Question]: _q,
            [F.Status]: "New",
            ...( _em ? { [F.Email]: _em } : {} ),
          },
        },
      ],
      typecast: true, // allows creating the 'New' select option if missing
    };

    const data = await at("POST", payload);
    const id = data?.records?.[0]?.id ?? null;
    return NextResponse.json({ id }, { status: 201 });
  } catch (err: any) {
    console.error("POST tutor-questions:", err?.message || err);
    return NextResponse.json({ error: err?.message || "failed" }, { status: 500 });
  }
}

// GET /api/tutor-questions?slug=gleichungen
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = clean(searchParams.get("slug"));
    if (!slug) return NextResponse.json({ items: [] });

    const formula = `AND({${F.Slug}}='${slug}', {${F.Status}}='Answered')`;

    // ask Airtable to return fields keyed by FIELD ID
    const query =
      `filterByFormula=${encodeURIComponent(formula)}` +
      `&returnFieldsByFieldId=true` +
      // (optional but efficient) only fetch the fields you need
      `&fields[]=${F.Question}&fields[]=${F.Answer}&fields[]=${F.Created}&fields[]=${F.Email}` +
      `&maxRecords=50`;

    const data = await at("GET", undefined, query);

    const items = (data.records || []).map((r: any) => ({
      id: r.id,
      q: r.fields?.[F.Question] || "",
      a: r.fields?.[F.Answer] || "",
      when: r.fields?.[F.Created] || "",
      by: r.fields?.[F.Email] || "",
    }));

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("GET tutor-questions:", err?.message || err);
    return NextResponse.json({ error: err?.message || "failed" }, { status: 500 });
  }
}

