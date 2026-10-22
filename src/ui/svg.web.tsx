// Web: SVG sebagai elemen DOM biasa supaya react-native-svg tidak ikut ke bundle web.
import type { CSSProperties, ReactNode, SVGProps } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

export type SvgProps = { width?: number | string; height?: number | string; viewBox: string; label?: string; style?: ViewStyle; preserveAspectRatio?: string; children?: ReactNode };
export function Svg({ label, style, children, ...p }: SvgProps) {
  const css = { display: 'block', flexShrink: 0, ...(StyleSheet.flatten(style) as CSSProperties) };
  return (
    <svg {...p} style={css} focusable="false" {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      {children}
    </svg>
  );
}
export const Path = (p: SVGProps<SVGPathElement>) => <path {...p} />;
export const Circle = (p: SVGProps<SVGCircleElement>) => <circle {...p} />;
export const Rect = (p: SVGProps<SVGRectElement>) => <rect {...p} />;
export const G = (p: SVGProps<SVGGElement>) => <g {...p} />;
export const Ellipse = (p: SVGProps<SVGEllipseElement>) => <ellipse {...p} />;
