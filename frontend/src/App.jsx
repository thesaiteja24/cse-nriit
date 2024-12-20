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
function Navigation() {
  const location = useLocation();

  // Hide the navigation on the LandingPage
  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null; // Don't render the navigation
  }

  return (
    <nav className="p-2 m-2 flex flex-row justify-center">
      <div className="flex justify-evenly w-1/3">
        <NavLink
          className={"bg-black rounded-full text-white px-3 py-1"}
          to="/"
        >
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
        <NavLink
          className={"bg-black rounded-full text-white px-3 py-1 "}
          to="/assignFaculty"
        >
          Assign
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
          <Route path="/assignFaculty" element={<AssignFaculty />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
