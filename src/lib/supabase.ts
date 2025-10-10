const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

class SupabaseClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(url: string, key: string) {
    this.baseUrl = url;
    this.apiKey = key;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  from(table: string) {
    const queryBuilder = {
      selectQuery: '',
      eqFilters: [] as Array<{ column: string; value: any }>,
      orderBy: null as { column: string; ascending: boolean } | null,

      select: function(columns = '*') {
        this.selectQuery = columns;
        return this;
      },

      eq: function(column: string, value: any) {
        this.eqFilters.push({ column, value });
        return this;
      },

      order: function(column: string, options?: { ascending?: boolean }) {
        this.orderBy = { column, ascending: options?.ascending ?? true };
        return this;
      },

      single: async function() {
        const filters = this.eqFilters.map(f => `${f.column}=eq.${f.value}`).join('&');
        const url = `${supabaseUrl}/rest/v1/${table}?select=${this.selectQuery || '*'}&${filters}&limit=1`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey || '',
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        const data = await response.json();
        return { data: Array.isArray(data) ? data[0] : data, error: response.ok ? null : data };
      },

      maybeSingle: async function() {
        const result = await this.single();
        if (!result.data) {
          return { data: null, error: null };
        }
        return result;
      }
    };

    return {
      select: (columns = '*') => {
        queryBuilder.selectQuery = columns;
        return {
          ...queryBuilder,
          execute: async () => {
            let url = `${this.baseUrl}/rest/v1/${table}?select=${columns}`;
            if (queryBuilder.eqFilters.length > 0) {
              const filters = queryBuilder.eqFilters.map(f => `${f.column}=eq.${f.value}`).join('&');
              url += `&${filters}`;
            }
            if (queryBuilder.orderBy) {
              url += `&order=${queryBuilder.orderBy.column}.${queryBuilder.orderBy.ascending ? 'asc' : 'desc'}`;
            }

            const response = await fetch(url, {
              headers: this.getHeaders()
            });
            const data = await response.json();
            return { data, error: response.ok ? null : data };
          }
        };
      },
      insert: (values: any) => {
        return {
          select: () => {
            return {
              single: async () => {
                const response = await fetch(`${this.baseUrl}/rest/v1/${table}`, {
                  method: 'POST',
                  headers: { ...this.getHeaders(), 'Prefer': 'return=representation' },
                  body: JSON.stringify(values)
                });
                const data = await response.json();
                return { data: Array.isArray(data) ? data[0] : data, error: response.ok ? null : data };
              }
            };
          },
          execute: async () => {
            const response = await fetch(`${this.baseUrl}/rest/v1/${table}`, {
              method: 'POST',
              headers: this.getHeaders(),
              body: JSON.stringify(values)
            });
            const data = await response.json();
            return { data, error: response.ok ? null : data };
          }
        };
      },
      update: (values: any) => {
        return {
          eq: async (column: string, value: any) => {
            const response = await fetch(`${this.baseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
              method: 'PATCH',
              headers: this.getHeaders(),
              body: JSON.stringify(values)
            });
            const data = await response.json();
            return { data, error: response.ok ? null : data };
          }
        };
      },
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            const response = await fetch(`${this.baseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
              method: 'DELETE',
              headers: this.getHeaders()
            });
            return { error: response.ok ? null : await response.json() };
          }
        };
      }
    };
  }

  auth = {
    getUser: async () => {
      return { data: { user: null }, error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };
}

export const supabase = new SupabaseClient(supabaseUrl || '', supabaseAnonKey || '');

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
