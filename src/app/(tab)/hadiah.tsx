import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layar, Pita } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Chip, KartuTaut, TautanTombol } from '@/ui/Tombol';
import { Kerangka, Lencana, Medali } from '@/ui/Kecil';
import { Bintik } from '@/ui/Bintik';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { meta } from '@/lib/meta';
import { angka } from '@/lib/format';
import { HADIAH, JENIS_HADIAH, type Hadiah } from '@/data/hadiah';
import { levelById, urutanLevel } from '@/data/level';
import type { NamaIkon } from '@/ui/Ikon';

export function generateMetadata() {
  return meta({
    judul: 'Katalog Hadiah & Tukar Voucher · Kopi Blirik',
    desk: 'Tukar bintik Kopi Blirik jadi voucher: tambah shot, naik ukuran, potongan, makanan, minuman, biji kopi, sampai kelas seduh untuk level tertentu.',
    jalur: '/hadiah',
  });
}

const IKON: Record<string, NamaIkon> = { shot: 'cangkir', naik: 'tambah', potongan: 'voucher', kelas: 'daun' };

export default function Katalog() {
  const d = useData();
  const [filter, setFilter] = useState<(typeof JENIS_HADIAH)[number]['id']>('semua');
  const bisa = (h: Hadiah) => !!d && h.biaya <= d.r.saldo && (!h.minLevel || urutanLevel(d.r.level.id) >= urutanLevel(h.minLevel));
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

      <View role="radiogroup" aria-label="Saring hadiah" style={s.filter}>
        {JENIS_HADIAH.map((j) => (
          <Chip key={j.id} teks={j.nama} aktif={filter === j.id} onPress={() => setFilter(j.id)} kecil />
        ))}
      </View>

      <View style={s.grid}>
        {daftar.map((h, i) => {
          const lebar = i % 5 === 0;
          const kunci = h.minLevel && d && urutanLevel(d.r.level.id) < urutanLevel(h.minLevel);
          const kurang = d ? h.biaya - d.r.saldo : 0;
          const status = !d ? null : kunci ? `Khusus ${levelById(h.minLevel!).nama} ke atas` : kurang > 0 ? `Kurang ${angka(kurang)} bintik` : 'Bisa ditukar';
          return (
            <KartuTaut key={h.id} href={`/hadiah/${h.id}`} label={`${h.nama}, ${angka(h.biaya)} bintik${status ? ', ' + status : ''}`} style={StyleSheet.flatten([s.kartu, lebar ? s.lebar : s.sempit])}>
              <View style={[s.gambar, lebar && { height: 150 }]}>
                {h.foto ? <Foto k={h.foto} bentuk={lebar ? 'l' : 'k'} alt={h.nama} lebarTampil={lebar ? 360 : 172} /> : (
                  <View style={s.tanpaFoto}>
                    <Bintik benih={h.biaya} jumlah={50} kuat={0.8} />
                    <Medali ikon={IKON[h.ikon ?? 'shot']} ukuran={lebar ? 76 : 60} />
                  </View>
                )}
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
  filter: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kartu: { backgroundColor: W.kertas, borderRadius: 22, borderWidth: 1, borderColor: W.garis, overflow: 'hidden' },
  lebar: { width: '100%' },
  sempit: { width: '48.5%' },
  gambar: { height: 120, backgroundColor: W.garis },
  tanpaFoto: { flex: 1, backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  harga: { position: 'absolute', left: 10, bottom: 10, backgroundColor: W.hijauTua, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
});
