import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const navigate = useNavigate();

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
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}