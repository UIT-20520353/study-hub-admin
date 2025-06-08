export const ACCESS_TOKEN_KEY = "study_hub_access_token";

export const API_URLS = {
  login: "/auth/login",
  getUserInfo: "/user/profile",
  getCategories: "/admin/categories",
  createCategory: "/admin/categories",
  updateCategory: (id: string | number) => `/admin/categories/${id}`,
  deleteCategory: (id: string | number) => `/admin/categories/${id}`,
  getUniversities: "/admin/universities",
  getUniversityDetail: (id: string | number) => `/admin/universities/${id}`,
  createUniversity: "/admin/universities",
  deleteUniversity: (id: string | number) => `/admin/universities/${id}`,
  changeStatusUniversity: (id: string | number) =>
    `/admin/universities/${id}/status`,
  updateUniversity: (id: string | number) => `/admin/universities/${id}`,
};

export const ROUTES = {
  home: "/",
  login: "/login",
  categories: "/categories",
  users: "/users",
  courses: "/courses",
  dashboard: "/dashboard",
  universities: "/universities",
  universityDetail: (id: string | number) => `/universities/${id}`,
  universityEdit: (id: string | number) => `/universities/${id}/edit`,
  universityCreate: "/universities/create",
};

export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
