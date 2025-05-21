import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalHeaderProps {
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  header?: ModalHeaderProps;
  closeOnBackdropClick?: boolean;
}

const ModalHeader = ({
  title,
  showCloseButton = true,
  onClose,
  className,
}: ModalHeaderProps) => {
  if (!title && !showCloseButton) return null;

  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {showCloseButton && (
        <Button type="button" variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
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
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/50"
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
              className
            )}
          >
            {header && <ModalHeader {...header} onClose={onClose} />}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
