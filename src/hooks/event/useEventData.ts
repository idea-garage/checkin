import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEventData = (teamSlug: string | undefined, slug: string | undefined) => {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamSlug || !slug) return;

    const fetchEventData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_schedules (
              id,
              title,
              start_time,
              end_time
            )
          `)
          .eq('team_slug', teamSlug)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        console.log('Fetched event data:', data);
        setEventData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [teamSlug, slug]);

  return { eventData, loading, error };
};
