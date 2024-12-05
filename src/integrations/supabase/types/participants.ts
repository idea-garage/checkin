import { Json } from './common';

export interface ParticipantsTable {
  Row: {
    attendance_mode: string
    created_at: string
    email: string
    event_id: string
    id: string
    nickname: string
  }
  Insert: {
    attendance_mode?: string
    created_at?: string
    email: string
    event_id: string
    id?: string
    nickname: string
  }
  Update: {
    attendance_mode?: string
    created_at?: string
    email?: string
    event_id?: string
    id?: string
    nickname?: string
  }
}

export interface LotteryWinnersTable {
  Row: {
    created_at: string
    event_id: string
    id: string
    participant_id: string
    round: number
  }
  Insert: {
    created_at?: string
    event_id: string
    id?: string
    participant_id: string
    round: number
  }
  Update: {
    created_at?: string
    event_id?: string
    id?: string
    participant_id?: string
    round?: number
  }
}