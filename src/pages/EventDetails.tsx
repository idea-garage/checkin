import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Clipboard, Users, FileText, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participants", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;
      return data;
    },
  });

  const { data: survey } = useQuery({
    queryKey: ["survey", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const copyRegistrationLink = () => {
    const link = `${window.location.origin}/e/${eventId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Registration link has been copied to clipboard",
    });
  };

  if (isLoadingEvent || isLoadingParticipants) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <p className="text-muted-foreground">
            {format(new Date(event.date), "MMMM d, yyyy")} at{" "}
            {format(new Date(`2000-01-01T${event.time}`), "h:mm a")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({participants?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={copyRegistrationLink}>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy Registration Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/e/${eventId}/lottery`)}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Lottery
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/e/${eventId}/survey`)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Survey
                  </Button>
                </div>
                <div className="divide-y">
                  {participants?.map((participant) => (
                    <div key={participant.id} className="py-3">
                      <div className="font-medium">{participant.nickname}</div>
                      <div className="text-sm text-muted-foreground">
                        {participant.email}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.description && (
                  <p className="text-muted-foreground">{event.description}</p>
                )}
                {event.location && (
                  <div>
                    <div className="font-medium">Location</div>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                )}
                <div>
                  <div className="font-medium">Survey Status</div>
                  <p className="text-muted-foreground">
                    {survey ? "Survey available" : "No survey created yet"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;