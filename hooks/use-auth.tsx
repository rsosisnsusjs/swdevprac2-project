"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { apiCall } from "@/lib/api-client";

interface User {
  _id: string;
  name: string;
  email: string;
  tel?: string;
  role: "member" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    tel: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (useToken?: string) => {
    const t = useToken ?? token;
    if (!t) {
      setUser(null);
      return null;
    }

    const data = await apiCall("/auth/me", { token: t });
    // assume data.data contains user object
    setUser(data.data ?? null);
    return data.data ?? null;
  };

  const refreshUser = async () => {
    try {
      await fetchProfile();
    } catch (err) {
      // ignore or handle
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
          await fetchProfile(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("checkAuth error:", error);
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const authToken = data.token;
      if (!authToken) throw new Error("No token returned from login");

      localStorage.setItem("authToken", authToken);
      setToken(authToken);

      const profile = await fetchProfile(authToken);
      if (!profile) {
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          tel: data.tel,
          role: data.role || "member",
        });
      }
    } catch (err) {
      console.error("login error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    tel: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const result = await apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...payload, role: "member" }),
      });

      const authToken = result.token;
      if (!authToken) throw new Error("No token returned from register");

      localStorage.setItem("authToken", authToken);
      setToken(authToken);

      await fetchProfile(authToken);
    } catch (err) {
      console.error("register error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiCall("/auth/logout", { method: "POST" });
    } catch (error) {
      console.warn("logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      token,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
