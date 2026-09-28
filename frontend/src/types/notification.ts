export type NotificationType = "APPLICATION_UPDATE" | "INTERVIEW_REMINDER" | "RESUME_ANALYSIS" | "SYSTEM";

export interface NotificationItem {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  readAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
  };
}