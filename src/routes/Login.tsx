import { Link, Navigate, useSearchParams } from "react-router";
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react";

import { useLoginForm } from "@/hooks/useLoginForm";
import { useAuth } from "@/context/AuthContext";
import { roleToPath } from "@/lib/roleNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/common/Logo";

const Login = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const {
    email,
    password,
    isPasswordVisible,
    errorMessage,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useLoginForm();

  if (isAuthenticated) {
    return <Navigate to={roleToPath(userRole)} replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Brand panel — visible from md up */}
      <aside className="relative hidden md:flex md:w-[45%] flex-col items-center justify-center gap-4 bg-[var(--color-brand-dark)] overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[var(--color-brand-blue-primary)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[var(--color-brand-blue-secondary)]/15 blur-3xl" />

        <Logo />
        <p className="text-[var(--color-brand-light)]/50 text-xs tracking-[0.3em] uppercase">
          Sua loja, sua experiência
        </p>
        <p className="absolute bottom-6 text-[var(--color-brand-light)]/25 text-xs">
          © 2025 AllBuy. Todos os direitos reservados.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12">
        {/* Mobile-only brand */}
        <div className="mb-8 flex flex-col items-center gap-2 md:hidden">
          <div className="text-4xl font-semibold text-[var(--color-brand-dark)]">
            ALL
            <span className="brand-gradient-text font-bold text-5xl">BUY</span>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">
              Bem-vindo de volta
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Entre com sua conta para continuar
            </p>
          </div>

          {justRegistered && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <CheckCircleIcon className="size-4 shrink-0" />
              Conta criada com sucesso! Faça login para continuar.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="text-sm text-red-500 text-center">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Ainda não tem conta?{" "}
              <Link
                to="/cadastro"
                className="font-semibold text-[var(--color-brand-blue-primary)] hover:underline"
              >
                Cadastrar-se
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
