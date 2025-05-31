import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const unitedStatesFlag = "🇺🇸";
const vietnamFlag = "🇻🇳";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: unitedStatesFlag,
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: vietnamFlag,
  },
];

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "icon-only";
  position?: "fixed" | "relative";
  className?: string;
}

export const LanguageSwitcher: FunctionComponent<LanguageSwitcherProps> = ({
  variant = "default",
  position = "fixed",
  className = "",
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-language-switcher]")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "relative",
          position === "fixed" && "fixed top-5 right-5 z-50 overflow-hidden",
          className
        )}
        data-language-switcher
      >
        <motion.button
          onClick={toggleDropdown}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg",
            "bg-white/90 backdrop-blur-sm border border-gray-200/50",
            "hover:bg-white hover:border-gray-300 hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "transition-all duration-200"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200",
                "py-1 z-50 overflow-hidden"
              )}
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left",
                    "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                    "transition-colors duration-150",
                    currentLanguage.code === language.code &&
                      "bg-blue-50 text-blue-600"
                  )}
                  whileHover={{ backgroundColor: "#f9fafb", scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.nativeName}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "icon-only") {
    return (
      <div
        className={cn(
          "relative",
          position === "fixed" && "fixed top-5 right-5 z-50",
          className
        )}
        data-language-switcher
      >
        <motion.button
          onClick={toggleDropdown}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            "bg-white/90 backdrop-blur-sm border border-gray-200/50",
            "hover:bg-white hover:border-gray-300 hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "transition-all duration-200"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Globe className="w-5 h-5 text-gray-600" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200",
                "py-1 z-50 overflow-hidden"
              )}
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left",
                    "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                    "transition-colors duration-150",
                    currentLanguage.code === language.code &&
                      "bg-blue-50 text-blue-600"
                  )}
                  whileHover={{ backgroundColor: "#f9fafb", scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.nativeName}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative",
        position === "fixed" && "fixed top-5 right-5 z-50",
        className
      )}
      data-language-switcher
    >
      <motion.button
        onClick={toggleDropdown}
        className={cn(
          "flex items-center space-x-3 px-4 py-2.5 rounded-xl",
          "bg-white/90 backdrop-blur-sm border border-gray-200/50",
          "hover:bg-white hover:border-gray-300 hover:shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "transition-all duration-200 min-w-[140px]"
        )}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage.nativeName}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-200 ml-auto",
            isOpen && "rotate-180"
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200/50",
              "py-2 z-50 backdrop-blur-sm overflow-hidden"
            )}
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Choose Language
              </p>
            </div>

            <div className="px-2">
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-3 text-sm text-left rounded-lg mx-0",
                    "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                    "transition-colors duration-150",
                    currentLanguage.code === language.code &&
                      "bg-blue-50 text-blue-600"
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium">{language.nativeName}</p>
                    <p className="text-xs text-gray-500">{language.name}</p>
                  </div>
                  {currentLanguage.code === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
