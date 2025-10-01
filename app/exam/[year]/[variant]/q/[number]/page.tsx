import Link from "next/link";
import { getExam, listExams, Variant } from "@/lib/exams";
import AnswerBlock from "@/components/AnswerBlock";
import { getTopic, listTopics } from "@/lib/topics";
import TaskNav from "@/components/TaskNav";
import VideoToggle from "@/components/VideoToggle";
import Collapse from "@/components/Collapse";
import AskAI from "@/components/AskAI";
import AskTutor from "@/components/AskTutor";
import AskAIChat from "@/components/AskAIChat";


export async function generateStaticParams() {
  const params: { year: string; variant: Variant; number: string }[] = [];
  for (const ref of listExams()) {
    const exam = getExam(ref.year, ref.variant);
    exam.questions.forEach(q => {
      params.push({ year: String(ref.year), variant: ref.variant, number: String(q.number) });
    });
  }
  return params;
}

export default function Page({ params }: { params: { year: string; variant: Variant; number: string } }) {
  const exam = getExam(params.year, params.variant);
  const q = exam.questions.find(x => String(x.number) === params.number);
  if (!q) return <div>Not found</div>;
  // render…


  return (
    <main className="center-screen">
      <div className="container" style={{ textAlign:"left" }}>
        <h1>{exam.year} – {exam.variant === "mit" ? "Mit TR" : "Ohne TR"} – Aufgabe {q.number}</h1>

        <div className="card" style={{ marginTop: 12 }}>
          <p><strong>Aufgabe:</strong> {q.prompt}</p>
        </div>

        {q.image && (
          <div className="card" style={{ marginTop: 12 }}>
            <img src={q.image} alt={`Aufgabe ${q.number}`} style={{ maxWidth: "100%" }} />
          </div>
        )}

        {/* your VideoToggle + AnswerBlock here */}
          <VideoToggle src={q.video} />
    
          <AnswerBlock answer={q.answer} />

        <div style={{ marginTop: 16, display:"flex", gap:8 }}>
          <Link href={`/exam/${exam.year}/${exam.variant}`} className="btn">← Zurück zu {exam.year}</Link>
        </div>
      </div>
    </main>
  );
}
