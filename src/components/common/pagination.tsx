import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  size?: "sm" | "md" | "lg";
  showFirstLast?: boolean;
  showInfo?: boolean;
  maxVisiblePages?: number;
  className?: string;
  loading?: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  startItem: number;
  endItem: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  size = "md",
  showFirstLast = true,
  showInfo = true,
  maxVisiblePages = 5,
  className = "",
  loading = false,
}) => {
  // Calculate pagination info
  const paginationInfo: PaginationInfo = {
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    startItem: (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, totalElements),
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "w-8 h-8 text-xs",
      spacing: "gap-1",
      padding: "px-2 py-1",
      infoText: "text-xs",
    },
    md: {
      button: "w-10 h-10 text-sm",
      spacing: "gap-2",
      padding: "px-3 py-2",
      infoText: "text-sm",
    },
    lg: {
      button: "w-12 h-12 text-base",
      spacing: "gap-3",
      padding: "px-4 py-3",
      infoText: "text-base",
    },
  };

  const config = sizeConfig[size];

  // Generate page numbers array
  const generatePageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end page
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);

      // Adjust if we're near the beginning or end
      if (currentPage <= halfVisible) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("ellipsis");
        }
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("ellipsis");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: { scale: 0.95 },
  };

  const activeButtonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  // Button component
  const PaginationButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    children: React.ReactNode;
    "aria-label"?: string;
  }> = ({ onClick, disabled, active, children, "aria-label": ariaLabel }) => (
    <motion.button
      variants={active ? activeButtonVariants : buttonVariants}
      initial="rest"
      whileHover={!disabled ? "hover" : "rest"}
      whileTap={!disabled ? "tap" : "rest"}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        ${config.button} ${config.padding}
        flex items-center justify-center
        rounded-lg font-medium
        transition-all duration-200
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
            : disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {loading && active ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white rounded-full border-t-transparent"
        />
      ) : (
        children
      )}
    </motion.button>
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* Pagination Info */}
      {showInfo && (
        <motion.div
          variants={itemVariants}
          className={`${config.infoText} text-gray-600 text-center`}
        >
          Hiển thị {paginationInfo.startItem} - {paginationInfo.endItem} của{" "}
          {paginationInfo.totalElements} kết quả
        </motion.div>
      )}

      {/* Pagination Controls */}
      <motion.div
        variants={itemVariants}
        className={`flex items-center justify-center ${config.spacing}`}
      >
        {/* First Page Button */}
        {showFirstLast && (
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Trang đầu"
          >
            <ChevronsLeft className="w-4 h-4" />
          </PaginationButton>
        )}

        {/* Previous Button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </PaginationButton>

        {/* Page Numbers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`pages-${currentPage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`flex items-center ${config.spacing}`}
          >
            {generatePageNumbers().map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <motion.div
                    key={`ellipsis-${index}`}
                    variants={itemVariants}
                    className={`${config.button} flex items-center justify-center text-gray-400`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </motion.div>
                );
              }

              return (
                <motion.div key={page} variants={itemVariants}>
                  <PaginationButton
                    onClick={() => onPageChange(page)}
                    active={page === currentPage}
                    aria-label={`Trang ${page}`}
                  >
                    {page}
                  </PaginationButton>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </PaginationButton>

        {/* Last Page Button */}
        {showFirstLast && (
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Trang cuối"
          >
            <ChevronsRight className="w-4 h-4" />
          </PaginationButton>
        )}
      </motion.div>

      {/* Mobile Info */}
      <motion.div
        variants={itemVariants}
        className={`${config.infoText} text-gray-500 text-center md:hidden`}
      >
        Trang {currentPage} / {totalPages}
      </motion.div>
    </motion.div>
  );
};

// Compact Pagination variant for mobile/small spaces
export const PaginationCompact: React.FC<
  Omit<PaginationProps, "showFirstLast" | "showInfo">
> = (props) => {
  return (
    <Pagination
      {...props}
      showFirstLast={false}
      showInfo={false}
      maxVisiblePages={3}
      size="sm"
    />
  );
};

// Simple Pagination with just prev/next
export const PaginationSimple: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
}> = ({ currentPage, totalPages, onPageChange, loading, className }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between ${className}`}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium
          rounded-lg transition-all duration-200
          ${
            currentPage === 1 || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
        {t("pagination.previous")}
      </motion.button>

      <span className="text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium
          rounded-lg transition-all duration-200
          ${
            currentPage === totalPages || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }
        `}
      >
        {t("pagination.next")}
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export { Pagination };
