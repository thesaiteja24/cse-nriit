// components/Navigation.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset/")
  ) {
    return null;
  }

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    }
  };

  const navigationItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/faculty", label: "Faculty" },
    { to: "/assignFaculty", label: "Assign" },
  ];

  return (
    <nav className="bg-gray-100 py-4 px-6 shadow-md relative">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center space-x-4">
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`transition-colors duration-200 ${
                location.pathname === item.to
                  ? "bg-white text-black rounded-full px-4 py-2 border-2 border-black"
                  : "bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 right-0 top-full bg-white py-2 px-4 shadow-lg border-t z-50 w-full">
              {navigationItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block py-2 px-4 my-1 rounded-full transition-colors duration-200 ${
                    location.pathname === item.to
                      ? "bg-white text-black border-2 border-black"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-4 my-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
