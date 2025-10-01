// app/sitemap.ts
import type { MetadataRoute } from "next";
import { listExams, getExam } from "@/lib/exams";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://YOURDOMAIN";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // 1) exam index + variant pages
  for (const ref of listExams()) {
    // /exam/2024/ohne
    entries.push({
      url: `${BASE}/exam/${ref.year}/${ref.variant}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    });

    // 2) individual questions
    const exam = getExam(ref.year, ref.variant);
    for (const q of exam.questions) {
      entries.push({
        url: `${BASE}/exam/${ref.year}/${ref.variant}/q/${q.number}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  // add other static pages you want indexed...
  entries.push({ url: `${BASE}/`, lastModified: new Date(), priority: 1 });

  return entries;
}
