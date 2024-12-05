import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { useEventQueries } from "@/hooks/event/useEventQueries";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Lottery = () => {
  const { teamSlug, slug } = useParams();
  
  if (!teamSlug || !slug) return null;

  const { event } = useEventQueries(teamSlug, slug);

  // Fetch lottery winners
  const { data: winners } = useQuery({
    queryKey: ['lottery-winners', event?.id],
    queryFn: async () => {
      if (!event?.id) return [];
      
      const { data, error } = await supabase
        .from('lottery_winners')
        .select(`
          round,
          participants (
            nickname,
            email
          )
        `)
        .eq('event_id', event.id)
        .order('round', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!event?.id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{event?.name} - Lottery Results</CardTitle>
              <CardDescription>
                Winners from the lottery draw
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {winners && winners.length > 0 ? (
                  <div className="space-y-4">
                    <div className="divide-y">
                      {winners.map((winner) => (
                        <div key={`${winner.round}-${winner.participants?.nickname}`} className="py-3">
                          <div className="font-medium">
                            Round {winner.round}: {winner.participants?.nickname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {winner.participants?.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No winners have been selected yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Lottery;