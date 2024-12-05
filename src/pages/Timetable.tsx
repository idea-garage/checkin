import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { EventHeader } from "@/components/event/EventHeader";
import { Timetable } from "@/components/event/Timetable";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const schedule = [
  { time: "18:30", title: "開場" },
  { time: "19:00", title: "オープニング Supabase共同創業者Paul, Antからの歓迎ビデオ" },
  { time: "19:10", title: "Launch Week13速報" },
  { 
    time: "19:20", 
    title: "Supabase Edge Functionを利用した超小型衛星のスケジュール管理システムの設計",
    speaker: "@waarrk"
  },
  { 
    time: "19:35", 
    title: "LangChainとSupabaseを活用して、RAGを実装してみた",
    speaker: "@Atsushiii_"
  },
  { 
    time: "19:50", 
    title: "最新！AIアプリ開発とSupabase",
    speaker: "Hide@Ideagarage"
  },
  { time: "20:20", title: "交流会：ピザ・ドリンク" },
  { time: "20:30", title: "プレゼント抽選会" }
];

const TimetablePage = () => {
  const { teamSlug, slug } = useParams();
  const navigate = useNavigate();
  const { event, isLoadingEvent } = useEventQueries(teamSlug!, slug!);

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="text-center">Loading event details...</div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="text-center">Event not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <EventHeader
            name={event.name}
            date={event.date}
            time={event.time}
            location={event.location}
          />

          <Tabs defaultValue="timetable" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger 
                value="register"
                onClick={() => navigate(`/e/${teamSlug}/${slug}`)}
              >
                Register
              </TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger 
                value="lottery"
                onClick={() => navigate(`/e/${teamSlug}/${slug}/lottery`)}
              >
                Lottery
              </TabsTrigger>
              <TabsTrigger 
                value="survey"
                onClick={() => navigate(`/e/${teamSlug}/${slug}/survey`)}
              >
                Survey
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Timetable items={schedule} />
        </div>
      </main>
    </div>
  );
};

export default TimetablePage;