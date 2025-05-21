import { StudyHubLogo } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import type { LoginForm } from "./types/form";
import { Modal } from "@/components/ui/modal";

const Login: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [isShowModal, setShowModal] = useState<boolean>(false);

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
    onSubmit: (values) => {
      setShowModal(true);
      console.log(values);
    },
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

  return (
    <div className="relative flex items-center justify-center w-full h-screen">
      <Card className="w-1/3">
        <CardHeader className="flex flex-col items-center justify-center gap-2">
          <StudyHubLogo className="w-15 h-15" />
          <CardTitle className="text-2xl font-bold text-blue-800">
            {t("login.welcome")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-10">
          <form className="w-full space-y-3" onSubmit={formik.handleSubmit}>
            {formFields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                name={field.name}
                type={field.type}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched[field.name]
                    ? formik.errors[field.name]
                    : undefined
                }
              />
            ))}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              variant="default"
            >
              {t("button.login")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <LanguageSwitcher />

      <Modal
        isOpen={isShowModal}
        onClose={() => setShowModal(false)}
        header={{ title: "Hello", showCloseButton: false }}
      >
        <h2>Hello</h2>
      </Modal>
    </div>
  );
};

export default Login;
