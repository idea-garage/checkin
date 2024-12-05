import { Json } from './common';

export interface TeamsTable {
  Row: {
    created_at: string
    id: string
    name: string
    owner_id: string
  }
  Insert: {
    created_at?: string
    id?: string
    name: string
    owner_id: string
  }
  Update: {
    created_at?: string
    id?: string
    name?: string
    owner_id?: string
  }
}

export interface TeamUsersTable {
  Row: {
    created_at: string
    id: string
    is_admin: boolean | null
    is_staff: boolean | null
    team_id: string
    user_id: string
  }
  Insert: {
    created_at?: string
    id?: string
    is_admin?: boolean | null
    is_staff?: boolean | null
    team_id: string
    user_id: string
  }
  Update: {
    created_at?: string
    id?: string
    is_admin?: boolean | null
    is_staff?: boolean | null
    team_id?: string
    user_id?: string
  }
}