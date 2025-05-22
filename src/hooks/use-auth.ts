import authenticationApi from "@/api/authenticationApi";
import { ACCESS_TOKEN_KEY, ROUTES } from "@/constants/app";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const { user } = useSelector((state: RootState) => state.auth);

  const getUserInfo = useCallback(async () => {
    const { ok, body, error } = await authenticationApi.getUserInfo();
    if (ok && body) {
      dispatch(setUser(body));
    }
    if (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      navigate(ROUTES.login);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      navigate(ROUTES.login);
    } else {
      getUserInfo();
    }
  }, [navigate, token, getUserInfo]);

  return { user };
};

export default useAuth;
