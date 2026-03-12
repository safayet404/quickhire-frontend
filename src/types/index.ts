export interface Job {
  id: number;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  category: string;
  type: 'full-time' | 'part-time' | 'remote' | 'contract' | 'internship';
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string[];
  is_featured: boolean;
  is_active: boolean;
  applications_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
  created_at: string;
  job?: Job;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: PaginationMeta;
}

export interface Category {
  category: string;
  count: number;
}

export const JOB_CATEGORIES = [
  { name: 'Design', icon: '🎨' },
  { name: 'Technology', icon: '💻' },
  { name: 'Marketing', icon: '📣' },
  { name: 'Finance', icon: '📊' },
  { name: 'Human Resource', icon: '👥' },
  { name: 'Engineering', icon: '⚙️' },
  { name: 'Sales', icon: '🤝' },
  { name: 'Healthcare', icon: '🏥' },
];

export const JOB_TYPES: Record<string, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'remote': 'Remote',
  'contract': 'Contract',
  'internship': 'Internship',
};

export const JOB_TYPE_COLORS: Record<string, string> = {
  'full-time': 'bg-blue-50 text-blue-700',
  'part-time': 'bg-purple-50 text-purple-700',
  'remote': 'bg-green-50 text-green-700',
  'contract': 'bg-orange-50 text-orange-700',
  'internship': 'bg-pink-50 text-pink-700',
};
