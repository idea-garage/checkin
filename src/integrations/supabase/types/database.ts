import { Tables, TablesInsert, TablesUpdate } from './tables';
import { Enums } from './enums';
import { CompositeTypes } from './composite-types';

export type Database = {
  public: {
    Tables: {
      event_schedules: {
        Row: Tables<'event_schedules'>;
        Insert: TablesInsert<'event_schedules'>;
        Update: TablesUpdate<'event_schedules'>;
      };
      event_users: {
        Row: Tables<'event_users'>;
        Insert: TablesInsert<'event_users'>;
        Update: TablesUpdate<'event_users'>;
      };
      events: {
        Row: Tables<'events'>;
        Insert: TablesInsert<'events'>;
        Update: TablesUpdate<'events'>;
      };
      lottery_winners: {
        Row: Tables<'lottery_winners'>;
        Insert: TablesInsert<'lottery_winners'>;
        Update: TablesUpdate<'lottery_winners'>;
      };
      participants: {
        Row: Tables<'participants'>;
        Insert: TablesInsert<'participants'>;
        Update: TablesUpdate<'participants'>;
      };
      profiles: {
        Row: Tables<'profiles'>;
        Insert: TablesInsert<'profiles'>;
        Update: TablesUpdate<'profiles'>;
      };
      survey_questions: {
        Row: Tables<'survey_questions'>;
        Insert: TablesInsert<'survey_questions'>;
        Update: TablesUpdate<'survey_questions'>;
      };
      survey_responses: {
        Row: Tables<'survey_responses'>;
        Insert: TablesInsert<'survey_responses'>;
        Update: TablesUpdate<'survey_responses'>;
      };
      surveys: {
        Row: Tables<'surveys'>;
        Insert: TablesInsert<'surveys'>;
        Update: TablesUpdate<'surveys'>;
      };
      team_users: {
        Row: Tables<'team_users'>;
        Insert: TablesInsert<'team_users'>;
        Update: TablesUpdate<'team_users'>;
      };
      teams: {
        Row: Tables<'teams'>;
        Insert: TablesInsert<'teams'>;
        Update: TablesUpdate<'teams'>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};