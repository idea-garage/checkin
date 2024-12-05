import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const Lottery = () => {
  const { teamSlug, slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isStaff, setIsStaff] = useState(false);
  
  if (!teamSlug || !slug) return null;

  const { event } = useEventQueries(teamSlug, slug);

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
      
      const { data: winners } = await supabase
        .from('lottery_winners')
        .select('participant_id')
        .eq('event_id', event.id);

      const winnerIds = winners?.map(w => w.participant_id) || [];

      const { data: participants } = await supabase
        .from('participants')
        .select('id, nickname, email, attendance_mode')
        .eq('event_id', event.id)
        .not('id', 'in', `(${winnerIds.length > 0 ? winnerIds.join(',') : 'null'})`);

      return participants || [];
    },
    enabled: !!event?.id && isStaff,
  });

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

      if (error) throw error;
      return data;
    },
    enabled: !!event?.id,
  });

  // Draw winner mutation for staff
  const drawWinnerMutation = useMutation({
    mutationFn: async () => {
      if (!event?.id || !eligibleParticipants?.length) {
        throw new Error("No eligible participants");
      }

      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
      const winner = eligibleParticipants[randomIndex];

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

  const getAttendanceIcon = (mode: string) => {
    return mode === 'online' ? (
      <Globe className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  };

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
                )}

                <div className="space-y-4">
                  {winners && winners.length > 0 ? (
                    <div className="divide-y">
                      {winners.map((winner) => (
                        <div key={`${winner.round}-${winner.participants?.nickname}`} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                Round {winner.round}: {winner.participants?.nickname}
                              </div>
                              {isStaff && (
                                <div className="text-sm text-muted-foreground">
                                  {winner.participants?.email}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {getAttendanceIcon(winner.participants?.attendance_mode)}
                              <span className="text-sm">
                                {winner.participants?.attendance_mode === 'online' ? 'Online' : 'In Person'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No winners have been selected yet
                    </div>
                  )}
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