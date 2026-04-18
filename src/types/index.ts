export type CategoryType = 'post' | 'demographic' | 'finance' | 'gallery';

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description?: string;
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
  updated_at: string;
}

export interface VillageInfo {
  id: number;
  name: string;
  vision: string | null;
  mission: string[];
  history: string | null;
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
    maps_url?: string;
  };
  location: Record<string, any>;
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
