import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Users, FileText, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface ParticipantListProps {
  eventId: string;
  participants: Array<{
    id: string;
    nickname: string;
    email: string;
  }>;
  canManageSurvey?: boolean;
}

export const ParticipantList = ({ eventId, participants, canManageSurvey }: ParticipantListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyRegistrationLink = () => {
    const link = `${window.location.origin}/e/${eventId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Registration link has been copied to clipboard",
    });
  };

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
          <div className="flex flex-wrap gap-2">
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
            {canManageSurvey && (
              <Button
                variant="outline"
                onClick={() => navigate(`/e/${eventId}/survey`)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Survey
              </Button>
            )}
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
  );
};