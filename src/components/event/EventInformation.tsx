import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Globe, MapPin } from "lucide-react";

interface EventInformationProps {
  description?: string | null;
  hasSurvey: boolean;
  mode: string;
  broadcastUrl?: string | null;
  showBroadcast: boolean;
}

export const EventInformation = ({ 
  description, 
  hasSurvey, 
  mode,
  broadcastUrl,
  showBroadcast
}: EventInformationProps) => {
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
            <div className="font-medium mb-1">Event Mode</div>
            <p className="text-muted-foreground flex items-center gap-2">
              {mode === 'inperson' ? (
                <Globe className="h-4 w-4" />
              ) : mode === 'inperson' ? (
                <MapPin className="h-4 w-4" />
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  <MapPin className="h-4 w-4" />
                </>
              )}
              {mode === 'inperson' ? 'inperson Only' : mode === 'inperson' ? 'In Person Only' : 'Hybrid'}
            </p>
          </div>

          {showBroadcast && broadcastUrl && (
            <div>
              <div className="font-medium mb-1">Broadcast URL</div>
              <a 
                href={broadcastUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Join inperson Event
              </a>
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