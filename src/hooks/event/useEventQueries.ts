import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useEventQueries = (slug: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      console.log("Fetching event with slug:", slug);
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          team:teams(owner_id),
          created_by:profiles!events_created_by_fkey(id)
        `)
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No event found with slug:", slug);
        throw new Error("Event not found");
      }

      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  });

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participants", event?.id],
    enabled: !!event?.id,
    queryFn: async () => {
      if (!event?.id) {
        console.error("No event ID available for fetching participants");
        return [];
      }

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
      if (!event?.id) {
        console.error("No event ID available for fetching survey");
        return null;
      }

      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("event_id", event.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return {
    event,
    isLoadingEvent,
    participants,
    isLoadingParticipants,
    survey,
  };
};