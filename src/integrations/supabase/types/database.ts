import {
  EventSchedule,
  EventUser,
  Event,
  LotteryWinner,
  Participant,
  Profile,
  SurveyQuestion,
  SurveyResponse,
  Survey,
  TeamUser,
  Team,
} from './tables';

export interface Database {
  public: {
    Tables: {
      event_schedules: {
        Row: EventSchedule;
        Insert: Partial<EventSchedule>;
        Update: Partial<EventSchedule>;
      };
      event_users: {
        Row: EventUser;
        Insert: Partial<EventUser>;
        Update: Partial<EventUser>;
      };
      events: {
        Row: Event;
        Insert: Partial<Event>;
        Update: Partial<Event>;
      };
      lottery_winners: {
        Row: LotteryWinner;
        Insert: Partial<LotteryWinner>;
        Update: Partial<LotteryWinner>;
      };
      participants: {
        Row: Participant;
        Insert: Partial<Participant>;
        Update: Partial<Participant>;
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      survey_questions: {
        Row: SurveyQuestion;
        Insert: Partial<SurveyQuestion>;
        Update: Partial<SurveyQuestion>;
      };
      survey_responses: {
        Row: SurveyResponse;
        Insert: Partial<SurveyResponse>;
        Update: Partial<SurveyResponse>;
      };
      surveys: {
        Row: Survey;
        Insert: Partial<Survey>;
        Update: Partial<Survey>;
      };
      team_users: {
        Row: TeamUser;
        Insert: Partial<TeamUser>;
        Update: Partial<TeamUser>;
      };
      teams: {
        Row: Team;
        Insert: Partial<Team>;
        Update: Partial<Team>;
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
}