import { UsersIcon, PackageIcon, ShieldCheckIcon } from "lucide-react";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";

const FEATURE_CARDS = [
  {
    icon: UsersIcon,
    title: "Usuários",
    description: "Visualize e gerencie todos os usuários cadastrados.",
  },
  {
    icon: PackageIcon,
    title: "Produtos",
    description: "Administre o catálogo completo de produtos.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Permissões",
    description: "Controle os papéis e permissões dos usuários.",
  },
];

const AdminDashboard = () => (
  <DashboardLayout
    roleBadge="Admin"
    roleBadgeColorClass="text-[var(--color-brand-blue-primary)]"
    headerPath="/admin"
    title="Painel administrativo"
    subtitle="Controle total da plataforma AllBuy"
  >
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
  </DashboardLayout>
);

export default AdminDashboard;
