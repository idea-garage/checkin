import { ManageLayout } from "@/components/manage/ManageLayout";
import { useParams } from "react-router-dom";
import { EventInformation } from "@/components/event/EventInformation";
import { EventHeader } from "@/components/event/EventHeader";
import { EventControls } from "@/components/event/EventControls";
import { EventTimer } from "@/components/event/EventTimer";
import { useState } from "react";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { useEventMutations } from "@/hooks/event/useEventMutations";

const ManageEvent = () => {
  const { slug } = useParams();
  const [newSlug, setNewSlug] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (!slug) return null;

  const { event, isLoadingEvent, survey } = useEventQueries(slug);
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

  if (isLoadingEvent) {
    return (
      <ManageLayout>
        <div className="text-center">Loading event details...</div>
      </ManageLayout>
    );
  }

  if (!event) {
    return (
      <ManageLayout>
        <div className="text-center">Event not found</div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout>
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
        />
      </div>

      <EventTimer 
        eventDate={event.date} 
        eventTime={event.time} 
      />

      <div className="mt-6">
        <EventInformation 
          description={event.description} 
          hasSurvey={!!survey} 
        />
      </div>
    </ManageLayout>
  );
};

export default ManageEvent;