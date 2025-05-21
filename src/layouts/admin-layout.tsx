import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 h-16 bg-white shadow-sm">
        <div className="flex items-center justify-between h-full px-4">
          <h1 className="text-xl font-semibold">Study Hub Admin</h1>
          <div className="flex items-center gap-4">
            <span>Admin</span>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/users"
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Users
              </a>
            </li>
            <li>
              <a
                href="/courses"
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Courses
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="p-6 pt-16 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
