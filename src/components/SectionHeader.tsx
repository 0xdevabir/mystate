interface SectionLabelProps {
  children: React.ReactNode;
  dark?: boolean;
}

export function SectionLabel({ children, dark }: SectionLabelProps) {
  return (
    <p
      className={`mb-4 text-[11px] font-bold uppercase tracking-widest ${
        dark ? "text-accent" : "text-accent"
      }`}
    >
      {children}
    </p>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

export function SectionTitle({ children, dark, className = "" }: SectionTitleProps) {
  return (
    <h2
      className={`text-[36px] font-black leading-none sm:text-[48px] md:text-[56px] ${
        dark ? "text-bg" : "text-dark"
      } ${className}`}
    >
      {children}
    </h2>
  );
}
