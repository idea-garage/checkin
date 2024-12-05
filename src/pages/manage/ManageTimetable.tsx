import { ManageLayout } from "@/components/manage/ManageLayout";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Timetable } from "@/components/event/Timetable";
import { format } from "date-fns";

const ManageTimetable = () => {
  const { teamSlug, slug } = useParams();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!teamSlug || !slug) return null;

  const { event, isLoadingEvent, schedules } = useEventQueries(teamSlug, slug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event?.id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add schedule items",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('event_schedules')
        .insert({
          event_id: event.id,
          title,
          description,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule item added successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoadingEvent) {
    return (
      <ManageLayout>
        <div className="text-center">Loading timetable...</div>
      </ManageLayout>
    );
  }

  if (!event) {
    return (
      <ManageLayout>
        <div className="text-center">Event not found</div>
      </ManageLayout>
    );
  }

  const defaultDate = format(new Date(event.date), "yyyy-MM-dd");

  return (
    <ManageLayout>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Schedule Item</CardTitle>
            <CardDescription>
              Add a new item to the event schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    min={`${defaultDate}T00:00`}
                  />
                </div>
                <div>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    min={startTime || `${defaultDate}T00:00`}
                  />
                </div>
              </div>
              <Button type="submit">Add Schedule Item</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Timetable items={schedules || []} />
          </CardContent>
        </Card>
      </div>
    </ManageLayout>
  );
};

export default ManageTimetable;