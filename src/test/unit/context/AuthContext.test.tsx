import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthProvider, useAuth, TOKEN_STORAGE_KEY } from "@/context/AuthContext";

const SignInButton = () => {
  const { signIn } = useAuth();
  return (
    <button onClick={() => signIn("user@email.com", "password123").catch(() => undefined)}>
      Sign In
    </button>
  );
};

const SignOutButton = () => {
  const { signOut } = useAuth();
  return <button onClick={signOut}>Sign Out</button>;
};

const AuthStatus = () => {
  const { isAuthenticated, token } = useAuth();
  return (
    <div>
      <span data-testid="status">{isAuthenticated ? "authenticated" : "unauthenticated"}</span>
      <span data-testid="token">{token ?? "none"}</span>
    </div>
  );
};

const renderWithAuthProvider = (ui: React.ReactNode) =>
  render(<AuthProvider>{ui}</AuthProvider>);

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("initial state", () => {
    it("starts unauthenticated when localStorage is empty", () => {
      renderWithAuthProvider(<AuthStatus />);
      expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated");
      expect(screen.getByTestId("token")).toHaveTextContent("none");
    });

    it("restores token from localStorage on mount", () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "stored-token");
      renderWithAuthProvider(<AuthStatus />);
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
      expect(screen.getByTestId("token")).toHaveTextContent("stored-token");
    });
  });

  describe("signIn", () => {
    it("calls the correct API endpoint", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("jwt-token", { status: 200 })
      );
      renderWithAuthProvider(<SignInButton />);
      await userEvent.click(screen.getByRole("button"));
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/login/authenticate"),
        expect.objectContaining({ method: "POST" })
      );
    });

    it("sends email and password in request body with correct field names", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("jwt-token", { status: 200 })
      );
      renderWithAuthProvider(<SignInButton />);
      await userEvent.click(screen.getByRole("button"));
      const callBody = JSON.parse(
        (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string
      ) as { email: string; senha: string };
      expect(callBody).toEqual({ email: "user@email.com", senha: "password123" });
    });

    it("sets authentication state to true after successful sign in", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("jwt-token", { status: 200 })
      );
      renderWithAuthProvider(
        <>
          <SignInButton />
          <AuthStatus />
        </>
      );
      await userEvent.click(screen.getByRole("button"));
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
    });

    it("stores token in localStorage after successful sign in", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response("jwt-token", { status: 200 })
      );
      renderWithAuthProvider(<SignInButton />);
      await userEvent.click(screen.getByRole("button"));
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("jwt-token");
    });

    it("throws error with message from backend on failure", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      );
      const ErrorCapture = () => {
        const { signIn } = useAuth();
        const [error, setError] = useState<string | null>(null);
        return (
          <>
            <button
              onClick={() =>
                signIn("user@email.com", "wrong").catch((err: Error) =>
                  setError(err.message)
                )
              }
            >
              Sign In
            </button>
            {error && <span data-testid="error">{error}</span>}
          </>
        );
      };
      renderWithAuthProvider(<ErrorCapture />);
      await userEvent.click(screen.getByRole("button"));
      expect(await screen.findByTestId("error")).toHaveTextContent(
        "Invalid credentials"
      );
    });

    it("does not update token state on failed sign in", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
      );
      renderWithAuthProvider(
        <>
          <SignInButton />
          <AuthStatus />
        </>
      );
      await userEvent.click(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated");
      });
    });
  });

  describe("signOut", () => {
    it("clears token from state after sign out", async () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "existing-token");
      renderWithAuthProvider(
        <>
          <SignOutButton />
          <AuthStatus />
        </>
      );
      await userEvent.click(screen.getByRole("button"));
      expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated");
      expect(screen.getByTestId("token")).toHaveTextContent("none");
    });

    it("removes token from localStorage after sign out", async () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "existing-token");
      renderWithAuthProvider(<SignOutButton />);
      await userEvent.click(screen.getByRole("button"));
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    });
  });

  describe("useAuth guard", () => {
    it("throws when used outside AuthProvider", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);
      const ComponentWithoutProvider = () => {
        useAuth();
        return null;
      };
      expect(() => render(<ComponentWithoutProvider />)).toThrow(
        "useAuth must be used within an <AuthProvider>"
      );
      consoleError.mockRestore();
    });
  });
});

