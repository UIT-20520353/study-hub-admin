import AdminLayout from "@/layouts/admin-layout";
import Categories from "@/pages/categories";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/categories" replace />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
