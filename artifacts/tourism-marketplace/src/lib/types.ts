export interface UserOut {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string; // 'tourist' | 'company' | 'admin'
  is_active: boolean;
  profile_image?: string | null;
  profile_image_content_type?: string | null;
  created_at: string;
}

export interface UserListOut {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface CompanyOut {
  id: number;
  user_id: number;
  name: string;
  description: string;
  whatsapp: string;
  additional_contact: string;
  address: string;
  avg_rating: number;
  rate_count: number;
  image?: string | null;
  image_content_type?: string | null;
  created_at: string;
}

export interface CountryOut {
  id: number;
  name: string;
  image?: string | null;
  image_content_type?: string | null;
  program_count: number;
  created_at: string;
}

export interface ProgramSimple {
  id: number;
  name: string;
  description: string;
  duration: number;
  start_at: string | null;
  price: number;
  main_image: string;
  country_name: string;
  company_name: string;
  avg_rating: number;
  created_at: string;
  is_favorited?: boolean;
}

export interface ProgramImageOut {
  id: number;
  image: string;
  content_type: string;
  created_at: string;
}

export interface ProgramDetail extends ProgramSimple {
  company_id: number;
  country_id: number;
  main_image_content_type: string;
  is_active: boolean;
  company_name: string;
  country_name: string;
  avg_rating: number;
  is_favorited: boolean;
  images: ProgramImageOut[];
}

export interface ReviewOut {
  id: number;
  user_id: number;
  company_id: number;
  rate: number;
  comment: string;
  created_at: string;
  reviewer_first_name?: string | null;
  reviewer_last_name?: string | null;
  reviewer_image?: string | null;
}

export interface AdminStatsOut {
  total_users: number;
  total_tourists: number;
  total_companies: number;
  total_programs: number;
  total_countries: number;
  total_reviews: number;
  total_favorites: number;
}
