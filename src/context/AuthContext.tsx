import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { type JwtPayload, type UserRole } from "@/types/auth";
import { parseBackendError, UNEXPECTED_ERROR_MESSAGE } from "@/lib/api";

interface AuthContextValue {
  token: string | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  signIn(email: string, password: string): Promise<UserRole>;
  signOut(): void;
}

interface AuthState {
  token: string | null;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const TOKEN_STORAGE_KEY = "allbuy_token";

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

function extractValidRole(token: string): UserRole | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const role = payload.role as unknown;
  if (role !== "ROLE_ADMIN" && role !== "ROLE_VENDEDOR" && role !== "ROLE_USER") {
    return null;
  }
  return role as UserRole;
}

function loadInitialAuthState(): AuthState {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) return { token: null, userRole: null };

  const payload = decodeJwtPayload(stored);
  if (
    !payload ||
    typeof payload.exp !== "number" ||
    Date.now() / 1000 > payload.exp
  ) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return { token: null, userRole: null };
  }

  const role = extractValidRole(stored);
  if (!role) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return { token: null, userRole: null };
  }

  return { token: stored, userRole: role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ token, userRole }, setAuth] = useState<AuthState>(loadInitialAuthState);

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
      const role = extractValidRole(jwtToken);
      if (!role) throw new Error(UNEXPECTED_ERROR_MESSAGE);

      localStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
      setAuth({ token: jwtToken, userRole: role });
      return role;
    },
    []
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuth({ token: null, userRole: null });
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
