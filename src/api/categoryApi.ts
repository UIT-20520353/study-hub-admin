import type { ICategory } from "@/types/category";
import type { IListResponse, IResponse } from "@/types/http";
import axiosInstance, { handleResponse } from "./axios";
import { API_URLS } from "@/constants/app";
import type { ICategoryCriteria } from "@/pages/categories";

const categoryApi = {
  getCategories: async (
    criteria: ICategoryCriteria
  ): Promise<IResponse<IListResponse<ICategory>>> =>
    handleResponse(
      axiosInstance.get(API_URLS.getCategories, { params: criteria })
    ),
};

export default categoryApi;
