import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";

import Login from "@/routes/Login";
import { AuthProvider, TOKEN_STORAGE_KEY } from "@/context/AuthContext";

const renderLoginPage = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/cadastro" element={<div>Register Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

describe("Login page — rendering", () => {
  it("renders the brand logo", () => {
    renderLoginPage();
    // Both desktop aside panel and mobile fallback render the brand
    expect(screen.getAllByText("ALL").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("BUY").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the login heading", () => {
    renderLoginPage();
    expect(
      screen.getByRole("heading", { name: /bem-vindo de volta/i })
    ).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    renderLoginPage();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderLoginPage();
    expect(
      screen.getByRole("button", { name: /entrar/i })
    ).toBeInTheDocument();
  });

  it("renders the register link", () => {
    renderLoginPage();
    expect(
      screen.getByRole("link", { name: /cadastrar-se/i })
    ).toBeInTheDocument();
  });

  it("renders the password visibility toggle button", () => {
    renderLoginPage();
    expect(
      screen.getByRole("button", { name: "Mostrar senha" })
    ).toBeInTheDocument();
  });
});

describe("Login page — password visibility", () => {
  it("hides password by default", () => {
    renderLoginPage();
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
  });

  it("reveals password when toggle button is clicked", async () => {
    renderLoginPage();
    await userEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "text");
  });

  it("hides password again when toggle button is clicked twice", async () => {
    renderLoginPage();
    await userEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));
    await userEvent.click(screen.getByRole("button", { name: "Ocultar senha" }));
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
  });
});

describe("Login page — form submission", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls signIn with the typed email and password", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("jwt-token", { status: 200 })
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    const requestBody = JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string
    ) as { email: string; senha: string };
    expect(requestBody).toEqual({ email: "user@email.com", senha: "password123" });
  });

  it("redirects to home page after successful sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("jwt-token", { status: 200 })
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("stores JWT token in localStorage after successful sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("jwt-token-value", { status: 200 })
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("jwt-token-value");
    });
  });

  it("displays backend error message on 401", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Credenciais inválidas." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "wrong@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Credenciais inválidas.");
    });
  });

  it("displays fallback error message when backend returns 500 without body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, { status: 500 })
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("disables the submit button while request is in-flight", async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(new Response("jwt-token", { status: 200 })), 300)
        )
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByRole("button", { name: /entrando/i })).toBeDisabled();
  });

  it("re-enables submit button after a failed request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Error" }), { status: 401 })
    );
    renderLoginPage();

    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /entrar/i })
      ).not.toBeDisabled();
    });
  });

  it("clears previous error message on new submission attempt", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "First error" }), { status: 401 })
      )
      .mockResolvedValueOnce(new Response("jwt-token", { status: 200 }));

    renderLoginPage();
    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "password123");

    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
  });

  it("does not submit when email field is empty", async () => {
    renderLoginPage();
    await userEvent.type(screen.getByLabelText("Senha"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not submit when password field is empty", async () => {
    renderLoginPage();
    await userEvent.type(screen.getByLabelText("Email"), "user@email.com");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("Login page — navigation", () => {
  it("register link points to /cadastro", () => {
    renderLoginPage();
    expect(
      screen.getByRole("link", { name: /cadastrar-se/i })
    ).toHaveAttribute("href", "/cadastro");
  });

  it("navigates to register page when link is clicked", async () => {
    renderLoginPage();
    await userEvent.click(screen.getByRole("link", { name: /cadastrar-se/i }));
    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });
});
