// Web: <img> asli dengan srcset WebP (ukuran tetap, lazy di luar layar) supaya tidak bergantung pada pengoptimal gambar.
import type { CSSProperties } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import daftar from '@/data/foto-daftar.json';

type Props = { k: string; bentuk?: 'k' | 'l'; alt: string; style?: ViewStyle; prioritas?: boolean; lebarTampil?: number };

export function Foto({ k, bentuk = 'k', alt, style, prioritas, lebarTampil = 360 }: Props) {
  const ukuran = (daftar as Record<string, Record<string, number[]>>)[k]?.[bentuk] ?? [];
  const [kecil, besar] = ukuran;
  const css = { display: 'block', objectFit: 'cover', width: '100%', height: '100%', backgroundColor: '#E2D8C6', ...(StyleSheet.flatten(style) as CSSProperties) } as CSSProperties;
  return (
    <img
      src={`/foto/${k}-${bentuk}${kecil}.webp`}
      srcSet={`/foto/${k}-${bentuk}${kecil}.webp ${kecil}w, /foto/${k}-${bentuk}${besar}.webp ${besar}w`}
      sizes={`${lebarTampil}px`}
      width={kecil}
      height={bentuk === 'k' ? kecil : Math.round((kecil * 3) / 4)}
      alt={alt}
      loading={prioritas ? 'eager' : 'lazy'}
      decoding="async"
      {...(prioritas ? { fetchPriority: 'high' } : {})}
      style={css}
    />
  );
}
