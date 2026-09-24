import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type {
  JobListResponse,
  JobResponse,
  SaveJobResponse,
  SavedJobsResponse,
  JobSearchParams,
} from "@/types/job";
import type { JobMatchResponse } from "@/types/resume";

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
  async getApplications() {
    const response =
      await axiosInstance.get(
        API.JOBS.APPLIED
      );

    return response.data;
  }
}

export default new JobService();