import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthCtx = createContext(null);

// 🔒 SAFE localStorage parser
const getSafeUser = () => {
  try {
    const u = localStorage.getItem("tas_user");

    if (!u || u === "undefined" || u === "null") return null;

    return JSON.parse(u);
  } catch (err) {
    localStorage.removeItem("tas_user");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tas_token");
    const parsedUser = getSafeUser();

    if (token && parsedUser) {
      setUser(parsedUser);
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", {
      username,
      password,
    });

    if (!data?.token || !data?.user) {
      throw new Error("Login response invalide");
    }

    localStorage.setItem("tas_token", data.token);
    localStorage.setItem("tas_user", JSON.stringify(data.user));

    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("tas_token");
    localStorage.removeItem("tas_user");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);