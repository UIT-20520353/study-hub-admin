import categoryApi, { type IUpdateCategoryRequest } from "@/api/categoryApi";
import { ECategoryType } from "@/enums/category";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/slices/modalSlice";
import type { ICategory } from "@/types/category";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

export interface UpdateCategoryForm {
  name: string;
  type: ECategoryType;
}

const useUpdateCategoryForm = (
  category: ICategory | null,
  onSuccess?: () => void
) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isUpdateLoading, setUpdateLoading] = useState<boolean>(false);

  const onSubmit = async (values: UpdateCategoryForm) => {
    if (!category) return;

    setUpdateLoading(true);
    try {
      const data: IUpdateCategoryRequest = {
        name: values.name,
        type: values.type,
      };

      const { ok, error } = await categoryApi.updateCategory(category.id, data);

      if (ok) {
        dispatch(
          openModal({
            title: t("category.edit.success.title"),
            content: t("category.edit.success.content"),
            type: "success",
          })
        );
        onSuccess?.();
      } else {
        dispatch(
          openModal({
            title: t("category.edit.error.title"),
            content: error?.message || t("category.edit.error.content"),
            type: "error",
          })
        );
      }
    } catch {
      dispatch(
        openModal({
          title: t("category.edit.error.title"),
          content: t("category.edit.error.content"),
          type: "error",
        })
      );
    } finally {
      setUpdateLoading(false);
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

  const formik = useFormik<UpdateCategoryForm>({
    initialValues: {
      name: category?.name || "",
      type: category?.type || ECategoryType.TOPIC,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  return {
    formik,
    isUpdateLoading,
  };
};

export default useUpdateCategoryForm;
