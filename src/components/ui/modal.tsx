import { cn } from "@/lib/utils";
import type { ModalType } from "@/store/slices/modalSlice";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface ModalHeaderProps {
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
  type?: ModalType;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  header?: ModalHeaderProps;
  closeOnBackdropClick?: boolean;
  type?: ModalType;
}

const typeStyles = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-50",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    borderColor: "border-red-500",
    bgColor: "bg-red-50",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-50",
  },
  default: {
    icon: Info,
    iconColor: "text-gray-500",
    borderColor: "border-gray-300",
    bgColor: "bg-white",
  },
};

const ModalHeader = ({
  title,
  showCloseButton = true,
  onClose,
  className,
  type = "default",
}: ModalHeaderProps) => {
  if (!title && !showCloseButton) return null;

  const Icon = typeStyles[type].icon;

  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div className="flex items-center gap-2">
        <Icon className={cn("w-5 h-5", typeStyles[type].iconColor)} />
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
      </div>
      {showCloseButton && (
        <button className="cursor-pointer" type="button" onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  header,
  closeOnBackdropClick = true,
  type = "info",
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="fixed inset-0 z-50 min-h-screen bg-black/60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
              "bg-white rounded-lg shadow-lg p-6",
              "w-full max-w-md",
              "border-2",
              typeStyles[type].borderColor,
              typeStyles[type].bgColor,
              className
            )}
          >
            {header && (
              <ModalHeader {...header} type={type} onClose={onClose} />
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
