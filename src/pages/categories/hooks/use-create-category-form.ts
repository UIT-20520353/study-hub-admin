import categoryApi, { type ICreateCategoryRequest } from "@/api/categoryApi";
import { ECategoryType } from "@/enums/category";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/slices/modalSlice";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

export interface CreateCategoryForm {
  name: string;
  type: ECategoryType;
}

const useCreateCategoryForm = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isCreateLoading, setCreateLoading] = useState<boolean>(false);

  const onSubmit = async (values: CreateCategoryForm) => {
    setCreateLoading(true);
    try {
      const data: ICreateCategoryRequest = {
        name: values.name,
        type: values.type,
      };

      const { ok, error } = await categoryApi.createCategory(data);

      if (ok) {
        dispatch(
          openModal({
            title: t("category.create.success.title"),
            content: t("category.create.success.content"),
            type: "success",
          })
        );
        formik.resetForm();
        onSuccess?.();
      } else {
        dispatch(
          openModal({
            title: t("category.create.error.title"),
            content: error?.message || t("category.create.error.content"),
            type: "error",
          })
        );
      }
    } catch {
      dispatch(
        openModal({
          title: t("category.create.error.title"),
          content: t("category.create.error.content"),
          type: "error",
        })
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("category.validation.name.required"))
      .max(100, t("category.validation.name.maxLength")),
    type: Yup.string()
      .oneOf(Object.values(ECategoryType))
      .required(t("category.validation.type.required")),
  });

  const formik = useFormik<CreateCategoryForm>({
    initialValues: {
      name: "",
      type: ECategoryType.TOPIC,
    },
    validationSchema,
    onSubmit,
  });

  const formFields = [
    {
      name: "name" as keyof CreateCategoryForm,
      label: t("category.field.label.name"),
      placeholder: t("category.field.placeholder.name"),
      type: "text",
      required: true,
    },
    {
      name: "type" as keyof CreateCategoryForm,
      label: t("category.field.label.type"),
      type: "select",
      required: true,
      options: Object.values(ECategoryType).map((type) => ({
        value: type,
        label: t(`category.type.${type.toLowerCase()}`),
      })),
    },
  ];

  return {
    formik,
    formFields,
    isCreateLoading,
  };
};

export default useCreateCategoryForm;
