// Native: react-native-svg. Di web dipakai svg.web.tsx (elemen DOM langsung, tanpa pustaka).
import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import RNSvg, { Path as RNPath, Circle as RNCircle, Rect as RNRect, G as RNG, Ellipse as RNEllipse } from 'react-native-svg';

export type SvgProps = { width?: number | string; height?: number | string; viewBox: string; label?: string; style?: ViewStyle; preserveAspectRatio?: string; children?: ReactNode };
export function Svg({ label, style, children, ...p }: SvgProps) {
  const svg = <RNSvg {...(p as object)} style={label ? undefined : style}>{children}</RNSvg>;
  return label ? (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={style}>
      {svg}
    </View>
  ) : (
    svg
  );
}
export const Path = RNPath;
export const Circle = RNCircle;
export const Rect = RNRect;
export const G = RNG;
export const Ellipse = RNEllipse;
