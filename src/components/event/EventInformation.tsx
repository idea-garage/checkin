import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface EventInformationProps {
  description?: string | null;
  hasSurvey: boolean;
}

export const EventInformation = ({ description, hasSurvey }: EventInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {description && (
            <div>
              <div className="font-medium mb-1">Description</div>
              <p className="text-muted-foreground">{description}</p>
            </div>
          )}
          <div>
            <div className="font-medium mb-1">Survey Status</div>
            <p className="text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {hasSurvey ? "Survey available" : "No survey created yet"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};