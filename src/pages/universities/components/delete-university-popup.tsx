import type { IUniversity } from "@/types/university";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DeleteUniversityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  university: IUniversity | null;
  onConfirm: (id: string | number) => void;
  isLoading: boolean;
}

export const DeleteUniversityPopup: React.FC<DeleteUniversityPopupProps> = ({
  isOpen,
  onClose,
  university,
  onConfirm,
  isLoading,
}) => {
  const { t } = useTranslation();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (isLoading || !university) return;

    onConfirm(university.id);
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 bg-black/60"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("university.delete.title")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("university.delete.subtitle")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">
                  {t("university.delete.content")}
                  <span className="font-semibold text-gray-900">
                    {university?.name || ""}
                  </span>
                  ?
                </p>
                <div className="p-3 border border-yellow-200 rounded-md bg-yellow-50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="mb-1 font-medium">
                        {t("university.delete.warning.title")}:
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>• {t("university.delete.warning.line1")}</li>
                        <li>• {t("university.delete.warning.line2")}</li>
                        <li>• {t("university.delete.warning.line3")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 rounded-b-lg bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("button.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white rounded-full border-t-transparent"
                      />
                      {t("button.deleting")}
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {t("button.delete")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
