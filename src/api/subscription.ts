import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { api } from "./axiosInstance";
import { CreateSubscriptionInput, SubscriptionResource, ApiResponse } from "../types/types";
import { AxiosError } from "axios";

export interface LaravelValidationError {
  errors: Record<string, string[]>;
  message?: string;
}

/* ====================================================
   CREATE Subscription (React Query Mutation)
==================================================== */
export function useCreateSubscription(): UseMutationResult<
  SubscriptionResource,
  AxiosError<LaravelValidationError>, 
  CreateSubscriptionInput
> {
  return useMutation({
    mutationFn: async (formData: CreateSubscriptionInput): Promise<SubscriptionResource> => {
      const response = await api.post<ApiResponse<SubscriptionResource>>('subscriptions', formData);
      return response.data.data;
    },
  });
}