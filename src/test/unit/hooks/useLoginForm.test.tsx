import { renderHook, act } from "@testing-library/react";
import { type ReactNode, type ChangeEvent, type FormEvent } from "react";
import { MemoryRouter } from "react-router";

import { AuthProvider, TOKEN_STORAGE_KEY } from "@/context/AuthContext";
import { useLoginForm } from "@/hooks/useLoginForm";

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={["/login"]}>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

const makeEmailEvent = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

const makePasswordEvent = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

const makeSubmitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

describe("useLoginForm — initial state", () => {
  it("starts with empty email and password", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
  });

  it("starts with password hidden", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.isPasswordVisible).toBe(false);
  });

  it("starts with no error message", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.errorMessage).toBeNull();
  });

  it("starts not submitting", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    expect(result.current.isSubmitting).toBe(false);
  });
});

describe("useLoginForm — field updates", () => {
  it("updates email when handleEmailChange is called", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handleEmailChange(makeEmailEvent("user@email.com"));
    });
    expect(result.current.email).toBe("user@email.com");
  });

  it("updates password when handlePasswordChange is called", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handlePasswordChange(makePasswordEvent("secret123"));
    });
    expect(result.current.password).toBe("secret123");
  });

  it("reveals password when togglePasswordVisibility is called", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.togglePasswordVisibility();
    });
    expect(result.current.isPasswordVisible).toBe(true);
  });

  it("hides password again when togglePasswordVisibility is called twice", () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.togglePasswordVisibility();
      result.current.togglePasswordVisibility();
    });
    expect(result.current.isPasswordVisible).toBe(false);
  });
});

describe("useLoginForm — form submission", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not call signIn when email is empty", async () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handlePasswordChange(makePasswordEvent("password123"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not call signIn when password is empty", async () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handleEmailChange(makeEmailEvent("user@email.com"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("stores token in localStorage after successful sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("jwt-token-value", { status: 200 })
    );
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handleEmailChange(makeEmailEvent("user@email.com"));
      result.current.handlePasswordChange(makePasswordEvent("password123"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("jwt-token-value");
  });

  it("clears error message on successful sign in", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Bad credentials" }), {
          status: 401,
        })
      )
      .mockResolvedValueOnce(new Response("jwt-token", { status: 200 }));

    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handleEmailChange(makeEmailEvent("user@email.com"));
      result.current.handlePasswordChange(makePasswordEvent("password123"));
    });

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).toBe("Bad credentials");

    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).toBeNull();
  });

  it("sets errorMessage with backend message on failed sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    );
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handleEmailChange(makeEmailEvent("user@email.com"));
      result.current.handlePasswordChange(makePasswordEvent("wrong"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.errorMessage).toBe("Invalid credentials");
  });

  it("resets isSubmitting to false after failed sign in", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Error" }), { status: 401 })
    );
    const { result } = renderHook(() => useLoginForm(), { wrapper });
    act(() => {
      result.current.handleEmailChange(makeEmailEvent("user@email.com"));
      result.current.handlePasswordChange(makePasswordEvent("wrong"));
    });
    await act(async () => {
      await result.current.handleSubmit(makeSubmitEvent());
    });
    expect(result.current.isSubmitting).toBe(false);
  });
});
