import { Link } from "react-router";

import { AuthBrandPanel } from "@/components/common/AuthBrandPanel";
import { SellerForm } from "@/components/sellerForm";

const RegisterSeller = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AuthBrandPanel widthClass="md:w-[40%]" />

      <main className="flex flex-1 flex-col items-center justify-start overflow-y-auto bg-white px-8 py-12">

        <div className="mb-6 flex flex-col items-center md:hidden">
          <div className="text-4xl font-semibold text-[var(--color-brand-dark)]">
            ALL
            <span className="brand-gradient-text font-bold text-5xl">BUY</span>
          </div>
        </div>

        <div className="w-full max-w-md pb-12">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">
              Cadastro de vendedor
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Preencha os dados da sua loja para começar a vender
            </p>
          </div>

          <SellerForm />

          <p className="mt-4 text-center text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--color-brand-blue-primary)] hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterSeller;