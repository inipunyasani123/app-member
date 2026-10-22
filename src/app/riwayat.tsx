import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Chip } from '@/ui/Tombol';
import { Kerangka, Lencana } from '@/ui/Kecil';
import { Lembar } from '@/ui/Lembar';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import type { Trx } from '@/lib/jenis';
import { meta } from '@/lib/meta';
import { angka, rupiah } from '@/lib/format';
import { bulanTahun, jamMenit, tglPanjang, tglPendek } from '@/lib/waktu';
import { outletBySlug } from '@/data/outlet';

export function generateMetadata() {
  return meta({
    judul: 'Riwayat Transaksi · Kopi Blirik',
    desk: 'Riwayat transaksi member Kopi Blirik di kasir dan pesan ambil: outlet, isi pesanan, potongan voucher, total, dan bintik yang didapat, dengan struk.',
    jalur: '/riwayat',
  });
}

const FILTER = [
  { id: 'semua', nama: 'Semua' },
  { id: 'kasir', nama: 'Di kasir' },
  { id: 'ambil', nama: 'Pesan ambil' },
] as const;

export default function Riwayat() {
  const d = useData();
  const [f, setF] = useState<(typeof FILTER)[number]['id']>('semua');
  const [buka, setBuka] = useState<Trx | null>(null);
  const daftar = d ? d.a.trx.filter((t) => f === 'semua' || t.jenis === f).sort((a, b) => b.waktu - a.waktu) : [];
  const grup: { bulan: string; isi: Trx[]; total: number }[] = [];
  for (const t of daftar) {
    const b = bulanTahun(t.waktu);
    const g = grup[grup.length - 1];
    if (g && g.bulan === b) {
      g.isi.push(t);
      g.total += t.total;
    } else grup.push({ bulan: b, isi: [t], total: t.total });
  }

  return (
    <Layar judul="Riwayat transaksi" induk="/akun">
      <T v="judul1" h={1} style={{ marginTop: 10 }}>Riwayat transaksi</T>
      <View role="radiogroup" aria-label="Saring transaksi" style={s.filter}>
        {FILTER.map((x) => (
          <Chip key={x.id} teks={x.nama} aktif={f === x.id} onPress={() => setF(x.id)} kecil />
        ))}
      </View>
      {!d ? <Kerangka tinggi={360} /> : grup.map((g) => (
        <View key={g.bulan} style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <T v="label" h={2} style={{ flex: 1 }}>{g.bulan}</T>
            <T v="kecil">{rupiah(g.total)}</T>
          </View>
          <View style={{ gap: 8 }}>
            {g.isi.map((t) => (
              <Pressable key={t.id} role="button" aria-label={`Struk ${tglPendek(t.waktu)}, ${outletBySlug(t.outlet)?.nama}, ${rupiah(t.total)}`} onPress={() => setBuka(t)} style={s.trx}>
                <View style={s.ikon}>
                  <Ikon n={t.jenis === 'ambil' ? 'pesan' : 'struk'} ukuran={20} warna={W.hijau} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <T v="isiTebal" numberOfLines={1}>{outletBySlug(t.outlet)?.nama}</T>
                  <T v="kecil" numberOfLines={1}>{t.item.map((i) => `${i.qty > 1 ? i.qty + '× ' : ''}${i.nama}`).join(', ')}</T>
                  <T v="kecil">{tglPendek(t.waktu)} · {jamMenit(t.waktu)} WIB{t.jenis === 'ambil' ? ' · pesan ambil' : ''}</T>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 2 }}>
                  <T v="isiTebal">{rupiah(t.total)}</T>
                  <T v="kecilTebal" warna={W.hijau}>+{angka(t.bintik)}</T>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Lembar terbuka={!!buka} onTutup={() => setBuka(null)} judul="Struk">
        {buka ? (
          <View style={s.struk}>
            <T v="judul2" tengah warna={W.hijau}>Kopi Blirik</T>
            <T v="kecil" tengah>{outletBySlug(buka.outlet)?.nama} · {outletBySlug(buka.outlet)?.alamat}</T>
            <T v="kecil" tengah>{tglPanjang(buka.waktu)}, {jamMenit(buka.waktu)} WIB</T>
            <View style={s.putus} />
            {buka.item.map((i) => (
              <View key={i.kunci} style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <T v="isi">{i.qty}× {i.nama}</T>
                  {i.opsi.length ? <T v="kecil">{i.opsi.join(' · ')}</T> : null}
                </View>
                <T v="kode" style={{ fontSize: 14 }}>{angka(i.harga * i.qty)}</T>
              </View>
            ))}
            <View style={s.putus} />
            <Baris k="Subtotal" n={angka(buka.subtotal)} />
            {buka.potongan ? <Baris k={buka.voucher ? `Voucher ${buka.voucher.nama}` : 'Potongan'} n={`-${angka(buka.potongan)}`} /> : null}
            <Baris k="Total" n={rupiah(buka.total)} tebal />
            <View style={s.putus} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Lencana teks={`+${angka(buka.bintik)} bintik`} ragam="hijau" ikon="bintang" />
              {buka.voucher ? <T v="kecil">{buka.voucher.kode}</T> : null}
            </View>
          </View>
        ) : null}
      </Lembar>
    </Layar>
  );
}

function Baris({ k, n, tebal }: { k: string; n: string; tebal?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <T v={tebal ? 'isiTebal' : 'isi'} style={{ flex: 1 }}>{k}</T>
      <T v="kode" style={{ fontSize: 14, fontWeight: tebal ? '700' : '400' }}>{n}</T>
    </View>
  );
}

const s = StyleSheet.create({
  filter: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trx: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: W.kertas, borderRadius: 18, borderWidth: 1, borderColor: W.garis, padding: 12 },
  ikon: { width: 40, height: 40, borderRadius: 20, backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center' },
  struk: { backgroundColor: '#FFFEFA', borderWidth: 1, borderColor: W.garis, borderRadius: 6, padding: 16, gap: 6 },
  putus: { borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: W.garisKuat, marginVertical: 6 },
});
