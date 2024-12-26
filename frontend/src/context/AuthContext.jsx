import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${backend_url}getuser`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      const response = await axios.post(`${backend_url}register`, data, {
        withCredentials: true,
      });
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data.message ||
          "An error occurred during registration",
      };
    }
  };

  const login = async (data) => {
    try {
      const response = await axios.post(`${backend_url}login`, data, {
        withCredentials: true,
      });
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data.message || "An error occurred during login",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${backend_url}logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data.message || "An error occurred during logout",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
