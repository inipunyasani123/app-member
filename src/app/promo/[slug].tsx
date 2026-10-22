import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { KartuTaut, TautanTombol } from '@/ui/Tombol';
import { Kerangka, Kotak, Lencana } from '@/ui/Kecil';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { meta } from '@/lib/meta';
import { angka, rupiah } from '@/lib/format';
import { hitungBintik, buatItem } from '@/lib/keranjang';
import { MUSIMAN, menuById } from '@/data/menu';
import NotFound from '../+not-found';

export function generateStaticParams() {
  return MUSIMAN.map((m) => ({ slug: m.id }));
}

export function generateMetadata(_r: unknown, params: Record<string, string>) {
  const m = menuById(params.slug);
  if (!m || m.kategori !== 'musiman') return meta({ judul: 'Menu tidak ditemukan · Kopi Blirik', desk: 'Menu musiman ini tidak ada.', jalur: '/promo', noindex: true });
  return meta({
    judul: `${m.nama} · Menu Musim Hujan Kopi Blirik`.slice(0, 60),
    desk: `${m.nama} ${rupiah(m.harga)}: ${m.desk} Bintik dua kali lipat selama musim hujan.`.slice(0, 155),
    jalur: `/promo/${m.id}`,
  });
}

export default function DetailMenu() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const m = menuById(slug);
  const d = useData();
  if (!m || m.kategori !== 'musiman') return <NotFound />;
  const lain = MUSIMAN.filter((x) => x.id !== m.id);
  const b = d ? hitungBintik([buatItem(m, { ukuran: 'sedang', suhu: 'es', shot: false }, 1)], m.harga, d.r.level.kali) : null;

  return (
    <Layar judul="Menu musim hujan" induk="/promo">
      <View style={s.foto}>
        <Foto k={m.foto!} bentuk="k" alt={m.nama} prioritas lebarTampil={360} />
      </View>
      <View style={{ gap: 6 }}>
        <Lencana teks="Menu musim hujan · Bintik 2×" ragam="mentega" ikon="hujan" />
        <T v="judul1" h={1}>{m.nama}</T>
        <T v="judul2" warna={W.hijau}>{rupiah(m.harga)}</T>
        <T v="isi">{m.desk}</T>
      </View>
      {m.rasa ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {m.rasa.map((r) => (
            <View key={r} style={s.rasa}>
              <T v="kecilTebal" warna={W.hijauTua}>{r}</T>
            </View>
          ))}
        </View>
      ) : null}
      <Kotak style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Ikon n="bintang" warna={W.hijau} />
        {d && b ? (
          <T v="isi" style={{ flex: 1 }}>
            Satu porsi memberi <T v="isiTebal">+{angka(b.jumlah)} bintik</T> untuk level {d.r.level.nama} ({angka(b.dasar)} dasar + {angka(b.bonus)} bonus musiman).
          </T>
        ) : (
          <Kerangka tinggi={40} style={{ flex: 1 }} />
        )}
      </Kotak>
      <TautanTombol href={{ pathname: '/pesan', params: { menu: m.id } }} teks="Pesan ambil menu ini" ikon="pesan" penuh />

      <T v="judul2" h={2}>Menu musiman lain</T>
      <View style={{ gap: 10 }}>
        {lain.map((x) => (
          <KartuTaut key={x.id} href={`/promo/${x.id}`} style={s.lain}>
            <View style={s.lainFoto}>
              <Foto k={x.foto!} alt={x.nama} lebarTampil={64} />
            </View>
            <View style={{ flex: 1 }}>
              <T v="isiTebal">{x.nama}</T>
              <T v="kecil">{rupiah(x.harga)}</T>
            </View>
            <Ikon n="kanan" ukuran={18} warna={W.abu} />
          </KartuTaut>
        ))}
      </View>
    </Layar>
  );
}

const s = StyleSheet.create({
  foto: { height: 300, borderRadius: 28, overflow: 'hidden', backgroundColor: W.garis, marginTop: 12, borderWidth: 4, borderColor: W.hijau },
  rasa: { backgroundColor: W.hijauPucat, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  lain: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.kertas, borderRadius: 18, borderWidth: 1, borderColor: W.garis, padding: 8 },
  lainFoto: { width: 56, height: 56, borderRadius: 12, overflow: 'hidden', backgroundColor: W.garis },
});
