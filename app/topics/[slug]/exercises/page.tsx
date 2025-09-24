import { redirect } from "next/navigation";
import { getTopic, listTopics } from "@/lib/topics";

export async function generateStaticParams() {
  return listTopics().map((t) => ({ slug: t.slug }));
}

export default function ExercisesIndex({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  const first = topic?.extraExercises?.[0]?.id;
  if (first) redirect(`/topics/${params.slug}/exercises/${first}`);
  return <div className="container">Für dieses Thema sind noch keine Übungen vorhanden.</div>;
}
