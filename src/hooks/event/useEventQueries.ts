import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useEventQueries = (teamSlug: string, eventSlug: string) => {
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", teamSlug, eventSlug],
    queryFn: async () => {
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
      return data;
    },
  });

  const { data: participants } = useQuery({
    queryKey: ["participants", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("event_id", event.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: survey } = useQuery({
    queryKey: ["survey", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("event_id", event.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return {
    event,
    isLoadingEvent,
    participants,
    survey,
  };
};