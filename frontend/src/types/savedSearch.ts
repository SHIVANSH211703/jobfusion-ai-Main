import type { JobSearchParams } from "@/types/job";

export interface SavedSearch {
  _id: string;
  name: string;
  filters: JobSearchParams;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearchesResponse {
  success: boolean;
  data: SavedSearch[];
}

export interface SavedSearchResponse {
  success: boolean;
  data: SavedSearch;
}