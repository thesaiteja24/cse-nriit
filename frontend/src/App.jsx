import { React, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Menu, X } from "lucide-react";
import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import ViewCourses from "./components/ViewCourses";
import ViewFaculty from "./components/ViewFaculty";
import AssignFaculty from "./components/AssignFaculty";
import CardComponent from "./components/cardComponent";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

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
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Mobile Menu Button */}
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

          {/* Mobile Menu Items */}
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen relative">
        <Navigation />
        <div className="relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<ViewCourses />} />
            <Route path="/faculty" element={<ViewFaculty />} />
            <Route path="/assignFaculty" element={<AssignFaculty />} />
            <Route path="/card" element={<CardComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;