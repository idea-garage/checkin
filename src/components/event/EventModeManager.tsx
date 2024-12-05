import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventModeManagerProps {
  mode: string;
  onModeChange: (value: string) => void;
  broadcastUrl: string | null;
  onBroadcastUrlChange: (value: string) => void;
}

export const EventModeManager = ({
  mode,
  onModeChange,
  broadcastUrl,
  onBroadcastUrlChange,
}: EventModeManagerProps) => {
  return (
    <div className="flex items-center gap-4">
      <Select value={mode} onValueChange={onModeChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select event mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="offline">Offline Only</SelectItem>
          <SelectItem value="online">Online Only</SelectItem>
          <SelectItem value="hybrid">Hybrid (Online & Offline)</SelectItem>
        </SelectContent>
      </Select>
      
      {(mode === 'online' || mode === 'hybrid') && (
        <Input
          value={broadcastUrl || ''}
          onChange={(e) => onBroadcastUrlChange(e.target.value)}
          placeholder="Broadcast URL"
          className="w-64"
        />
      )}
    </div>
  );
};