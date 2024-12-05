import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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