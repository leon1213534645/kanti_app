import { redirect } from "next/navigation";
import { getTopic, listTopics } from "@/lib/topics";

export async function generateStaticParams() {
  return listTopics().map((t) => ({ slug: t.slug }));
}

export default function PastIndex({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
const first = topic?.recommended?.[0];
if (first) redirect(`/topics/${params.slug}/past-exams/${first.year}-${first.variant ?? "ohne"}-${first.number}`);
  return <div className="container">Für dieses Thema sind noch keine Prüfungsaufgaben verlinkt.</div>;
}
