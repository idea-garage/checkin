import { useEffect, useState } from "react";
import { differenceInSeconds, differenceInMinutes, format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface EventTimerProps {
  eventDate: string;
  eventTime: string;
}

export const EventTimer = ({ eventDate, eventTime }: EventTimerProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);

    const updateTimer = () => {
      const now = new Date();
      setCurrentTime(now);

      if (now < eventDateTime) {
        // Event hasn't started - update every second
        const seconds = differenceInSeconds(eventDateTime, now);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        setRemainingTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        );
        setIsStarted(false);
      } else {
        // Event has started - update remaining time every minute
        const endDateTime = new Date(eventDateTime);
        endDateTime.setHours(endDateTime.getHours() + 24); // Assuming 24-hour duration
        
        if (now < endDateTime) {
          const remainingMinutes = differenceInMinutes(endDateTime, now);
          const hours = Math.floor(remainingMinutes / 60);
          const minutes = remainingMinutes % 60;
          
          setRemainingTime(
            `${hours}h ${minutes}m remaining`
          );
        } else {
          setRemainingTime("Event ended");
        }
        setIsStarted(true);
      }
    };

    // Initial update
    updateTimer();

    // Set up interval - every second before event starts, every minute after
    const interval = setInterval(
      updateTimer,
      isStarted ? 60000 : 1000
    );

    return () => clearInterval(interval);
  }, [eventDate, eventTime, isStarted]);

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Event Start
            </div>
            <div className="text-2xl font-bold">
              {format(new Date(`${eventDate}T${eventTime}`), "h:mm a")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {isStarted ? "Current Time" : "Countdown"}
            </div>
            <div className="text-2xl font-bold">
              {isStarted 
                ? format(currentTime, "h:mm:ss a")
                : remainingTime}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};