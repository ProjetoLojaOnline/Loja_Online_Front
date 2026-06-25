import { Link } from "react-router";

import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/common/Logo";

const Login = () => {
  const {
    email,
    password,
    isPasswordVisible,
    errorMessage,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordVisibilityChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <main className="flex h-145 w-215 flex-col bg-[var(--color-brand-light)] md:flex-row md:items-start">
        <section className="flex h-full w-full items-center justify-center bg-[var(--color-brand-dark)] md:w-[52%]">
          <Logo />
        </section>

        <section className="flex h-full flex-col items-center gap-8 py-16 text-[var(--color-brand-dark)] md:w-[48%]">
          <h1 className="text-2xl font-extrabold font-[var(--font-sans)] tracking-wide">
            LOGIN
          </h1>

          <form
            className="flex w-full flex-col gap-5 px-10"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Checkbox
                  id="show-password"
                  onCheckedChange={handlePasswordVisibilityChange}
                />
                <Label
                  htmlFor="show-password"
                  className="font-normal text-gray-400"
                >
                  Mostrar senha
                </Label>
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="text-center text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>

            <Link
              to="/cadastro"
              className="text-center text-sm font-semibold underline text-[var(--color-brand-dark)]"
            >
              Cadastrar-se
            </Link>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
