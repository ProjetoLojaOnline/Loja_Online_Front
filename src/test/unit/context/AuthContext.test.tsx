import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactNode } from "react";
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
  const [signInError, setSignInError] = useState<string | null>(null);
  return (
    <>
      <button
        onClick={() => {
          signIn(email, password).catch((err: Error) => {
            setSignInError(err.message);
          });
        }}
      >
        Sign In
      </button>
      <span data-testid="auth">{isAuthenticated ? "yes" : "no"}</span>
      <span data-testid="role">{userRole ?? "none"}</span>
      {signInError && <span data-testid="error">{signInError}</span>}
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

const TokenDisplay = () => {
  const { token } = useAuth();
  return <span data-testid="token">{token ?? "null"}</span>;
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

  it("clears token without exp field on initialization", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: "user@email.com", role: "ROLE_USER", iat: 1000000 }));
    const noExpJwt = `${header}.${payload}.fakesig`;
    localStorage.setItem(TOKEN_STORAGE_KEY, noExpJwt);
    renderWithAuth(<SignInButton />);
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("clears token with unknown role on initialization", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: "user@email.com", role: "ROLE_SUPERADMIN", iat: 1000000, exp: 9999999999 }));
    const unknownRoleJwt = `${header}.${payload}.fakesig`;
    localStorage.setItem(TOKEN_STORAGE_KEY, unknownRoleJwt);
    renderWithAuth(<SignInButton />);
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("token field holds the stored JWT value after mount", () => {
    renderWithAuth(<TokenDisplay />, { initialToken: userJwt });
    expect(screen.getByTestId("token")).toHaveTextContent(userJwt);
  });

  it("token field is null when no token is stored", () => {
    renderWithAuth(<TokenDisplay />);
    expect(screen.getByTestId("token")).toHaveTextContent("null");
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

  it("re-throws backend error message when sign in fails with 401", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Credenciais inválidas." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("error")).toHaveTextContent("Credenciais inválidas.")
    );
  });

  it("throws when backend 200 response is not a valid JWT", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("not-a-jwt", { status: 200 })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("auth")).toHaveTextContent("no")
    );
    await waitFor(() =>
      expect(screen.getByTestId("error")).toBeInTheDocument()
    );
  });

  it("throws when backend 200 JWT has no recognized role", async () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: "user@email.com", role: "ROLE_SUPERADMIN", iat: 1000000, exp: 9999999999 }));
    const unknownRoleJwt = `${header}.${payload}.fakesig`;
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(unknownRoleJwt, { status: 200 })
    );
    renderWithAuth(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() =>
      expect(screen.getByTestId("auth")).toHaveTextContent("no")
    );
    await waitFor(() =>
      expect(screen.getByTestId("error")).toBeInTheDocument()
    );
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
