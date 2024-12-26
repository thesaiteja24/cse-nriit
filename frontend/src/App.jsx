// App.jsx
import { React, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';  // Make sure this path is correct
import Navigation from './components/Navigation';  // Move Navigation to separate component
import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./components/LandingPage";
import ViewCourses from "./components/ViewCourses";
import ViewFaculty from "./components/ViewFaculty";
import AssignFaculty from "./components/AssignFaculty";
import CardComponent from "./components/cardComponent";
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative">
          <Navigation />
          <div className="relative">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <ViewCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty"
                element={
                  <ProtectedRoute>
                    <ViewFaculty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignFaculty"
                element={
                  <ProtectedRoute>
                    <AssignFaculty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/card"
                element={
                  <ProtectedRoute>
                    <CardComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;