import { ManageLayout } from "@/components/manage/ManageLayout";
import { useParams } from "react-router-dom";
import { ParticipantList } from "@/components/event/ParticipantList";
import { useEventQueries } from "@/hooks/event/useEventQueries";

const ManageParticipants = () => {
  const { slug } = useParams();

  if (!slug) return null;

  const { event, isLoadingEvent, participants } = useEventQueries(slug);

  if (isLoadingEvent) {
    return (
      <ManageLayout>
        <div className="text-center">Loading participants...</div>
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
      <ParticipantList 
        eventId={event.id} 
        participants={participants || []} 
        canManageSurvey={event.team?.owner_id === event.created_by?.id}
      />
    </ManageLayout>
  );
};

export default ManageParticipants;