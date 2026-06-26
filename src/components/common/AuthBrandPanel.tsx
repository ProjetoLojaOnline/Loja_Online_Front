import { Logo } from "@/components/common/Logo";

interface AuthBrandPanelProps {
  widthClass?: string;
}

const AuthBrandPanel = ({ widthClass = "md:w-[45%]" }: AuthBrandPanelProps) => (
  <aside
    className={`relative hidden md:flex ${widthClass} flex-col items-center justify-center gap-4 bg-[var(--color-brand-dark)] overflow-hidden`}
  >
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
);

export { AuthBrandPanel };
