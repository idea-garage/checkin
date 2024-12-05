import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { EventHeader } from "@/components/event/EventHeader";
import { EventInformation } from "@/components/event/EventInformation";
import { RegistrationForm } from "@/components/event/RegistrationForm";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { generateEventUrl } from "@/utils/urlUtils";

const EventRegistration = () => {
  const { teamSlug, slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    attendance_mode: "inperson",
    createAccount: false,
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

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamSlug || !slug) {
      toast({
        title: "Error",
        description: "Invalid event URL",
        variant: "destructive",
      });
      return;
    }

    try {
      let userId = null;

      // If user wants to create an account
      if (formData.createAccount) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: crypto.randomUUID(), // Generate a random password
          options: {
            data: {
              full_name: formData.nickname,
            },
          },
        });

        if (authError) throw authError;
        userId = authData.user?.id;

        // Send welcome email with magic link
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            type: 'welcome-participant',
            email: formData.email,
            to: [formData.email],
            subject: 'Welcome to Checkin! Complete your registration',
            html: `
              <h1>Welcome to Checkin!</h1>
              <p>Thank you for registering for the event. To access your account in the future, click the button below:</p>
              <a href="${window.location.origin}/login" 
                 style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Login to Your Account
              </a>
              <p>You can use the "Forgot Password" option to set your password.</p>
            `
          }
        });

        if (emailError) {
          console.error('Error sending welcome email:', emailError);
        }
      }

      // Register participant
      const { error } = await supabase
        .from("participants")
        .insert([
          {
            event_id: event?.id,
            nickname: formData.nickname,
            email: formData.email,
            attendance_mode: formData.attendance_mode,
            user_id: userId,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: formData.createAccount 
          ? "You have been registered! Check your email to complete your account setup."
          : "You have been registered for the event!",
      });

      const redirectUrl = generateEventUrl(teamSlug, slug);
      navigate(redirectUrl.replace(window.location.origin, ''));
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
                <RegistrationForm
                  formData={formData}
                  onChange={handleFormChange}
                  onSubmit={handleSubmit}
                  showAttendanceMode={event.mode !== 'inperson'}
                />
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