import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SlugManagerProps {
  isEditing: boolean;
  newSlug: string;
  onSlugChange: (value: string) => void;
  onSaveSlug: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onActivateEvent: () => void;
  isActivated: boolean;
}

export const SlugManager = ({
  isEditing,
  newSlug,
  onSlugChange,
  onSaveSlug,
  onCancelEdit,
  onStartEdit,
  onActivateEvent,
  isActivated,
}: SlugManagerProps) => {
  return (
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
  );
};