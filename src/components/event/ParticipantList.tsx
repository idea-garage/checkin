import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { ParticipantActions } from "./participant/ParticipantActions";
import { ParticipantItem } from "./participant/ParticipantItem";

interface ParticipantListProps {
  eventId: string;
  participants: Array<{
    id: string;
    nickname: string;
    email: string;
    attendance_mode: string;
  }>;
  canManageSurvey?: boolean;
  eventMode: string;
  onAttendanceModeChange?: (participantId: string, mode: string) => void;
}

export const ParticipantList = ({ 
  participants, 
  canManageSurvey,
  eventMode,
  onAttendanceModeChange,
}: ParticipantListProps) => {
  const { teamSlug, slug } = useParams();

  if (!teamSlug || !slug) return null;

  console.log("Rendering participants:", participants); // Debug log

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participants ({participants?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ParticipantActions
            teamSlug={teamSlug}
            eventSlug={slug}
            eventMode={eventMode}
            canManageSurvey={canManageSurvey}
          />
          <div className="divide-y">
            {participants?.map((participant) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                eventMode={eventMode}
                onAttendanceModeChange={onAttendanceModeChange}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};