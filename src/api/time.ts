import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "./axiosInstance";
import { ApiResponse, TimeResource } from "../types/types";

export const useGetTimes = (): UseQueryResult<TimeResource[], Error> => {
  return useQuery({
    queryKey: ["times"],
    queryFn: async (): Promise<TimeResource[]> => {
      const response = await api.get<ApiResponse<TimeResource[]>>("times");
      return response.data.data;
    },
  });
};