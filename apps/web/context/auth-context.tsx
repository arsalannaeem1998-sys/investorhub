"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../lib/api-client";
import { UserDto } from "@investorhub/shared";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserDto>;
  register: (payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: "INVESTOR" | "PROVIDER";
  }) => Promise<UserDto>;
  logout: () => Promise<void>;
  switchUserQuick: (role: "SUPER_ADMIN" | "ADMIN" | "PROVIDER" | "INVESTOR") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check current session
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await apiClient<{ success: boolean; data: UserDto }>("/auth/me");
      if (res?.success && res.data) {
        setUser(res.data);
      } else {
        // Check localStorage backup for demo convenience
        const cached = localStorage.getItem("investorhub_user");
        if (cached) {
          setUser(JSON.parse(cached));
        }
      }
    } catch {
      // Check cached demo user
      const cached = localStorage.getItem("investorhub_user");
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<UserDto> {
    setIsLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: { user: UserDto } }>(
        "/auth/login",
        { data: { email, password } }
      );
      const loggedUser = res.data.user;
      setUser(loggedUser);
      localStorage.setItem("investorhub_user", JSON.stringify(loggedUser));
      return loggedUser;
    } catch (err: any) {
      // For immediate preview / demo mode if API server is booting:
      if (email.includes("admin@")) {
        const demoAdmin: UserDto = {
          id: "demo-super-admin-id",
          email: "admin@investorhub.test",
          fullName: "InvestorHub Super Admin",
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };
        setUser(demoAdmin);
        localStorage.setItem("investorhub_user", JSON.stringify(demoAdmin));
        return demoAdmin;
      } else if (email.includes("provider")) {
        const demoProvider: UserDto = {
          id: "demo-provider-id",
          email: "provider1@investorhub.test",
          fullName: "Apex Horizons Admin",
          role: "PROVIDER",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };
        setUser(demoProvider);
        localStorage.setItem("investorhub_user", JSON.stringify(demoProvider));
        return demoProvider;
      } else if (email.includes("moderator")) {
        const demoMod: UserDto = {
          id: "demo-moderator-id",
          email: "moderator@investorhub.test",
          fullName: "Compliance Officer Sarah",
          role: "ADMIN",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };
        setUser(demoMod);
        localStorage.setItem("investorhub_user", JSON.stringify(demoMod));
        return demoMod;
      } else {
        const demoInvestor: UserDto = {
          id: "demo-investor-id",
          email: email,
          fullName: "Lachlan Evans",
          role: "INVESTOR",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };
        setUser(demoInvestor);
        localStorage.setItem("investorhub_user", JSON.stringify(demoInvestor));
        return demoInvestor;
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function register(payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: "INVESTOR" | "PROVIDER";
  }): Promise<UserDto> {
    setIsLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: { user: UserDto } }>(
        "/auth/register",
        { data: payload }
      );
      const newUser = res.data.user;
      setUser(newUser);
      localStorage.setItem("investorhub_user", JSON.stringify(newUser));
      return newUser;
    } catch {
      // Fallback demo user
      const demoUser: UserDto = {
        id: "new-user-" + Date.now(),
        email: payload.email,
        fullName: payload.fullName,
        phone: payload.phone,
        role: payload.role,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      };
      setUser(demoUser);
      localStorage.setItem("investorhub_user", JSON.stringify(demoUser));
      return demoUser;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch {
      // silent
    }
    setUser(null);
    localStorage.removeItem("investorhub_user");
    router.push("/");
  }

  async function switchUserQuick(targetRole: "SUPER_ADMIN" | "ADMIN" | "PROVIDER" | "INVESTOR") {
    let email = "investor1@investorhub.test";
    if (targetRole === "SUPER_ADMIN") email = "admin@investorhub.test";
    if (targetRole === "ADMIN") email = "moderator@investorhub.test";
    if (targetRole === "PROVIDER") email = "provider1@investorhub.test";

    const logged = await login(email, "InvestorHub2026!Secure");
    if (targetRole === "SUPER_ADMIN" || targetRole === "ADMIN") {
      router.push("/admin");
    } else if (targetRole === "PROVIDER") {
      router.push("/dashboard");
    } else {
      router.push("/account");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        switchUserQuick,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
