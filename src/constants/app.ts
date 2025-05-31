export const ACCESS_TOKEN_KEY = "study_hub_access_token";

export const API_URLS = {
  login: "/auth/login",
  getUserInfo: "/user/profile",
  getCategories: "/admin/categories",
  getUniversities: "/admin/universities",
  getUniversityDetail: (id: string | number) => `/admin/universities/${id}`,
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
};

export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
