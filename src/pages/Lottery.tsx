import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEventQueries } from "@/hooks/event/useEventQueries";

const Lottery = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [winners, setWinners] = useState<Array<{ nickname: string, email: string }>>([]);
  
  const { event, participants } = useEventQueries(slug || '');

  const selectWinner = () => {
    if (!participants || participants.length === 0) {
      toast({
        title: "No participants available",
        description: "There are no participants to select from.",
        variant: "destructive",
      });
      return;
    }

    // Filter out previous winners
    const eligibleParticipants = participants.filter(
      participant => !winners.some(winner => winner.email === participant.email)
    );

    if (eligibleParticipants.length === 0) {
      toast({
        title: "No more participants",
        description: "All participants have been selected as winners.",
        variant: "destructive",
      });
      return;
    }

    // Randomly select a winner from eligible participants
    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const winner = eligibleParticipants[randomIndex];

    setWinners(prev => [...prev, winner]);
    
    toast({
      title: "Winner Selected!",
      description: `Congratulations to ${winner.nickname}!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{event?.name} - Lottery</CardTitle>
              <CardDescription>
                Select winners from the registered participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <Button 
                    size="lg" 
                    onClick={selectWinner}
                    disabled={!participants || participants.length === 0}
                  >
                    Select Winner
                  </Button>
                </div>

                {winners.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Winners</h3>
                    <div className="divide-y">
                      {winners.map((winner, index) => (
                        <div key={index} className="py-3">
                          <div className="font-medium">
                            Round {index + 1}: {winner.nickname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {winner.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground text-center">
                  Total Participants: {participants?.length || 0}
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