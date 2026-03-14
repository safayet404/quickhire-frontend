export interface Job {
  id: number;
  user_id?: number;
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
  user_id?: number;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  status_note?: string;
  status_color?: string;
  created_at: string;
  job?: Job;
  user?: {
    id: number;
    name: string;
    email: string;
    seeker_profile?: {
      headline?: string;
      location?: string;
      skills?: string[];
    };
  };
}

export interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  pendingReview: number;
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
  'Design', 'Technology', 'Marketing', 'Finance',
  'Human Resource', 'Engineering', 'Sales', 'Healthcare', 'Business', 'Other',
];

export const JOB_TYPES: Record<string, string> = {
  'full-time':  'Full Time',
  'part-time':  'Part Time',
  'remote':     'Remote',
  'contract':   'Contract',
  'internship': 'Internship',
};

export const JOB_TYPE_COLORS: Record<string, string> = {
  'full-time':  'bg-blue-50 text-blue-700',
  'part-time':  'bg-purple-50 text-purple-700',
  'remote':     'bg-green-50 text-green-700',
  'contract':   'bg-orange-50 text-orange-700',
  'internship': 'bg-pink-50 text-pink-700',
};
