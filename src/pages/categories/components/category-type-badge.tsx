import { ECategoryType } from "@/enums/category";
import { motion } from "framer-motion";
import { Bookmark, Package } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface CategoryTypeBadgeProps {
  type: ECategoryType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const CategoryTypeBadge: React.FC<CategoryTypeBadgeProps> = ({
  type,
  size = "md",
  showIcon = true,
  className = "",
}) => {
  const { t } = useTranslation();
  const typeConfig: Record<
    ECategoryType,
    {
      label: string;
      bgColor: string;
      textColor: string;
      iconColor: string;
      borderColor: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    [ECategoryType.TOPIC]: {
      label: t("category.type.topic"),
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      icon: Bookmark,
    },
    [ECategoryType.PRODUCT]: {
      label: t("category.type.product"),
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      icon: Package,
    },
  };

  const sizeConfig = {
    sm: {
      container: "px-2 py-1 text-xs",
      icon: "w-3 h-3",
      gap: "gap-1",
    },
    md: {
      container: "px-3 py-1.5 text-sm",
      icon: "w-4 h-4",
      gap: "gap-1.5",
    },
    lg: {
      container: "px-4 py-2 text-base",
      icon: "w-5 h-5",
      gap: "gap-2",
    },
  };

  const config = typeConfig[type];
  const sizes = sizeConfig[size];
  const IconComponent = config.icon;

  const containerVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    whileHover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    initial: { rotate: -10, opacity: 0 },
    animate: {
      rotate: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      className={`
        inline-flex items-center justify-center rounded-full
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizes.container} ${sizes.gap}
        border font-medium
        cursor-default
        ${className}
      `}
    >
      {showIcon && (
        <motion.div variants={iconVariants} className={`${config.iconColor}`}>
          <IconComponent className={sizes.icon} />
        </motion.div>
      )}

      <motion.span
        initial={{ opacity: 0, x: -5 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            delay: 0.2,
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        className="font-semibold whitespace-nowrap"
      >
        {config.label}
      </motion.span>
    </motion.div>
  );
};

export default CategoryTypeBadge;
