import categoryApi from "@/api/categoryApi";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/slices/modalSlice";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const useDeleteCategory = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string | number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      dispatch(
        openModal({
          title: t("common.success.title"),
          content: t("category.delete.success.content"),
          type: "success",
        })
      );
    },
    onError: () => {
      dispatch(
        openModal({
          title: t("category.delete.error.title"),
          content: t("category.delete.error.content"),
          type: "error",
        })
      );
    },
  });
};

export default useDeleteCategory;
