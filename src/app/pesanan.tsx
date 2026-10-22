import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Tombol, TautanTombol, KartuTaut } from '@/ui/Tombol';
import { Kerangka, Kotak, Kosong, Lencana } from '@/ui/Kecil';
import { Bintik, Gompal } from '@/ui/Bintik';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { ambilPesanan, batalPesanan } from '@/lib/toko';
import type { Pesanan } from '@/lib/jenis';
import { meta } from '@/lib/meta';
import { angka, rupiah } from '@/lib/format';
import { jamMenit, tglPendek, MENIT, relatifHari } from '@/lib/waktu';
import { outletBySlug } from '@/data/outlet';

export function generateMetadata() {
  return meta({
    judul: 'Status Pesanan Ambil · Kopi Blirik',
    desk: 'Pantau pesan ambil Kopi Blirik: nomor ambil, jam ambil dalam WIB, tahap pesanan, dan bintik yang masuk setelah diambil.',
    jalur: '/pesanan',
    noindex: true,
  });
}

function tahap(p: Pesanan, kini: number) {
  const seduh = Math.max(p.dibuat + 2 * MENIT, p.ambil - 10 * MENIT);
  const siap = p.ambil - MENIT;
  return [
    { teks: 'Pesanan diterima', t: p.dibuat, lewat: true },
    { teks: 'Sedang diseduh', t: seduh, lewat: kini >= seduh },
    { teks: 'Siap diambil', t: siap, lewat: kini >= siap },
  ];
}

export default function HalamanPesanan() {
  const d = useData(15_000);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const p = d && id ? d.a.pesanan.find((x) => x.id === id) : null;
  const lain = d ? d.a.pesanan.filter((x) => x.id !== id).slice(0, 6) : [];

  return (
    <Layar judul="Pesanan ambil" induk="/pesan">
      <T v="judul1" h={1} style={{ marginTop: 10 }}>{p ? `Pesanan ${p.nomor}` : 'Pesanan ambil'}</T>
      {!d ? <Kerangka tinggi={360} /> : p ? <Rincian p={p} kini={d.kini} /> : (
        <>
          {lain.length === 0 ? <Kosong judul="Belum ada pesanan" isi="Pesan minuman dari tab Pesan, lalu ambil di outlet tanpa antre." ikon="pesan" /> : null}
          <TautanTombol href="/pesan" teks="Buat pesanan" ikon="pesan" />
        </>
      )}
      {d && lain.length ? (
        <View style={{ gap: 10 }}>
          <T v="judul2" h={2}>Pesanan lain</T>
          {lain.map((x) => (
            <KartuTaut key={x.id} href={{ pathname: '/pesanan', params: { id: x.id } }} label={`Pesanan ${x.nomor}, ${x.status}`} style={s.lain}>
              <View style={{ flex: 1 }}>
                <T v="isiTebal">{x.nomor} · {outletBySlug(x.outlet)?.nama}</T>
                <T v="kecil">{tglPendek(x.ambil)} {jamMenit(x.ambil)} WIB · {rupiah(x.total)}</T>
              </View>
              <Lencana teks={x.status === 'aktif' ? 'Aktif' : x.status === 'diambil' ? 'Diambil' : 'Batal'} ragam={x.status === 'aktif' ? 'hijau' : x.status === 'diambil' ? 'abu' : 'merah'} />
            </KartuTaut>
          ))}
        </View>
      ) : null}
    </Layar>
  );
}

