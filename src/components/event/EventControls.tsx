import { SlugManager } from "./SlugManager";
import { EventModeManager } from "./EventModeManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
  teamSlug: string;
  eventSlug: string;
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
  teamSlug,
  eventSlug,
}: EventControlsProps) => {
  const { toast } = useToast();
  const [showCopied, setShowCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/e/${teamSlug}/${eventSlug}`;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    toast({
      title: "Link copied!",
      description: "The event link has been copied to your clipboard.",
    });
    setTimeout(() => setShowCopied(false), 2000);
  };

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

      <div className="flex items-center gap-2 mt-4">
        <Button variant="outline" onClick={copyLink}>
          {showCopied ? "Copied!" : "Copy Event Link"}
        </Button>
        <a
          href={`${window.location.origin}/e/${teamSlug}/${eventSlug}`}
          className="flex-1 text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`${window.location.origin}/e/${teamSlug}/${eventSlug}`}
        </a>
      </div>
    </div>
  );
};