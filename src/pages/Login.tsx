import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const Login = () => {
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
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#4F46E5',
                        brandAccent: '#4338CA',
                        inputBackground: 'white',
                        inputText: '#1F2937',
                        inputBorder: '#E5E7EB',
                        inputLabelText: '#6B7280',
                        inputPlaceholder: '#9CA3AF',
                      },
                    },
                  },
                  className: {
                    input: 'bg-white border-gray-200',
                    label: 'text-gray-600',
                    button: 'bg-indigo-600 hover:bg-indigo-700',
                  },
                }}
                providers={[]}
                theme="light"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;