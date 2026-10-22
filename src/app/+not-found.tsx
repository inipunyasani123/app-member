import { View, StyleSheet } from 'react-native';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Wadah } from '@/ui/Wadah';
import { Bintik, Gompal } from '@/ui/Bintik';
import { TautanTombol } from '@/ui/Tombol';
import { W } from '@/ui/tema';
import { meta } from '@/lib/meta';

export function generateMetadata() {
  return meta({ judul: 'Halaman tidak ditemukan · Kopi Blirik', desk: 'Halaman yang kamu cari tidak ada di aplikasi Kopi Blirik.', jalur: '/404', noindex: true });
}

/** 404 bergaya: lepek kosong yang gompal. Dipakai juga oleh rute /404 (dist/404.html untuk Vercel). */
export default function TidakDitemukan() {
  return (
    <Layar judul="Tidak ditemukan" induk="/">
      <View style={s.kotak}>
        <Bintik benih={404} jumlah={90} kuat={0.8} />
        <Gompal benih={9} ukuran={26} style={{ top: 30, right: 36 }} />
        <Wadah id="lepek" ukuran={180} label="Lepek kosong" />
        <T v="label" warna={W.hijau}>Galat 404</T>
        <T v="judul1" h={1} tengah>Lepeknya kosong</T>
        <T v="isi" tengah>Halaman yang kamu cari tidak ada, mungkin tautannya salah ketik atau sudah dipindah.</T>
      </View>
      <View style={{ gap: 10 }}>
        <TautanTombol href="/" teks="Kembali ke beranda" ikon="beranda" penuh />
        <TautanTombol href="/hadiah" teks="Lihat katalog hadiah" ragam="garis" penuh />
      </View>
    </Layar>
  );
}

const s = StyleSheet.create({
  kotak: { alignItems: 'center', gap: 8, paddingVertical: 28, paddingHorizontal: 12, marginTop: 16, backgroundColor: W.kertas, borderRadius: 28, borderWidth: 4, borderColor: W.hijau, overflow: 'hidden' },
});
