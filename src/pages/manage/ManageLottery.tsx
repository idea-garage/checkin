import { ManageLayout } from "@/components/manage/ManageLayout";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ManageLottery = () => {
  const { teamSlug, slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!teamSlug || !slug) return null;

  const { event, isLoadingEvent } = useEventQueries(teamSlug, slug);

  // Fetch participants who haven't won yet
  const { data: eligibleParticipants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ['eligible-participants', event?.id],
    queryFn: async () => {
      if (!event?.id) return [];
      
      const { data: winners } = await supabase
        .from('lottery_winners')
        .select('participant_id')
        .eq('event_id', event.id);

      const winnerIds = winners?.map(w => w.participant_id) || [];

      const { data: participants } = await supabase
        .from('participants')
        .select('id, nickname, email')
        .eq('event_id', event.id)
        .not('id', 'in', `(${winnerIds.length > 0 ? winnerIds.join(',') : 'null'})`);

      return participants || [];
    },
    enabled: !!event?.id,
  });

  // Fetch existing winners
  const { data: winners } = useQuery({
    queryKey: ['lottery-winners', event?.id],
    queryFn: async () => {
      if (!event?.id) return [];
      
      const { data, error } = await supabase
        .from('lottery_winners')
        .select(`
          round,
          participants (
            nickname,
            email
          )
        `)
        .eq('event_id', event.id)
        .order('round', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!event?.id,
  });

  // Draw winner mutation
  const drawWinnerMutation = useMutation({
    mutationFn: async () => {
      if (!event?.id || !eligibleParticipants?.length) {
        throw new Error("No eligible participants");
      }

      // Randomly select a winner
      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
      const winner = eligibleParticipants[randomIndex];

      // Get the next round number
      const currentRound = winners?.length || 0;
      const nextRound = currentRound + 1;

      const { error } = await supabase
        .from('lottery_winners')
        .insert({
          event_id: event.id,
          participant_id: winner.id,
          round: nextRound,
        });

      if (error) throw error;
      return winner;
    },
    onSuccess: (winner) => {
      queryClient.invalidateQueries({ queryKey: ['lottery-winners', event?.id] });
      queryClient.invalidateQueries({ queryKey: ['eligible-participants', event?.id] });
      toast({
        title: "Winner Selected!",
        description: `${winner.nickname} has been selected as the winner!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to select winner. Please try again.",
        variant: "destructive",
      });
      console.error("Error drawing winner:", error);
    },
  });

  if (isLoadingEvent) {
    return (
      <ManageLayout>
        <div className="text-center">Loading lottery...</div>
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
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Lottery Management</CardTitle>
            <CardDescription>
              Draw winners for {event.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Eligible Participants</h3>
                  <p className="text-sm text-muted-foreground">
                    {isLoadingParticipants 
                      ? "Loading participants..." 
                      : `${eligibleParticipants?.length || 0} participants remaining`}
                  </p>
                </div>
                <Button 
                  onClick={() => drawWinnerMutation.mutate()}
                  disabled={drawWinnerMutation.isPending || !eligibleParticipants?.length}
                >
                  {drawWinnerMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Draw Winner
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Winners</h3>
                {winners && winners.length > 0 ? (
                  <div className="divide-y">
                    {winners.map((winner) => (
                      <div key={`${winner.round}-${winner.participants?.nickname}`} className="py-3">
                        <div className="font-medium">
                          Round {winner.round}: {winner.participants?.nickname}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {winner.participants?.email}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No winners have been selected yet
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManageLayout>
  );
};

export default ManageLottery;