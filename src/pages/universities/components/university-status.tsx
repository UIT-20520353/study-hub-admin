import { EUniversityStatus } from "@/enums/university";
import { motion } from "framer-motion";
import { Check, Pause, Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface UniversityStatusProps {
  status: EUniversityStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

const UniversityStatus: React.FC<UniversityStatusProps> = ({
  status,
  size = "md",
  showIcon = true,
  showLabel = true,
  className = "",
}) => {
  const { t } = useTranslation();

  const statusConfig = {
    [EUniversityStatus.ACTIVE]: {
      label: t("university.ACTIVE"),
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      icon: Check,
      dotColor: "bg-green-500",
    },
    [EUniversityStatus.INACTIVE]: {
      label: t("university.INACTIVE"),
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
      icon: Pause,
      dotColor: "bg-yellow-500",
    },
    [EUniversityStatus.DELETED]: {
      label: t("university.DELETED"),
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      icon: Trash2,
      dotColor: "bg-red-500",
    },
  };

  const sizeConfig = {
    sm: {
      container: "px-2 py-1 text-xs",
      icon: "w-3 h-3",
      dot: "w-2 h-2",
      gap: "gap-1",
    },
    md: {
      container: "px-3 py-1.5 text-sm",
      icon: "w-4 h-4",
      dot: "w-2.5 h-2.5",
      gap: "gap-1.5",
    },
    lg: {
      container: "px-4 py-2 text-base",
      icon: "w-5 h-5",
      dot: "w-3 h-3",
      gap: "gap-2",
    },
  };

  const config = statusConfig[status];
  const sizes = sizeConfig[size];
  const IconComponent = config.icon;

  const containerVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
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
    initial: { rotate: -180, opacity: 0 },
    animate: {
      rotate: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    },
    whileHover: {
      rotate: 15,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const dotVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: "easeOut",
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
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

      {!showIcon && (
        <motion.div
          variants={dotVariants}
          animate={status === EUniversityStatus.ACTIVE ? "pulse" : "animate"}
          className={`
            ${config.dotColor} ${sizes.dot}
            rounded-full
          `}
        />
      )}

      {showLabel && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
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
      )}
    </motion.div>
  );
};

export const UniversityStatusCompact: React.FC<
  Omit<UniversityStatusProps, "showIcon">
> = (props) => {
  return <UniversityStatus {...props} showIcon={false} />;
};

export const UniversityStatusMinimal: React.FC<
  Omit<UniversityStatusProps, "showLabel">
> = (props) => {
  return <UniversityStatus {...props} showLabel={false} />;
};

export default UniversityStatus;
