export type EquipmentCondition = 'new' | 'used' | 'reconditioned';
export type ListingStatus = 'active' | 'sold' | 'reserved' | 'inactive';
export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost';

export interface EquipmentSpecs {
  power?: string;
  weight_kg?: number;
  dimensions?: string;
  voltage?: string;
  rpm?: number;
  capacity?: string;
  [key: string]: string | number | undefined;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  condition: EquipmentCondition;
  year?: number;
  brand?: string;
  model?: string;
  specs: EquipmentSpecs;
  location_state: string;
  location_city: string;
  price?: number;
  price_negotiable: boolean;
  price_display: string;
  images: string[];
  thumbnail: string;
  status: ListingStatus;
  featured: boolean;
  views: number;
  leads_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  listing_count: number;
  order: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  name: string;
  slug: string;
  specs_template?: string[];
}

export interface Lead {
  id: string;
  listing_id: string;
  listing_title: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  status: LeadStatus;
  commission_value?: number;
  notes?: string;
  source: 'site' | 'whatsapp' | 'phone';
  created_at: string;
  updated_at: string;
}

export interface ListingFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  condition?: EquipmentCondition;
  state?: string;
  price_min?: number;
  price_max?: number;
  featured?: boolean;
}
