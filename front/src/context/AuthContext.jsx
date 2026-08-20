import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("kasanteria-user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("kasanteria-token"),
  );
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   try {
  //     const savedUser = localStorage.getItem("kasanteria-user");
  //     if (savedUser && token) {
  //       setUser(JSON.parse(savedUser));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [token]);

  const login = async (userData, authToken) => {
    localStorage.setItem("kasanteria-user", JSON.stringify(userData));
    localStorage.setItem("kasanteria-token", authToken);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("kasanteria-user");
    localStorage.removeItem("kasanteria-token");
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro de un AuthProvider");
  }
  return context;
};
