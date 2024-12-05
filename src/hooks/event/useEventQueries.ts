import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useEventQueries = (teamSlug: string, eventSlug: string) => {
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", teamSlug, eventSlug],
    queryFn: async () => {
      console.log("Fetching event details for:", teamSlug, eventSlug);
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          team:teams(
            id,
            name,
            slug,
            owner_id
          ),
          created_by:profiles(
            id
          )
        `)
        .eq("slug", eventSlug)
        .eq("teams.slug", teamSlug)
        .single();

      if (error) throw error;
      console.log("Event data:", data);
      return data;
    },
  });

  const { data: participants } = useQuery({
    queryKey: ["participants", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      console.log("Fetching participants for event:", event?.id);
      const { data: winners } = await supabase
        .from('lottery_winners')
        .select('participant_id')
        .eq('event_id', event.id);

      const winnerIds = winners?.map(w => w.participant_id) || [];
      
      let query = supabase
        .from('participants')
        .select('id, nickname, email, attendance_mode')
        .eq('event_id', event.id);

      // Only add the not.in filter if there are winners
      if (winnerIds.length > 0) {
        query = query.not('id', 'in', `(${winnerIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching participants:", error);
        return [];
      }

      console.log("Eligible participants:", data);
      return data || [];
    },
  });

  const { data: survey } = useQuery({
    queryKey: ["survey", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      console.log("Fetching survey for event:", event?.id);
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("event_id", event.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching survey:", error);
        return null;
      }
      return data;
    },
  });

  const { data: schedules } = useQuery({
    queryKey: ["schedules", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      console.log("Fetching schedules for event:", event?.id);
      const { data, error } = await supabase
        .from("event_schedules")
        .select("*")
        .eq("event_id", event.id)
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching schedules:", error);
        return [];
      }
      return data || [];
    },
  });

  return {
    event,
    isLoadingEvent,
    participants,
    survey,
    schedules,
  };
};