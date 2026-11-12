import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SellerForm } from "@/components/sellerForm"; 
import * as sellerApi from "@/lib/sellerApi";
import type { EnderecoDTO } from "@/types/adress"; 

vi.mock("@/lib/sellerApi");

describe("SellerForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar todos os campos obrigatórios", () => {
    render(<SellerForm />);
    expect(screen.getByLabelText("CNPJ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cadastrar Loja" })).toBeInTheDocument();
  });

  it("deve preencher o formulário, enviar e mostrar o botão de loading", async () => {
    const user = userEvent.setup();

    const enderecoMock: EnderecoDTO = {
      logradouro: "Rua Teste", numero: 123, bairro: "Centro",
      complemento: "", referencia: "", cep: "12345-678",
      cidade: "São Paulo", estado: "SP",
    };

    vi.spyOn(sellerApi, "createSeller").mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({
        id: "1", cnpj: "11222333000181", razaoSocial: "Loja Teste",
        nomeFantasia: "Loja", endereco: enderecoMock, status: "PENDENTE",
      }), 50))
    );

    render(<SellerForm />);

    await user.type(screen.getByLabelText("CNPJ"), "11.222.333/0001-81");
    await user.type(screen.getByLabelText("Razão Social"), "Loja Teste");
    await user.type(screen.getByLabelText("Nome Fantasia"), "Loja");
    await user.type(screen.getByLabelText("Logradouro"), "Rua Teste");
    await user.type(screen.getByLabelText("Número"), "123");
    await user.type(screen.getByLabelText("Bairro"), "Centro");
    await user.type(screen.getByLabelText("CEP"), "12345-678");
    await user.type(screen.getByLabelText("Cidade"), "São Paulo");
    await user.type(screen.getByLabelText("Estado (UF)"), "SP");

    const { fireEvent } = await import("@testing-library/react");
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar Loja" }));

    expect(screen.getByRole("button", { name: "Cadastrando..." })).toBeInTheDocument();

    await waitFor(() => {
      expect(sellerApi.createSeller).toHaveBeenCalledWith(
        expect.objectContaining({ cnpj: "11222333000181" })
      );
    });
  });

  it("deve exibir a tela de Status após o sucesso do cadastro", async () => {
    const user = userEvent.setup();
    const enderecoMock: EnderecoDTO = {
      logradouro: "Rua Teste", numero: 123, bairro: "Centro",
      complemento: "", referencia: "", cep: "12345-678",
      cidade: "São Paulo", estado: "SP",
    };

    vi.spyOn(sellerApi, "createSeller").mockResolvedValueOnce({
      id: "1", cnpj: "11222333000181", razaoSocial: "Loja Teste",
      nomeFantasia: "Loja", endereco: enderecoMock, status: "PENDENTE",
    });

    render(<SellerForm />);

    await user.type(screen.getByLabelText("CNPJ"), "11.222.333/0001-81");
    await user.type(screen.getByLabelText("Razão Social"), "Loja Teste");
    await user.type(screen.getByLabelText("Nome Fantasia"), "Loja");
    await user.type(screen.getByLabelText("Logradouro"), "Rua Teste");
    await user.type(screen.getByLabelText("Número"), "123");
    await user.type(screen.getByLabelText("Bairro"), "Centro");
    await user.type(screen.getByLabelText("CEP"), "12345-678");
    await user.type(screen.getByLabelText("Cidade"), "São Paulo");
    await user.type(screen.getByLabelText("Estado (UF)"), "SP");

    await user.click(screen.getByRole("button", { name: "Cadastrar Loja" }));

    await waitFor(() => {
      expect(screen.getByText("Cadastro em Análise")).toBeInTheDocument();
    });
    
    expect(screen.queryByRole("button", { name: "Cadastrar Loja" })).not.toBeInTheDocument();
  });

  it("deve exibir a mensagem de erro se a API falhar (ex: CNPJ duplicado)", async () => {
    const user = userEvent.setup();
    vi.spyOn(sellerApi, "createSeller").mockRejectedValueOnce(
      new Error("Este CNPJ já está cadastrado no sistema.")
    );

    render(<SellerForm />);

    await user.type(screen.getByLabelText("CNPJ"), "11.222.333/0001-81");
    await user.type(screen.getByLabelText("Razão Social"), "Loja Teste");
    await user.type(screen.getByLabelText("Nome Fantasia"), "Loja");
    await user.type(screen.getByLabelText("Logradouro"), "Rua Teste");
    await user.type(screen.getByLabelText("Número"), "123");
    await user.type(screen.getByLabelText("Bairro"), "Centro");
    await user.type(screen.getByLabelText("CEP"), "12345-678");
    await user.type(screen.getByLabelText("Cidade"), "São Paulo");
    await user.type(screen.getByLabelText("Estado (UF)"), "SP");

    await user.click(screen.getByRole("button", { name: "Cadastrar Loja" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Este CNPJ já está cadastrado no sistema.");
    });

    expect(screen.getByRole("button", { name: "Cadastrar Loja" })).toBeInTheDocument();
  });
});