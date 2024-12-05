import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Lottery = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [winners, setWinners] = useState<string[]>([]);

  // Example participants
  const participants = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Edward Norton",
  ];

  const spinWheel = () => {
    setIsSpinning(true);
    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentWinner(participants[randomIndex]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        const winner = participants[Math.floor(Math.random() * participants.length)];
        setCurrentWinner(winner);
        setWinners((prev) => [...prev, winner]);
        toast({
          title: "We have a winner! 🎉",
          description: `Congratulations to ${winner}!`,
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Prize Draw</h1>

          <div className="relative mb-8">
            <div
              className={`w-64 h-64 mx-auto rounded-full border-4 border-primary flex items-center justify-center ${
                isSpinning ? "animate-spin" : ""
              }`}
            >
              <div className="text-xl font-bold p-4">
                {currentWinner || "Click Spin!"}
              </div>
            </div>
          </div>

          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            size="lg"
            className="mb-8"
          >
            {isSpinning ? "Spinning..." : "Spin the Wheel"}
          </Button>

          {winners.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Winners</h2>
              <div className="space-y-2">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted rounded-lg animate-fade-in"
                  >
                    {index + 1}. {winner}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Lottery;