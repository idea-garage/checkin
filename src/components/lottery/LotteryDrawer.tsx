import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LotteryDrawerProps {
  isLoading: boolean;
  participantCount: number;
  onDraw: () => void;
  isPending: boolean;
}

export const LotteryDrawer = ({ 
  isLoading, 
  participantCount, 
  onDraw, 
  isPending 
}: LotteryDrawerProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">Eligible Participants</h3>
        <p className="text-sm text-muted-foreground">
          {isLoading 
            ? "Loading participants..." 
            : `${participantCount} participants remaining`}
        </p>
      </div>
      <Button 
        onClick={onDraw}
        disabled={isPending || participantCount === 0}
      >
        {isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isPending ? "Drawing..." : "Draw Winner"}
      </Button>
    </div>
  );
};