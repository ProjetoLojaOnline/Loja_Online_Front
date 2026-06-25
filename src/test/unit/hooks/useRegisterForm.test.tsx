import { renderHook, act } from "@testing-library/react";
import { type ReactNode, type ChangeEvent, type FormEvent } from "react";
import { MemoryRouter } from "react-router";

import { useRegisterForm } from "@/hooks/useRegisterForm";

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={["/cadastro"]}>{children}</MemoryRouter>
);

const makeInputEvent = (name: string, value: string) =>
  ({ target: { name, value } }) as ChangeEvent<HTMLInputElement>;

const makeSubmitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

const fillRequiredFields = (
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
) => {
  handleChange(makeInputEvent("nome", "João da Silva"));
  handleChange(makeInputEvent("email", "joao@email.com"));
  handleChange(makeInputEvent("cpf", "12345678901"));
  handleChange(makeInputEvent("telefone", "11999990000"));
  handleChange(makeInputEvent("loginUsername", "joaosilva"));
  handleChange(makeInputEvent("password", "senha123"));
  handleChange(makeInputEvent("confirmPassword", "senha123"));
};

describe("useRegisterForm — initial state", () => {
  it("starts with all fields empty", () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    expect(result.current.formData.nome).toBe("");
    expect(result.current.formData.email).toBe("");
    expect(result.current.formData.cpf).toBe("");
    expect(result.current.formData.telefone).toBe("");
    expect(result.current.formData.loginUsername).toBe("");
    expect(result.current.formData.password).toBe("");
    expect(result.current.formData.confirmPassword).toBe("");
  });

  it("starts with password hidden", () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    expect(result.current.isPasswordVisible).toBe(false);
  });

  it("starts with no error and not submitting", () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });
});

describe("useRegisterForm — field updates", () => {
  it("updates form fields when handleChange is called", () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      result.current.handleChange(makeInputEvent("nome", "Maria Silva"));
    });
    expect(result.current.formData.nome).toBe("Maria Silva");
  });

  it("toggles password visibility", () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => result.current.togglePasswordVisibility());
    expect(result.current.isPasswordVisible).toBe(true);
    act(() => result.current.togglePasswordVisibility());
    expect(result.current.isPasswordVisible).toBe(false);
  });
});

describe("useRegisterForm — validation", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("sets error when passwords do not match", async () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      fillRequiredFields(result.current.handleChange);
      result.current.handleChange(makeInputEvent("confirmPassword", "outrasenha"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).toBe("As senhas não coincidem.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sets error when CPF has fewer than 11 digits", async () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      fillRequiredFields(result.current.handleChange);
      result.current.handleChange(makeInputEvent("cpf", "1234567"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).toBe(
      "CPF deve ter exatamente 11 dígitos."
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("accepts CPF with formatting characters (dots and dash)", async () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      fillRequiredFields(result.current.handleChange);
      result.current.handleChange(makeInputEvent("cpf", "123.456.789-01"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).not.toBe(
      "CPF deve ter exatamente 11 dígitos."
    );
  });

  it("sets error when phone has fewer than 10 digits", async () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      fillRequiredFields(result.current.handleChange);
      result.current.handleChange(makeInputEvent("telefone", "1199999"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).toBe(
      "Telefone deve ter 10 ou 11 dígitos."
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("useRegisterForm — submission", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("calls fetch with correct request body on valid submission", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => fillRequiredFields(result.current.handleChange));
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    expect(fetch).toHaveBeenCalledOnce();
    const body = JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string
    ) as {
      usuario: { nome: string; email: string; cpf: string; telefone: string };
      login: { login: string; senha: string };
    };
    expect(body.usuario.nome).toBe("João da Silva");
    expect(body.usuario.email).toBe("joao@email.com");
    expect(body.usuario.cpf).toBe("12345678901");
    expect(body.login.login).toBe("joaosilva");
    expect(body.login.senha).toBe("senha123");
  });

  it("sends only digits for CPF and telefone", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      fillRequiredFields(result.current.handleChange);
      result.current.handleChange(makeInputEvent("cpf", "123.456.789-01"));
      result.current.handleChange(makeInputEvent("telefone", "(11) 99999-0000"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });

    const body = JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string
    ) as { usuario: { cpf: string; telefone: string } };
    expect(body.usuario.cpf).toBe("12345678901");
    expect(body.usuario.telefone).toBe("11999990000");
  });

  it("sets errorMessage from backend on 409 Conflict", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ message: "Este e-mail já está cadastrado!" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => fillRequiredFields(result.current.handleChange));
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).toBe("Este e-mail já está cadastrado!");
  });

  it("resets isSubmitting to false after successful submission", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => fillRequiredFields(result.current.handleChange));
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it("resets isSubmitting to false after failed submission", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Error" }), { status: 400 })
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => fillRequiredFields(result.current.handleChange));
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.isSubmitting).toBe(false);
  });
});
