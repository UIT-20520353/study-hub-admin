import { ACCESS_TOKEN_KEY, API_URLS, ROUTES } from "@/constants/app";
import { EUserRole } from "@/enums/user";
import { queryKeys } from "@/lib/react-query";
import type { LoginForm, LoginResponse } from "@/pages/login/types/form";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/slices/modalSlice";
import type { IResponse } from "@/types/http";
import type { IUser } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import axiosInstance, { handleResponse } from "./axios";
import { queryClient } from "@/main";

const authenticationApi = {
  login: (data: LoginForm): Promise<IResponse<LoginResponse>> =>
    handleResponse(axiosInstance.post(API_URLS.login, data)),
  getUserInfo: (): Promise<IResponse<IUser>> =>
    handleResponse(axiosInstance.get(API_URLS.getUserInfo)),
};

export const useGetUserInfo = () =>
  useQuery({
    queryKey: [queryKeys.profile],
    queryFn: authenticationApi.getUserInfo,
    staleTime: 2 * 60 * 1000,
  });

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authenticationApi.login,
    onSuccess(data) {
      const { ok, body, error } = data;

      if (ok && body) {
        if (body.user.role === EUserRole.SYSTEM_ADMIN) {
          localStorage.setItem(ACCESS_TOKEN_KEY, body.token);
          queryClient.invalidateQueries({ queryKey: [queryKeys.profile] });
          navigate(ROUTES.home);
        } else {
          dispatch(
            openModal({
              title: t("login.error.title"),
              content: t("error.validate.login.invalid-credential"),
              size: "sm",
              type: "error",
            })
          );
        }
      }
      if (error) {
        dispatch(
          openModal({
            title: t("login.error.title"),
            content: t(error.message),
            size: "sm",
            type: "error",
          })
        );
      }
    },
  });
};

export default authenticationApi;
