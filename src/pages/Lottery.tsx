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
import { useState } from "react";

const Lottery = () => {
  const { teamSlug, slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  if (!teamSlug || !slug) return null;

  const { event, participants } = useEventQueries(teamSlug, slug);

  console.log("Lottery - participants:", participants);

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

  // State to control spinning
  const [isSpinning, setIsSpinning] = useState(false);

  // Draw winner mutation
  const drawWinnerMutation = useMutation({
    mutationFn: async () => {
      if (!event?.id || !participants?.length) {
        throw new Error("No participants available");
      }

      setIsSpinning(true); // Start the wheel spinning

      // Return a promise that resolves after the spin animation (10 seconds)
      return new Promise((resolve) => {
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * participants.length);
          const winner = participants[randomIndex];
          resolve(winner);
        }, 10000); // Match the wheel's 10-second spin duration
      });
    },
    onSuccess: async (winner) => {
      // After the spin animation completes, save the winner to the database
      if (!event?.id) return;

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

      queryClient.invalidateQueries({ queryKey: ['lottery-winners', event?.id] });
      toast({
        title: "Winner Selected!",
        description: `${winner.nickname} has been selected as the winner!`,
      });
      setIsSpinning(false); // Stop the wheel spinning
    },
    onError: (error) => {
      setIsSpinning(false); // Stop the wheel if there's an error
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
                  isPending={isSpinning || drawWinnerMutation.isPending}
                />

                <LotteryWheel
                  participants={participants || []}
                  isSpinning={isSpinning}
                  onSpinComplete={(winner) => {
                    // The actual database update is handled in mutation's onSuccess
                    console.log("Wheel stopped on winner:", winner);
                  }}
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
