import type { ReactNode } from 'react';
import { Pressable, View, StyleSheet, type ViewStyle, type PressableProps, type StyleProp } from 'react-native';
import { Link, type Href } from 'expo-router';
import { T } from './Teks';
import { Ikon, type NamaIkon } from './Ikon';
import { W } from './tema';

type Ragam = 'utama' | 'garis' | 'lembut' | 'bahaya' | 'mentega';
const WARNA: Record<Ragam, { bg: string; fg: string; garis: string }> = {
  utama: { bg: W.hijau, fg: W.kertas, garis: W.hijau },
  garis: { bg: 'transparent', fg: W.hijau, garis: W.hijau },
  lembut: { bg: W.hijauPucat, fg: W.hijauTua, garis: W.hijauPucat },
  bahaya: { bg: 'transparent', fg: W.merah, garis: W.merah },
  mentega: { bg: W.mentega, fg: W.hijauTua, garis: W.mentega },
};

type TombolProps = Omit<PressableProps, 'children' | 'style'> & {
  teks: string;
  ragam?: Ragam;
  ikon?: NamaIkon;
  kecil?: boolean;
  penuh?: boolean;
  style?: ViewStyle;
  label?: string;
};

function isi(teks: string, ragam: Ragam, ikon?: NamaIkon, kecil?: boolean) {
  const w = WARNA[ragam];
  return (
    <>
      {ikon ? <Ikon n={ikon} ukuran={kecil ? 18 : 20} warna={w.fg} /> : null}
      <T v={kecil ? 'kecilTebal' : 'isiTebal'} warna={w.fg}>
        {teks}
      </T>
    </>
  );
}

const gayaTombol = (ragam: Ragam, kecil?: boolean, penuh?: boolean, pressed?: boolean, disabled?: boolean): ViewStyle => {
  const w = WARNA[ragam];
  return {
    minHeight: kecil ? 40 : 50,
    paddingHorizontal: kecil ? 14 : 20,
    borderRadius: 999,
    backgroundColor: w.bg,
    borderWidth: 2,
    borderColor: w.garis,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: penuh ? 'stretch' : 'flex-start',
    opacity: disabled ? 0.55 : 1,
    transform: [{ scale: pressed ? 0.98 : 1 }],
  };
};

export function Tombol({ teks, ragam = 'utama', ikon, kecil, penuh, style, label, disabled, ...p }: TombolProps) {
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...p}
      style={({ pressed }) => [gayaTombol(ragam, kecil, penuh, pressed, !!disabled), style]}
    >
      {isi(teks, ragam, ikon, kecil)}
    </Pressable>
  );
}

/** Tautan yang tampil seperti tombol (di web menjadi <a href>). */
export function TautanTombol({ href, teks, ragam = 'utama', ikon, kecil, penuh, style, label }: { href: Href; teks: string; ragam?: Ragam; ikon?: NamaIkon; kecil?: boolean; penuh?: boolean; style?: ViewStyle; label?: string }) {
  return (
    <Link href={href} asChild>
      <Pressable role="link" aria-label={label} style={StyleSheet.flatten([gayaTombol(ragam, kecil, penuh), style])}>
        {isi(teks, ragam, ikon, kecil)}
      </Pressable>
    </Link>
  );
}

/** Kartu/baris yang seluruhnya bisa ditekan dan menaut ke halaman lain.
 * Catatan: Link asChild menggabungkan style sebagai objek, jadi style harus datar (bukan fungsi/array). */
export function KartuTaut({ href, children, style, label }: { href: Href; children: ReactNode; style?: StyleProp<ViewStyle>; label?: string }) {
  return (
    <Link href={href} asChild>
      <Pressable role="link" aria-label={label} style={StyleSheet.flatten(style)}>
        {children}
      </Pressable>
    </Link>
  );
}

/** Pilihan tunggal/ganda bergaya pil. */
export function Chip({ teks, aktif, onPress, peran = 'radio', kecil, label }: { teks: string; aktif: boolean; onPress: () => void; peran?: 'radio' | 'tab' | 'checkbox' | 'button'; kecil?: boolean; label?: string }) {
  const status = peran === 'tab' ? { 'aria-selected': aktif } : peran === 'button' ? { 'aria-pressed': aktif } : { 'aria-checked': aktif };
  return (
    <Pressable
      role={peran}
      {...status}
      aria-label={label}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: kecil ? 36 : 42,
        paddingHorizontal: kecil ? 12 : 16,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: aktif ? W.hijau : W.garisKuat,
        backgroundColor: aktif ? W.hijau : pressed ? W.garis : W.kertas,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
      })}
    >
      {aktif && peran !== 'tab' ? <Ikon n="centang" ukuran={16} warna={W.kertas} tebal={2.4} /> : null}
      <T v="kecilTebal" warna={aktif ? W.kertas : W.tinta}>
        {teks}
      </T>
    </Pressable>
  );
}

export function TombolIkon({ n, label, onPress, warna = W.tinta, latar = W.kertas, ukuran = 44 }: { n: NamaIkon; label: string; onPress: () => void; warna?: string; latar?: string; ukuran?: number }) {
  return (
    <Pressable
      role="button"
      aria-label={label}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({ width: ukuran, height: ukuran, borderRadius: ukuran / 2, backgroundColor: latar, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1, borderWidth: 1, borderColor: W.garis })}
    >
      <Ikon n={n} warna={warna} />
    </Pressable>
  );
}

export const gaya = StyleSheet.create({
  baris: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kartu: { backgroundColor: W.kertas, borderRadius: 22, borderWidth: 1, borderColor: W.garis, padding: 16 },
});

export function Pemisah() {
  return <View style={{ height: 1, backgroundColor: W.garis, marginVertical: 4 }} />;
}
