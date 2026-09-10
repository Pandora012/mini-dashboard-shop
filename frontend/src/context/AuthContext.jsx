import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const C = createContext();

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const handleExpiredSession = () => setUser(null);
    window.addEventListener("auth:expired", handleExpiredSession);
    return () =>
      window.removeEventListener("auth:expired", handleExpiredSession);
  }, []);
  const login = async (d) => {
    const r = await api.post("/login", d);
    localStorage.setItem("token", r.data.token);
    localStorage.setItem("user", JSON.stringify(r.data.user));
    setUser(r.data.user);
  };
  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };
  return <C.Provider value={{ user, login, logout }}>{children}</C.Provider>;
}
export const useAuth = () => useContext(C);
