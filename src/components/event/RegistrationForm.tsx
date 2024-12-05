import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AttendanceSelector } from "./AttendanceSelector";

interface RegistrationFormProps {
  formData: {
    nickname: string;
    email: string;
    attendance_mode: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  showAttendanceMode: boolean;
}

export const RegistrationForm = ({ 
  formData, 
  onChange, 
  onSubmit,
  showAttendanceMode 
}: RegistrationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          placeholder="Enter your nickname"
          value={formData.nickname}
          onChange={(e) => onChange("nickname", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>

      {showAttendanceMode && (
        <div className="space-y-2">
          <Label>How will you attend?</Label>
          <AttendanceSelector
            value={formData.attendance_mode}
            onChange={(value) => onChange("attendance_mode", value)}
          />
        </div>
      )}

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Register for Event
      </Button>
    </form>
  );
};