import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/common/button";
import { Save, Tag } from "lucide-react";
import useUpdateCategoryForm from "../hooks/use-update-category-form";
import { ECategoryType } from "@/enums/category";
import type { ICategory } from "@/types/category";

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ICategory | null;
  onSuccess?: () => void;
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const { formik, isUpdateLoading } = useUpdateCategoryForm(
    category,
    handleSuccess
  );

  const handleClose = () => {
    if (isUpdateLoading) return;
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-md"
      header={{
        title: t("category.edit.title"),
        showCloseButton: true,
      }}
      closeOnBackdropClick={!isUpdateLoading}
      type="default"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Tag className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-gray-600">{t("category.edit.subtitle")}</p>
        </div>

        <FormField
          label={t("category.field.label.name")}
          placeholder={t("category.field.placeholder.name")}
          name="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : undefined}
          required
          disabled={isUpdateLoading}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t("category.field.label.type")}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(ECategoryType).map((type) => (
              <label
                key={type}
                className={`
                  flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all
                  ${
                    formik.values.type === type
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }
                  ${isUpdateLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={formik.values.type === type}
                  onChange={formik.handleChange}
                  className="sr-only"
                  disabled={isUpdateLoading}
                />
                <div className="text-center">
                  <div className="text-sm font-medium">
                    {t(`category.type.${type.toLowerCase()}`)}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{type}</div>
                </div>
              </label>
            ))}
          </div>
          {formik.touched.type && formik.errors.type && (
            <p className="text-sm text-red-500">{formik.errors.type}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdateLoading}
            className="min-w-[120px]"
          >
            {t("button.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isUpdateLoading}
            className="min-w-[120px]"
            leftIcon={<Save className="w-4 h-4" />}
          >
            {t("button.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCategoryModal;
