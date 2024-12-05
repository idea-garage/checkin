import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Users, FileText, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

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
  eventId, 
  participants, 
  canManageSurvey,
  eventMode,
  onAttendanceModeChange,
}: ParticipantListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyRegistrationLink = async () => {
    // Get the event slug from the database
    const { data: event } = await supabase
      .from('events')
      .select('slug')
      .eq('id', eventId)
      .single();

    if (!event?.slug) {
      toast({
        title: "Error",
        description: "Could not find event slug",
        variant: "destructive",
      });
      return;
    }

    const link = `${window.location.origin}/e/${event.slug}`;
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
            {eventMode !== 'online' && (
              <Button
                variant="outline"
                onClick={() => navigate(`/e/${eventId}/lottery`)}
              >
                <Trophy className="mr-2 h-4 w-4" />
                Lottery
              </Button>
            )}
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
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{participant.nickname}</div>
                    <div className="text-sm text-muted-foreground">
                      {participant.email}
                    </div>
                  </div>
                  {eventMode !== 'offline' && onAttendanceModeChange && (
                    <Select
                      value={participant.attendance_mode}
                      onValueChange={(value) => onAttendanceModeChange(participant.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};