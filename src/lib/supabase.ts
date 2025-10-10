import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          audio_url: string | null;
          video_analysis: any | null;
          sentiment_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          audio_url?: string | null;
          video_analysis?: any | null;
          sentiment_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          audio_url?: string | null;
          video_analysis?: any | null;
          sentiment_score?: number | null;
          created_at?: string;
        };
      };
      moral_decisions: {
        Row: {
          id: string;
          user_id: string;
          conversation_id: string | null;
          dilemma: string;
          decision: string;
          ethical_score: number;
          principles_applied: any;
          emotional_state: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          conversation_id?: string | null;
          dilemma: string;
          decision: string;
          ethical_score?: number;
          principles_applied?: any;
          emotional_state?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          conversation_id?: string | null;
          dilemma?: string;
          decision?: string;
          ethical_score?: number;
          principles_applied?: any;
          emotional_state?: any;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          psychological_profile: any;
          behavioral_patterns: any;
          total_decisions: number;
          consistency_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          psychological_profile?: any;
          behavioral_patterns?: any;
          total_decisions?: number;
          consistency_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          psychological_profile?: any;
          behavioral_patterns?: any;
          total_decisions?: number;
          consistency_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
