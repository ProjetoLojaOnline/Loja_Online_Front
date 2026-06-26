import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";

import Register from "@/routes/Register";
import { AuthProvider, TOKEN_STORAGE_KEY } from "@/context/AuthContext";
import { PublicOnlyRoute } from "@/components/common/PublicOnlyRoute";
import { createTestJwt } from "@/test/helpers/jwt";

const renderRegisterPage = (initialToken?: string, initialPath = "/cadastro") => {
  if (initialToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, initialToken);
  }
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/cadastro"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>User Dashboard</div>} />
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
          <Route path="/vendedor" element={<div>Seller Dashboard</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

const fillForm = async (overrides: Record<string, string> = {}) => {
  const defaults: Record<string, string> = {
    "Nome completo": "João da Silva",
    Email: "joao@email.com",
    CPF: "12345678901",
    Telefone: "11999990000",
    "Nome de usuário": "joaosilva",
    Senha: "senha123",
    "Confirmar senha": "senha123",
    ...overrides,
  };

  for (const [label, value] of Object.entries(defaults)) {
    const field = screen.getByLabelText(new RegExp(`^${label}`, "i"));
    await userEvent.clear(field);
    await userEvent.type(field, value);
  }
};

afterEach(() => localStorage.clear());

describe("Register page — rendering", () => {
  it("renders the page heading", () => {
    renderRegisterPage();
    expect(
      screen.getByRole("heading", { name: /criar conta/i })
    ).toBeInTheDocument();
  });

  it("renders all required input fields", () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^cpf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  it("renders optional fields", () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gênero/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderRegisterPage();
    expect(
      screen.getByRole("button", { name: /criar conta/i })
    ).toBeInTheDocument();
  });

  it("renders the login link", () => {
    renderRegisterPage();
    expect(
      screen.getByRole("link", { name: /entrar/i })
    ).toBeInTheDocument();
  });

  it("renders the password visibility toggle", () => {
    renderRegisterPage();
    expect(
      screen.getByRole("button", { name: "Mostrar senha" })
    ).toBeInTheDocument();
  });
});

describe("Register page — auth redirect", () => {
  it("redirects to /dashboard when already authenticated as ROLE_USER", () => {
    renderRegisterPage(createTestJwt("ROLE_USER"));
    expect(screen.getByText("User Dashboard")).toBeInTheDocument();
  });

  it("redirects to /admin when already authenticated as ROLE_ADMIN", () => {
    renderRegisterPage(createTestJwt("ROLE_ADMIN"));
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });
});

describe("Register page — password visibility", () => {
  it("hides password and confirm password by default", () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/^senha/i)).toHaveAttribute(
      "type",
      "password"
    );
    expect(screen.getByLabelText(/confirmar senha/i)).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("reveals both password fields when toggle is clicked", async () => {
    renderRegisterPage();
    await userEvent.click(
      screen.getByRole("button", { name: "Mostrar senha" })
    );
    expect(screen.getByLabelText(/^senha/i)).toHaveAttribute("type", "text");
    expect(screen.getByLabelText(/confirmar senha/i)).toHaveAttribute(
      "type",
      "text"
    );
  });
});

describe("Register page — password mismatch", () => {
  it("disables submit button when passwords do not match", async () => {
    renderRegisterPage();
    await fillForm({ "Confirmar senha": "outrasenha" });
    expect(
      screen.getByRole("button", { name: /criar conta/i })
    ).toBeDisabled();
  });

  it("marks confirmPassword field as invalid when passwords do not match", async () => {
    renderRegisterPage();
    await fillForm({ "Confirmar senha": "outrasenha" });
    expect(screen.getByLabelText(/confirmar senha/i)).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("does not call fetch when passwords do not match", async () => {
    vi.stubGlobal("fetch", vi.fn());
    renderRegisterPage();
    await fillForm({ "Confirmar senha": "outrasenha" });
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(fetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("enables submit button when passwords match", async () => {
    renderRegisterPage();
    await fillForm();
    expect(
      screen.getByRole("button", { name: /criar conta/i })
    ).not.toBeDisabled();
  });
});

describe("Register page — form submission", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  afterEach(() => vi.unstubAllGlobals());

  it("navigates to /login after successful registration", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    renderRegisterPage();
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("sends POST to /api/usuarios with correct structure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    renderRegisterPage();
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(url as string).toContain("/api/usuarios");

    const body = JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string
    ) as {
      usuario: { nome: string; email: string };
      login: { login: string };
    };
    expect(body.usuario.nome).toBe("João da Silva");
    expect(body.usuario.email).toBe("joao@email.com");
    expect(body.login.login).toBe("joaosilva");
  });

  it("shows backend error on 409 Conflict", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ message: "Este e-mail já está cadastrado!" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    );
    renderRegisterPage();
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Este e-mail já está cadastrado!"
      );
    });
  });

  it("disables submit button while request is in-flight", async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve(new Response(JSON.stringify({ id: 1 }), { status: 201 })),
            300
          )
        )
    );
    renderRegisterPage();
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(
      screen.getByRole("button", { name: /criando conta/i })
    ).toBeDisabled();
  });
});

describe("Register page — navigation", () => {
  it("login link points to /login", () => {
    renderRegisterPage();
    expect(screen.getByRole("link", { name: /entrar/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("navigates to login page when link is clicked", async () => {
    renderRegisterPage();
    await userEvent.click(screen.getByRole("link", { name: /entrar/i }));
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
