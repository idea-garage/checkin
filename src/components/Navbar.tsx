import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between py-4">
        <h1 
          onClick={() => navigate("/")} 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary cursor-pointer"
        >
          checkin.love
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}