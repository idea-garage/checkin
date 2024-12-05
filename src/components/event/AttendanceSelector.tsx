import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttendanceMode } from "@/types/enums";

interface AttendanceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const AttendanceSelector = ({ value, onChange }: AttendanceSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        onClick={() => onChange(AttendanceMode.IN_PERSON)}
        variant={value === AttendanceMode.IN_PERSON ? "default" : "outline"}
        className={cn(
          "h-9 px-6",
          value === AttendanceMode.IN_PERSON ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-muted/50"
        )}
      >
        In Person
      </Button>
      <Button
        type="button"
        onClick={() => onChange(AttendanceMode.ONLINE)}
        variant={value === AttendanceMode.ONLINE ? "default" : "outline"}
        className={cn(
          "h-9 px-6",
          value === AttendanceMode.ONLINE ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-muted/50"
        )}
      >
        Online
      </Button>
    </div>
  );
};