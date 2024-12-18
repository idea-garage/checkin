import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceMode } from "@/types/enums";

interface ParticipantItemProps {
  participant: {
    id: string;
    nickname: string;
    email: string;
    attendance_mode: string;
  };
  eventMode: string;
  onAttendanceModeChange?: (participantId: string, mode: string) => void;
}

export const ParticipantItem = ({
  participant,
  eventMode,
  onAttendanceModeChange,
}: ParticipantItemProps) => {
  return (
    <div className="py-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{participant.nickname}</div>
          <div className="text-sm text-muted-foreground">
            {participant.email}
          </div>
        </div>
        {eventMode !== AttendanceMode.IN_PERSON && onAttendanceModeChange && (
          <Select
            value={participant.attendance_mode}
            onValueChange={(value) => onAttendanceModeChange(participant.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AttendanceMode.IN_PERSON}>In Person</SelectItem>
              <SelectItem value={AttendanceMode.ONLINE}>Online</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};