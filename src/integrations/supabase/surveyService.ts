import { supabase } from './client';

export const fetchSurveys = async () => {
  const { data, error } = await supabase.from('surveys').select('*');
  if (error) {
    console.error('Error fetching surveys:', error);
    return [];
  }
  return data;
};

export const addSurvey = async (title: string, eventId: string) => {
  const { data, error } = await supabase.from('surveys').insert([{
    title,
    event_id: eventId
  }]);
  if (error) {
    console.error('Error adding survey:', error);
    return null;
  }
  return data;
}; 