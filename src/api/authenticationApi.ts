import { API_URLS } from "@/constants/app";
import type { LoginForm, LoginResponse } from "@/pages/login/types/form";
import type { IResponse } from "@/types/http";
import axiosInstance, { handleResponse } from "./axios";
import type { IUser } from "@/types/user";

const authenticationApi = {
  login: (data: LoginForm): Promise<IResponse<LoginResponse>> =>
    handleResponse(axiosInstance.post(API_URLS.login, data)),
  getUserInfo: (): Promise<IResponse<IUser>> =>
    handleResponse(axiosInstance.get(API_URLS.getUserInfo)),
};

export default authenticationApi;
