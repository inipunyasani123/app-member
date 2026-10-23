import { View, Pressable, StyleSheet } from 'react-native';
import { Link, usePathname, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from './Teks';
import { Ikon, type NamaIkon } from './Ikon';
import { Bintik } from './Bintik';
import { W } from './tema';

const TAB: { href: Href; jalur: string; teks: string; ikon: NamaIkon }[] = [
  { href: '/', jalur: '/', teks: 'Beranda', ikon: 'beranda' },
  { href: '/pesan', jalur: '/pesan', teks: 'Pesan', ikon: 'pesan' },
  { href: '/kartu', jalur: '/kartu', teks: 'Kartu', ikon: 'kartu' },
  { href: '/hadiah', jalur: '/hadiah', teks: 'Hadiah', ikon: 'hadiah' },
  { href: '/akun', jalur: '/akun', teks: 'Akun', ikon: 'akun' },
];

/**
 * Satu gaya penanda aktif untuk semua tab: label tebal hijau tua + garis mentega di bawah label.
 * Kartu tetap berupa koin enamel di tengah, tetapi hanya bertepi mentega saat aktif.
 */
export function TabBar() {
  const p = usePathname();
  const ins = useSafeAreaInsets();
  return (
    <View role="navigation" aria-label="Menu utama" style={[s.bilah, { paddingBottom: Math.max(ins.bottom, 8) }]}>
      {TAB.map((t) => {
        const aktif = p === t.jalur;
        const koin = t.jalur === '/kartu';
        return (
          <Link key={t.jalur} href={t.href} replace asChild>
            <Pressable role="link" aria-current={aktif ? 'page' : undefined} style={s.tab}>
              {koin ? (
                <View style={[s.koin, aktif ? s.koinAktif : null]}>
                  <Bintik benih={7} jumlah={26} warna={W.kertas} kuat={0.7} />
                  <Ikon n={t.ikon} warna={W.kertas} tebal={2} />
                </View>
              ) : (
                <View style={s.wadah}>
                  <Ikon n={t.ikon} warna={aktif ? W.hijauTua : W.abu} tebal={aktif ? 2.3 : 1.8} />
                </View>
              )}
              <T v={aktif ? 'kecilTebal' : 'kecil'} warna={aktif ? W.hijauTua : W.abu} style={{ fontSize: 13, lineHeight: 16 }}>
                {t.teks}
              </T>
              <View style={[s.penanda, aktif ? s.penandaAktif : null]} />
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bilah: { flexDirection: 'row', backgroundColor: W.kertas, borderTopWidth: 3, borderTopColor: W.hijau, paddingTop: 6, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', gap: 2, minHeight: 56, justifyContent: 'flex-end' },
  wadah: { width: 44, height: 30, alignItems: 'center', justifyContent: 'center' },
  koin: { width: 52, height: 52, borderRadius: 26, marginTop: -24, backgroundColor: W.hijau, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: W.kertas },
  koinAktif: { borderColor: W.mentega, backgroundColor: W.hijauTua },
  penanda: { width: 20, height: 5, borderRadius: 3, marginTop: 1, borderWidth: 1, borderColor: 'transparent' },
  penandaAktif: { backgroundColor: W.mentega, borderColor: W.hijauTua },
});
