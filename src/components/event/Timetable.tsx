import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface TimetableItem {
  start_time: string;
  title: string;
  description?: string | null;
}

interface TimetableProps {
  items: TimetableItem[];
}

export const Timetable = ({ items }: TimetableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Event Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {items.map((item, index) => (
            <div key={index} className="py-4">
              <div className="flex items-start gap-4">
                <div className="w-16 font-mono text-sm">
                  {format(new Date(item.start_time), "HH:mm")}
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};