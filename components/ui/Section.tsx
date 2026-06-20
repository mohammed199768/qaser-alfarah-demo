import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties | undefined;
}

export function Section({ children, className, id, style }: SectionProps) {
  return (
    <section id={id} style={style} className={cn("py-12 md:py-24 text-start", className)}>
      {children}
    </section>
  );
}
