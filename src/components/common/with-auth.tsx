import { useGetUserInfo } from "@/api/authenticationApi";
import { ROUTES } from "@/constants/app";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SpinLoading } from "./spin-loading";

export const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const { data: response, isLoading, isFetching } = useGetUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're not loading/fetching and there's no user data
    if (!isLoading && !isFetching && !response?.body) {
      navigate(ROUTES.login);
    }
  }, [response, isFetching, isLoading, navigate]);

  // Show loading state only on initial load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinLoading size="lg" color="blue" />
      </div>
    );
  }

  // Only render children if we have user data
  if (!response?.body) {
    return null;
  }

  return children;
};
