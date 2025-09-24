import { NextResponse } from "next/server";

const AT_KEY   = process.env.AIRTABLE_API_KEY;
const AT_BASE  = process.env.AIRTABLE_BASE_ID;
const AT_TABLE = process.env.AIRTABLE_TABLE_NAME || "Questions";

if (!AT_KEY || !AT_BASE) {
  console.warn("Airtable env missing. KEY or BASE not set.");
}

const AT_URL = AT_BASE && AT_TABLE
  ? `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(AT_TABLE)}`
  : "";

async function at(method: "GET" | "POST", body?: any, query?: string) {
  if (!AT_URL) throw new Error("Airtable not configured (missing env).");
  const url = query ? `${AT_URL}?${query}` : AT_URL;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${AT_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${method} ${res.status}: ${text}`);
  }
  return res.json();
}

function clean(x: unknown) {
  return typeof x === "string" ? x.trim() : "";
}

// POST /api/tutor-questions  { slug, q, email? }
export async function POST(req: Request) {
  try {
    const { slug, q, email } = await req.json();
    const _slug = clean(slug);
    const _q = clean(q);
    const _email = clean(email);

    if (!_slug || !_q) {
      return NextResponse.json({ error: "slug and q required" }, { status: 400 });
    }
    if (_q.length > 2000) {
      return NextResponse.json({ error: "question too long" }, { status: 400 });
    }

    const payload = {
      records: [
        {
          fields: {
            slug: _slug,
            question: _q,
            status: "New",
            ...( _email ? { email: _email } : {} ),
          },
        },
      ],
      typecast: true,
    };

    const data = await at("POST", payload);
    const id = data?.records?.[0]?.id ?? null;
    return NextResponse.json({ id }, { status: 201 });
  } catch (err: any) {
    console.error("POST /tutor-questions error:", err.message);
    return NextResponse.json({ error: err.message ?? "failed" }, { status: 500 });
  }
}

// GET /api/tutor-questions?slug=gleichungen
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = clean(searchParams.get("slug"));
    if (!slug) return NextResponse.json({ items: [] });

    // If you don't have 'created_at', we won't sort by it
    const filter = encodeURIComponent(`AND({slug}='${slug}', {status}='Answered')`);
    const query = `filterByFormula=${filter}&maxRecords=50`;

    const data = await at("GET", undefined, query);
    const items = (data.records || []).map((r: any) => ({
      id: r.id,
      q: r.fields?.question ?? "",
      a: r.fields?.answer ?? "",
      when: r.fields?.created_at ?? "",  // will be empty if field not present
      by: r.fields?.answered_by ?? "",
    }));
    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("GET /tutor-questions error:", err.message);
    return NextResponse.json({ error: err.message ?? "failed" }, { status: 500 });
  }
}
