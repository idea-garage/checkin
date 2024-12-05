import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimetableItem {
  time: string;
  title: string;
  speaker?: string;
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
                <div className="w-16 font-mono text-sm">{item.time}</div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.speaker && (
                    <div className="text-sm text-muted-foreground">{item.speaker}</div>
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