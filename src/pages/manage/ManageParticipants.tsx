import { ManageLayout } from "@/components/manage/ManageLayout";
import { useParams } from "react-router-dom";
import { ParticipantList } from "@/components/event/ParticipantList";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { supabase } from "@/integrations/supabase/client";

const ManageParticipants = () => {
  const { teamSlug, slug } = useParams();

  if (!teamSlug || !slug) return null;

  const { event, isLoadingEvent, participants } = useEventQueries(teamSlug, slug);

  console.log("ManageParticipants - participants:", participants); // Debug log

  const handleAttendanceModeChange = async (participantId: string, mode: string) => {
    const { error } = await supabase
      .from('participants')
      .update({ attendance_mode: mode })
      .eq('id', participantId);
    
    if (error) {
      console.error('Error updating attendance mode:', error);
    }
  };

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
        eventMode={event.mode || 'inperson'}
        onAttendanceModeChange={handleAttendanceModeChange}
      />
    </ManageLayout>
  );
};

export default ManageParticipants;