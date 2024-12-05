import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventHeaderProps {
  name: string;
  date: string;
  time: string;
  location?: string | null;
}

export const EventHeader = ({ name, date, time, location }: EventHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <div className="flex flex-wrap gap-4 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {format(new Date(date), "MMMM d, yyyy")}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {format(new Date(`2000-01-01T${time}`), "h:mm a")}
        </div>
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
        )}
      </div>
    </div>
  );
};