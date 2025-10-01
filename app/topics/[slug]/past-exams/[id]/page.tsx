import AnswerBlock from "@/components/AnswerBlock";
import { getQuestion, getExam } from "@/lib/exams";
import { getTopic, listTopics } from "@/lib/topics";
import TaskNav from "@/components/TaskNav";
import VideoToggle from "@/components/VideoToggle";
import Collapse from "@/components/Collapse";
import AskAI from "@/components/AskAI";
import AskTutor from "@/components/AskTutor";
import AskAIChat from "@/components/AskAIChat";



export async function generateStaticParams() {
  const out: { slug: string; id: string }[] = [];
  listTopics().forEach(t => (t.recommended ?? []).forEach(r => out.push({ slug: t.slug, id: `${r.year}-${r.number}` })));
  return out;
}

export default function PastItem({ params }: { params: { slug: string; id: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) return <div>Not found</div>;

  const list = topic.recommended ?? [];
  const idx  = list.findIndex(r => `${r.year}-${r.number}` === params.id);
  const ref  = list[idx];
  if (!ref) return <div className="container">Aufgabe nicht gefunden.</div>;

  const q = getQuestion(ref.year, ref.number);
  const exam = getExam(ref.year);
  if (!q) return <div className="container">Aufgabe nicht gefunden.</div>;

  const prev = idx > 0 ? `/topics/${topic.slug}/past-exams/${list[idx-1].year}-${list[idx-1].number}` : undefined;
  const next = idx < list.length-1 ? `/topics/${topic.slug}/past-exams/${list[idx+1].year}-${list[idx+1].number}` : undefined;

  return (
    <div className="container" style={{ textAlign: "left" }}>
      <h1>{topic.chapter} — {topic.label}: {ref.year} – Q{q.number} – {q.title}</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <p><strong>Aufgabe:</strong> {q.prompt}</p>
      </div>

      {q.image && (
        <div className="card" style={{ marginTop: 12 }}>
          <img src={q.image} alt={`Q${q.number} prompt`} style={{ maxWidth: "100%" }} />
        </div>
      )}

      <VideoToggle src={q.video} />

      <AnswerBlock answer={q.answer} />

      <TaskNav prevHref={prev} nextHref={next} backHref={`/topics/${topic.slug}`} />



<Collapse title={<><span>💬</span> Coach fragen</>} defaultOpen={false}>
  <AskTutor slug={topic.slug} />
</Collapse>

    </div>
  );
}
