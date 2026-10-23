import { Platform, type TextStyle } from 'react-native';

// Palet enamel blirik: krem email kehijauan, hijau tepi cangkir (dominan), cap merah, mentega, besi gompal.
// Teks/latar >= 4.5:1, garis kontrol >= 3:1 (dicek 23 Okt 2026).
export const W = {
  enamel: '#E7EEDF',
  kertas: '#FAFCF3',
  hijau: '#1B5536',
  hijauTua: '#0F3524',
  hijauPucat: '#D6E7D9',
  tinta: '#18201B',
  abu: '#4B564D',
  garis: '#C7D7C6',
  garisKuat: '#66755F',
  tepi: '#3F7A58',
  merah: '#A0311B',
  merahPucat: '#F5DED6',
  mentega: '#F0C14B',
  mentegaPucat: '#FAEEC6',
  karat: '#262B27',
} as const;

/** Bibir enamel: tepi atas hijau tebal pada kartu, seperti bibir cangkir blirik. */
export const BIBIR = { borderWidth: 1, borderColor: '#C7D7C6', borderTopWidth: 4, borderTopColor: '#1B5536' } as const;

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
