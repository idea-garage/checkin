import { ManageLayout } from "@/components/manage/ManageLayout";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LotteryWinnerList } from "@/components/lottery/LotteryWinnerList";
import { LotteryDrawer } from "@/components/lottery/LotteryDrawer";
import { LotteryWheel } from "@/components/lottery/LotteryWheel";
import { useState } from "react";

const ManageLottery = () => {
  const { teamSlug, slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!teamSlug || !slug) return null;

  const { event, participants } = useEventQueries(teamSlug, slug);

  // State to control spinning
  const [isSpinning, setIsSpinning] = useState(false);

  // Fetch lottery winners
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

      setIsSpinning(true);

      return new Promise((resolve) => {
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * participants.length);
          const winner = participants[randomIndex];
          resolve(winner);
        }, 10000);
      });
    },
    onSuccess: async (winner: any) => {
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
      setIsSpinning(false);
    },
    onError: (error) => {
      setIsSpinning(false);
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
    </ManageLayout>
  );
};

export default ManageLottery;