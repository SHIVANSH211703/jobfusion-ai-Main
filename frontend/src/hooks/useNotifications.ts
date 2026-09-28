"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import notificationService from "@/services/notification.service";
import { getApiErrorMessage } from "@/lib/api-error";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => (await notificationService.getNotifications()).data,
    enabled,
    staleTime: 30_000,
  });
}

export function useMarkNotificationRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => client.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not mark notification as read.")),
  });
}

export function useMarkAllNotificationsRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => client.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not mark notifications as read.")),
  });
}