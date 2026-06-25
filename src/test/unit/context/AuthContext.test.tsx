import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router";

import { AuthProvider, TOKEN_STORAGE_KEY, useAuth } from "@/context/AuthContext";
import { createTestJwt, createExpiredTestJwt } from "@/test/helpers/jwt";

const userJwt = createTestJwt("ROLE_USER");
const adminJwt = createTestJwt("ROLE_ADMIN");
const vendedorJwt = createTestJwt("ROLE_VENDEDOR");

const SignInButton = ({
  email = "user@email.com",
  password = "pass123",
}: {
  email?: string;
  password?: string;
}) => {
  const { signIn, isAuthenticated, userRole } = useAuth();
  return (
    <>
      <button
        onClick={() => {
          signIn(email, password).catch(() => undefined);
        }}
      >
        Sign In
      </button>
      <span data-testid="auth">{isAuthenticated ? "yes" : "no"}</span>
      <span data-testid="role">{userRole ?? "none"}</span>
    </>
  );
};

const SignOutButton = () => {
  const { signOut, isAuthenticated } = useAuth();
  return (
    <>
      <button onClick={signOut}>Sign Out</button>
      <span data-testid="auth">{isAuthenticated ? "yes" : "no"}</span>
    </>
  );
};

const renderWithAuth = (
  ui: ReactNode,
  { initialToken }: { initialToken?: string } = {}
) => {
  if (initialToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, initialToken);
  }
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
};

describe("AuthContext — initial state", () => {
  beforeEach(() => localStorage.clear());

  it("starts unauthenticated when no token is stored", () => {
    renderWithAuth(<SignInButton />);
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
  });

  it("starts authenticated when a valid token is in localStorage", () => {
    renderWithAuth(<SignInButton />, { initialToken: userJwt });
    expect(screen.getByTestId("auth")).toHaveTextContent("yes");
  });

  it("clears expired token on initialization", () => {
    const expiredJwt = createExpiredTestJwt("ROLE_USER");
    localStorage.setItem(TOKEN_STORAGE_KEY, expiredJwt);
    renderWithAuth(<SignInButton />);
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("restores ROLE_USER from stored token", () => {
    renderWithAuth(<SignInButton />, { initialToken: userJwt });
    expect(screen.getByTestId("role")).toHaveTextContent("ROLE_USER");
  });

  it("restores ROLE_ADMIN from stored token", () => {
    renderWithAuth(<SignInButton />, { initialToken: adminJwt });
    expect(screen.getByTestId("role")).toHaveTextContent("ROLE_ADMIN");
  });
});

describe("AuthContext — signIn", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  afterEach(() => vi.unstubAllGlobals());

  it("sets isAuthenticated to true after successful sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(userJwt, { status: 200 })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("auth")).toHaveTextContent("yes")
    );
  });

  it("stores JWT token in localStorage after successful sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(userJwt, { status: 200 })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(userJwt)
    );
  });

  it("sets userRole to ROLE_USER after sign in with user JWT", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(userJwt, { status: 200 })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("role")).toHaveTextContent("ROLE_USER")
    );
  });

  it("sets userRole to ROLE_ADMIN after sign in with admin JWT", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(adminJwt, { status: 200 })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("role")).toHaveTextContent("ROLE_ADMIN")
    );
  });

  it("sets userRole to ROLE_VENDEDOR after sign in with vendedor JWT", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(vendedorJwt, { status: 200 })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("role")).toHaveTextContent("ROLE_VENDEDOR")
    );
  });

  it("does not update token state on failed sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Bad credentials" }), {
        status: 401,
      })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("auth")).toHaveTextContent("no")
    );
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("sends email and senha in request body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(userJwt, { status: 200 })
    );
    renderWithAuth(<SignInButton email="test@test.com" password="secret" />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("auth")).toHaveTextContent("yes")
    );
    const requestBody = JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string
    ) as { email: string; senha: string };
    expect(requestBody).toEqual({ email: "test@test.com", senha: "secret" });
  });
});

describe("AuthContext — signOut", () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_STORAGE_KEY, userJwt);
  });

  afterEach(() => localStorage.clear());

  it("sets isAuthenticated to false after sign out", async () => {
    renderWithAuth(<SignOutButton />);
    expect(screen.getByTestId("auth")).toHaveTextContent("yes");
    await userEvent.click(screen.getByRole("button", { name: "Sign Out" }));
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
  });

  it("removes token from localStorage after sign out", async () => {
    renderWithAuth(<SignOutButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign Out" }));
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});

describe("AuthContext — useAuth guard", () => {
  it("throws when used outside AuthProvider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const BadComponent = () => {
      useAuth();
      return null;
    };
    expect(() => render(<BadComponent />)).toThrow(
      "useAuth must be used within an <AuthProvider>"
    );
    consoleError.mockRestore();
  });
});
