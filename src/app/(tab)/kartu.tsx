import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layar, Pita } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { KartuMember } from '@/ui/KartuMember';
import { QR } from '@/ui/QR';
import { Ikon } from '@/ui/Ikon';
import { Tombol, TautanTombol } from '@/ui/Tombol';
import { Kerangka, Kotak } from '@/ui/Kecil';
import { Lembar } from '@/ui/Lembar';
import { Bintik } from '@/ui/Bintik';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { simulasiPindai } from '@/lib/toko';
import type { Trx } from '@/lib/jenis';
import { meta } from '@/lib/meta';
import { angka, fnv, rupiah } from '@/lib/format';
import { jamMenit } from '@/lib/waktu';
import { outletBySlug } from '@/data/outlet';

export function generateMetadata() {
  return meta({
    judul: 'Kartu Member QR · Kopi Blirik',
    desk: 'Kartu member Kopi Blirik dengan kode QR yang dibuat di perangkat dan berganti tiap 60 detik. Tunjukkan ke kasir, bintik masuk otomatis.',
    jalur: '/kartu',
  });
}

const PERIODE = 60_000;

export default function Kartu() {
  const d = useData(1000);
  const [struk, setStruk] = useState<Trx | null>(null);
  const slot = d ? Math.floor(d.kini / PERIODE) : 0;
  const sisa = d ? Math.ceil((PERIODE - (d.kini % PERIODE)) / 1000) : 60;
  const nomor = d?.a.nomor.replace(/\s/g, '') ?? '';
  const isiQR = d ? `BLIRIK|M|${nomor}|${slot}|${fnv(`${nomor}:${slot}:blirik`)}` : '';

  return (
    <Layar tab>
      <Pita label="Kartu Kawan Blirik" judul="Tunjukkan ke kasir" />
      <KartuMember nama={d?.a.nama} nomor={d?.a.nomor} level={d?.r.level} benih={17}>
        <View style={s.qrWadah}>
          {d ? <QR teks={isiQR} ukuran={228} label={`Kode QR member ${d.a.nomor}, berganti dalam ${sisa} detik`} /> : <Kerangka tinggi={228} lebar={228} bulat={14} />}
        </View>
        <View style={s.hitung}>
          <Ikon n="ulang" ukuran={18} warna={W.hijau} tebal={2} />
          <T v="kecilTebal" warna={W.hijauTua}>
            {d ? `Kode berganti dalam ${sisa} detik` : 'Kode berganti tiap 60 detik'}
          </T>
        </View>
      </KartuMember>

      <View style={s.saldo}>
        <Bintik benih={9} jumlah={34} warna={W.kertas} kuat={0.5} />
        <View style={{ flex: 1 }}>
          <T v="label" warna={W.hijauPucat}>Saldo bintik</T>
          {d ? <T v="angka" warna={W.kertas}>{angka(d.r.saldo)}</T> : <Kerangka tinggi={38} lebar={110} />}
        </View>
        <TautanTombol href="/poin" teks="Riwayat" ragam="mentega" kecil />
      </View>

      <Kotak>
        <T v="judul3" h={2}>Cara pakai</T>
        {[
          ['pindai', 'Tunjukkan kode sebelum membayar. Kasir memindainya, bintik masuk ke saldomu.'],
          ['ulang', 'Kode berganti tiap menit supaya tangkapan layar lama tidak bisa dipakai orang lain.'],
          ['telepon', 'Kamera kasir bermasalah? Sebutkan nomor member di bawah kartu.'],
        ].map(([ikon, teks]) => (
          <View key={ikon} style={s.langkah}>
            <View style={s.bulat}>
              <Ikon n={ikon as 'pindai'} ukuran={18} warna={W.hijau} tebal={2} />
            </View>
            <T v="isi" style={{ flex: 1 }}>{teks}</T>
          </View>
        ))}
      </Kotak>

      <Kotak style={{ backgroundColor: W.mentegaPucat, borderColor: W.mentega }}>
        <T v="judul3" h={2}>Coba sebagai kasir</T>
        <T v="isi">Demo ini tidak punya kasir sungguhan. Tekan tombol di bawah untuk mensimulasikan pemindaian: satu transaksi acak dibuat di outlet favoritmu dan bintiknya masuk.</T>
        <Tombol
          teks="Simulasikan pindai kasir"
          ikon="pindai"
          disabled={!d}
          onPress={() => setStruk(simulasiPindai())}
          style={{ marginTop: 4 }}
        />
      </Kotak>

      <Lembar terbuka={!!struk} onTutup={() => setStruk(null)} judul="Bintik masuk" bawah={<Tombol teks="Selesai" penuh onPress={() => setStruk(null)} />}>
        {struk ? (
          <View style={{ gap: 12 }}>
            <View style={s.dapat}>
              <Bintik benih={struk.bintik} jumlah={60} warna={W.mentega} kuat={0.9} />
              <T v="raksasa" warna={W.kertas}>+{angka(struk.bintik)}</T>
              <T v="isiTebal" warna={W.hijauPucat}>bintik dari kunjungan ini</T>
            </View>
            <T v="kecil">
              {outletBySlug(struk.outlet)?.nama} · {jamMenit(struk.waktu)} WIB
            </T>
            {struk.item.map((i) => (
              <View key={i.kunci} style={s.baris}>
                <View style={{ flex: 1 }}>
                  <T v="isiTebal">{i.qty}× {i.nama}</T>
                  {i.opsi.length ? <T v="kecil">{i.opsi.join(' · ')}</T> : null}
                </View>
                <T v="isi">{rupiah(i.harga * i.qty)}</T>
              </View>
            ))}
            <View style={[s.baris, { borderTopWidth: 1, borderTopColor: W.garis, paddingTop: 10 }]}>
              <T v="isiTebal" style={{ flex: 1 }}>Total</T>
              <T v="isiTebal">{rupiah(struk.total)}</T>
            </View>
          </View>
        ) : null}
      </Lembar>
    </Layar>
  );
}

const s = StyleSheet.create({
  qrWadah: { alignSelf: 'center', padding: 10, backgroundColor: '#fff', borderRadius: 22, borderWidth: 3, borderColor: W.hijau, marginTop: 4 },
  hitung: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  saldo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.hijau, borderRadius: 22, padding: 16, overflow: 'hidden' },
  langkah: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  bulat: { width: 34, height: 34, borderRadius: 17, backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center' },
  dapat: { backgroundColor: W.hijau, borderRadius: 22, padding: 18, alignItems: 'center', overflow: 'hidden' },
  baris: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
});
