import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { EventInformation } from "@/components/event/EventInformation";
import { EventHeader } from "@/components/event/EventHeader";
import { EventTimer } from "@/components/event/EventTimer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";

const EventDetails = () => {
  const { teamSlug, slug } = useParams();
  const navigate = useNavigate();

  if (!teamSlug || !slug) {
    console.log("No team slug or event slug provided");
    return null;
  }

  const { event, isLoadingEvent, survey } = useEventQueries(teamSlug, slug);

  // Calculate whether to show broadcast URL (15 minutes before event)
  const showBroadcast = event && (event.mode === 'online' || event.mode === 'hybrid') && (() => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    const diffMinutes = (eventDateTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes <= 15;
  })();

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

          <Tabs
            defaultValue="details"
            className="mb-8"
            onValueChange={(value) => navigate(`/e/${teamSlug}/${slug}/${value}`)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="lottery">Lottery</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
            </TabsList>
          </Tabs>

          <EventTimer 
            eventDate={event.date} 
            eventTime={event.time} 
          />

          <div className="mt-6">
            <EventInformation 
              description={event.description} 
              hasSurvey={!!survey}
              mode={event.mode}
              broadcastUrl={event.broadcast_url}
              showBroadcast={!!showBroadcast}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;