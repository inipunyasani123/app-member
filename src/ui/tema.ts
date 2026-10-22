import { Platform, type TextStyle } from 'react-native';

// Palet enamel blirik: krem email, hijau tepi cangkir, cap merah, mentega, dan besi gompal.
// Semua pasangan teks/latar yang dipakai sudah dicek >= 4.5:1.
export const W = {
  enamel: '#F3EDE0',
  kertas: '#FFFCF4',
  hijau: '#1B5536',
  hijauTua: '#0F3524',
  hijauPucat: '#E1ECE3',
  tinta: '#1A1F1B',
  abu: '#545B55',
  garis: '#E2D8C6',
  garisKuat: '#857D6B',
  merah: '#A8341D',
  merahPucat: '#F7E2DA',
  mentega: '#F0C14B',
  mentegaPucat: '#FBEFC9',
  karat: '#262B27',
} as const;

type Berat = 400 | 600 | 800;

const UI_WEB = '"Schibsted Grotesk", "Schibsted Fallback", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const JUDUL_WEB = 'Caprasimo, "Caprasimo Fallback", "Cooper Black", Georgia, serif';
const MONO_WEB = '"Fragment Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace';

const NATIVE_UI: Record<Berat, string> = { 400: 'Schibsted-400', 600: 'Schibsted-600', 800: 'Schibsted-800' };

/** Gaya huruf lintas platform: di web memakai @font-face variabel, di native satu berkas per bobot. */
export function ui(berat: Berat = 400): TextStyle {
  return Platform.OS === 'web'
    ? { fontFamily: UI_WEB, fontWeight: String(berat) as TextStyle['fontWeight'] }
    : { fontFamily: NATIVE_UI[berat] };
}
export const judul: TextStyle = Platform.OS === 'web' ? { fontFamily: JUDUL_WEB, fontWeight: '400' } : { fontFamily: 'Caprasimo' };
export const mono: TextStyle = Platform.OS === 'web' ? { fontFamily: MONO_WEB, fontWeight: '400' } : { fontFamily: 'FragmentMono' };

export const R = { kecil: 12, sedang: 18, besar: 26 } as const;
export const JARAK = 16;
