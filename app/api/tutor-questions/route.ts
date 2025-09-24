import { NextResponse } from "next/server";

// --- config (env) ---
const AT_KEY   = process.env.AIRTABLE_API_KEY!;
const AT_BASE  = process.env.AIRTABLE_BASE_ID!;
const AT_TABLE = process.env.AIRTABLE_TABLE_NAME || "Questions";
const AT_URL   = `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(AT_TABLE)}`;

// Small helper
async function at(method: "GET" | "POST", body?: any, query?: string) {
  const url = query ? `${AT_URL}?${query}` : AT_URL;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${AT_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    // Important for Vercel: disable caching for POST/GET dynamic data
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${method} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// Validate simple text
function clean(s: unknown) {
  return typeof s === "string" ? s.trim() : "";
}

// --- POST /api/tutor-questions ---
export async function POST(req: Request) {
  try {
    const { slug, q, email } = await req.json();
    const _slug = clean(slug);
    const _q    = clean(q);
    const _em   = clean(email);

    if (!_slug || !_q) {
      return NextResponse.json({ error: "slug and q required" }, { status: 400 });
    }
    if (_q.length > 2000) {
      return NextResponse.json({ error: "question too long" }, { status: 400 });
    }

    // Create record in Airtable
    const data = await at("POST", {
      records: [
        {
          fields: {
            slug: _slug,
            question: _q,
            status: "New",
            ...( _em ? { email: _em } : {} ),
          },
        },
      ],
      typecast: true,
    });

    const rec = data?.records?.[0];
    return NextResponse.json({ id: rec?.id ?? null });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "failed to create record" }, { status: 500 });
  }
}

// --- GET /api/tutor-questions?slug=gleichungen ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = clean(searchParams.get("slug"));
    if (!slug) return NextResponse.json({ items: [] });

    // Only answered items; Airtable formula filters
    const filter = encodeURIComponent(`AND({slug}='${slug}', {status}='Answered')`);
    const query  = `filterByFormula=${filter}&sort[0][field]=created_at&sort[0][direction]=desc&maxRecords=50`;

    const data = await at("GET", undefined, query);
    const items = (data.records || []).map((r: any) => ({
      id: r.id,
      q: r.fields?.question || "",
      a: r.fields?.answer || "",
      when: r.fields?.created_at || "",
      by: r.fields?.answered_by || "",
    }));
    return NextResponse.json({ items });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "failed to load" }, { status: 500 });
  }
}
