import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <nav className="container flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          checkin.love
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>Get Started</Button>
        </div>
      </nav>

      <main className="container pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-6xl font-bold leading-tight">
            Seamless Event Management{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Made Simple
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Create, manage, and track your events with ease. From registration to
            surveys, we've got you covered.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/register")}>
              Start for Free
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Easy Registration"
            description="Simple and quick registration process for both organizers and participants."
          />
          <FeatureCard
            title="Event Management"
            description="Create and manage events with unique shareable links."
          />
          <FeatureCard
            title="Participant Surveys"
            description="Collect valuable feedback through customizable surveys."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-lg bg-card border animate-float">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;