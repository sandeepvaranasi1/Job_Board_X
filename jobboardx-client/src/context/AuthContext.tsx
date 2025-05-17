import React, { createContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";

import { User } from "../types/profile";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<User | null>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    role: "jobseeker" | "employer";
  }) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await api.get("/profile/me");
        setUser(res.data);
      } catch (err) {
        console.error("Not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (data: {
    email: string;
    password: string;
  }): Promise<User | null> => {
    const response = await api.post("/auth/login", data);
    setUser(response.data);
    return response.data;
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    role: "jobseeker" | "employer";
  }): Promise<boolean> => {
    await api.post("/auth/register", data);
    return true;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
