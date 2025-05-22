import authenticationApi from "@/api/authenticationApi";
import { ACCESS_TOKEN_KEY, ROUTES } from "@/constants/app";
import { EUserRole } from "@/enums/user";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { openModal } from "@/store/slices/modalSlice";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import type { LoginForm } from "../types/form";

const useLoginForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoginLoading, setLoginLoading] = useState<boolean>(false);

  const onSubmit = async (values: LoginForm) => {
    setLoginLoading(true);
    const { ok, body, error } = await authenticationApi.login(values);
    if (ok && body) {
      if (body.user.role === EUserRole.SYSTEM_ADMIN) {
        localStorage.setItem(ACCESS_TOKEN_KEY, body.token);
        dispatch(setUser(body.user));
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

    setLoginLoading(false);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("validation.email.invalid"))
      .required(t("validation.email.required")),
    password: Yup.string()
      .min(6, t("validation.password.min"))
      .required(t("validation.password.required")),
  });

  const formik = useFormik<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit,
  });

  const formFields = [
    {
      name: "email",
      type: "text",
      label: t("login.field.label.email"),
      placeholder: t("login.field.placeholder.email"),
    },
    {
      name: "password",
      type: "password",
      label: t("login.field.label.password"),
      placeholder: t("login.field.placeholder.password"),
    },
  ] as const;

  return {
    formik,
    formFields,
    isLoginLoading,
  };
};

export default useLoginForm;
