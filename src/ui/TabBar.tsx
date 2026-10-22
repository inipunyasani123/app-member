import { View, Pressable, StyleSheet } from 'react-native';
import { Link, usePathname, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from './Teks';
import { Ikon, type NamaIkon } from './Ikon';
import { W } from './tema';

const TAB: { href: Href; jalur: string; teks: string; ikon: NamaIkon }[] = [
  { href: '/', jalur: '/', teks: 'Beranda', ikon: 'beranda' },
  { href: '/kartu', jalur: '/kartu', teks: 'Kartu', ikon: 'kartu' },
  { href: '/pesan', jalur: '/pesan', teks: 'Pesan', ikon: 'pesan' },
  { href: '/hadiah', jalur: '/hadiah', teks: 'Hadiah', ikon: 'hadiah' },
  { href: '/akun', jalur: '/akun', teks: 'Akun', ikon: 'akun' },
];

export function TabBar() {
  const p = usePathname();
  const ins = useSafeAreaInsets();
  return (
    <View role="navigation" aria-label="Menu utama" style={[s.bilah, { paddingBottom: Math.max(ins.bottom, 8) }]}>
      {TAB.map((t) => {
        const aktif = p === t.jalur;
        const kartu = t.jalur === '/kartu';
        return (
          <Link key={t.jalur} href={t.href} replace asChild>
            <Pressable role="link" aria-current={aktif ? 'page' : undefined} style={s.tab}>
              <View style={[s.wadah, kartu && s.wadahKartu, aktif && (kartu ? s.wadahKartuAktif : s.wadahAktif)]}>
                <Ikon n={t.ikon} warna={kartu ? W.kertas : aktif ? W.hijauTua : W.abu} tebal={aktif ? 2.2 : 1.8} />
              </View>
              <T v="kecilTebal" warna={aktif ? W.hijauTua : W.abu} style={{ fontSize: 12, lineHeight: 15 }}>
                {t.teks}
              </T>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bilah: { flexDirection: 'row', backgroundColor: W.kertas, borderTopWidth: 1, borderTopColor: W.garis, paddingTop: 6, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', gap: 2, minHeight: 52, justifyContent: 'center' },
  wadah: { width: 48, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  wadahAktif: { backgroundColor: W.hijauPucat },
  wadahKartu: { backgroundColor: W.hijau, borderWidth: 2, borderColor: W.hijauTua },
  wadahKartuAktif: { backgroundColor: W.hijauTua, borderColor: W.mentega },
});
