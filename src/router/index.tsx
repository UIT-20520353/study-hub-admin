import { WithAuth } from "@/components/common/with-auth";
import AdminLayout from "@/layouts/admin-layout";
import Categories from "@/pages/categories";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Universities from "@/pages/universities";
import UniversityDetailPage from "@/pages/universities/university-detail-page";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <WithAuth>
        <AdminLayout />
      </WithAuth>
    ),
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
        path: "universities",
        element: <Universities />,
      },
      {
        path: "universities/:id",
        element: <UniversityDetailPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
