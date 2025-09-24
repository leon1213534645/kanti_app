import { listYears, getExam } from "@/lib/exams";
import { listTopics } from "@/lib/topics";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-vercel-url";
  const years = listYears();
  const topics = listTopics();

  const urls = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/exam`, lastModified: new Date() },
    { url: `${base}/topics`, lastModified: new Date() },
    ...years.flatMap(y => {
      const e = getExam(y);
      return [
        { url: `${base}/exam/${y}`, lastModified: new Date() },
        ...e.questions.map(q => ({ url: `${base}/exam/${y}/q/${q.number}`, lastModified: new Date() })),
      ];
    }),
    ...topics.flatMap(t => [
      { url: `${base}/topics/${t.slug}`, lastModified: new Date() },
      { url: `${base}/topics/${t.slug}/summary`, lastModified: new Date() },
      { url: `${base}/topics/${t.slug}/exercises`, lastModified: new Date() },
      { url: `${base}/topics/${t.slug}/past-exams`, lastModified: new Date() },
    ]),
  ];
  return urls;
}
