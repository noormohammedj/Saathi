import Svg, { Circle, G, Path } from 'react-native-svg';

/** Lotus-petal mandala used as quiet decoration on cards and heroes. */
export function Mandala({ size = 240, color = '#FFFFFF', opacity = 0.18 }: { size?: number; color?: string; opacity?: number }) {
  const petals = Array.from({ length: 16 });
  const inner = Array.from({ length: 8 });
  return (
    <Svg width={size} height={size} viewBox="-100 -100 200 200" opacity={opacity}>
      <G stroke={color} strokeWidth={1.2} fill="none">
        <Circle r={96} />
        <Circle r={78} strokeDasharray="2 5" />
        {petals.map((_, i) => (
          <Path key={`p${i}`} d="M0 -76 C 14 -58, 14 -40, 0 -26 C -14 -40, -14 -58, 0 -76 Z" transform={`rotate(${(360 / 16) * i})`} />
        ))}
        {inner.map((_, i) => (
          <Path key={`i${i}`} d="M0 -26 C 9 -18, 9 -9, 0 -2 C -9 -9, -9 -18, 0 -26 Z" transform={`rotate(${(360 / 8) * i + 22.5})`} />
        ))}
        <Circle r={6} fill={color} />
      </G>
    </Svg>
  );
}
