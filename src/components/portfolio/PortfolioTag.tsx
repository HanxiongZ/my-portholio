import type { ReactNode } from "react";

type PortfolioTagProps = {
  children: ReactNode;
};

export function PortfolioTag({ children }: PortfolioTagProps) {
  return <span className="portfolio-tag">{children}</span>;
}
