import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Lottery = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<string | null>(null);
  const [round, setRound] = useState(1);

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participants", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;
      return data;
    },
  });

  const { data: winners, isLoading: isLoadingWinners } = useQuery({
    queryKey: ["lottery-winners", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lottery_winners")
        .select("*, participants(*)")
        .eq("event_id", eventId)
        .order("round", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const addWinnerMutation = useMutation({
    mutationFn: async ({ participantId, round }: { participantId: string; round: number }) => {
      const { error } = await supabase
        .from("lottery_winners")
        .insert([{ event_id: eventId, participant_id: participantId, round }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lottery-winners", eventId] });
    },
  });

  const spinWheel = () => {
    if (!participants?.length) {
      toast({
        title: "No participants",
        description: "There are no participants to draw from.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const availableParticipants = participants.filter(
        (p) => !winners?.some((w) => w.participant_id === p.id)
      );

      if (!availableParticipants.length) {
        clearInterval(interval);
        setIsSpinning(false);
        toast({
          title: "No more participants",
          description: "All participants have been drawn.",
          variant: "destructive",
        });
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setCurrentParticipant(availableParticipants[randomIndex].nickname);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        const winner = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
        setCurrentParticipant(winner.nickname);
        addWinnerMutation.mutate({ participantId: winner.id, round });
        setRound((prev) => prev + 1);
        toast({
          title: "We have a winner! 🎉",
          description: `Congratulations to ${winner.nickname}!`,
        });
      }
    }, 100);
  };

  if (isLoadingParticipants || isLoadingWinners) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Prize Draw</h1>

          <div className="grid gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="relative mb-8">
                  <div
                    className={`w-64 h-64 mx-auto rounded-full border-4 border-primary flex items-center justify-center ${
                      isSpinning ? "animate-spin" : ""
                    }`}
                  >
                    <div className="text-xl font-bold p-4 text-center">
                      {currentParticipant || "Click Spin!"}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={spinWheel}
                    disabled={isSpinning || !participants?.length}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {isSpinning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Spinning...
                      </>
                    ) : (
                      "Spin the Wheel"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {winners?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Winners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {winners.map((winner) => (
                      <div
                        key={winner.id}
                        className="p-4 bg-muted rounded-lg animate-fade-in flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium">
                            Round {winner.round}: {winner.participants?.nickname}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {winner.participants?.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="text-center text-sm text-muted-foreground">
              <p>Want to create and manage your own events?</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => navigate(`/register?eventId=${eventId}&from=lottery`)}
              >
                Create an account
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lottery;
