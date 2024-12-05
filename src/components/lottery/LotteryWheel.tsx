import { useEffect, useState, useCallback } from "react";
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
  const [rotationSpeed, setRotationSpeed] = useState(100); // Initial speed (ms)
  const [baseRotation, setBaseRotation] = useState(0);

  const updateSpeed = useCallback(() => {
    if (isSpinning) {
      // Start fast (100ms)
      setRotationSpeed(100);
      
      // After 5 seconds, start slowing down gradually
      setTimeout(() => {
        const slowdownInterval = setInterval(() => {
          setRotationSpeed(prev => {
            const newSpeed = prev + 20; // Gradually increase interval
            if (newSpeed >= 500) { // Max slowdown speed
              clearInterval(slowdownInterval);
            }
            return Math.min(newSpeed, 500);
          });
        }, 500); // Adjust speed every 500ms
      }, 5000);
    }
  }, [isSpinning]);

  useEffect(() => {
    if (isSpinning && participants.length > 0) {
      console.log("Starting spin with participants:", participants);
      setDisplayedParticipants(participants);
      updateSpeed();
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % participants.length);
      }, rotationSpeed); // Use dynamic speed
      setIntervalId(interval);

      // Stop after exactly 10 seconds
      setTimeout(() => {
        if (interval) {
          clearInterval(interval);
          setIntervalId(null);
          // Select winner
          const winnerIndex = Math.floor(Math.random() * participants.length);
          setCurrentIndex(winnerIndex);
          console.log("Selected winner:", participants[winnerIndex]);
          setDisplayedParticipants([participants[winnerIndex]]);
          onSpinComplete(participants[winnerIndex]);
        }
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSpinning, participants, onSpinComplete, rotationSpeed, updateSpeed]);

  // Continuous rotation effect
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setBaseRotation(prev => (prev + 1) % 360);
    }, 50); // Adjust speed of continuous rotation

    return () => clearInterval(rotationInterval);
  }, []);

  if (participants.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No eligible participants</p>
      </Card>
    );
  }

  // Calculate positions for participants in a circle
  const getParticipantPosition = (index: number, total: number) => {
    const radius = 120; // Adjust this value to change the circle size
    const angle = ((index * 2 * Math.PI) / total) + (baseRotation * Math.PI / 180);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <Card className="relative overflow-hidden min-h-[400px] flex items-center justify-center bg-card">
      <div className="relative w-full h-full">
        <AnimatePresence>
          {displayedParticipants.map((participant, index) => {
            const position = getParticipantPosition(index, displayedParticipants.length);
            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: position.x,
                  y: position.y,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.3,
                  ease: "linear"
                }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center
                  ${isSpinning ? 'border-2 border-primary rounded-full p-4 animate-pulse' : ''}
                  ${!isSpinning && displayedParticipants.length === 1 ? 'border-4 border-primary rounded-full p-6 shadow-lg' : ''}`}
              >
                <h3 className="text-xl font-bold mb-1">{participant.nickname}</h3>
                <p className="text-sm text-muted-foreground">
                  {participant.attendance_mode === 'online' ? 'Online' : 'In-Person'} Participant
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
};