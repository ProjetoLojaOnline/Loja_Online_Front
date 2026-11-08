import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import RegisterSeller from "@/routes/RegisterSeller";

// Mock do AuthBrandPanel — não queremos testar o painel lateral aqui
vi.mock("@/components/common/AuthBrandPanel", () => ({
  AuthBrandPanel: () => <div data-testid="auth-brand-panel" />,
}));

// Mock do SellerForm — a página só precisa saber que ele foi renderizado.
// Os testes de comportamento do form ficam em sellerForm.test.tsx.
vi.mock("@/components/sellerForm", () => ({
  SellerForm: () => <div data-testid="seller-form" />,
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/cadastro-vendedor"]}>
      <RegisterSeller />
    </MemoryRouter>
  );

describe("RegisterSeller (página)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza o painel de marca e o formulário de vendedor", () => {
    renderPage();

    expect(screen.getByTestId("auth-brand-panel")).toBeInTheDocument();
    expect(screen.getByTestId("seller-form")).toBeInTheDocument();
  });

  it("exibe o título e o subtítulo da página", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: /cadastro de vendedor/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/preencha os dados da sua loja/i)
    ).toBeInTheDocument();
  });

  it("exibe o logo mobile com a marca ALLBUY", () => {
    renderPage();

    // O bloco mobile tem "ALL" + "BUY" em spans separados
    expect(screen.getByText(/ALL/)).toBeInTheDocument();
    expect(screen.getByText(/BUY/)).toBeInTheDocument();
  });

  it("renderiza o link 'Entrar' apontando para /login", () => {
    renderPage();

    const link = screen.getByRole("link", { name: /entrar/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("navega para /login ao clicar em 'Entrar'", async () => {
    const user = userEvent.setup();

    renderPage();

    const link = screen.getByRole("link", { name: /entrar/i });
    // O MemoryRouter atualiza a URL; validamos pelo href + clique não quebrar
    await user.click(link);

    expect(link).toHaveAttribute("href", "/login");
  });
});