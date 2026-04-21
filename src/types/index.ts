export type CategoryType = 'post' | 'demographic' | 'finance' | 'gallery';

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'editor';
  updated_at: string;
}

export interface Demographic {
  id: string;
  category_id: string;
  label: string;
  value: number;
  metadata?: Record<string, unknown>;
  updated_at: string;
  category?: {
    name: string;
  };
}

export interface VillageInfo {
  id: number;
  name: string;
  vision: string | null;
  mission: string[];
  history: string | null;
  logo_url: string | null;
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
    maps_url?: string;
  };
  location: Record<string, unknown>;
  updated_at: string;
}

export interface Finance {
  id: string;
  year: number;
  type: 'income' | 'expense' | 'financing';
  category_name: string;
  amount: number;
  note: string | null;
  updated_at: string;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  parent_id: string | null;
  order_index: number;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  status: 'draft' | 'published';
  category_id: string | null;
  author_id: string;
  created_at: string;
  event_date: string | null;
  categories?: {
    name: string;
  } | null;
}
