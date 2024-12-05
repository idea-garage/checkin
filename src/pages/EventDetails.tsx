import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { ParticipantList } from "@/components/event/ParticipantList";
import { EventInformation } from "@/components/event/EventInformation";
import { EventHeader } from "@/components/event/EventHeader";
import { EventControls } from "@/components/event/EventControls";
import { EventTimer } from "@/components/event/EventTimer";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { useEventMutations } from "@/hooks/event/useEventMutations";
import { supabase } from "@/integrations/supabase/client";

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

  const handleUpdateSlug = () => {
    if (!newSlug || !event?.id) return;
    updateSlugMutation.mutate({ newSlug, eventId: event.id });
    setIsEditing(false);
  };

  const handleActivateEvent = () => {
    if (!event?.id) return;
    activateEventMutation.mutate(event.id);
  };

  const handleModeChange = async (mode: string) => {
    if (!event?.id) return;
    const { error } = await supabase
      .from('events')
      .update({ mode })
      .eq('id', event.id);
    
    if (error) {
      console.error('Error updating event mode:', error);
    }
  };

  const handleBroadcastUrlChange = async (broadcastUrl: string) => {
    if (!event?.id) return;
    const { error } = await supabase
      .from('events')
      .update({ broadcast_url: broadcastUrl })
      .eq('id', event.id);
    
    if (error) {
      console.error('Error updating broadcast URL:', error);
    }
  };

  const handleAttendanceModeChange = async (participantId: string, mode: string) => {
    const { error } = await supabase
      .from('participants')
      .update({ attendance_mode: mode })
      .eq('id', participantId);
    
    if (error) {
      console.error('Error updating attendance mode:', error);
    }
  };

  useEffect(() => {
    if (event?.id) {
      Cookies.set(`event_${event.id}_visited`, 'true', { expires: 365 });
    }
  }, [event]);

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
        <div className="flex justify-between items-start mb-8">
          <EventHeader
            name={event.name}
            date={event.date}
            time={event.time}
            location={event.location}
          />
          <EventControls
            canEditSlug={event.team?.owner_id === event.created_by?.id && !event.is_activated}
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
            mode={event.mode || 'offline'}
            onModeChange={handleModeChange}
            broadcastUrl={event.broadcast_url}
            onBroadcastUrlChange={handleBroadcastUrlChange}
          />
        </div>

        <EventTimer 
          eventDate={event.date} 
          eventTime={event.time} 
        />

        <div className="grid gap-6 md:grid-cols-2">
          <ParticipantList 
            eventId={event.id} 
            participants={participants || []} 
            canManageSurvey={event.team?.owner_id === event.created_by?.id}
            eventMode={event.mode || 'offline'}
            onAttendanceModeChange={handleAttendanceModeChange}
          />
          <EventInformation 
            description={event.description} 
            hasSurvey={!!survey}
            mode={event.mode || 'offline'}
            broadcastUrl={event.broadcast_url}
            showBroadcast={!!showBroadcast}
          />
        </div>
      </main>
    </div>
  );
};

export default EventDetails;