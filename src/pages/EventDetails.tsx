import { Navbar } from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { ParticipantList } from "@/components/event/ParticipantList";
import { EventInformation } from "@/components/event/EventInformation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const EventDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSlug, setNewSlug] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (!slug) {
    console.log("No slug provided");
    navigate("/dashboard");
    return null;
  }

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      console.log("Fetching event with slug:", slug);
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          team:teams(owner_id),
          created_by:profiles!events_created_by_fkey(id)
        `)
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No event found with slug:", slug);
        throw new Error("Event not found");
      }

      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  });

  const updateSlugMutation = useMutation({
    mutationFn: async ({ newSlug, eventId }: { newSlug: string; eventId: string }) => {
      if (!eventId) {
        console.error("No event ID provided for slug update");
        throw new Error("Event ID is required");
      }

      // First check if the new slug is already in use by any event
      const { data: existingEvent, error: checkError } = await supabase
        .from('events')
        .select('id')
        .eq('slug', newSlug)
        .maybeSingle();

      if (existingEvent) {
        throw new Error('This slug is already in use by an activated event');
      }

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned, which is what we want
        throw checkError;
      }

      // If we get here, the slug is available, so update it
      const { data, error } = await supabase
        .from('events')
        .update({ slug: newSlug })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast({
        title: "Success",
        description: "Event slug updated successfully",
      });
      navigate(`/e/${data.slug}/details`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activateEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!eventId) {
        console.error("No event ID provided for activation");
        throw new Error("Event ID is required");
      }

      const { data, error } = await supabase
        .from('events')
        .update({ is_activated: true })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast({
        title: "Success",
        description: "Event activated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participants", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      if (!event?.id) {
        console.error("No event ID available for fetching participants");
        return [];
      }

      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("event_id", event.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: survey } = useQuery({
    queryKey: ["survey", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      if (!event?.id) {
        console.error("No event ID available for fetching survey");
        return null;
      }

      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("event_id", event.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (profileError) throw profileError;
        return { ...user, profile };
      }
      return null;
    },
  });

  useEffect(() => {
    if (event?.id) {
      // Set cookie for participant tracking
      Cookies.set(`event_${event.id}_visited`, 'true', { expires: 365 });
    }
  }, [event]);

  const canManageSurvey = user?.profile && event?.team?.owner_id === user.profile.id;

  const canEditSlug = user?.profile && 
    event?.team?.owner_id === user.profile.id && 
    !event?.is_activated;

  const handleUpdateSlug = () => {
    if (!newSlug || !event?.id) {
      console.error("Missing required data for slug update");
      toast({
        title: "Error",
        description: "Missing required data for slug update",
        variant: "destructive",
      });
      return;
    }
    updateSlugMutation.mutate({ newSlug, eventId: event.id });
    setIsEditing(false);
  };

  const handleActivateEvent = () => {
    if (!event?.id) {
      console.error("No event ID available for activation");
      toast({
        title: "Error",
        description: "Event ID is required for activation",
        variant: "destructive",
      });
      return;
    }
    activateEventMutation.mutate(event.id);
  };

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
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            {canEditSlug && (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Input
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="New slug"
                      className="w-48"
                    />
                    <Button onClick={handleUpdateSlug}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => {
                      setNewSlug(event.slug);
                      setIsEditing(true);
                    }}>
                      Edit Slug
                    </Button>
                    {!event.is_activated && (
                      <Button onClick={handleActivateEvent}>
                        Activate Event
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.date), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(`2000-01-01T${event.time}`), "h:mm a")}
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ParticipantList 
            eventId={event.id} 
            participants={participants || []} 
            canManageSurvey={canManageSurvey}
          />
          <EventInformation 
            description={event.description} 
            hasSurvey={!!survey} 
          />
        </div>
      </main>
    </div>
  );
};

export default EventDetails;