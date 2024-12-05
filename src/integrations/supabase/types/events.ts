import { Json } from './common';

export interface EventSchedulesTable {
  Row: {
    created_at: string
    created_by: string
    description: string | null
    end_time: string
    event_id: string
    id: string
    start_time: string
    title: string
  }
  Insert: {
    created_at?: string
    created_by: string
    description?: string | null
    end_time: string
    event_id: string
    id?: string
    start_time: string
    title: string
  }
  Update: {
    created_at?: string
    created_by?: string
    description?: string | null
    end_time?: string
    event_id?: string
    id?: string
    start_time?: string
    title?: string
  }
}

export interface EventsTable {
  Row: {
    broadcast_url: string | null
    created_at: string
    created_by: string
    date: string
    description: string | null
    id: string
    is_activated: boolean | null
    location: string | null
    mode: string
    name: string
    slug: string
    team_id: string
    time: string
  }
  Insert: {
    broadcast_url?: string | null
    created_at?: string
    created_by: string
    date: string
    description?: string | null
    id?: string
    is_activated?: boolean | null
    location?: string | null
    mode?: string
    name: string
    slug: string
    team_id: string
    time: string
  }
  Update: {
    broadcast_url?: string | null
    created_at?: string
    created_by?: string
    date?: string
    description?: string | null
    id?: string
    is_activated?: boolean | null
    location?: string | null
    mode?: string
    name?: string
    slug?: string
    team_id?: string
    time?: string
  }
}

export interface EventUsersTable {
  Row: {
    created_at: string
    event_id: string
    id: string
    is_admin: boolean | null
    is_staff: boolean | null
    user_id: string
  }
  Insert: {
    created_at?: string
    event_id: string
    id?: string
    is_admin?: boolean | null
    is_staff?: boolean | null
    user_id: string
  }
  Update: {
    created_at?: string
    event_id?: string
    id?: string
    is_admin?: boolean | null
    is_staff?: boolean | null
    user_id?: string
  }
}