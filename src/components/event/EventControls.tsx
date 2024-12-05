import { SlugManager } from "./SlugManager";
import { EventModeManager } from "./EventModeManager";

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
      <SlugManager
        isEditing={isEditing}
        newSlug={newSlug}
        onSlugChange={onSlugChange}
        onSaveSlug={onSaveSlug}
        onCancelEdit={onCancelEdit}
        onStartEdit={onStartEdit}
        onActivateEvent={onActivateEvent}
        isActivated={isActivated}
      />
      
      <EventModeManager
        mode={mode}
        onModeChange={onModeChange}
        broadcastUrl={broadcastUrl}
        onBroadcastUrlChange={onBroadcastUrlChange}
      />
    </div>
  );
};