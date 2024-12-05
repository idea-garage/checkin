export const generateEventUrl = (teamSlug: string, eventSlug: string, type: 'public' | 'manage' = 'public', page: string = 'details') => {
  const baseUrl = window.location.origin;
  const prefix = type === 'public' ? 'e' : 'm';
  return `${baseUrl}/${prefix}/${teamSlug}/${eventSlug}/${page}`;
};

export const generateRegistrationUrl = (teamSlug: string, eventSlug: string) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/e/${teamSlug}/${eventSlug}`;
};