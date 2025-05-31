import React from "react";
import { motion, type Variants } from "framer-motion";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface ButtonProps {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "success"
    | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  animation?: "none" | "bounce" | "scale" | "slide" | "glow";
  children?: React.ReactNode;
  className?: string;

  // Essential HTML attributes
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;

  // Accessibility
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-pressed"?: boolean;
  id?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  fullWidth = false,
  rounded = "md",
  shadow = "sm",
  animation = "scale",
  children,
  className,
  type = "button",
  onClick,
  onFocus,
  onBlur,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-pressed": ariaPressed,
  id,
}) => {
  // Size variants
  const sizeStyles = {
    sm: {
      button: "h-8 px-3 text-sm gap-1.5",
      icon: "w-4 h-4",
      iconOnly: "w-8 h-8",
    },
    md: {
      button: "h-10 px-4 text-sm gap-2",
      icon: "w-4 h-4",
      iconOnly: "w-10 h-10",
    },
    lg: {
      button: "h-12 px-6 text-base gap-2.5",
      icon: "w-5 h-5",
      iconOnly: "w-12 h-12",
    },
    xl: {
      button: "h-14 px-8 text-lg gap-3",
      icon: "w-6 h-6",
      iconOnly: "w-14 h-14",
    },
  };

  // Variant styles
  const variantStyles = {
    default:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-blue-500/25",
    secondary:
      "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-purple-500/25",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 bg-white",
    ghost:
      "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-red-500/25",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-green-500/25",
    gradient:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg",
  };

  // Rounded styles
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  // Shadow styles
  const shadowStyles = {
    none: "shadow-none",
    sm: "shadow-sm hover:shadow",
    md: "shadow hover:shadow-md",
    lg: "shadow-md hover:shadow-lg",
    xl: "shadow-lg hover:shadow-xl",
  };

  // Animation variants
  const animationVariants: Record<string, Variants> = {
    none: {},
    bounce: {
      tap: { scale: 0.95, y: 2 },
      hover: { y: -2 },
    },
    scale: {
      tap: { scale: 0.95 },
      hover: { scale: 1.02 },
    },
    slide: {
      tap: { x: 2 },
      hover: { x: -2 },
    },
    glow: {
      hover: {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        scale: 1.02,
      },
      tap: { scale: 0.98 },
    },
  };

  // States
  const isDisabled = disabled || loading;
  const disabledStyles = isDisabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "cursor-pointer";

  // Final className
  const buttonClassName = clsx(
    // Base styles
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none",
    // Size
    iconOnly ? sizeStyles[size].iconOnly : sizeStyles[size].button,
    // Variant
    variantStyles[variant],
    // Styling
    roundedStyles[rounded],
    shadowStyles[shadow],
    fullWidth && "w-full",
    disabledStyles,
    className
  );

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    // Haptic feedback for mobile
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }

    onClick?.(e);
  };

  return (
    <motion.button
      className={buttonClassName}
      variants={animationVariants[animation]}
      whileHover={!isDisabled ? "hover" : undefined}
      whileTap={!isDisabled ? "tap" : undefined}
      initial={false}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      id={id}
    >
      {/* Left Icon or Loading */}
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={sizeStyles[size].icon} />
        </motion.div>
      ) : (
        <>
          {!iconOnly && leftIcon && (
            <span className={sizeStyles[size].icon}>{leftIcon}</span>
          )}
          {!iconOnly && children && (
            <span className={loading ? "opacity-70" : ""}>{children}</span>
          )}
          {!iconOnly && rightIcon && (
            <span className={sizeStyles[size].icon}>{rightIcon}</span>
          )}
          {iconOnly && (leftIcon || rightIcon) && (
            <span className={sizeStyles[size].icon}>
              {leftIcon || rightIcon}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
};

export { Button };
