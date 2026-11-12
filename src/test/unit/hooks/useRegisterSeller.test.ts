import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ChangeEvent, SubmitEvent } from "react";
import { useRegisterSeller } from "@/hooks/useRegisterSeller";
import * as sellerApi from "@/lib/sellerApi";

vi.mock("@/lib/sellerApi");

describe("useRegisterSeller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve atualizar o formData quando o handleChange é chamado", () => {
    const { result } = renderHook(() => useRegisterSeller());

    const fakeEvent = {
      target: { name: "razaoSocial", value: "Minha Loja" },
    } as unknown as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(fakeEvent);
    });

    expect(result.current.formData.razaoSocial).toBe("Minha Loja");
  });

  it("deve limpar a máscara do CNPJ ao dar submit com sucesso", async () => {
    vi.spyOn(sellerApi, "createSeller").mockResolvedValueOnce({
      id: "1",
      cnpj: "11222333000181",
      razaoSocial: "Loja Teste",
      nomeFantasia: "Loja",
      endereco: {
        logradouro: "",
        numero: 0,
        bairro: "",
        complemento: "",
        referencia: "",
        cep: "",
        cidade: "",
        estado: "",
      },
      status: "PENDENTE",
    });

    const { result } = renderHook(() => useRegisterSeller());

    act(() => {
      result.current.handleChange({
        target: { name: "cnpj", value: "11.222.333/0001-81" },
      } as unknown as ChangeEvent<HTMLInputElement>);

      result.current.handleChange({
        target: { name: "razaoSocial", value: "  Loja Teste  " },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    const fakeSubmitEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(fakeSubmitEvent);
    });

    expect(sellerApi.createSeller).toHaveBeenCalledWith(
      expect.objectContaining({
        cnpj: "11222333000181", // sem máscara
        razaoSocial: "Loja Teste", // sem espaços nas pontas
      })
    );

    expect(result.current.result?.status).toBe("PENDENTE");
  });

  // ✅ CORRIGIDO: preenche CNPJ válido antes do submit
  it("deve exibir mensagem de erro se a API retornar CNPJ duplicado", async () => {
    vi.spyOn(sellerApi, "createSeller").mockRejectedValueOnce(
      new Error("Este CNPJ já está cadastrado no sistema.")
    );

    const { result } = renderHook(() => useRegisterSeller());

    act(() => {
      result.current.handleChange({
        target: { name: "cnpj", value: "11.222.333/0001-81" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    const fakeSubmitEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(fakeSubmitEvent);
    });

    expect(sellerApi.createSeller).toHaveBeenCalled();
    expect(result.current.errorMessage).toBe(
      "Este CNPJ já está cadastrado no sistema."
    );
  });

  // ✅ NOVO: cobre o critério "valida CNPJ antes de enviar"
  it("não chama a API quando o CNPJ é inválido", async () => {
    const spy = vi.spyOn(sellerApi, "createSeller");

    const { result } = renderHook(() => useRegisterSeller());

    act(() => {
      result.current.handleChange({
        target: { name: "cnpj", value: "11.111.111/1111-11" }, // inválido (repetidos)
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    const fakeSubmitEvent = {
      preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(fakeSubmitEvent);
    });

    expect(spy).not.toHaveBeenCalled(); // API NÃO foi chamada
    expect(result.current.errorMessage).toMatch(/cnpj inválido/i);
    expect(result.current.isSubmitting).toBe(false); // não travou em loading
    expect(result.current.result).toBeNull();
  });
});