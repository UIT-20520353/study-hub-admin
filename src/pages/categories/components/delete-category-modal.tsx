import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/common/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { ICategory } from "@/types/category";
import useDeleteCategory from "../hooks/use-delete-category";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ICategory | null;
  onSuccess?: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending: isDeleting } = useDeleteCategory();

  const onConfirmDelete = async () => {
    if (!category) return;

    await mutateAsync(category.id, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-md"
      header={{
        title: t("category.delete.title"),
        showCloseButton: true,
      }}
      closeOnBackdropClick={!isDeleting}
      type="error"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-gray-600">{t("category.delete.subtitle")}</p>
        </div>

        <div className="space-y-3">
          <p className="text-gray-700">
            {t("category.delete.content")}
            <span className="font-semibold text-gray-900">
              "{category?.name || ""}"
            </span>
            ?
          </p>

          <div className="p-3 border border-red-200 rounded-md bg-red-50">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="mb-1 font-medium">
                  {t("category.delete.warning.title")}:
                </p>
                <ul className="space-y-1 text-xs">
                  <li>• {t("category.delete.warning.line1")}</li>
                  <li>• {t("category.delete.warning.line2")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="min-w-[120px]"
          >
            {t("button.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirmDelete}
            loading={isDeleting}
            className="min-w-[120px]"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            {isDeleting ? t("button.deleting") : t("button.delete")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
