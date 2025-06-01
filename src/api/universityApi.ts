import { API_URLS, ROUTES } from "@/constants/app";
import { EUniversityStatus } from "@/enums/university";
import { queryKeys } from "@/lib/react-query";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/slices/modalSlice";
import type { IListResponse } from "@/types/http";
import type { IUniversity } from "@/types/university";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosInstance, { handleResponse } from "./axios";

interface UniversityFilter {
  page: number;
  size: number;
  statuses: string[];
  name?: string;
  sortDirection: "ASC" | "DESC";
  sortBy: string;
}

export const useGetUniversities = (
  page: number,
  searchName: string,
  status: string
) => {
  const filter: UniversityFilter = {
    page,
    size: 10,
    statuses: status
      ? [status]
      : [
          EUniversityStatus.ACTIVE,
          EUniversityStatus.INACTIVE,
          EUniversityStatus.DELETED,
        ],
    name: searchName || undefined,
    sortBy: "id",
    sortDirection: "DESC",
  };

  return useQuery({
    queryKey: status
      ? [queryKeys.universities, page, searchName, status]
      : [queryKeys.universities, page, searchName],
    queryFn: () =>
      handleResponse<IListResponse<IUniversity>>(
        axiosInstance.get(API_URLS.getUniversities, {
          params: filter,
        })
      ),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetUniversityDetail = (id: string | number) =>
  useQuery({
    queryKey: [queryKeys.universityDetail, id],
    queryFn: () =>
      handleResponse<IUniversity>(
        axiosInstance.get(API_URLS.getUniversityDetail(id))
      ),
    staleTime: 0,
  });

export const useCreateUniversity = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (body: FormData) =>
      handleResponse(
        axiosInstance.post(API_URLS.createUniversity, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ),
    onSuccess: ({ ok, body, error }) => {
      if (ok && body) {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.universities],
        });
        dispatch(
          openModal({
            title: t("university.create.success.title"),
            content: t("university.create.success.content"),
            size: "sm",
            type: "success",
          })
        );
        navigate(ROUTES.universities);
      }

      if (error) {
        dispatch(
          openModal({
            title: t("error.title"),
            content: t(error.message),
            size: "sm",
            type: "error",
          })
        );
      }
    },
  });
};

export const useDeleteUniversity = () =>
  useMutation({
    mutationFn: async (id: string | number) =>
      handleResponse(axiosInstance.delete(API_URLS.deleteUniversity(id))),
  });

export const useChangeStatusUniversity = () =>
  useMutation({
    mutationFn: async (university: IUniversity) =>
      handleResponse(
        axiosInstance.patch(API_URLS.changeStatusUniversity(university.id), {
          status:
            university.status === EUniversityStatus.ACTIVE
              ? EUniversityStatus.INACTIVE
              : EUniversityStatus.ACTIVE,
        })
      ),
  });

export const useUpdateUniversity = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string | number;
      formData: FormData;
    }) =>
      handleResponse(
        axiosInstance.put(API_URLS.updateUniversity(id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ),
    onSuccess: ({ ok, body, error }, variables) => {
      if (ok && body) {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.universities],
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.universityDetail, variables.id],
        });
        dispatch(
          openModal({
            title: t("common.success.title"),
            content: t("university.edit.success.content"),
            size: "sm",
            type: "success",
          })
        );
        navigate(ROUTES.universityDetail(variables.id));
      }

      if (error) {
        dispatch(
          openModal({
            title: t("error.title"),
            content: t(error.message),
            size: "sm",
            type: "error",
          })
        );
      }
    },
  });
};
