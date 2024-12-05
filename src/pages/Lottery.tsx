import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { LotteryWinnerList } from "@/components/lottery/LotteryWinnerList";
import { LotteryDrawer } from "@/components/lottery/LotteryDrawer";
import { AttendanceMode } from "@/types/enums";

const Lottery = () => {
  const { teamSlug, slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isStaff, setIsStaff] = useState(false);
  
  if (!teamSlug || !slug) return null;

  const { event } = useEventQueries(teamSlug, slug);

  console.log("Event data:", event); // Debug log

  // Check if current user is staff
  useEffect(() => {
    const checkStaffStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id && event?.id) {
        const { data: eventUser } = await supabase
          .from('event_users')
          .select('is_admin, is_staff')
          .eq('event_id', event.id)
          .eq('user_id', session.user.id)
          .single();

        setIsStaff(eventUser?.is_admin || eventUser?.is_staff || false);
      }
    };

    checkStaffStatus();
  }, [event?.id]);

  // Fetch eligible participants for staff
  const { data: eligibleParticipants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ['eligible-participants', event?.id],
    queryFn: async () => {
      if (!event?.id || !isStaff) return [];
      
      console.log("Fetching eligible participants for event:", event.id); // Debug log

      const { data: winners } = await supabase
        .from('lottery_winners')
        .select('participant_id')
        .eq('event_id', event.id);

      console.log("Current winners:", winners); // Debug log

      const winnerIds = winners?.map(w => w.participant_id) || [];

      const { data: participants, error } = await supabase
        .from('participants')
        .select('id, nickname, email, attendance_mode')
        .eq('event_id', event.id)
        .eq('attendance_mode', AttendanceMode.IN_PERSON)
        .not('id', 'in', `(${winnerIds.length > 0 ? winnerIds.join(',') : 'null'})`);

      if (error) {
        console.error("Error fetching participants:", error); // Debug log
        return [];
      }

      console.log("Eligible participants:", participants); // Debug log
      return participants || [];
    },
    enabled: !!event?.id && isStaff,
  });

  // Fetch lottery winners
  const { data: winners } = useQuery({
    queryKey: ['lottery-winners', event?.id],
    queryFn: async () => {
      if (!event?.id) return [];
      
      console.log("Fetching lottery winners for event:", event.id); // Debug log

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
        console.error("Error fetching winners:", error); // Debug log
        throw error;
      }

      console.log("Current winners:", data); // Debug log
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

      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
      const winner = eligibleParticipants[randomIndex];

      console.log("Selected winner:", winner); // Debug log

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{event?.name} - Lottery Results</CardTitle>
              <CardDescription>
                Winners from the lottery draw
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {isStaff && (
                  <LotteryDrawer
                    isLoading={isLoadingParticipants}
                    participantCount={eligibleParticipants?.length || 0}
                    onDraw={() => drawWinnerMutation.mutate()}
                    isPending={drawWinnerMutation.isPending}
                  />
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Winners</h3>
                  <LotteryWinnerList 
                    winners={winners || []} 
                    isStaff={isStaff}
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