import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import ViewCourses from "./components/ViewCourses";
import ViewFaculty from "./components/ViewFaculty";
import AssignFaculty from "./components/assignFaculty";
import CardComponent from "./components/cardComponent";
function Navigation() {
  const location = useLocation();

  // Hide the navigation on specific routes
  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  return (
    <nav className="p-2 m-2 flex flex-row justify-center">
      <div className="flex justify-evenly w-1/3">
        {[
          { to: "/", label: "Home" },
          { to: "/courses", label: "Courses" },
          { to: "/faculty", label: "Faculty" },
          { to: "/assignFaculty", label: "Assign" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "bg-white text-black rounded-full px-3 py-1 border-2 border-black"
                : "bg-black text-white rounded-full px-3 py-1"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<ViewCourses />} />
          <Route path="/faculty" element={<ViewFaculty />} />
          <Route path="/assignFaculty" element={<AssignFaculty />}></Route>
          <Route path="/card" element={<CardComponent />} />
        </Routes>
      </div>
    </Router>
  );
}
