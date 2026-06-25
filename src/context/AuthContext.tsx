import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { type JwtPayload, type UserRole } from "@/types/auth";

interface AuthContextValue {
  token: string | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  signIn(email: string, password: string): Promise<UserRole>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const TOKEN_STORAGE_KEY = "allbuy_token";

const UNEXPECTED_ERROR_MESSAGE = "Unexpected error. Please try again.";

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;
    const json = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function extractRole(token: string): UserRole | null {
  return decodeJwtPayload(token)?.role ?? null;
}

function loadStoredToken(): string | null {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) return null;
  const payload = decodeJwtPayload(stored);
  if (!payload || Date.now() / 1000 > payload.exp) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
  return stored;
}

async function parseBackendError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? UNEXPECTED_ERROR_MESSAGE;
  } catch {
    return UNEXPECTED_ERROR_MESSAGE;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(loadStoredToken);
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const stored = loadStoredToken();
    return stored ? extractRole(stored) : null;
  });

  const signIn = useCallback(
    async (email: string, password: string): Promise<UserRole> => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login/authenticate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha: password }),
        }
      );

      if (!response.ok) {
        const errorMessage = await parseBackendError(response);
        throw new Error(errorMessage);
      }

      const jwtToken = await response.text();
      const role = extractRole(jwtToken) ?? "ROLE_USER";
      localStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
      setToken(jwtToken);
      setUserRole(role);
      return role;
    },
    []
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUserRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, userRole, isAuthenticated: !!token, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return authContext;
}
