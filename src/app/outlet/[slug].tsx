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
import { bagian, NAMA_HARI, jamDariMenit } from '@/lib/waktu';
import { OUTLET, outletBySlug, statusBuka, teksJam, type Outlet } from '@/data/outlet';
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

/** Perkiraan keramaian per jam (rekaan): batang 06.00–23.00, jam sekarang ditandai mentega. */
function Keramaian({ o, jam }: { o: Outlet; jam: number }) {
  const r = o.ramai;
  const puncak = Math.max(...r);
  let a = r.indexOf(puncak), b = a;
  while (b + 1 < r.length && r[b + 1] === puncak) b++;
  const sepi = r.map((v, i) => [v, i] as const).filter(([v]) => v > 0).sort((x, y) => x[0] - y[0])[0]?.[1] ?? 0;
  const teks = `Paling ramai ${jamDariMenit((6 + a) * 60)}–${jamDariMenit((7 + b) * 60)}, paling lengang sekitar ${jamDariMenit((6 + sepi) * 60)}`;
  return (
    <View style={{ gap: 6 }}>
      <T v="isiTebal">{teks}</T>
      <View role="img" aria-label={`${teks}. Perkiraan rekaan.`} style={s.grafik}>
        {r.map((v, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 64 }}>
            <View style={{ width: '70%', height: v ? 8 + v * 13 : 3, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: 6 + i === jam ? W.mentega : v >= 3 ? W.hijau : W.tepi, opacity: v ? 1 : 0.35, borderWidth: 6 + i === jam ? 1.5 : 0, borderColor: W.hijauTua }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {['06', '10', '14', '18', '22'].map((x) => (
          <T key={x} v="kecil">{x}.00</T>
        ))}
      </View>
      <T v="kecil">{jam >= 6 ? 'Batang kuning = jam sekarang (WIB). ' : ''}Perkiraan rekaan untuk demo.</T>
    </View>
  );
}

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
        <T v="judul3" h={2}>Biasanya ramai</T>
        <Keramaian o={o} jam={d ? bagian(d.kini).jam : -1} />
      </Kotak>

      <Kotak>
        <T v="judul3" h={2}>Bayar dengan</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {o.bayar.map((b) => (
            <Lencana key={b} teks={b} ragam="mentega" />
          ))}
        </View>
        <T v="kecil">Pesan ambil juga dibayar di kasir saat mengambil.</T>
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
  grafik: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, borderBottomWidth: 2, borderBottomColor: W.hijau, paddingBottom: 2 },
});
