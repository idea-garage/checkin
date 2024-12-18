import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useEventQueries = (teamSlug: string | undefined, eventSlug: string | undefined) => {
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", teamSlug, eventSlug],
    enabled: !!teamSlug && !!eventSlug,
    queryFn: async () => {
      console.log("Fetching event details for:", teamSlug, eventSlug);
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          team:teams!events_team_id_fkey(
            id,
            name,
            slug,
            owner_id
          ),
          created_by:profiles(
            id
          )
        `)
        .eq("team_slug", teamSlug)
        .eq("slug", eventSlug)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
      console.log("Event data:", data);
      return data;
    },
  });

  const { data: participants } = useQuery({
    queryKey: ["participants", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      console.log("Fetching participants for event:", event?.id);
      const { data, error } = await supabase
        .from('participants')
        .select('id, nickname, email, attendance_mode')
        .eq('event_id', event.id);

      if (error) {
        console.error("Error fetching participants:", error);
        return [];
      }

      console.log("All participants:", data);
      return data || [];
    },
  });

  const { data: survey } = useQuery({
    queryKey: ["survey", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      console.log("Fetching survey for event:", event?.id);
      try {
        const { data: surveyData, error: surveyError } = await supabase
          .from("surveys")
          .select(`
            *,
            questions:survey_questions(
              id,
              question,
              type,
              options,
              order_number
            )
          `)
          .eq("event_id", event.id)
          .single();

        if (surveyError && surveyError.code !== "PGRST116") {
          console.error("Error fetching survey:", surveyError);
          return null;
        }
        console.log("Survey data:", surveyData);
        return surveyData;
      } catch (error) {
        console.error("Error in survey query:", error);
        return null;
      }
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