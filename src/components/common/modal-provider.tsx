import { Modal } from "@/components/ui/modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeModal } from "@/store/slices/modalSlice";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export const ModalProvider = () => {
  const dispatch = useAppDispatch();
  const {
    isOpen,
    content,
    title,
    size = "md",
    type = "info",
    hideCloseButton = false,
  } = useAppSelector((state) => state.modal);

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={{
        title,
        showCloseButton: !hideCloseButton,
      }}
      className={cn(sizeClasses[size])}
      type={type}
    >
      {content}
    </Modal>
  );
};
