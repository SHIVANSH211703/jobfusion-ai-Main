export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Project {
  title: string;
  description?: string;
  technologies: string[];
  github?: string;
  live?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  issueDate?: string;
}

export interface Achievement {
  title: string;
  description?: string;
}

export interface Language {
  language: string;
  proficiency?: string;
}

export interface Resume {
  _id?: string;
  id?: string;

  title: string;
  template: string;

  status: string;

  isDefault: boolean;
  isPublic: boolean;
  publicSlug: string;

  atsScore: number;
  aiSummary: string;

  personalInfo: PersonalInfo;

  summary: string;

  education: Education[];
  experience: Experience[];
  projects: Project[];

  skills: string[];

  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];

  customSections: any[];

  createdAt: string;
  updatedAt: string;
}

export interface ResumeResponse {
  success: boolean;
  message: string;
  data: Resume;
}

export interface ResumeListResponse {
  success: boolean;
  message: string;
  data: Resume[];
}

export interface ATSAnalysisResponse {
  success: boolean;
  message: string;
  data: {
    score: number;
    aiSummary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    analyzedAt: string;
  };
}

export interface ImproveResumeResponse {
  success: boolean;
  message: string;
  data: Resume;
  changes: string[];
}

export interface JobMatchResponse {
  success: boolean;
  message: string;
  data: {
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export interface CoverLetterResponse {
  success: boolean;
  message: string;
  data: {
    coverLetter: string;
  };
}

export type CreateResumeRequest = Omit<
  Resume,
  | "_id"
  | "id"
  | "status"
  | "isDefault"
  | "isPublic"
  | "publicSlug"
  | "atsScore"
  | "aiSummary"
  | "createdAt"
  | "updatedAt"
>;

export type UpdateResumeRequest = Partial<CreateResumeRequest>;