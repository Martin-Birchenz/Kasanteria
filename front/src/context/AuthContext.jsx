import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const headers = storedToken
          ? { Authorization: `Bearer ${storedToken}` }
          : {};

        const res = await fetch(`${API_URL}/auth/verify`, {
          method: "GET",
          headers,
          credentials: "include",
        });
        if (res.status === 401 || res.status === 403) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          return;
        }

        const data = await res.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (userData, receivedToken) => {
    setUser(userData);
    if (receivedToken) {
      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
