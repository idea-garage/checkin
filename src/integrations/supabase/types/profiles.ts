import { Json } from './common';

export interface ProfilesTable {
  Row: {
    created_at: string
    email: string
    full_name: string | null
    id: string
    team_id: string
  }
  Insert: {
    created_at?: string
    email: string
    full_name?: string | null
    id: string
    team_id: string
  }
  Update: {
    created_at?: string
    email?: string
    full_name?: string | null
    id?: string
    team_id?: string
  }
}