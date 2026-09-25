import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type { DashboardResponse } from "@/types/dashboard";

class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await axiosInstance.get<DashboardResponse>(
      API.DASHBOARD.GET
    );

    return response.data;
  }
}

export default new DashboardService();
