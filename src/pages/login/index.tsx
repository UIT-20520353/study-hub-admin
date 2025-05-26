import { StudyHubLogo } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import React from "react";
import { useTranslation } from "react-i18next";
import useLoginForm from "./hooks/use-login-form";
import { Button } from "@/components/common/button";

const Login: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { formik, formFields, isLoginLoading } = useLoginForm();

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
              variant="primary"
              className="w-full"
              loading={isLoginLoading}
            >
              {t("button.login")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <LanguageSwitcher />
    </div>
  );
};

export default Login;
