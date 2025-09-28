import AnswerBlock from "@/components/AnswerBlock";
import { getTopic, listTopics } from "@/lib/topics";
import TaskNav from "@/components/TaskNav";
import VideoToggle from "@/components/VideoToggle";
import Collapse from "@/components/Collapse";
import AskAI from "@/components/AskAI";
import AskTutor from "@/components/AskTutor";
import AskAIChat from "@/components/AskAIChat";



export async function generateStaticParams() {
  const out: { slug: string; id: string }[] = [];
  listTopics().forEach(t => (t.extraExercises ?? []).forEach(ex => out.push({ slug: t.slug, id: String(ex.id) })));
  return out;
}

export default function ExerciseTask({ params }: { params: { slug: string; id: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) return <div>Not found</div>;

  const list = topic.extraExercises ?? [];
  const idx  = list.findIndex(x => String(x.id) === String(params.id));
  const ex   = list[idx];
  if (!ex) return <div className="container">Aufgabe nicht gefunden.</div>;

  const prev = idx > 0 ? `/topics/${topic.slug}/exercises/${list[idx-1].id}` : undefined;
  const next = idx < list.length-1 ? `/topics/${topic.slug}/exercises/${list[idx+1].id}` : undefined;

  return (
    <div className="container" style={{ textAlign: "left" }}>
      <h1>{topic.chapter} — {topic.label}: { `Aufgabe ${ex.id}`}</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <p><strong>Aufgabe:</strong> {ex.prompt}</p>
      </div>

      {/* show/hide video if present */}
      <VideoToggle src={ex.video} />

      <AnswerBlock answer={ex.answer} />

      <TaskNav prevHref={prev} nextHref={next} backHref={`/topics/${topic.slug}`} />

      <Collapse title={<><span>✨</span> AI fragen</>} defaultOpen={false}>
        <AskAI context={{ type: "summary", slug: topic.slug }} />
        <AskAIChat context={{ topic: `${topic.chapter} — ${topic.label}`, exercise: `Übung ${ex.id}` }} />
      </Collapse>

<Collapse title={<><span>💬</span> Tutor/in fragen</>} defaultOpen={false}>
  <AskTutor slug={topic.slug} />
</Collapse>

    </div>
  );
}
