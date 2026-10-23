import { Text, type TextProps, type TextStyle } from 'react-native';
import { W, ui, judul, mono } from './tema';

type Varian = 'raksasa' | 'judul1' | 'judul2' | 'judul3' | 'sub' | 'isi' | 'isiTebal' | 'kecil' | 'kecilTebal' | 'label' | 'kode' | 'angka' | 'nominal';

const GAYA: Record<Varian, TextStyle> = {
  raksasa: { ...judul, fontSize: 44, lineHeight: 48, color: W.tinta, fontVariant: ['tabular-nums'] },
  judul1: { ...judul, fontSize: 30, lineHeight: 35, color: W.tinta },
  judul2: { ...judul, fontSize: 22, lineHeight: 27, color: W.tinta },
  judul3: { ...ui(800), fontSize: 17, lineHeight: 22, color: W.tinta },
  sub: { ...ui(600), fontSize: 15, lineHeight: 21, color: W.tinta },
  isi: { ...ui(400), fontSize: 15, lineHeight: 22, color: W.tinta },
  isiTebal: { ...ui(600), fontSize: 15, lineHeight: 22, color: W.tinta },
  kecil: { ...ui(400), fontSize: 13, lineHeight: 18, color: W.abu },
  kecilTebal: { ...ui(600), fontSize: 13, lineHeight: 18, color: W.tinta },
  label: { ...ui(800), fontSize: 12.5, lineHeight: 16, letterSpacing: 1, textTransform: 'uppercase', color: W.abu },
  kode: { ...mono, fontSize: 15, lineHeight: 20, letterSpacing: 1, color: W.tinta, fontVariant: ['tabular-nums'] },
  angka: { ...judul, fontSize: 34, lineHeight: 38, color: W.tinta, fontVariant: ['tabular-nums'] },
  nominal: { ...mono, fontSize: 14.5, lineHeight: 22, color: W.tinta },
};

type Props = TextProps & { v?: Varian; warna?: string; h?: 1 | 2 | 3; tengah?: boolean };

/** Teks bergaya. Prop h menjadikannya judul (h1–h3) untuk pembaca layar dan struktur halaman web. */
export function T({ v = 'isi', warna, h, tengah, style, ...p }: Props) {
  const aksen: TextStyle = { ...(warna ? { color: warna } : null), ...(tengah ? { textAlign: 'center' as const } : null) };
  return <Text {...(h ? { role: 'heading', 'aria-level': h } : null)} {...p} style={[GAYA[v], aksen, style]} />;
}
