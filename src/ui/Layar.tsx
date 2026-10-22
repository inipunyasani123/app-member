import type { ReactNode } from 'react';
import { ScrollView, View, Pressable, StyleSheet, Platform } from 'react-native';
import { router, Link, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from './Teks';
import { Ikon } from './Ikon';
import { Bintik } from './Bintik';
import { W, JARAK } from './tema';

type Props = {
  children: ReactNode;
  /** Judul halaman detail; tanpa judul berarti layar tab (tanpa tombol kembali). */
  judul?: string;
  induk?: Href;
  /** Elemen tetap di bawah (mis. bilah keranjang). */
  bawah?: ReactNode;
  kanan?: ReactNode;
  tab?: boolean;
};

/** Kerangka layar: kepala, isi yang bisa digulir (landmark main), dan ruang untuk bilah tab. */
export function Layar({ children, judul, induk = '/', bawah, kanan, tab }: Props) {
  const ins = useSafeAreaInsets();
  return (
    <View role="main" nativeID={Platform.OS === 'web' ? 'isi' : undefined} style={s.akar}>
      {judul ? <KepalaDetail judul={judul} induk={induk} kanan={kanan} atas={ins.top} /> : <View style={{ height: ins.top }} />}
      <ScrollView
        style={s.gulir}
        contentContainerStyle={[s.isi, { paddingBottom: (bawah ? 104 : 28) + (tab ? 0 : ins.bottom) }]}
        keyboardShouldPersistTaps="handled"
        {...(Platform.OS === 'web' ? { tabIndex: 0 } : null)}
      >
        <View style={s.utama}>{children}</View>
      </ScrollView>
      {bawah}
    </View>
  );
}

function KepalaDetail({ judul, induk, kanan, atas }: { judul: string; induk: Href; kanan?: ReactNode; atas: number }) {
  const kembali = () => (router.canGoBack() ? router.back() : router.replace(induk));
  return (
    <View style={[s.kepala, { paddingTop: atas + 8 }]}>
      <Pressable role="button" aria-label="Kembali" onPress={kembali} hitSlop={6} style={({ pressed }) => [s.kembali, pressed && { opacity: 0.75 }]}>
        <Ikon n="kembali" warna={W.hijauTua} tebal={2.2} />
      </Pressable>
      <T v="judul3" numberOfLines={1} style={{ flex: 1 }}>
        {judul}
      </T>
      {kanan}
    </View>
  );
}

/** Judul bagian dengan tautan "lihat semua" opsional. */
export function JudulBagian({ judul, href, tautan = 'Lihat semua', label }: { judul: string; href?: Href; tautan?: string; label?: string }) {
  return (
    <View style={s.judulBagian}>
      <T v="judul2" h={2} style={{ flex: 1 }}>
        {judul}
      </T>
      {href ? (
        <Link href={href} asChild>
          <Pressable role="link" aria-label={label} style={s.lihat} hitSlop={6}>
            <T v="kecilTebal" warna={W.hijau}>
              {tautan}
            </T>
            <Ikon n="kanan" ukuran={16} warna={W.hijau} tebal={2.2} />
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

/** Pita judul halaman: label kecil + judul besar Caprasimo + tekstur bintik tipis. */
export function Pita({ label, judul, anak }: { label: string; judul: string; anak?: ReactNode }) {
  return (
    <View style={s.pita}>
      <Bintik benih={judul.length} jumlah={46} kuat={0.7} />
      <T v="label" warna={W.hijau}>
        {label}
      </T>
      <T v="judul1" h={1}>
        {judul}
      </T>
      {anak}
    </View>
  );
}

const s = StyleSheet.create({
  akar: { flex: 1, backgroundColor: W.enamel },
  gulir: { flex: 1 },
  isi: { flexGrow: 1 },
  utama: { paddingHorizontal: JARAK, gap: 18, paddingTop: 4 },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingBottom: 8, backgroundColor: W.enamel, borderBottomWidth: 1, borderBottomColor: W.garis },
  kembali: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: W.kertas, borderWidth: 1, borderColor: W.garis },
  judulBagian: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  lihat: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 32, paddingHorizontal: 4 },
  pita: { overflow: 'hidden', paddingVertical: 14, gap: 4 },
});
