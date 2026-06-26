import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";

import { AuthProvider, TOKEN_STORAGE_KEY } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { createTestJwt } from "@/test/helpers/jwt";

const userJwt = createTestJwt("ROLE_USER");
const adminJwt = createTestJwt("ROLE_ADMIN");
const vendedorJwt = createTestJwt("ROLE_VENDEDOR");

const Protected = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const DashboardPage = () => <div>Dashboard</div>;

const renderWithRoute = (
  initialPath: string,
  { token, allowedRoles }: { token?: string; allowedRoles?: string[] } = {}
) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.clear();
  }

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                allowedRoles={
                  allowedRoles as
                    | ("ROLE_ADMIN" | "ROLE_VENDEDOR" | "ROLE_USER")[]
                    | undefined
                }
              >
                <Protected />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

afterEach(() => localStorage.clear());

describe("ProtectedRoute — unauthenticated", () => {
  it("redirects to /login when no token is stored", () => {
    renderWithRoute("/protected");
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});

describe("ProtectedRoute — authenticated, no role restriction", () => {
  it("renders children for authenticated user", () => {
    renderWithRoute("/protected", { token: userJwt });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children for authenticated admin", () => {
    renderWithRoute("/protected", { token: adminJwt });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});

describe("ProtectedRoute — role-based access", () => {
  it("renders children when user's role is in allowedRoles", () => {
    renderWithRoute("/protected", {
      token: adminJwt,
      allowedRoles: ["ROLE_ADMIN"],
    });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /dashboard when user's role is not in allowedRoles", () => {
    renderWithRoute("/protected", {
      token: userJwt,
      allowedRoles: ["ROLE_ADMIN"],
    });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("allows ROLE_ADMIN to access ROLE_ADMIN + ROLE_VENDEDOR route", () => {
    renderWithRoute("/protected", {
      token: adminJwt,
      allowedRoles: ["ROLE_ADMIN", "ROLE_VENDEDOR"],
    });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("allows ROLE_VENDEDOR to access ROLE_ADMIN + ROLE_VENDEDOR route", () => {
    renderWithRoute("/protected", {
      token: vendedorJwt,
      allowedRoles: ["ROLE_ADMIN", "ROLE_VENDEDOR"],
    });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("blocks ROLE_USER from ROLE_ADMIN + ROLE_VENDEDOR route", () => {
    renderWithRoute("/protected", {
      token: userJwt,
      allowedRoles: ["ROLE_ADMIN", "ROLE_VENDEDOR"],
    });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to /login when token has no valid role (defense in depth)", () => {
    // A JWT without a recognized role is rejected by AuthContext — isAuthenticated stays false
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({ sub: "user@email.com", iat: 1000000, exp: 9999999999 })
    );
    const noRoleJwt = `${header}.${payload}.fakesig`;
    renderWithRoute("/protected", {
      token: noRoleJwt,
      allowedRoles: ["ROLE_ADMIN"],
    });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
