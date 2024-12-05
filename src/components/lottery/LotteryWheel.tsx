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

  useEffect(() => {
    if (isSpinning && participants.length > 0) {
      console.log("Starting spin with participants:", participants); // Debug log
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
          console.log("Selected winner:", participants[winnerIndex]); // Debug log
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

  const currentParticipant = participants[currentIndex];

  return (
    <Card className="relative overflow-hidden h-48 flex items-center justify-center bg-card">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <h3 className="text-4xl font-bold mb-2">{currentParticipant?.nickname}</h3>
          {currentParticipant?.attendance_mode === 'online' ? (
            <p className="text-lg text-muted-foreground">Online Participant</p>
          ) : (
            <p className="text-lg text-muted-foreground">In-Person Participant</p>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};