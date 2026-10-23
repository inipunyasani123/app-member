import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layar, Pita } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Chip, KartuTaut, TautanTombol } from '@/ui/Tombol';
import { Kerangka, Lencana } from '@/ui/Kecil';
import { Bintik } from '@/ui/Bintik';
import { Meter } from '@/ui/Meter';
import { IlustrasiHadiah } from '@/ui/IlustrasiHadiah';
import { GambarHadiah } from '@/ui/GambarHadiah';
import { W, BIBIR } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { meta } from '@/lib/meta';
import { angka } from '@/lib/format';
import { HADIAH, JENIS_HADIAH, type Hadiah } from '@/data/hadiah';
import { levelById, urutanLevel } from '@/data/level';

export function generateMetadata() {
  return meta({
    judul: 'Katalog Hadiah & Tukar Voucher · Kopi Blirik',
    desk: 'Tukar bintik Kopi Blirik jadi voucher: tambah shot, naik ukuran, potongan, makanan, minuman, biji kopi, sampai kelas seduh untuk level tertentu.',
    jalur: '/hadiah',
  });
}

export default function Katalog() {
  const d = useData();
  const [filter, setFilter] = useState<(typeof JENIS_HADIAH)[number]['id']>('semua');
  const terkunci = (h: Hadiah) => !!(d && h.minLevel && urutanLevel(d.r.level.id) < urutanLevel(h.minLevel));
  const bisa = (h: Hadiah) => !!d && h.biaya <= d.r.saldo && !terkunci(h);
  const sebentar = d ? HADIAH.filter((h) => !bisa(h)).sort((x, y) => x.biaya - y.biaya) : [];
  const daftar = HADIAH.filter((h) =>
    filter === 'semua' ? true : filter === 'bisa' ? bisa(h) : filter === 'barang' ? h.jenis === 'barang' || h.jenis === 'pengalaman' : filter === 'minuman' ? h.jenis === 'minuman' || h.jenis === 'potongan' : h.jenis === filter,
  );

  return (
    <Layar tab>
      <Pita label="Katalog hadiah" judul="Tukar bintikmu" />
      <View style={s.saldo}>
        <Bintik benih={33} jumlah={40} warna={W.kertas} kuat={0.5} />
        <View style={{ flex: 1 }}>
          <T v="label" warna={W.hijauPucat}>Bintik kamu</T>
          {d ? <T v="angka" warna={W.kertas}>{angka(d.r.saldo)}</T> : <Kerangka tinggi={38} lebar={100} />}
        </View>
        <TautanTombol href="/voucher" teks="Voucher saya" ragam="mentega" kecil ikon="voucher" />
      </View>

      <View style={s.sebentar}>
        <T v="judul2" h={2}>Sebentar lagi</T>
        <T v="kecil" warna={W.tinta}>Hadiah yang belum bisa kamu tukar, berikut sisa bintik dan syarat levelnya.</T>
        {!d ? (
          <Kerangka tinggi={190} />
        ) : sebentar.length === 0 ? (
          <T v="isi">Semua hadiah sudah bisa kamu tukar. Mantap.</T>
        ) : (
          sebentar.map((h) => {
            const kurang = Math.max(0, h.biaya - d.r.saldo);
            const kunci = terkunci(h);
            const lv = h.minLevel ? levelById(h.minLevel) : null;
            return (
              <KartuTaut key={h.id} href={`/hadiah/${h.id}`} style={s.target}>
                <View style={s.targetGambar}>
                  {h.foto ? <Foto k={h.foto} alt={h.nama} lebarTampil={64} /> : <IlustrasiHadiah id={h.ikon ?? 'shot'} ukuran={64} />}
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <T v="isiTebal" numberOfLines={2}>{h.nama}</T>
                  <Meter nilai={Math.min(d.r.saldo, h.biaya)} maks={h.biaya} jumlah={16} label={`${angka(Math.min(d.r.saldo, h.biaya))} dari ${angka(h.biaya)} bintik untuk ${h.nama}`} />
                  <T v="kecil" warna={W.tinta}>
                    {kurang > 0 ? `Kurang ${angka(kurang)} bintik` : `Bintik cukup (${angka(h.biaya)})`}
                    {kunci && lv ? ` · khusus level ${lv.nama}, kurang ${angka(lv.min - d.r.terkumpul)} bintik dalam 180 hari` : ''}
                  </T>
                </View>
              </KartuTaut>
            );
          })
        )}
        <TautanTombol href="/kartu" teks="Kumpulkan bintik" ikon="pindai" ragam="garis" kecil />
      </View>

      <T v="judul2" h={2}>Katalog</T>
      <View role="radiogroup" aria-label="Saring hadiah" style={s.filter}>
        {JENIS_HADIAH.map((j) => (
          <Chip key={j.id} teks={j.nama} aktif={filter === j.id} onPress={() => setFilter(j.id)} kecil />
        ))}
      </View>

      <View style={s.grid}>
        {daftar.map((h, i) => {
          const lebar = i % 5 === 0;
          const kunci = terkunci(h);
          const kurang = d ? h.biaya - d.r.saldo : 0;
          const status = !d ? null : kunci ? `Khusus ${levelById(h.minLevel!).nama} ke atas` : kurang > 0 ? `Kurang ${angka(kurang)} bintik` : 'Bisa ditukar';
          return (
            <KartuTaut key={h.id} href={`/hadiah/${h.id}`} style={StyleSheet.flatten([s.kartu, lebar ? s.lebar : s.sempit])}>
              <View>
                <GambarHadiah h={h} lebar={lebar} tinggi={lebar ? 150 : 120} />
                <View style={s.harga}>
                  <T v="kecilTebal" warna={W.kertas}>{angka(h.biaya)} bintik</T>
                </View>
              </View>
              <View style={{ padding: 12, gap: 6 }}>
                <T v="sub" numberOfLines={2}>{h.nama}</T>
                {status ? <Lencana teks={status} ragam={kunci ? 'abu' : kurang > 0 ? 'mentega' : 'hijau'} ikon={kunci ? 'kunci' : kurang > 0 ? undefined : 'centang'} /> : <Kerangka tinggi={22} lebar={110} bulat={11} />}
              </View>
            </KartuTaut>
          );
        })}
      </View>
      <T v="kecil">Voucher dari hadiah berlaku 14 hari (barang dan kelas 30 hari) sejak ditukar, sampai pukul 23.59 WIB.</T>
    </Layar>
  );
}

const s = StyleSheet.create({
  saldo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.hijau, borderRadius: 22, padding: 16, overflow: 'hidden' },
  sebentar: { backgroundColor: W.mentegaPucat, borderRadius: 24, padding: 14, gap: 10, borderWidth: 1, borderColor: W.mentega, borderTopWidth: 4, borderTopColor: W.hijau },
  target: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: W.kertas, borderRadius: 18, padding: 10, borderWidth: 1, borderColor: W.garis },
  targetGambar: { width: 64, height: 64, borderRadius: 14, overflow: 'hidden', backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center' },
  filter: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kartu: { backgroundColor: W.kertas, borderRadius: 22, ...BIBIR, overflow: 'hidden' },
  lebar: { width: '100%' },
  sempit: { width: '48.5%' },
  harga: { position: 'absolute', left: 10, bottom: 10, backgroundColor: W.hijauTua, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
});
