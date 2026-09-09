import { useRegisterForm } from '@/hooks/useRegisterForm';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const fillRequiredFormFields = (
  result: ReturnType<
    typeof renderHook<ReturnType<typeof useRegisterForm>, unknown>
  >['result']
) => {
  act(() => {
    result.current.form.setValue('nome', 'João da Silva');
    result.current.form.setValue('email', 'joao@email.com');
    result.current.form.setValue('cpf', '123.456.789-01');
    result.current.form.setValue('telefone', '(11) 99999-0000');
    result.current.form.setValue('endereco', 'Rua A, 123');
    result.current.form.setValue('loginUsername', 'joaosilva');
    result.current.form.setValue('password', 'senha123');
    result.current.form.setValue('confirmPassword', 'senha123');
  });
};

describe('useRegisterForm hook — initial state', () => {
  it('starts with all fields empty', () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    const values = result.current.form.getValues();
    expect(values.nome).toBe('');
    expect(values.email).toBe('');
    expect(values.cpf).toBe('');
    expect(values.telefone).toBe('');
    expect(values.endereco).toBe('');
    expect(values.loginUsername).toBe('');
    expect(values.password).toBe('');
    expect(values.confirmPassword).toBe('');
  });

  it('starts with password hidden', () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    expect(result.current.isPasswordVisible).toBe(false);
  });

  it('starts with no generic error and not submitting', () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    expect(result.current.genericError).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });
});

describe('useRegisterForm hook — field updates and handlers', () => {
  it('updates form fields when setValue is called', () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      result.current.form.setValue('nome', 'Maria Silva');
    });
    expect(result.current.form.getValues().nome).toBe('Maria Silva');
  });

  it('toggles password visibility', () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => result.current.togglePasswordVisibility());
    expect(result.current.isPasswordVisible).toBe(true);
    act(() => result.current.togglePasswordVisibility());
    expect(result.current.isPasswordVisible).toBe(false);
  });

  it('formats CPF correctly via handleCpfChange', () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      const event = {
        target: { value: '12345678901' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleCpfChange(event);
    });
    expect(result.current.form.getValues().cpf).toBe('123.456.789-01');
  });

  it('formats phone correctly via handlePhoneChange', () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    act(() => {
      const event = {
        target: { value: '11999990000' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handlePhoneChange(event);
    });
    expect(result.current.form.getValues().telefone).toBe('(11) 99999-0000');
  });
});

describe('useRegisterForm hook — submission', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('calls fetch with correct request body on valid submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    fillRequiredFormFields(result);

    await act(async () => {
      await result.current.onSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(fetch).toHaveBeenCalledOnce();
    const body = JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string
    ) as {
      usuario: {
        nome: string;
        email: string;
        cpf: string;
        telefone: string;
        enderecos: { logradouro: string }[];
      };
      login: { login: string; senha: string };
    };
    expect(body.usuario.nome).toBe('João da Silva');
    expect(body.usuario.email).toBe('joao@email.com');
    expect(body.usuario.cpf).toBe('12345678901');
    expect(body.usuario.telefone).toBe('11999990000');
    expect(body.usuario.enderecos[0].logradouro).toBe('Rua A, 123');
    expect(body.login.login).toBe('joaosilva');
    expect(body.login.senha).toBe('senha123');
  });

  it('maps 409 Conflict message to specific field instead of genericError', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ message: 'Este e-mail já está cadastrado!' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    expect(result.current.form.formState.errors).toBeDefined();

    fillRequiredFormFields(result);

    await act(async () => {
      await result.current.onSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.genericError).toBeNull();

    // Aguardar a propagação assíncrona do erro mapeado via setError
    await waitFor(() => {
      expect(result.current.form.formState.errors.email?.message).toBe(
        'Este e-mail já está cadastrado!'
      );
    });
  });

  it('resets isSubmitting to false after successful submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1 }), { status: 201 })
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    fillRequiredFormFields(result);

    await act(async () => {
      await result.current.onSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('resets isSubmitting to false after failed submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Error' }), { status: 400 })
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });
    fillRequiredFormFields(result);

    await act(async () => {
      await result.current.onSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.isSubmitting).toBe(false);
  });
});
