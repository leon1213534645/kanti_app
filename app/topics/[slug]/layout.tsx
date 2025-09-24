import { ReactNode } from "react";
import { getTopic, listTopics } from "@/lib/topics";
import TopicLeftColumn from "@/components/TopicLeftColumn";

export async function generateStaticParams() {
  return listTopics().map((t) => ({ slug: t.slug }));
}

export default function TopicLayout({
  children,
  params,
}: { children: ReactNode; params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) {
    return <main className="center-screen"><div className="container"><h1>Not found</h1></div></main>;
  }

  const toc = topic.summary?.sections?.map((s) => ({ id: s.id, title: s.title })) ?? [];

  return (
    <main className="container-wide">
      <div className="topic-shell">
        {/* LEFT column (stacked TopicSidebar + TaskSidebar) */}
        <TopicLeftColumn
          slug={topic.slug}
          chapter={topic.chapter}
          label={topic.label}
          toc={toc}
          extraExercises={topic.extraExercises ?? []}
          recommended={topic.recommended ?? []}
        />
        {/* RIGHT column (page content) */}
        <div>{children}</div>
      </div>
    </main>
  );
}
