import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VerificationStatusBadge } from "@/components/verificationStatus";

describe("VerificationStatusBadge", () => {
  it("deve renderizar o estado PENDENTE corretamente", () => {
    render(<VerificationStatusBadge status="PENDENTE" />);
    expect(screen.getByText("Cadastro em Análise")).toBeInTheDocument();
    expect(screen.getByText("⏳")).toBeInTheDocument();
  });

  it("deve renderizar o estado APROVADO corretamente", () => {
    render(<VerificationStatusBadge status="APROVADO" />);
    expect(screen.getByText("Loja Aprovada!")).toBeInTheDocument();
    expect(screen.getByText("✅")).toBeInTheDocument();
  });

  it("deve renderizar o estado REJEITADO corretamente", () => {
    render(<VerificationStatusBadge status="REJEITADO" />);
    expect(screen.getByText("Cadastro Rejeitado")).toBeInTheDocument();
    expect(screen.getByText("❌")).toBeInTheDocument();
  });
});