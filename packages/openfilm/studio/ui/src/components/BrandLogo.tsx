/*
 * Setpiece's mark: a geometric film frame in the surrounding text color, with one fog-blue point at its centre.
 * The frame says "set"; the point is the idea being staged. No play triangle, no viewfinder corners, no gradient:
 * it stays quiet at 15 px.
 */
const VIEWBOX = '0 0 64 64';
const FRAME = 'M13 10H51Q56 10 56 15V49Q56 54 51 54H13Q8 54 8 49V15Q8 10 13 10Z';

export function BrandLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none" className="block shrink-0" role="img" aria-label="Setpiece · 造境">
      <path d={FRAME} stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="4.5" fill="var(--brand-fog, #6F879C)" />
    </svg>
  );
}
