export type PortfolioArrowDirection = "up" | "down" | "right";

/** Directional icon from the portfolio button component in Figma. */
export function PortfolioArrow({
  direction,
}: {
  direction: PortfolioArrowDirection;
}) {
  return (
    <span
      className={`portfolio-button__arrow portfolio-button__arrow--${direction}`}
      aria-hidden="true"
    >
      <span className="portfolio-button__arrow-rotation">
        <img
          src={`/icons/button-arrow-${direction}.svg`}
          alt=""
        />
      </span>
    </span>
  );
}