function Rincian({ p, kini }: { p: Pesanan; kini: number }) {
  const o = outletBySlug(p.outlet)!;
  const langkah = tahap(p, kini);
  const bisaBatal = p.status === 'aktif' && kini < p.ambil - 10 * MENIT;
  return (
    <View style={{ gap: 16 }}>
      <View style={s.nomor}>
        <Bintik benih={p.nomor.charCodeAt(1)} jumlah={70} warna={W.kertas} kuat={0.55} />
        <Gompal benih={4} ukuran={18} style={{ top: -2, left: 40 }} />
        <T v="label" warna={W.hijauPucat}>Nomor ambil</T>
        <T v="raksasa" warna={W.kertas} style={{ fontSize: 64, lineHeight: 68 }}>{p.nomor}</T>
        <T v="isiTebal" warna={W.mentega}>
          {p.status === 'aktif' ? `${relatifHari(p.ambil, kini) === 'hari ini' ? 'Hari ini' : tglPendek(p.ambil)}, ${jamMenit(p.ambil)} WIB` : p.status === 'diambil' ? 'Sudah diambil' : 'Dibatalkan'}
        </T>
        <T v="kecil" warna={W.hijauPucat}>{o.nama} · {o.alamat}</T>
      </View>

      {p.status === 'aktif' ? (
        <Kotak>
          <T v="judul3" h={2}>Tahap pesanan</T>
          {langkah.map((l, i) => (
            <View key={l.teks} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={[s.titik, l.lewat && { backgroundColor: W.hijau, borderColor: W.hijau }]}>{l.lewat ? <Ikon n="centang" ukuran={14} warna={W.kertas} tebal={2.6} /> : null}</View>
              <View style={{ flex: 1 }}>
                <T v={l.lewat ? 'isiTebal' : 'isi'} warna={l.lewat ? W.tinta : W.abu}>{l.teks}</T>
                <T v="kecil">{i === 0 ? 'Pukul' : 'Perkiraan'} {jamMenit(l.t)} WIB</T>
              </View>
            </View>
          ))}
          <T v="kecil" style={{ marginTop: 4 }}>Tunjukkan nomor ambil ke kasir, bayar, lalu minumanmu diserahkan. Tahap di atas disimulasikan dari jam ambil.</T>
        </Kotak>
      ) : null}

      <Kotak>
        <T v="judul3" h={2}>Isi pesanan</T>
        {p.item.map((i) => (
          <View key={i.kunci} style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <T v="isiTebal">{i.qty}× {i.nama}</T>
              {i.opsi.length ? <T v="kecil">{i.opsi.join(' · ')}</T> : null}
            </View>
            <T v="isi">{rupiah(i.harga * i.qty)}</T>
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: W.garis }} />
        {p.rincianPotongan.map((r) => (
          <T key={r} v="kecil" warna={W.hijau}>{r}</T>
        ))}
        <View style={{ flexDirection: 'row' }}>
          <T v="isiTebal" style={{ flex: 1 }}>Dibayar di kasir</T>
          <T v="isiTebal">{rupiah(p.total)}</T>
        </View>
        <T v="kecil">{p.status === 'diambil' ? `+${angka(p.bintik)} bintik sudah masuk` : `+${angka(p.bintik)} bintik masuk setelah pesanan diambil`}</T>
      </Kotak>

      {p.status === 'aktif' ? (
        <View style={{ gap: 10 }}>
          <Tombol teks="Simulasikan: sudah kuambil" ikon="centang" penuh onPress={() => ambilPesanan(p.id)} />
          {bisaBatal ? <Tombol teks="Batalkan pesanan" ragam="bahaya" penuh onPress={() => batalPesanan(p.id)} /> : <T v="kecil" tengah>Pesanan tidak bisa dibatalkan 10 menit sebelum jam ambil.</T>}
        </View>
      ) : (
        <TautanTombol href="/riwayat" teks="Lihat riwayat transaksi" ragam="garis" penuh />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  nomor: { backgroundColor: W.hijau, borderRadius: 28, padding: 20, alignItems: 'center', gap: 4, overflow: 'hidden', borderWidth: 4, borderColor: W.hijauTua },
  titik: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: W.garisKuat, alignItems: 'center', justifyContent: 'center' },
  lain: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: W.kertas, borderRadius: 18, borderWidth: 1, borderColor: W.garis, padding: 12 },
});
