import { Json } from './common';

export interface SurveysTable {
  Row: {
    created_at: string
    event_id: string
    id: string
    title: string
  }
  Insert: {
    created_at?: string
    event_id: string
    id?: string
    title: string
  }
  Update: {
    created_at?: string
    event_id?: string
    id?: string
    title?: string
  }
}

export interface SurveyQuestionsTable {
  Row: {
    created_at: string
    id: string
    options: Json | null
    question: string
    survey_id: string
    type: string
  }
  Insert: {
    created_at?: string
    id?: string
    options?: Json | null
    question: string
    survey_id: string
    type: string
  }
  Update: {
    created_at?: string
    id?: string
    options?: Json | null
    question?: string
    survey_id?: string
    type?: string
  }
}

export interface SurveyResponsesTable {
  Row: {
    created_at: string
    id: string
    participant_id: string
    question_id: string
    response: string
  }
  Insert: {
    created_at?: string
    id?: string
    participant_id: string
    question_id: string
    response: string
  }
  Update: {
    created_at?: string
    id?: string
    participant_id?: string
    question_id?: string
    response?: string
  }
}