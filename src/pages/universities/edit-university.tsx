// pages/EditUniversity/index.tsx
import { Button } from "@/components/common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { EUniversityStatus } from "@/enums/university";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  ImageIcon,
  Save,
  Trash,
  Upload,
  X,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteUniversityPopup } from "./components/delete-university-popup";
import useEditUniversityForm from "./hooks/use-edit-university-form";
import { ROUTES } from "@/constants/app";

const EditUniversity: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    formik,
    formFields,
    isUpdateLoading,
    isLoadingDetail,
    logoFile,
    logoPreview,
    handleLogoChange,
    handleRemoveLogo,
    universityDetail,
    hasExistingLogo,
    isOpenDeletePopup,
    setIsOpenDeletePopup,
    onConfirmDelete,
    isDeleting,
  } = useEditUniversityForm({
    universityId: id!,
  });

  const handleBack = () => {
    navigate(ROUTES.universities);
  };

  if (isLoadingDetail) {
    return (
      <div className="min-h-screen">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
            leftIcon={<ArrowLeft className="w-4 h-4 mr-2" />}
          >
            {t("button.goBack")}
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <Skeleton className="w-64 h-8 mb-2" />
              <Skeleton className="w-48 h-4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="w-32 h-6" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-6" />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <Skeleton className="w-24 h-6" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-48 rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!universityDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            {t("university.notFound.title")}
          </h2>
          <p className="mb-4 text-gray-600">
            {t("university.notFound.description")}
          </p>
          <Button onClick={handleBack}>{t("button.goBack")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DeleteUniversityPopup
        isOpen={isOpenDeletePopup}
        onClose={() => setIsOpenDeletePopup(false)}
        university={universityDetail}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
      />

      <div className="mb-6">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
            leftIcon={<ArrowLeft className="w-4 h-4 mr-2" />}
          >
            {t("button.goBack")}
          </Button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 transition-colors border rounded-lg  bg-red-600 text-white",
              "shadow-sm cursor-pointer hover:bg-red-700 shadow-red-500/25",
              {
                hidden: universityDetail.status === EUniversityStatus.DELETED,
              }
            )}
            onClick={() => setIsOpenDeletePopup(true)}
          >
            <Trash size={18} />
            <span className="font-medium">{t("button.delete")}</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("university.edit.title")}
            </h1>
            <p className="text-gray-600">
              {t("university.edit.subtitle", { name: universityDetail.name })}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {t("university.section.basicInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {formFields.slice(0, 2).map((field) => (
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
                      required={field.required}
                    />
                  ))}
                </div>

                <FormField
                  key="emailDomain"
                  label={formFields[2].label}
                  placeholder={formFields[2].placeholder}
                  name="emailDomain"
                  type="text"
                  value={formik.values.emailDomain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.emailDomain
                      ? formik.errors.emailDomain
                      : undefined
                  }
                  helperText={formFields[2].helperText}
                  required={formFields[2].required}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {t("university.section.locationInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    label={formFields[4].label}
                    placeholder={formFields[4].placeholder}
                    name="city"
                    type="text"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city ? formik.errors.city : undefined}
                  />
                  <FormField
                    label={formFields[5].label}
                    placeholder={formFields[5].placeholder}
                    name="website"
                    type="url"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.website ? formik.errors.website : undefined
                    }
                  />
                </div>

                <FormField
                  label={formFields[3].label}
                  placeholder={formFields[3].placeholder}
                  name="address"
                  type="text"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.address ? formik.errors.address : undefined
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {t("university.section.additionalInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {formFields[6].label}
                  </label>
                  <textarea
                    name="description"
                    placeholder={formFields[6].placeholder}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-sm text-red-500">
                      {formik.errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {t("university.section.logo")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logoPreview ? (
                    <div className="relative">
                      <div className="w-full h-48 overflow-hidden bg-gray-100 rounded-lg">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute p-1 text-white transition-colors bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {hasExistingLogo && !logoFile && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                            {t("university.logo.current")}
                          </span>
                        </div>
                      )}
                      {logoFile && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            {t("university.logo.new")}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg">
                      <ImageIcon className="w-12 h-12 mb-2 text-gray-400" />
                      <p className="text-sm text-center text-gray-500">
                        {t("university.logo.placeholder")}
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      leftIcon={<Upload className="w-4 h-4 mr-2" />}
                    >
                      {logoFile
                        ? t("university.logo.change")
                        : hasExistingLogo
                        ? t("university.logo.replace")
                        : t("university.logo.upload")}
                    </Button>
                  </div>

                  {logoFile && (
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>
                        <span className="font-medium">
                          {t("university.logo.file-name")}:
                        </span>{" "}
                        {logoFile.name}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("university.logo.file-size")}:
                        </span>{" "}
                        {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-gray-500">
                    <p className="font-medium">
                      {t("university.logo.guidelines")}:
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>{t("university.logo.guideline.format")}</li>
                      <li>{t("university.logo.guideline.size")}</li>
                      <li>{t("university.logo.guideline.resolution")}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end pt-6 space-x-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isUpdateLoading}
          >
            {t("button.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isUpdateLoading}
            className="min-w-[120px]"
            leftIcon={<Save className="w-4 h-4 mr-2" />}
          >
            {isUpdateLoading ? t("button.saving") : t("button.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUniversity;
