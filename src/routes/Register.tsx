import { Clock, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link } from 'react-router';

import { AuthBrandPanel } from '@/components/common/AuthBrandPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterForm } from '@/hooks/useRegisterForm';

const Register = () => {
  const {
    form,
    isSubmitting,
    genericError,
    cpfStatus,
    isPasswordVisible,
    togglePasswordVisibility,
    onSubmit,
    handleCpfChange,
    handlePhoneChange,
  } = useRegisterForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AuthBrandPanel widthClass="md:w-[40%]" />

      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-8 py-12">
        <div className="mb-6 flex flex-col items-center md:hidden">
          <div className="text-4xl font-semibold text-brand-dark">
            ALL
            <span className="brand-gradient-text font-bold text-5xl">BUY</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brand-dark">Criar conta</h1>
            <p className="mt-1 text-sm text-gray-500">
              Preencha seus dados para começar
            </p>
          </div>

          {genericError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm"
            >
              {genericError}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* DADOS PESSOAIS */}
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Dados pessoais
              </legend>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="nome">Nome completo</Label>
                  {errors.nome && (
                    <span className="text-[11px] font-medium text-red-500 leading-none">
                      {errors.nome.message}
                    </span>
                  )}
                </div>
                <Input
                  id="nome"
                  type="text"
                  placeholder="João da Silva"
                  autoComplete="name"
                  {...register('nome')}
                  className={errors.nome ? 'border-red-500' : ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cpf">CPF</Label>
                    {errors.cpf && (
                      <span className="text-[10px] font-medium text-red-500 leading-none">
                        {errors.cpf.message}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="00000000000"
                      inputMode="numeric"
                      maxLength={14}
                      {...register('cpf')}
                      onChange={handleCpfChange}
                      className={errors.cpf ? 'border-red-500 pr-16' : 'pr-16'}
                    />
                    {cpfStatus === 'PENDENTE' && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> A3
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="telefone">Telefone</Label>
                    {errors.telefone && (
                      <span className="text-[10px] font-medium text-red-500 leading-none">
                        {errors.telefone.message}
                      </span>
                    )}
                  </div>
                  <Input
                    id="telefone"
                    type="text"
                    placeholder="11999990000"
                    inputMode="numeric"
                    maxLength={15}
                    {...register('telefone')}
                    onChange={handlePhoneChange}
                    className={errors.telefone ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  {errors.email && (
                    <span className="text-[11px] font-medium text-red-500 leading-none">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@email.com"
                  autoComplete="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  {errors.endereco && (
                    <span className="text-[11px] font-medium text-red-500 leading-none">
                      {errors.endereco.message}
                    </span>
                  )}
                </div>
                <Input
                  id="endereco"
                  type="text"
                  placeholder="Rua, Número, Bairro"
                  {...register('endereco')}
                  className={errors.endereco ? 'border-red-500' : ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dataNascimento">
                      Nascimento{' '}
                      <span className="text-gray-400 font-normal">
                        (opcional)
                      </span>
                    </Label>
                    {errors.dataNascimento && (
                      <span className="text-[11px] font-medium text-red-500 leading-none">
                        {errors.dataNascimento.message}
                      </span>
                    )}
                  </div>
                  <Input
                    id="dataNascimento"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    {...register('dataNascimento')}
                    className={errors.dataNascimento ? 'border-red-500' : ''}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="genero">
                    Gênero{' '}
                    <span className="text-gray-400 font-normal">
                      (opcional)
                    </span>
                  </Label>
                  <select
                    id="genero"
                    {...register('genero')}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  >
                    <option value="">Selecionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* CREDENCIAIS DE ACESSO */}
            <fieldset className="flex flex-col gap-4 mt-2">
              <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Credenciais de acesso
              </legend>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="loginUsername">Nome de usuário</Label>
                  {errors.loginUsername && (
                    <span className="text-[11px] font-medium text-red-500 leading-none">
                      {errors.loginUsername.message}
                    </span>
                  )}
                </div>
                <Input
                  id="loginUsername"
                  type="text"
                  placeholder="joaosilva"
                  autoComplete="username"
                  minLength={3}
                  maxLength={50}
                  {...register('loginUsername')}
                  className={errors.loginUsername ? 'border-red-500' : ''}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  {errors.password && (
                    <span className="text-[11px] font-medium text-red-500 leading-none">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={6}
                    {...register('password')}
                    className={
                      errors.password ? 'border-red-500 pr-10' : 'pr-10'
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  {errors.confirmPassword && (
                    <span className="text-[11px] font-medium text-red-500 leading-none">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <Input
                  id="confirmPassword"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  {...register('confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
              </div>
            </fieldset>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:underline"
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
