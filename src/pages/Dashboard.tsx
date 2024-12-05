import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Plus } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const todaysEvents = [
    {
      id: 1,
      name: "Team Meeting",
      time: "10:00 AM",
      participants: 12,
    },
    {
      id: 2,
      name: "Product Launch",
      time: "2:00 PM",
      participants: 45,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Team Dashboard</h1>
          <Button onClick={() => navigate("/create-event")}>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Today's Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {todaysEvents.map((event) => (
                  <div
                    key={event.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.time} • {event.participants} participants
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;