import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const TOKEN_STORAGE_KEY = "allbuy_token";

const UNEXPECTED_ERROR_MESSAGE = "Unexpected error. Please try again.";

async function parseBackendError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? UNEXPECTED_ERROR_MESSAGE;
  } catch {
    return UNEXPECTED_ERROR_MESSAGE;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_STORAGE_KEY)
  );

  const signIn = useCallback(async (email: string, password: string) => {
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
    localStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
    setToken(jwtToken);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, signIn, signOut }}
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
