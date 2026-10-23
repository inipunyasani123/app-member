import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Chip, TautanTombol } from '@/ui/Tombol';
import { Kerangka, Kotak, Kosong } from '@/ui/Kecil';
import { Bintik, Gompal } from '@/ui/Bintik';
import { W, BIBIR } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import type { Entri } from '@/lib/hitung';
import { meta } from '@/lib/meta';
import { angka } from '@/lib/format';
import { bulanTahun, jamMenit, tglPendek, tglSedang } from '@/lib/waktu';

export function generateMetadata() {
  return meta({
    judul: 'Saldo & Riwayat Bintik · Kopi Blirik',
    desk: 'Saldo bintik Kopi Blirik dan riwayatnya: bintik yang didapat, ditukar, dan hangus setelah 12 bulan, dikelompokkan per bulan dalam WIB.',
    jalur: '/poin',
  });
}

const FILTER = [
  { id: 'semua', nama: 'Semua' },
  { id: 'masuk', nama: 'Didapat' },
  { id: 'tukar', nama: 'Ditukar' },
  { id: 'hangus', nama: 'Hangus' },
] as const;

export default function Poin() {
  const d = useData();
  const [f, setF] = useState<(typeof FILTER)[number]['id']>('semua');
  const daftar = d
    ? d.r.riwayat.filter((e) => (f === 'semua' ? true : f === 'masuk' ? e.jumlah > 0 : e.jenis === f))
    : [];
  const grup: { bulan: string; isi: Entri[] }[] = [];
  for (const e of daftar) {
    const b = bulanTahun(e.waktu);
    const g = grup[grup.length - 1];
    if (g && g.bulan === b) g.isi.push(e);
    else grup.push({ bulan: b, isi: [e] });
  }

  return (
    <Layar judul="Bintik" induk="/">
      <View style={s.saldo}>
        <Bintik benih={41} jumlah={80} warna={W.kertas} kuat={0.55} />
        <Gompal benih={8} ukuran={18} style={{ top: -3, right: 60 }} />
        <T v="label" warna={W.hijauPucat}>Saldo bintik</T>
        <T v="judul1" h={1} warna={W.kertas} aria-label={d ? `Saldo ${angka(d.r.saldo)} bintik` : 'Saldo bintik'}>
          {d ? `${angka(d.r.saldo)} bintik` : 'Saldo bintik'}
        </T>
        {d ? (
          <T v="kecil" warna={W.hijauPucat}>
            {d.r.akanHangus ? `${angka(d.r.akanHangus.jumlah)} bintik akan hangus ${tglSedang(d.r.akanHangus.tanggal)}` : 'Tidak ada bintik yang hangus dalam 45 hari ke depan'}
          </T>
        ) : (
          <Kerangka tinggi={18} lebar={220} />
        )}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          <TautanTombol href="/hadiah" teks="Tukar" ragam="mentega" kecil ikon="hadiah" />
          <TautanTombol href="/level" teks="Level" ragam="lembut" kecil />
        </View>
      </View>

      <Kotak>
        <T v="judul3" h={2}>Cara dapat bintik</T>
        {[
          'Setiap belanja Rp1.000 = 1 bintik, dikali pengali levelmu (Lepek 1×, Cangkir 1,25×, Teko 1,5×, Ceret 2×).',
          'Menu musim hujan dihitung dua kali selama promo berjalan.',
          'Bawa tumbler sendiri: tambah 5 bintik per kunjungan.',
          'Bintik berlaku 12 bulan sejak didapat. Saat menukar, bintik paling lama terpakai lebih dulu.',
        ].map((t) => (
          <View key={t} style={{ flexDirection: 'row', gap: 10 }}>
            <View style={s.butir} />
            <T v="isi" style={{ flex: 1 }}>{t}</T>
          </View>
        ))}
      </Kotak>

      <View role="radiogroup" aria-label="Saring riwayat bintik" style={s.filter}>
        {FILTER.map((x) => (
          <Chip key={x.id} teks={x.nama} aktif={f === x.id} onPress={() => setF(x.id)} kecil />
        ))}
      </View>

      {!d ? <Kerangka tinggi={320} /> : grup.length === 0 ? <Kosong judul="Belum ada di bagian ini" isi={f === 'hangus' ? 'Bagus, belum ada bintik yang hangus.' : 'Riwayat bintik bagian ini masih kosong.'} /> : grup.map((g) => (
        <View key={g.bulan} style={{ gap: 8 }}>
          <T v="label" h={3}>{g.bulan}</T>
          <View style={s.daftar}>
            {g.isi.map((e, i) => (
              <View key={e.id} style={[s.baris, i > 0 && { borderTopWidth: 1, borderTopColor: W.garis }]}>
                <View style={[s.ikon, { backgroundColor: e.jumlah > 0 ? W.hijauPucat : e.jenis === 'hangus' ? '#ECE6D9' : W.merahPucat }]}>
                  <Ikon n={e.jenis === 'tukar' ? 'hadiah' : e.jenis === 'hangus' ? 'jam' : e.jenis === 'bonus' ? 'bintang' : 'cangkir'} ukuran={18} warna={e.jumlah > 0 ? W.hijau : e.jenis === 'hangus' ? W.abu : W.merah} />
                </View>
                <View style={{ flex: 1 }}>
                  <T v="isiTebal" numberOfLines={2}>{e.ket}</T>
                  <T v="kecil">{tglPendek(e.waktu)} · {jamMenit(e.waktu)} WIB{e.kode ? ` · ${e.kode}` : ''}</T>
                </View>
                <T v="sub" warna={e.jumlah > 0 ? W.hijau : e.jenis === 'hangus' ? W.abu : W.merah}>{e.jumlah > 0 ? `+${angka(e.jumlah)}` : angka(e.jumlah)}</T>
              </View>
            ))}
          </View>
        </View>
      ))}
    </Layar>
  );
}

const s = StyleSheet.create({
  saldo: { backgroundColor: W.hijau, borderRadius: 26, padding: 18, gap: 4, overflow: 'hidden', marginTop: 12, borderWidth: 4, borderColor: W.hijauTua },
  butir: { width: 8, height: 8, borderRadius: 4, backgroundColor: W.hijau, marginTop: 8 },
  filter: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  daftar: { backgroundColor: W.kertas, borderRadius: 20, ...BIBIR, paddingHorizontal: 12 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  ikon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
