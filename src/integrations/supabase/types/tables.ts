export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define base table types
export interface EventSchedule {
  created_at: string;
  created_by: string;
  description: string | null;
  end_time: string;
  event_id: string;
  id: string;
  start_time: string;
  title: string;
}

export interface EventUser {
  created_at: string;
  event_id: string;
  id: string;
  is_admin: boolean | null;
  is_staff: boolean | null;
  user_id: string;
}

export interface Event {
  broadcast_url: string | null;
  created_at: string;
  created_by: string;
  date: string;
  description: string | null;
  id: string;
  is_activated: boolean | null;
  location: string | null;
  mode: string;
  name: string;
  slug: string;
  team_id: string;
  time: string;
}

export interface LotteryWinner {
  created_at: string;
  event_id: string;
  id: string;
  participant_id: string;
  round: number;
}

export interface Participant {
  attendance_mode: string;
  created_at: string;
  email: string;
  event_id: string;
  id: string;
  nickname: string;
}

export interface Profile {
  created_at: string;
  email: string;
  full_name: string | null;
  id: string;
  team_id: string;
}

export interface SurveyQuestion {
  created_at: string;
  id: string;
  options: Json | null;
  question: string;
  survey_id: string;
  type: string;
}

export interface SurveyResponse {
  created_at: string;
  id: string;
  participant_id: string;
  question_id: string;
  response: string;
}

export interface Survey {
  created_at: string;
  event_id: string;
  id: string;
  title: string;
}

export interface TeamUser {
  created_at: string;
  id: string;
  is_admin: boolean | null;
  is_staff: boolean | null;
  team_id: string;
  user_id: string;
}

export interface Team {
  created_at: string;
  id: string;
  name: string;
  owner_id: string;
}