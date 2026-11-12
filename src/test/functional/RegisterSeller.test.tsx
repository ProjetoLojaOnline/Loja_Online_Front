import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import RegisterSeller from "@/routes/RegisterSeller";

vi.mock("@/components/common/AuthBrandPanel", () => ({
  AuthBrandPanel: () => <div data-testid="auth-brand-panel" />,
}));

vi.mock("@/components/sellerForm", () => ({
  SellerForm: () => <div data-testid="seller-form" />,
}));

vi.mock("@/components/common/ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

    expect(screen.getByText(/ALL/)).toBeInTheDocument();
    expect(screen.getByText(/BUY/)).toBeInTheDocument();
  });

});