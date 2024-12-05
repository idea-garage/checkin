import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Plus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [teamSlug, setTeamSlug] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        // Check if user is staff or admin
        checkUserRole(session.user.id);
        // Get team slug
        getTeamSlug(session.user.id);
      }
    });
  }, [navigate]);

  const getTeamSlug = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", userId)
      .single();

    if (profile?.team_id) {
      const { data: team } = await supabase
        .from("teams")
        .select("slug")
        .eq("id", profile.team_id)
        .single();
      
      if (team?.slug) {
        setTeamSlug(team.slug);
      }
    }
  };

  const checkUserRole = async (userId: string) => {
    const { data: eventUsers } = await supabase
      .from("event_users")
      .select("is_admin, is_staff")
      .eq("user_id", userId);

    setIsStaff(eventUsers?.some(user => user.is_admin || user.is_staff) || false);
  };

  const { data: todaysEvents, isLoading } = useQuery({
    queryKey: ["todaysEvents"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      let query = supabase
        .from("events")
        .select(`
          *,
          participants (
            count
          )
        `)
        .eq("date", today);

      // If not staff/admin, only show events where user is a participant
      if (!isStaff) {
        query = query.eq("created_by", user?.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Team Dashboard</h1>
          {isStaff && (
            <Button onClick={() => navigate("/create-event")}>
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          )}
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
              {isLoading ? (
                <div className="py-4 text-center text-muted-foreground">
                  Loading events...
                </div>
              ) : todaysEvents?.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">
                  No events scheduled for today
                </div>
              ) : (
                <div className="divide-y">
                  {todaysEvents?.map((event) => (
                    <div
                      key={event.id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), "MMMM d, yyyy")} at{' '}
                          {format(new Date(`2000-01-01T${event.time}`), 'h:mm a')} •{' '}
                          {event.participants?.[0]?.count || 0} participants
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/m/${teamSlug}/${event.slug}/participants`)}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Manage Event
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/m/${teamSlug}/${event.slug}/details`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;