interface LogoProps {
  compact?: boolean;
}

const Logo = ({ compact = false }: LogoProps) => {
  if (compact) {
    return (
      <div className="text-xl font-semibold text-[var(--color-brand-dark)]">
        ALL
        <span className="brand-gradient-text font-bold text-2xl">BUY</span>
      </div>
    );
  }

  return (
    <div className="w-full text-center text-5xl font-semibold text-[var(--color-brand-light)]">
      ALL
      <span className="brand-gradient-text font-bold text-7xl">BUY</span>
      <span className="text-sm">&copy;</span>
    </div>
  );
};

export { Logo };
