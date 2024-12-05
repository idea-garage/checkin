import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AttendanceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const AttendanceSelector = ({ value, onChange }: AttendanceSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        onClick={() => onChange("inperson")}
        variant={value === "inperson" ? "default" : "outline"}
        className={cn(
          "h-9 px-6",
          value === "inperson" ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-muted/50"
        )}
      >
        In Person
      </Button>
      <Button
        type="button"
        onClick={() => onChange("inperson")}
        variant={value === "inperson" ? "default" : "outline"}
        className={cn(
          "h-9 px-6",
          value === "inperson" ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-muted/50"
        )}
      >
        inperson
      </Button>
    </div>
  );
};