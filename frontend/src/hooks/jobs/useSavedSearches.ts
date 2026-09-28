"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import jobService from "@/services/job.service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { SavedSearch } from "@/types/savedSearch";

export const SAVED_SEARCHES_QUERY_KEY = ["saved-searches"] as const;

export function useSavedSearches() {
  return useQuery({
    queryKey: SAVED_SEARCHES_QUERY_KEY,
    queryFn: async () => (await jobService.getSavedSearches()).data,
  });
}

function useSavedSearchMutation<TInput>(mutationFn: (input: TInput) => Promise<unknown>, successMessage: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: SAVED_SEARCHES_QUERY_KEY });
      toast.success(successMessage);
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not update saved searches.")),
  });
}

export function useCreateSavedSearch() {
  return useSavedSearchMutation((payload: Pick<SavedSearch, "name" | "filters">) => jobService.createSavedSearch(payload), "Search saved.");
}

export function useUpdateSavedSearch() {
  return useSavedSearchMutation(({ id, payload }: { id: string; payload: Partial<Pick<SavedSearch, "name" | "filters" | "enabled">> }) => jobService.updateSavedSearch(id, payload), "Saved search updated.");
}

export function useDeleteSavedSearch() {
  return useSavedSearchMutation((id: string) => jobService.deleteSavedSearch(id), "Saved search deleted.");
}