import { View, StyleSheet } from 'react-native';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { KartuTaut } from '@/ui/Tombol';
import { Kerangka, Lencana } from '@/ui/Kecil';
import { Bintik, Gompal } from '@/ui/Bintik';
import { W } from '@/ui/tema';
import { useKini } from '@/lib/toko';
import { meta } from '@/lib/meta';
import { rupiah } from '@/lib/format';
import { tglSedang, awalHari, HARI, akhirHari } from '@/lib/waktu';
import { MUSIMAN } from '@/data/menu';
import { PROMO } from '@/data/promo';

export function generateMetadata() {
  return meta({
    judul: 'Promo & Menu Musim Hujan · Kopi Blirik',
    desk: 'Menu musim hujan Kopi Blirik: es kopi susu kelapa, wedang jahe gula aren, cokelat kayu manis, pisang goreng madu. Plus promo bintik 2× dan hemat pagi.',
    jalur: '/promo',
  });
}

export default function Promo() {
  const kini = useKini(60_000);
  return (
    <Layar judul="Promo & menu musiman" induk="/">
      <View style={s.hero}>
        <Bintik benih={77} jumlah={110} warna={W.kertas} kuat={0.6} />
        <Gompal benih={2} ukuran={22} style={{ top: -4, right: 70 }} />
        <Ikon n="hujan" ukuran={40} warna={W.mentega} tebal={2} />
        <T v="judul1" h={1} warna={W.kertas}>Musim hujan di Blirik</T>
        <T v="isi" warna={W.hijauPucat}>Empat menu hangat dan segar selama musim hujan. Bintiknya dihitung dua kali.</T>
        {kini ? (
          <T v="kecilTebal" warna={W.mentega}>Berlaku {tglSedang(awalHari(kini) - 12 * HARI)} sampai {tglSedang(akhirHari(kini, 38))}</T>
        ) : (
          <Kerangka tinggi={18} lebar={220} style={{ backgroundColor: 'rgba(255,252,244,0.2)' }} />
        )}
      </View>

      <View style={s.grid}>
        {MUSIMAN.map((m, i) => (
          <KartuTaut key={m.id} href={`/promo/${m.id}`} style={StyleSheet.flatten([s.kartu, i % 3 === 0 ? { width: '100%' } : { width: '48.5%' }])}>
            <View style={{ height: i === 0 ? 210 : i % 3 === 0 ? 170 : 150, backgroundColor: W.garis }}>
              <Foto k={m.foto!} bentuk={i % 3 === 0 ? 'l' : 'k'} alt={m.nama} lebarTampil={i % 3 === 0 ? 360 : 172} prioritas={i === 0} />
            </View>
            <View style={{ padding: 12, gap: 4 }}>
              <T v={i === 0 ? 'judul2' : 'sub'} h={2}>{m.nama}</T>
              {i === 0 ? <T v="kecil">{m.desk}</T> : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <T v="isiTebal">{rupiah(m.harga)}</T>
                <Lencana teks="Bintik 2×" ragam="mentega" />
              </View>
            </View>
          </KartuTaut>
        ))}
      </View>

      <T v="judul2" h={2}>Promo berjalan</T>
      <View style={{ gap: 10 }}>
        {PROMO.map((p) => (
          <View key={p.id} style={s.promo}>
            <View style={s.cap}>
              <T v="kecilTebal" warna={W.kertas} tengah style={{ fontSize: 12 }}>{p.label}</T>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <T v="judul3" h={3}>{p.judul}</T>
              <T v="kecil" warna={W.tinta}>{p.desk}</T>
              {p.akhirHari !== undefined ? (
                kini ? <T v="kecilTebal" warna={W.hijau}>Sampai {tglSedang(akhirHari(kini, p.akhirHari))}</T> : <Kerangka tinggi={16} lebar={120} />
              ) : (
                <T v="kecilTebal" warna={W.hijau}>Berlaku setiap hari</T>
              )}
            </View>
          </View>
        ))}
      </View>
    </Layar>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: W.hijau, borderRadius: 28, padding: 20, gap: 6, overflow: 'hidden', marginTop: 12, borderWidth: 4, borderColor: W.hijauTua },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kartu: { backgroundColor: W.kertas, borderRadius: 22, borderWidth: 1, borderColor: W.garis, overflow: 'hidden' },
  promo: { flexDirection: 'row', gap: 12, backgroundColor: W.kertas, borderRadius: 20, borderWidth: 1, borderColor: W.garis, padding: 14 },
  cap: { width: 64, height: 64, borderRadius: 32, backgroundColor: W.merah, alignItems: 'center', justifyContent: 'center', padding: 6, transform: [{ rotate: '-8deg' }], borderWidth: 2, borderColor: W.merahPucat, borderStyle: 'dashed' },
});
