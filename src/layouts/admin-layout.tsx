import { AvatarDropdown } from "@/components/common/avatar-dropdown";
import { StudyHubLogo } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ROUTES } from "@/constants/app";
import useAuth from "@/hooks/use-auth";
import { motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

interface SidebarItemProps {
  to: string;
  children: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, children }) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block px-4 py-2 rounded ${
            isActive
              ? "bg-blue-50 text-blue-600 font-medium"
              : "hover:bg-gray-100"
          }`
        }
      >
        {({ isActive }) => (
          <motion.span
            animate={{
              x: isActive ? 8 : 0,
              scale: isActive ? 1.02 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
            }}
            className="block"
          >
            {children}
          </motion.span>
        )}
      </NavLink>
    </motion.li>
  );
};

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 right-0 z-10 h-16 bg-white shadow-sm">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <StudyHubLogo className="w-10 h-10" />
            <h1 className="text-xl font-bold">Study Hub</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="icon-only" position="relative" />
            {user && <AvatarDropdown user={user} onLogout={logout} />}
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm">
        <nav className="p-4">
          <motion.ul
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <SidebarItem to={ROUTES.categories}>
              {t("sidebar.categories")}
            </SidebarItem>
          </motion.ul>
        </nav>
      </aside>

      <main className="p-6 pt-20 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
