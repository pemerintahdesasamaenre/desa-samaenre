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
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'editor';
  nip: string | null;
  position: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
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

export interface FormerLeader {
  name: string;
  period: string;
}

export interface MissionSection {
  title: string;
  items: string[];
}

export interface VillageInfo {
  id: number;
  name: string;
  vision: string | null;
  mission: MissionSection[] | string[];
  history: string | null;
  logo_url: string | null;
  contact_info: {
    email?: string;
    phone?: string;
    address?: string;
    maps_url?: string;
  };
  location: Record<string, unknown>;
  area_size?: string;
  boundaries?: {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
  former_leaders?: FormerLeader[];
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
  org_type: 'pemdes' | 'bpd';
  created_at: string;
}

export interface Resident {
  id: string;
  nik: string;
  kk: string;
  name: string;
  data_year: number;
  birth_place: string | null;
  birth_date: string | null;
  gender: 'L' | 'P';
  education: string | null;
  occupation: string | null;
  marital_status: string | null;
  family_relationship: string | null;
  father_name: string | null;
  mother_name: string | null;
  dusun: string | null;
  rt: string | null;
  rw: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  status: 'draft' | 'published';
  type: 'news' | 'agenda';
  views: number;
  category_id: string | null;
  author_id: string;
  created_at: string;
  event_date: string | null;
  categories?: {
    name: string;
  } | null;
}

export interface GalleryImage {
  url: string;
  title: string;
  source: 'post' | 'branding';
  date: string;
  link?: string;
}

// Re-export validation types for centralization (SoC)
export type { 
  StaffMemberInput, 
  ResidentInput, 
  PostInput, 
  FinanceInput, 
  VillageInfoInput,
  DemographicInput 
} from '@/lib/validations';
