/** Lotus-petal mandala, the Saathi decorative motif (same geometry as the app). */
export function Mandala({ size = 240, color = "#fff", opacity = 0.18, className }: { size?: number; color?: string; opacity?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" opacity={opacity} className={className} aria-hidden="true">
      <g stroke={color} strokeWidth={1.2} fill="none">
        <circle r={96} />
        <circle r={78} strokeDasharray="2 5" />
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={`p${i}`} d="M0 -76 C 14 -58, 14 -40, 0 -26 C -14 -40, -14 -58, 0 -76 Z" transform={`rotate(${(360 / 16) * i})`} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`i${i}`} d="M0 -26 C 9 -18, 9 -9, 0 -2 C -9 -9, -9 -18, 0 -26 Z" transform={`rotate(${(360 / 8) * i + 22.5})`} />
        ))}
        <circle r={6} fill={color} />
      </g>
    </svg>
  );
}
