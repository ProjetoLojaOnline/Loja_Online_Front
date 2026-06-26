import { type ReactNode } from "react";
import { Link } from "react-router";
import { LogOutIcon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  roleBadge: string;
  roleBadgeColorClass?: string;
  headerPath: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

const DashboardLayout = ({
  roleBadge,
  roleBadgeColorClass = "text-gray-400",
  headerPath,
  title,
  subtitle,
  children,
}: DashboardLayoutProps) => {
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <Link to={headerPath}>
          <Logo compact />
        </Link>

        <div className="flex items-center gap-3">
          <span
            className={`hidden text-xs font-medium sm:inline uppercase tracking-widest ${roleBadgeColorClass}`}
          >
            {roleBadge}
          </span>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOutIcon className="size-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-brand-dark)]">
              {title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};

export { DashboardLayout };
