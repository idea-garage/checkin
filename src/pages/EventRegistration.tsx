import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/Navbar";
import { EventHeader } from "@/components/event/EventHeader";
import { EventInformation } from "@/components/event/EventInformation";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const EventRegistration = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    attendance_mode: "offline",
  });

  const { data: event } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("participants")
        .insert([
          {
            event_id: event?.id,
            nickname: formData.nickname,
            email: formData.email,
            attendance_mode: formData.attendance_mode,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: "You have been registered for the event!",
      });

      // Optionally redirect to a success page or survey
      navigate(`/e/${slug}/survey`);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="text-center">Loading event details...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <EventHeader
            name={event.name}
            date={event.date}
            time={event.time}
            location={event.location}
          />
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Register for this event</CardTitle>
                <CardDescription>
                  Please provide your details below to register
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="Enter your nickname"
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {event.mode !== 'offline' && (
                    <div className="space-y-2">
                      <Label>How will you attend?</Label>
                      <RadioGroup
                        value={formData.attendance_mode}
                        onValueChange={(value) =>
                          setFormData({ ...formData, attendance_mode: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="offline" id="offline" />
                          <Label htmlFor="offline">In Person</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online">Online</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Register for Event
                  </Button>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Want to create and manage your own events?</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/register?eventId=${slug}`)}
                      className="w-full"
                    >
                      Create an account
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <EventInformation
                description={event.description}
                hasSurvey={false}
                mode={event.mode}
                broadcastUrl={event.broadcast_url}
                showBroadcast={false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventRegistration;