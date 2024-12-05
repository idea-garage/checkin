import { Navbar } from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantList } from "@/components/event/ParticipantList";
import { EventInformation } from "@/components/event/EventInformation";
import { EventHeader } from "@/components/event/EventHeader";
import { EventControls } from "@/components/event/EventControls";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { useEventMutations } from "@/hooks/event/useEventMutations";

const EventDetails = () => {
  const { slug } = useParams();
  const [newSlug, setNewSlug] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (!slug) {
    console.log("No slug provided");
    return null;
  }

  const { event, isLoadingEvent, participants, survey } = useEventQueries(slug);
  const { updateSlugMutation, activateEventMutation } = useEventMutations();

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
      return;
    }
    updateSlugMutation.mutate({ newSlug, eventId: event.id });
    setIsEditing(false);
  };

  const handleActivateEvent = () => {
    if (!event?.id) {
      console.error("No event ID available for activation");
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
        <div className="flex justify-between items-start mb-8">
          <EventHeader
            name={event.name}
            date={event.date}
            time={event.time}
            location={event.location}
          />
          <EventControls
            canEditSlug={canEditSlug}
            isEditing={isEditing}
            newSlug={newSlug}
            onSlugChange={setNewSlug}
            onSaveSlug={handleUpdateSlug}
            onCancelEdit={() => setIsEditing(false)}
            onStartEdit={() => {
              setNewSlug(event.slug);
              setIsEditing(true);
            }}
            onActivateEvent={handleActivateEvent}
            isActivated={!!event.is_activated}
          />
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