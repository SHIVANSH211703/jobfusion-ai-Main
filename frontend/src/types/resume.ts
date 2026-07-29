export interface Resume {
  id: string;
  title: string;
  template: string;
  status: string;
  isDefault: boolean;
  isPublic: boolean;
  publicSlug: string;
  atsScore: number;
  aiSummary: string;

  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };

  summary: string;

  education: any[];
  experience: any[];
  projects: any[];
  skills: string[];
  certifications: any[];
  achievements: any[];
  languages: any[];
  customSections: any[];

  createdAt: string;
  updatedAt: string;
}