import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Participant {
  id: string;
  nickname: string;
  email?: string;
  attendance_mode: string;
}

interface LotteryWheelProps {
  participants: Participant[];
  isSpinning: boolean;
  onSpinComplete: (winner: Participant) => void;
}

export const LotteryWheel = ({ participants, isSpinning, onSpinComplete }: LotteryWheelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [displayedParticipants, setDisplayedParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (isSpinning && participants.length > 0) {
      console.log("Starting spin with participants:", participants);
      // Show all participants while spinning
      setDisplayedParticipants(participants);
      
      // Start the wheel animation
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % participants.length);
      }, 100); // Speed of rotation
      setIntervalId(interval);

      // Stop after a random duration between 2-4 seconds
      const duration = 2000 + Math.random() * 2000;
      setTimeout(() => {
        if (interval) {
          clearInterval(interval);
          setIntervalId(null);
          // Select winner
          const winnerIndex = Math.floor(Math.random() * participants.length);
          setCurrentIndex(winnerIndex);
          console.log("Selected winner:", participants[winnerIndex]);
          // Show only the winner
          setDisplayedParticipants([participants[winnerIndex]]);
          onSpinComplete(participants[winnerIndex]);
        }
      }, duration);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSpinning, participants, onSpinComplete]);

  if (participants.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No eligible participants</p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden min-h-[300px] flex items-center justify-center bg-card">
      <div className="space-y-4">
        {displayedParticipants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-1">{participant.nickname}</h3>
            <p className="text-sm text-muted-foreground">
              {participant.attendance_mode === 'online' ? 'Online' : 'In-Person'} Participant
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};