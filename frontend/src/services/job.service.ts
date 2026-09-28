import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type {
  JobListResponse,
  JobResponse,
  SaveJobResponse,
  SavedJobsResponse,
  JobSearchParams,
  ApplicationsResponse,
  ApplicationStatus,
  JobApplication,
} from "@/types/job";
import type { JobMatchResponse } from "@/types/resume";
import type { SavedSearch, SavedSearchesResponse, SavedSearchResponse } from "@/types/savedSearch";

class JobService {
  // Get all jobs
  async getJobs(
    params?: JobSearchParams
  ): Promise<JobListResponse> {
    const response =
      await axiosInstance.get<JobListResponse>(
        API.JOBS.GET_ALL,
        {
          params,
        }
      );

    return response.data;
  }

  // Search jobs
  async searchJobs(
    params?: JobSearchParams
  ): Promise<JobListResponse> {
    const response =
      await axiosInstance.get<JobListResponse>(
        API.JOBS.SEARCH,
        {
          params,
        }
      );

    return response.data;
  }

  // Get single job
  async getJobById(
    id: string
  ): Promise<JobResponse> {
    const response =
      await axiosInstance.get<JobResponse>(
        API.JOBS.GET_BY_ID(id)
      );

    return response.data;
  }

  // Save job
  async saveJob(
    id: string
  ): Promise<SaveJobResponse> {
    const response =
      await axiosInstance.post<SaveJobResponse>(
        API.JOBS.SAVE(id)
      );

    return response.data;
  }

  // Unsave job
  async unsaveJob(
    id: string
  ): Promise<SaveJobResponse> {
    const response =
      await axiosInstance.delete<SaveJobResponse>(
        API.JOBS.UNSAVE(id)
      );

    return response.data;
  }

  async matchJob(
    id: string,
    resumeId: string
  ): Promise<JobMatchResponse> {
    const response =
      await axiosInstance.post<JobMatchResponse>(
        API.JOBS.MATCH(id),
        { resumeId }
      );

    return response.data;
  }

  // Get saved jobs
  async getSavedJobs(): Promise<SavedJobsResponse> {
    const response =
      await axiosInstance.get<SavedJobsResponse>(
        API.JOBS.SAVED
      );

    return response.data;
  }

  // Apply to job
  async applyToJob(
  id: string,
  payload: {
    resumeId: string;
    notes?: string;
  }
) {
  const response = await axiosInstance.post(
    API.JOBS.APPLY(id),
    payload
  );

  return response.data;
}

  // Get applications
  async getApplications(): Promise<ApplicationsResponse> {
    const response = await axiosInstance.get<ApplicationsResponse>(API.JOBS.APPLIED);

    return response.data;
  }

  async updateApplicationStatus(
    jobId: string,
    status?: ApplicationStatus,
    notes?: string,
    followUpDate?: string | null
  ): Promise<{ success: boolean; data: JobApplication }> {
    const response = await axiosInstance.patch<{ success: boolean; data: JobApplication }>(
      API.JOBS.APPLICATION(jobId),
      {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(followUpDate !== undefined ? { followUpDate } : {}),
      }
    );
    return response.data;
  }

  async deleteApplication(id: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete<{ success: boolean; message: string }>(
      API.JOBS.APPLICATION(id)
    );
    return response.data;
  }

  async getSavedSearches(): Promise<SavedSearchesResponse> {
    const response = await axiosInstance.get<SavedSearchesResponse>(API.JOBS.SAVED_SEARCHES);
    return response.data;
  }

  async createSavedSearch(payload: Pick<SavedSearch, "name" | "filters">): Promise<SavedSearchResponse> {
    const response = await axiosInstance.post<SavedSearchResponse>(API.JOBS.SAVED_SEARCHES, payload);
    return response.data;
  }

  async updateSavedSearch(id: string, payload: Partial<Pick<SavedSearch, "name" | "filters" | "enabled">>): Promise<SavedSearchResponse> {
    const response = await axiosInstance.patch<SavedSearchResponse>(API.JOBS.SAVED_SEARCH(id), payload);
    return response.data;
  }

  async deleteSavedSearch(id: string): Promise<{ success: boolean }> {
    const response = await axiosInstance.delete<{ success: boolean }>(API.JOBS.SAVED_SEARCH(id));
    return response.data;
  }
}

export default new JobService();