import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Send welcome email
        try {
          const { error } = await supabase.functions.invoke('send-email', {
            body: {
              type: 'welcome',
              email: session.user.email
            }
          });

          if (error) throw error;

          toast({
            title: "Welcome to Checkin! 🎉",
            description: "Check your email for more information.",
          });
        } catch (error) {
          console.error('Error sending welcome email:', error);
        }

        // Check if user came from an event page
        const params = new URLSearchParams(location.search);
        const eventId = params.get('eventId');
        
        if (eventId) {
          // If they came from lottery page, redirect back there
          if (params.get('from') === 'lottery') {
            navigate(`/e/${eventId}/lottery`);
          } else {
            // Otherwise show event details
            navigate(`/e/${eventId}/details`);
          }
        } else {
          // Default redirect to dashboard
          navigate("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Get started with Checkin by creating your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                view="sign_up"
                theme="light"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Register;
