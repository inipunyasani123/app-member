import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { Tombol, TautanTombol } from '@/ui/Tombol';
import { Kotak, StatusBuka, Lencana } from '@/ui/Kecil';
import { Gompal } from '@/ui/Bintik';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { setelProfil } from '@/lib/toko';
import { meta } from '@/lib/meta';
import { bagian, NAMA_HARI } from '@/lib/waktu';
import { OUTLET, outletBySlug, statusBuka, teksJam } from '@/data/outlet';
import NotFound from '../+not-found';

export function generateStaticParams() {
  return OUTLET.map((o) => ({ slug: o.slug }));
}

export function generateMetadata(_r: unknown, params: Record<string, string>) {
  const o = outletBySlug(params.slug);
  if (!o) return meta({ judul: 'Outlet tidak ditemukan · Kopi Blirik', desk: 'Outlet ini tidak ada.', jalur: '/outlet', noindex: true });
  return meta({
    judul: `${o.nama}: Jam Buka & Fasilitas · Kopi Blirik`.slice(0, 60),
    desk: `${o.nama} (${o.julukan}), ${o.alamat}. ${o.catatan} Jam buka tiap hari dalam WIB dan fasilitas.`.slice(0, 155),
    jalur: `/outlet/${o.slug}`,
  });
}

const URUT_HARI = [1, 2, 3, 4, 5, 6, 0];

export default function DetailOutlet() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const o = outletBySlug(slug);
  const d = useData();
  if (!o) return <NotFound />;
  const hari = d ? bagian(d.kini).hari : -1;
  const fav = d?.a.outletFav === o.slug;

  return (
    <Layar judul="Outlet" induk="/outlet">
      <View style={s.foto}>
        <Foto k={o.foto} bentuk="l" alt={`Suasana ${o.nama}`} prioritas lebarTampil={360} />
        <Gompal benih={6} ukuran={20} style={{ top: -2, right: 40 }} />
      </View>
      <View style={{ gap: 6 }}>
        <T v="label" warna={W.hijau}>{o.julukan}</T>
        <T v="judul1" h={1}>{o.nama}</T>
        <StatusBuka st={d ? statusBuka(o, d.kini) : null} />
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
          <Ikon n="lokasi" ukuran={18} warna={W.abu} />
          <T v="isi" style={{ flex: 1 }}>{o.alamat} <T v="kecil">(alamat rekaan)</T></T>
        </View>
        <T v="isi">{o.catatan}</T>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
        <TautanTombol href={{ pathname: '/pesan', params: { outlet: o.slug } }} teks="Pesan ambil di sini" ikon="pesan" />
        <Tombol
          teks={fav ? 'Outlet favoritmu' : 'Jadikan favorit'}
          ikon={fav ? 'centang' : 'bintang'}
          ragam={fav ? 'lembut' : 'garis'}
          disabled={!d || fav}
          onPress={() => setelProfil({ outletFav: o.slug })}
        />
      </View>

      <Kotak>
        <T v="judul3" h={2}>Jam buka (WIB)</T>
        {URUT_HARI.map((h) => (
          <View key={h} style={[s.jam, h === hari && s.jamIni]}>
            <T v={h === hari ? 'isiTebal' : 'isi'} style={{ flex: 1 }}>{NAMA_HARI[h]}{h === hari ? ' (hari ini)' : ''}</T>
            <T v={h === hari ? 'isiTebal' : 'isi'} warna={o.jam[h] ? W.tinta : W.merah}>{teksJam(o.jam[h])}</T>
          </View>
        ))}
      </Kotak>

      <Kotak>
        <T v="judul3" h={2}>Fasilitas</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {o.fasilitas.map((f) => (
            <Lencana key={f} teks={f} ragam="hijau" ikon="centang" />
          ))}
        </View>
      </Kotak>
    </Layar>
  );
}

const s = StyleSheet.create({
  foto: { height: 240, borderRadius: 26, overflow: 'hidden', backgroundColor: W.garis, marginTop: 12 },
  jam: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  jamIni: { backgroundColor: W.hijauPucat },
});
