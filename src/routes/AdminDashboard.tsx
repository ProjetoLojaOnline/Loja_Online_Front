import {
  UsersIcon,
  PackageIcon,
  ShieldCheckIcon,
  LogOutIcon,
} from "lucide-react";
import { Link } from "react-router";

import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

const FEATURE_CARDS = [
  {
    icon: UsersIcon,
    title: "Usuários",
    description: "Visualize e gerencie todos os usuários cadastrados.",
    available: false,
  },
  {
    icon: PackageIcon,
    title: "Produtos",
    description: "Administre o catálogo completo de produtos.",
    available: false,
  },
  {
    icon: ShieldCheckIcon,
    title: "Permissões",
    description: "Controle os papéis e permissões dos usuários.",
    available: false,
  },
];

const AdminDashboard = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <Link to="/admin">
          <Logo compact />
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-[var(--color-brand-blue-primary)] sm:inline uppercase tracking-widest">
            Admin
          </span>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOutIcon className="size-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">
              Painel administrativo
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Controle total da plataforma AllBuy
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURE_CARDS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-5 opacity-60"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-blue-primary)]/10">
                  <Icon className="size-5 text-[var(--color-brand-blue-primary)]" />
                </div>
                <h2 className="font-semibold text-[var(--color-brand-dark)]">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
                <span className="mt-3 inline-block text-xs font-medium text-gray-400">
                  Em breve
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
