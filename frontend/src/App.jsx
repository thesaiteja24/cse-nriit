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
function Navigation() {
  const location = useLocation();

  // Hide the navigation on the LandingPage
  if (location.pathname === "/") {
    return null; // Don't render the navigation
  }

  return (
    <nav className="p-2 m-2 flex flex-row justify-center">
      <div className="flex justify-evenly w-1/3">
        <NavLink className={"bg-black rounded-full text-white px-3 py-1"} to="/">
          Home
        </NavLink>
        <NavLink
          className={"bg-black rounded-full text-white px-3 py-1"}
          to="/courses"
        >
          Courses
        </NavLink>
        <NavLink
          className={"bg-black rounded-full text-white px-3 py-1"}
          to="/faculty"
        >
          Faculty
        </NavLink>
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
        </Routes>
      </div>
    </Router>
  );
}
