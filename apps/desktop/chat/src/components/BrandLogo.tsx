'use client';

/*
 * The mark: a viewfinder around a play triangle, in the surrounding text color (currentColor). Four open corners
 * say "frame", the triangle says "film": a set rather than a player, and it stays legible at 11 px.
 */
const VIEWBOX = '0 0 64 64';
const CORNERS = 'M10 24V16Q10 10 16 10H24M40 10H48Q54 10 54 16V24M54 40V48Q54 54 48 54H40M24 54H16Q10 54 10 48V40';
const PLAY = 'M27 23L42 32L27 41Z';

export function BrandLogo({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={VIEWBOX}
      fill="none"
      className={`block shrink-0 ${className ?? ''}`.trim()}
      role="img"
      aria-label="TryWorld Set"
    >
      <path d={CORNERS} stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={PLAY} fill="currentColor" strokeLinejoin="round" />
    </svg>
  );
}
