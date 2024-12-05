import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventControlsProps {
  canEditSlug: boolean;
  isEditing: boolean;
  newSlug: string;
  onSlugChange: (value: string) => void;
  onSaveSlug: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onActivateEvent: () => void;
  isActivated: boolean;
  mode: string;
  onModeChange: (value: string) => void;
  broadcastUrl: string | null;
  onBroadcastUrlChange: (value: string) => void;
}

export const EventControls = ({
  canEditSlug,
  isEditing,
  newSlug,
  onSlugChange,
  onSaveSlug,
  onCancelEdit,
  onStartEdit,
  onActivateEvent,
  isActivated,
  mode,
  onModeChange,
  broadcastUrl,
  onBroadcastUrlChange,
}: EventControlsProps) => {
  if (!canEditSlug) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={newSlug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="New slug"
              className="w-48"
            />
            <Button onClick={onSaveSlug}>Save</Button>
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onStartEdit}>
              Edit Slug
            </Button>
            {!isActivated && <Button onClick={onActivateEvent}>Activate Event</Button>}
          </>
        )}
      </div>
      
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
    </div>
  );
};