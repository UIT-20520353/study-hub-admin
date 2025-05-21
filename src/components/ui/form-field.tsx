import { cn } from "@/lib/utils";
import React, { useState, type ReactNode } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
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
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {typeof label === "string" ? (
        <Label htmlFor={name}>{label}</Label>
      ) : (
        label
      )}
      <div className="relative">
        <Input
          id={name}
          className={cn(
            "w-full transition-all duration-200",
            error && "border-red-500 focus-visible:ring-red-500/50",
            className
          )}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          name={name}
          aria-invalid={!!error}
        />

        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500" />
            )}
          </Button>
        )}
      </div>
      {error && (
        <div className="flex items-start gap-1.5 text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="leading-tight break-words">{error}</p>
        </div>
      )}
    </div>
  );
};

export { FormField };
