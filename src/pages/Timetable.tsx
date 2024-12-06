import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { EventHeader } from "@/components/event/EventHeader";
import { Timetable } from "@/components/event/Timetable";
import { useEventData } from "@/hooks/event/useEventData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const TimetablePage = () => {
  const { teamSlug, slug } = useParams();
  const navigate = useNavigate();
  const { eventData, loading, error } = useEventData(teamSlug, slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="text-center">Loading event details...</div>
        </main>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="text-center">{error || "Event not found"}</div>
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
            name={eventData.name}
            date={eventData.date}
            time={eventData.time}
            location={eventData.location}
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

          <Timetable items={eventData.schedules || []} />
        </div>
      </main>
    </div>
  );
};

export default TimetablePage;