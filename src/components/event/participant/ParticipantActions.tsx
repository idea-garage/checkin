import { Button } from "@/components/ui/button";
import { Clipboard, FileText, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { generateEventUrl, generateRegistrationUrl } from "@/utils/urlUtils";

interface ParticipantActionsProps {
  teamSlug: string;
  eventSlug: string;
  eventMode: string;
  canManageSurvey?: boolean;
}

export const ParticipantActions = ({
  teamSlug,
  eventSlug,
  eventMode,
  canManageSurvey,
}: ParticipantActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyRegistrationLink = async () => {
    const link = generateRegistrationUrl(teamSlug, eventSlug);
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Registration link has been copied to clipboard",
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={copyRegistrationLink}>
        <Clipboard className="mr-2 h-4 w-4" />
        Copy Registration Link
      </Button>
      {eventMode !== 'online' && (
        <Button
          variant="outline"
          onClick={() => navigate(generateEventUrl(teamSlug, eventSlug, 'public', 'lottery').replace(window.location.origin, ''))}
        >
          <Trophy className="mr-2 h-4 w-4" />
          Lottery
        </Button>
      )}
      {canManageSurvey && (
        <Button
          variant="outline"
          onClick={() => navigate(generateEventUrl(teamSlug, eventSlug, 'public', 'survey').replace(window.location.origin, ''))}
        >
          <FileText className="mr-2 h-4 w-4" />
          Survey
        </Button>
      )}
    </div>
  );
};