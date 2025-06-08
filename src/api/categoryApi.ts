import type { ICategory } from "@/types/category";
import type { IListResponse, IResponse } from "@/types/http";
import axiosInstance, { handleResponse } from "./axios";
import { API_URLS } from "@/constants/app";
import type { ICategoryCriteria } from "@/pages/categories";
import { ECategoryType } from "@/enums/category";

export interface ICreateCategoryRequest {
  name: string;
  type: ECategoryType;
}

export interface IUpdateCategoryRequest {
  name: string;
  type: ECategoryType;
}

const categoryApi = {
  getCategories: async (
    criteria: ICategoryCriteria
  ): Promise<IResponse<IListResponse<ICategory>>> =>
    handleResponse(
      axiosInstance.get(API_URLS.getCategories, { params: criteria })
    ),

  createCategory: async (
    data: ICreateCategoryRequest
  ): Promise<IResponse<ICategory>> =>
    handleResponse(axiosInstance.post(API_URLS.createCategory, data)),

  updateCategory: async (
    id: string | number,
    data: IUpdateCategoryRequest
  ): Promise<IResponse<ICategory>> =>
    handleResponse(axiosInstance.put(API_URLS.updateCategory(id), data)),

  deleteCategory: async (id: string | number): Promise<IResponse<void>> =>
    handleResponse(axiosInstance.delete(API_URLS.deleteCategory(id))),
};

export default categoryApi;
