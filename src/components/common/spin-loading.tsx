import React from "react";
import { motion } from "framer-motion";

interface SpinLoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "green" | "red" | "purple" | "orange" | "gray" | "white";
  thickness?: "thin" | "medium" | "thick";
  speed?: "slow" | "normal" | "fast";
  className?: string;
  showText?: boolean;
  text?: string;
}

export const SpinLoading: React.FC<SpinLoadingProps> = ({
  size = "md",
  color = "blue",
  thickness = "medium",
  speed = "normal",
  className = "",
  showText = false,
  text = "Loading...",
}) => {
  // Size configurations
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  // Color configurations
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    purple: "border-purple-500",
    orange: "border-orange-500",
    gray: "border-gray-500",
    white: "border-white",
  };

  // Thickness configurations
  const thicknessClasses = {
    thin: "border-2",
    medium: "border-4",
    thick: "border-6",
  };

  // Speed configurations
  const speedDurations = {
    slow: 2,
    normal: 1,
    fast: 0.5,
  };

  // Text size based on spinner size
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <motion.div
        className={`
          ${sizeClasses[size]}
          ${thicknessClasses[thickness]}
          ${colorClasses[color]}
          border-solid border-t-transparent rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: speedDurations[speed],
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {showText && (
        <motion.p
          className={`${textSizeClasses[size]} ${colorClasses[color].replace(
            "border-",
            "text-"
          )} font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};
