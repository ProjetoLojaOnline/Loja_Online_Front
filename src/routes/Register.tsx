import { Link } from "react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBrandPanel } from "@/components/common/AuthBrandPanel";

const Register = () => {
  const {
    formData,
    passwordMismatch,
    isPasswordVisible,
    errorMessage,
    isSubmitting,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AuthBrandPanel widthClass="md:w-[40%]" />

      {/* Form panel */}
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-8 py-12">
        {/* Mobile-only brand */}
        <div className="mb-6 flex flex-col items-center md:hidden">
          <div className="text-4xl font-semibold text-[var(--color-brand-dark)]">
            ALL
            <span className="brand-gradient-text font-bold text-5xl">BUY</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">
              Criar conta
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Preencha seus dados para começar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Personal data */}
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Dados pessoais
              </legend>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="João da Silva"
                  autoComplete="name"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="00000000000"
                    inputMode="numeric"
                    maxLength={14}
                    required
                    value={formData.cpf}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="text"
                    placeholder="11999990000"
                    inputMode="numeric"
                    maxLength={15}
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@email.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dataNascimento">
                    Nascimento{" "}
                    <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="genero">
                    Gênero{" "}
                    <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-primary)] focus:border-transparent"
                  >
                    <option value="">Selecionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não informar">
                      Prefiro não informar
                    </option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Access credentials */}
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Credenciais de acesso
              </legend>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="loginUsername">Nome de usuário</Label>
                <Input
                  id="loginUsername"
                  name="loginUsername"
                  type="text"
                  placeholder="joaosilva"
                  autoComplete="username"
                  minLength={3}
                  maxLength={50}
                  required
                  value={formData.loginUsername}
                  onChange={handleChange}
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
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      isPasswordVisible ? "Ocultar senha" : "Mostrar senha"
                    }
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

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  aria-invalid={passwordMismatch}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={
                    passwordMismatch
                      ? "border-red-400 focus:ring-red-400"
                      : undefined
                  }
                />
              </div>
            </fieldset>

            {errorMessage && (
              <p role="alert" className="text-sm text-red-500 text-center">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || passwordMismatch}
              className="mt-1 w-full"
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--color-brand-blue-primary)] hover:underline"
              >
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
