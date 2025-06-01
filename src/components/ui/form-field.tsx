import { cn } from "@/lib/utils";
import React, { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./input";
import { Label } from "./label";
import { Eye, EyeOff, AlertCircle, Check, Info, X } from "lucide-react";
import { Button } from "./button";

interface FormFieldProps {
  label?: ReactNode | string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  name?: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

  variant?: "default" | "floating" | "minimal" | "bordered" | "filled";
  size?: "sm" | "md" | "lg";
  helperText?: string;
  success?: boolean;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const FormField: React.FunctionComponent<FormFieldProps> = ({
  label,
  type,
  className,
  containerClassName,
  placeholder,
  onChange,
  value,
  name,
  error,
  onBlur,
  variant = "default",
  size = "md",
  helperText,
  success = false,
  loading = false,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  clearable = false,
  onClear,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<boolean>(!!value);

  React.useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFocus = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    setHasValue(false);
    onClear?.();
  };

  // Size variants
  const sizeClasses = {
    sm: {
      input: "h-8 text-sm px-3",
      icon: "w-4 h-4",
      label: "text-sm",
      padding: leftIcon ? "pl-8" : "pl-3",
    },
    md: {
      input: "h-10 text-sm px-3",
      icon: "w-4 h-4",
      label: "text-sm",
      padding: leftIcon ? "pl-10" : "pl-3",
    },
    lg: {
      input: "h-12 text-base px-4",
      icon: "w-5 h-5",
      label: "text-base",
      padding: leftIcon ? "pl-12" : "pl-4",
    },
  };

  // State classes
  const getStateClasses = () => {
    if (error)
      return "border-red-500 focus-visible:ring-red-500/50 bg-red-50/30";
    if (success)
      return "border-green-500 focus-visible:ring-green-500/50 bg-green-50/30";
    if (isFocused) return "border-blue-500 focus-visible:ring-blue-500/50";
    return "border-gray-300 focus-visible:ring-blue-500/50";
  };

  // Variant-specific styles
  const getVariantClasses = () => {
    switch (variant) {
      case "floating":
        return cn(
          "bg-transparent border-0 border-b-2 rounded-none",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          getStateClasses().replace("border-", "border-b-")
        );
      case "minimal":
        return "bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-500";
      case "bordered":
        return cn("border-2", getStateClasses());
      case "filled":
        return cn("bg-gray-100 border border-gray-300", getStateClasses());
      default:
        return cn("bg-white border", getStateClasses());
    }
  };

  const renderLabel = () => {
    if (!label) return null;

    if (variant === "floating") {
      return (
        <motion.div
          className={cn(
            "absolute left-3 pointer-events-none transition-all duration-200",
            "text-gray-500",
            isFocused || hasValue
              ? "top-1 text-xs text-blue-600"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
          animate={{
            y: isFocused || hasValue ? -8 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {typeof label === "string" ? (
            <span>
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </span>
          ) : (
            label
          )}
        </motion.div>
      );
    }

    return (
      <Label
        htmlFor={name}
        className={cn(
          sizeClasses[size].label,
          "font-medium text-gray-700",
          error && "text-red-600",
          success && "text-green-600"
        )}
      >
        {typeof label === "string" ? (
          <span>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </span>
        ) : (
          label
        )}
      </Label>
    );
  };

  const renderStatusIcon = () => {
    if (loading) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent"
        />
      );
    }

    if (error) {
      return (
        <AlertCircle className={cn(sizeClasses[size].icon, "text-red-500")} />
      );
    }

    if (success) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className={cn(sizeClasses[size].icon, "text-green-500")} />
        </motion.div>
      );
    }

    return null;
  };

  const showClearButton = clearable && hasValue && !disabled && !loading;
  const showPasswordToggle = type === "password";
  const showRightIcons =
    showPasswordToggle || showClearButton || rightIcon || renderStatusIcon();

  return (
    <motion.div
      className={cn("space-y-2", containerClassName)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {variant !== "floating" && renderLabel()}

      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 z-10",
              disabled && "opacity-50"
            )}
          >
            <div className={sizeClasses[size].icon}>{leftIcon}</div>
          </div>
        )}

        {/* Floating Label */}
        {variant === "floating" && renderLabel()}

        {/* Input */}
        <Input
          id={name}
          className={cn(
            "w-full transition-all duration-200",
            sizeClasses[size].input,
            getVariantClasses(),
            leftIcon && sizeClasses[size].padding,
            showRightIcons && "pr-12",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          style={{
            paddingRight: showRightIcons
              ? showPasswordToggle && showClearButton
                ? "80px"
                : "40px"
              : undefined,
          }}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={variant === "floating" ? "" : placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          value={value}
          name={name}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
        />

        {/* Right Icons Container */}
        {showRightIcons && (
          <div className="absolute flex items-center space-x-1 -translate-y-1/2 right-3 top-1/2">
            {/* Status Icon */}
            {renderStatusIcon()}

            {/* Custom Right Icon */}
            {rightIcon && !loading && (
              <div className={sizeClasses[size].icon}>{rightIcon}</div>
            )}

            {/* Clear Button */}
            {showClearButton && (
              <motion.button
                type="button"
                onClick={handleClear}
                className="p-1 transition-colors rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <X
                  className={cn(
                    sizeClasses[size].icon,
                    "text-gray-400 hover:text-gray-600"
                  )}
                />
              </motion.button>
            )}

            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-auto h-auto p-1 hover:bg-gray-100"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: showPassword ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showPassword ? (
                    <EyeOff
                      className={cn(sizeClasses[size].icon, "text-gray-500")}
                    />
                  ) : (
                    <Eye
                      className={cn(sizeClasses[size].icon, "text-gray-500")}
                    />
                  )}
                </motion.div>
              </Button>
            )}
          </div>
        )}

        {/* Focus Ring Effect */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text & Error */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-1.5 text-sm text-red-500"
            id={`${name}-error`}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="leading-tight break-words">{error}</p>
          </motion.div>
        )}

        {!error && helperText && (
          <motion.div
            key="helper"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-1.5 text-sm text-gray-500"
            id={`${name}-helper`}
          >
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="leading-tight">{helperText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { FormField };
