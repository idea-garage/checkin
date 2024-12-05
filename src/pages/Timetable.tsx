import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { EventHeader } from "@/components/event/EventHeader";
import { Timetable } from "@/components/event/Timetable";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const TimetablePage = () => {
  const { teamSlug, slug } = useParams();
  const navigate = useNavigate();
  const { event, isLoadingEvent, schedules } = useEventQueries(teamSlug!, slug!);

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

          <Timetable items={schedules || []} />
        </div>
      </main>
    </div>
  );
};

export default TimetablePage;