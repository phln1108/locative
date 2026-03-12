import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AuthUser = {
  email?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user?: AuthUser | null) => void;
  logout: () => void;
};

const AUTH_USER_STORAGE_KEY = "locative_auth_user";
const ACCESS_TOKEN_STORAGE_KEY = "locative_access_token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function hasStoredToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialUser = readStoredUser();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(initialUser) || hasStoredToken()
  );

  const login = (nextUser?: AuthUser | null) => {
    const normalizedUser = nextUser ?? null;
    setUser(normalizedUser);
    setIsAuthenticated(true);

    if (typeof window !== "undefined") {
      if (normalizedUser) {
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(normalizedUser));
      } else {
        window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

