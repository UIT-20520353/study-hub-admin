import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import axiosInstance, { handleResponse } from "./axios";
import { API_URLS } from "@/constants/app";
import type { IUniversity } from "@/types/university";

export const useGetUniversities = () => {
  return useQuery({
    queryKey: [queryKeys.universities],
    queryFn: () =>
      handleResponse<IUniversity[]>(
        axiosInstance.get(API_URLS.getUniversities, {
          params: { page: 0, size: 10 },
        })
      ),
  });
};

export const useGetUniversityDetail = (id: string | number) =>
  useQuery({
    queryKey: [queryKeys.universityDetail, id],
    queryFn: () =>
      handleResponse<IUniversity>(
        axiosInstance.get(API_URLS.getUniversityDetail(id))
      ),
    staleTime: 1 * 60 * 1000,
  });
