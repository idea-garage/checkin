import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LotteryWinnerList } from "@/components/lottery/LotteryWinnerList";
import { LotteryDrawer } from "@/components/lottery/LotteryDrawer";
import { LotteryWheel } from "@/components/lottery/LotteryWheel";

const Lottery = () => {
  const { teamSlug, slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  if (!teamSlug || !slug) return null;

  const { event, participants } = useEventQueries(teamSlug, slug);

  console.log("Lottery - participants:", participants); // Debug log

  // Fetch lottery winners
  const { data: winners } = useQuery({
    queryKey: ['lottery-winners', event?.id],
    queryFn: async () => {
      if (!event?.id) return [];
      
      console.log("Fetching lottery winners for event:", event.id);

      const { data, error } = await supabase
        .from('lottery_winners')
        .select(`
          round,
          participants (
            nickname,
            email,
            attendance_mode
          )
        `)
        .eq('event_id', event.id)
        .order('round', { ascending: true });

      if (error) {
        console.error("Error fetching winners:", error);
        throw error;
      }

      console.log("Current winners:", data);
      return data;
    },
    enabled: !!event?.id,
  });

  // Draw winner mutation
  const drawWinnerMutation = useMutation({
    mutationFn: async () => {
      if (!event?.id || !participants?.length) {
        throw new Error("No participants available");
      }

      const randomIndex = Math.floor(Math.random() * participants.length);
      const winner = participants[randomIndex];

      console.log("Selected winner:", winner);

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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Lottery Results</CardTitle>
              <CardDescription>
                Winners from the lottery draw for {event.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <LotteryDrawer
                  isLoading={false}
                  participantCount={participants?.length || 0}
                  onDraw={() => drawWinnerMutation.mutate()}
                  isPending={drawWinnerMutation.isPending}
                />

                <LotteryWheel
                  participants={participants || []}
                  isSpinning={drawWinnerMutation.isPending}
                  onSpinComplete={(winner) => drawWinnerMutation.mutate()}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Winners</h3>
                  <LotteryWinnerList 
                    winners={winners || []} 
                    isStaff={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Lottery;