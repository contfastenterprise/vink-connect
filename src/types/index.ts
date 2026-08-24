export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  account_type: 'personal' | 'empresa';
  plan?: 'free' | 'pro';
  created_at: string;
  updated_at?: string;
}

export interface Card {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  social_links?: Record<string, string>;
  logo_url?: string;
  theme_config?: {
    template: string;
    color: string;
    backgroundColor?: string;
    bio?: string;
  };
  created_at: string;
  updated_at: string;
}
