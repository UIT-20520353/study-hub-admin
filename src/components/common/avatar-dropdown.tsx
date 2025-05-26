import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { clsx } from "clsx";
import type { IUser } from "@/types/user";
import { useTranslation } from "react-i18next";

interface AvatarDropdownProps {
  user: IUser;
  onLogout: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onHelpClick?: () => void;
  className?: string;
}

export const AvatarDropdown: React.FC<AvatarDropdownProps> = ({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
  onNotificationsClick,
  onHelpClick,
  className = "",
}) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (callback?: () => void) => {
    callback?.();
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: User,
      label: "Hồ sơ cá nhân",
      onClick: onProfileClick,
      className: "text-gray-700 hover:text-blue-600",
    },
    {
      icon: Bell,
      label: "Thông báo",
      onClick: onNotificationsClick,
      className: "text-gray-700 hover:text-blue-600",
    },
    {
      icon: Settings,
      label: "Cài đặt",
      onClick: onSettingsClick,
      className: "text-gray-700 hover:text-blue-600",
    },
    {
      icon: HelpCircle,
      label: "Trợ giúp",
      onClick: onHelpClick,
      className: "text-gray-700 hover:text-blue-600",
    },
  ];

  return (
    <div className={clsx("relative", className)} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={clsx(
          "flex items-center space-x-2 p-2 rounded-lg transition-all duration-200",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isOpen && "bg-gray-100"
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="relative">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="object-cover w-8 h-8 border-2 border-gray-200 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
              <span className="text-sm font-medium text-white">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-medium text-gray-900 truncate max-w-32">
            {user.fullName}
          </p>
        </div>

        <ChevronDown
          className={clsx(
            "w-4 h-4 text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={clsx(
              "absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50",
              "py-2 divide-y divide-gray-100"
            )}
          >
            <div className="px-4 py-3">
              <div className="flex items-center space-x-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
                    <span className="font-medium text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.onClick)}
                  className={clsx(
                    "w-full flex items-center px-4 py-2.5 text-sm transition-colors duration-150",
                    "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                    item.className
                  )}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="py-1">
              <button
                onClick={() => handleMenuItemClick(onLogout)}
                className={clsx(
                  "w-full flex items-center px-4 py-2.5 text-sm transition-colors duration-150",
                  "text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50"
                )}
                type="button"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span>{t("button.logout")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
