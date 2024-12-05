export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

import { EventSchedulesTable, EventUsersTable, EventsTable } from './events';
import { LotteryWinnersTable, ParticipantsTable } from './participants';
import { ProfilesTable } from './profiles';
import { SurveyQuestionsTable, SurveyResponsesTable, SurveysTable } from './surveys';
import { TeamUsersTable, TeamsTable } from './teams';

export type Database = {
  public: {
    Tables: {
      event_schedules: EventSchedulesTable
      event_users: EventUsersTable
      events: EventsTable
      lottery_winners: LotteryWinnersTable
      participants: ParticipantsTable
      profiles: ProfilesTable
      survey_questions: SurveyQuestionsTable
      survey_responses: SurveyResponsesTable
      surveys: SurveysTable
      team_users: TeamUsersTable
      teams: TeamsTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}