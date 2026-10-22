import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { Tombol } from '@/ui/Tombol';
import { Kerangka, Kotak, Lencana, Medali } from '@/ui/Kecil';
import { Lembar } from '@/ui/Lembar';
import { Bintik } from '@/ui/Bintik';
import { Tiket } from '@/ui/Tiket';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { tukarHadiah } from '@/lib/toko';
import { meta } from '@/lib/meta';
import { angka } from '@/lib/format';
import { tglSedang, akhirHari } from '@/lib/waktu';
import { HADIAH, hadiahById, SYARAT_UMUM } from '@/data/hadiah';
import { levelById, urutanLevel } from '@/data/level';
import NotFound from '../+not-found';

export function generateStaticParams() {
  return HADIAH.map((h) => ({ id: h.id }));
}

export function generateMetadata(_r: unknown, params: Record<string, string>) {
  const h = hadiahById(params.id);
  if (!h) return meta({ judul: 'Hadiah tidak ditemukan · Kopi Blirik', desk: 'Hadiah ini tidak ada di katalog Kopi Blirik.', jalur: '/hadiah', noindex: true });
  return meta({
    judul: `${h.nama} · Hadiah Kopi Blirik`.slice(0, 60),
    desk: `Tukar ${angka(h.biaya)} bintik Kopi Blirik untuk ${h.nama.toLowerCase()}. ${h.desk}`.slice(0, 155),
    jalur: `/hadiah/${h.id}`,
  });
}

export default function DetailHadiah() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const h = hadiahById(id);
  const d = useData();
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [kode, setKode] = useState<string | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  if (!h) return <NotFound />;

  const kunci = !!(h.minLevel && d && urutanLevel(d.r.level.id) < urutanLevel(h.minLevel));
  const kurang = d ? h.biaya - d.r.saldo : 0;
  const bisa = !!d && !kunci && kurang <= 0;

  return (
    <Layar
      judul="Hadiah"
      induk="/hadiah"
      bawah={
        <View style={s.bilah}>
          <View style={{ flex: 1 }}>
            <T v="kecil">Saldo kamu</T>
            {d ? <T v="judul3">{angka(d.r.saldo)} bintik</T> : <Kerangka tinggi={22} lebar={100} />}
          </View>
          <Tombol
            teks={!d ? 'Memuat…' : kunci ? `Khusus ${levelById(h.minLevel!).nama}` : kurang > 0 ? `Kurang ${angka(kurang)}` : `Tukar ${angka(h.biaya)} bintik`}
            disabled={!bisa}
            onPress={() => setKonfirmasi(true)}
          />
        </View>
      }
    >
      <View style={s.gambar}>
        {h.foto ? <Foto k={h.foto} bentuk="l" alt={h.nama} prioritas lebarTampil={360} /> : (
          <View style={s.tanpaFoto}>
            <Bintik benih={h.biaya} jumlah={80} kuat={0.9} />
            <Medali ikon={h.ikon === 'kelas' ? 'daun' : h.ikon === 'potongan' ? 'voucher' : h.ikon === 'naik' ? 'tambah' : 'cangkir'} ukuran={96} />
          </View>
        )}
      </View>
      <View style={{ gap: 6 }}>
        <Lencana teks={`${angka(h.biaya)} bintik`} ragam="mentega" ikon="bintang" />
        <T v="judul1" h={1}>{h.nama}</T>
        <T v="isi">{h.desk}</T>
      </View>

      {h.minLevel ? (
        <Kotak style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ikon n="kunci" warna={W.hijau} />
          <T v="isi" style={{ flex: 1 }}>Hanya untuk member level {levelById(h.minLevel).nama} ke atas.</T>
        </Kotak>
      ) : null}

      <Kotak>
        <T v="judul3" h={2}>Syarat</T>
        {[`Voucher berlaku ${h.berlakuHari} hari sejak ditukar, sampai pukul 23.59 WIB.`, h.pakai.tipe === 'di-kasir' ? 'Ditukarkan langsung di kasir outlet, tidak lewat pesan ambil.' : 'Bisa dipakai di kasir atau dipilih saat pesan ambil.', ...SYARAT_UMUM.slice(0, 2)].map((t) => (
          <View key={t} style={{ flexDirection: 'row', gap: 10 }}>
            <View style={s.butir} />
            <T v="isi" style={{ flex: 1 }}>{t}</T>
          </View>
        ))}
      </Kotak>

      <Lembar
        terbuka={konfirmasi}
        onTutup={() => {
          setKonfirmasi(false);
          setKode(null);
          setGalat(null);
        }}
        judul={kode ? 'Voucher siap dipakai' : 'Tukar bintik?'}
        bawah={
          kode ? (
            <Tombol teks="Lihat voucher saya" penuh onPress={() => { setKonfirmasi(false); router.push({ pathname: '/voucher', params: { kode } }); }} />
          ) : (
            <Tombol
              teks={`Ya, tukar ${angka(h.biaya)} bintik`}
              penuh
              onPress={() => {
                const r = tukarHadiah(h.id);
                if (r.ok) setKode(r.kode);
                else setGalat(r.alasan);
              }}
            />
          )
        }
      >
        {kode && d ? (
          <Tiket
            latar={W.kertas}
            kiri={
              <>
                <T v="isiTebal">{h.nama}</T>
                <T v="kode" selectable>{kode}</T>
                <T v="kecil">Berlaku sampai {tglSedang(akhirHari(d.kini, h.berlakuHari))}, 23.59 WIB</T>
              </>
            }
            kanan={<Ikon n="voucher" ukuran={40} warna={W.hijau} tebal={1.8} />}
          />
        ) : d ? (
          <View style={{ gap: 8 }}>
            <T v="isi">Saldo bintikmu akan berkurang dari {angka(d.r.saldo)} menjadi {angka(d.r.saldo - h.biaya)}. Bintik yang ditukar tidak bisa dikembalikan.</T>
            <T v="kecil">Penukaran tidak menurunkan level. Level dihitung dari bintik yang kamu dapat, bukan saldo.</T>
            {galat ? <T v="isiTebal" warna={W.merah}>{galat}</T> : null}
          </View>
        ) : null}
      </Lembar>
    </Layar>
  );
}

const s = StyleSheet.create({
  gambar: { height: 240, borderRadius: 26, overflow: 'hidden', backgroundColor: W.garis, marginTop: 12 },
  tanpaFoto: { flex: 1, backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bilah: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.kertas, borderTopWidth: 1, borderTopColor: W.garis, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  butir: { width: 8, height: 8, borderRadius: 4, backgroundColor: W.hijau, marginTop: 8 },
});
