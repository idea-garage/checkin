import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useEventMutations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateSlugMutation = useMutation({
    mutationFn: async ({ newSlug, eventId }: { newSlug: string; eventId: string }) => {
      if (!eventId) {
        console.error("No event ID provided for slug update");
        throw new Error("Event ID is required");
      }

      // First check if the new slug is already in use by any event
      const { data: existingEvent, error: checkError } = await supabase
        .from('events')
        .select('id')
        .eq('slug', newSlug)
        .maybeSingle();

      if (existingEvent) {
        throw new Error('This slug is already in use');
      }

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const { data, error } = await supabase
        .from('events')
        .update({ slug: newSlug })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast({
        title: "Success",
        description: "Event slug updated successfully",
      });
      navigate(`/e/${data.slug}/details`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activateEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!eventId) {
        console.error("No event ID provided for activation");
        throw new Error("Event ID is required");
      }

      const { data, error } = await supabase
        .from('events')
        .update({ is_activated: true })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast({
        title: "Success",
        description: "Event activated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateSlugMutation,
    activateEventMutation,
  };
};