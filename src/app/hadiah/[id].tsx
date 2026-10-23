import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Tombol, TautanTombol } from '@/ui/Tombol';
import { Kerangka, Kotak, Lencana } from '@/ui/Kecil';
import { Lembar } from '@/ui/Lembar';
import { Tiket } from '@/ui/Tiket';
import { Meter } from '@/ui/Meter';
import { GambarHadiah } from '@/ui/GambarHadiah';
import { IlustrasiHadiah } from '@/ui/IlustrasiHadiah';
import { Tercetak } from '@/ui/Gerak';
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
  const h = HADIAH.find((x) => x.id === params.id);
  if (!h) return meta({ judul: 'Hadiah tidak ditemukan · Kopi Blirik', desk: 'Hadiah ini tidak ada di katalog Kopi Blirik.', jalur: '/hadiah', noindex: true });
  return meta({
    judul: `${h.nama} · Hadiah Kopi Blirik`.slice(0, 60),
    desk: `Tukar ${angka(h.biaya)} bintik Kopi Blirik untuk ${h.nama.toLowerCase()}. ${h.desk}`.slice(0, 155),
    jalur: `/hadiah/${h.id}`,
  });
}

export default function DetailHadiah() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const h = HADIAH.find((x) => x.id === id) ? hadiahById(id) : undefined;
  const d = useData();
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [hasil, setHasil] = useState<{ kode: string; saldo: number; berlaku: number } | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  if (!h) return <NotFound />;

  const lv = h.minLevel ? levelById(h.minLevel) : null;
  const kunci = !!(lv && d && urutanLevel(d.r.level.id) < urutanLevel(lv.id));
  const kurang = d ? h.biaya - d.r.saldo : 0;
  const bisa = !!d && !kunci && kurang <= 0;
  const tutup = () => {
    setKonfirmasi(false);
    setHasil(null);
    setGalat(null);
  };

  return (
    <Layar
      judul="Hadiah"
      induk="/hadiah"
      bawah={
        <View style={s.bilah}>
          {bisa || !d ? (
            <>
              <View style={{ flex: 1 }}>
                <T v="kecil">Saldo kamu</T>
                {d ? <T v="judul3">{angka(d.r.saldo)} bintik</T> : <Kerangka tinggi={22} lebar={100} />}
              </View>
              <Tombol teks={d ? `Tukar ${angka(h.biaya)} bintik` : 'Memuat…'} disabled={!bisa} onPress={() => setKonfirmasi(true)} />
            </>
          ) : (
            <>
              <TautanTombol href="/kartu" teks="Kumpulkan bintik" ikon="pindai" style={{ flex: 1 }} penuh />
              <Tombol teks="Tukar" ragam="garis" disabled label={`Tukar ${h.nama}, belum bisa`} />
            </>
          )}
        </View>
      }
    >
      <View style={s.gambar}>
        <GambarHadiah h={h} lebar tinggi={240} prioritas />
      </View>
      <View style={{ gap: 6 }}>
        <Lencana teks={`${angka(h.biaya)} bintik`} ragam="mentega" ikon="bintang" />
        <T v="judul1" h={1}>{h.nama}</T>
        <T v="isi">{h.desk}</T>
      </View>

      {d && !bisa ? (
        <Kotak style={{ backgroundColor: W.mentegaPucat }}>
          <T v="judul3" h={2}>Sebentar lagi</T>
          <Meter nilai={Math.min(d.r.saldo, h.biaya)} maks={h.biaya} jumlah={22} label={`${angka(Math.min(d.r.saldo, h.biaya))} dari ${angka(h.biaya)} bintik`} />
          <T v="nominal">{angka(Math.min(d.r.saldo, h.biaya))} / {angka(h.biaya)} bintik</T>
          {kurang > 0 ? <T v="isi">Kurang {angka(kurang)} bintik. Satu Kopi Susu Blirik memberi sekitar {Math.floor(22 * d.r.level.kali)} bintik.</T> : null}
          {kunci && lv ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <Ikon n="kunci" ukuran={20} warna={W.hijau} />
              <T v="isi" style={{ flex: 1 }}>Khusus level {lv.nama} ke atas. Levelmu {d.r.level.nama}: kumpulkan {angka(Math.max(0, lv.min - d.r.terkumpul))} bintik lagi dalam 180 hari.</T>
            </View>
          ) : null}
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
        onTutup={tutup}
        judul={hasil ? 'Voucher tercetak!' : 'Tukar bintik?'}
        bawah={
          hasil ? (
            <View style={{ gap: 8 }}>
              <Tombol teks="Tunjukkan sekarang" ikon="pindai" onPress={() => { tutup(); router.push({ pathname: '/voucher', params: { kode: hasil.kode } }); }} penuh />
              <Tombol teks="Simpan untuk nanti" ragam="garis" onPress={tutup} penuh />
            </View>
          ) : (
            <Tombol
              teks={`Ya, tukar ${angka(h.biaya)} bintik`}
              penuh
              onPress={() => {
                const sebelum = d?.r.saldo ?? 0;
                const r = tukarHadiah(h.id);
                if (r.ok) setHasil({ kode: r.kode, saldo: sebelum - h.biaya, berlaku: akhirHari(Date.now(), h.berlakuHari) });
                else setGalat(r.alasan);
              }}
            />
          )
        }
      >
        {hasil ? (
          <View style={{ gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              {h.foto ? (
                <View style={s.fotoBulat}>
                  <GambarHadiah h={h} tinggi={120} />
                </View>
              ) : (
                <IlustrasiHadiah id={h.ikon ?? 'shot'} ukuran={140} label={`Ilustrasi ${h.nama}`} />
              )}
            </View>
            <T v="isi" tengah aria-live="polite">
              {h.nama} siap dipakai. Saldo bintikmu sekarang {angka(hasil.saldo)}.
            </T>
            <Tercetak>
              <Tiket
                latar={W.kertas}
                kiri={
                  <>
                    <T v="isiTebal">{h.nama}</T>
                    <T v="kode" selectable>{hasil.kode}</T>
                    <T v="kecil">Berlaku {h.berlakuHari} hari · sampai {tglSedang(hasil.berlaku)}, 23.59 WIB</T>
                  </>
                }
                kanan={
                  <View style={s.cap}>
                    <T v="kecilTebal" warna={W.merah} tengah style={{ fontSize: 13 }}>TERCETAK</T>
                  </View>
                }
              />
            </Tercetak>
          </View>
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
  gambar: { height: 240, borderRadius: 26, overflow: 'hidden', backgroundColor: W.hijauPucat, marginTop: 12, borderWidth: 1, borderColor: W.garis, borderTopWidth: 4, borderTopColor: W.hijau },
  bilah: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.kertas, borderTopWidth: 3, borderTopColor: W.hijau, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  butir: { width: 8, height: 8, borderRadius: 4, backgroundColor: W.hijau, marginTop: 8 },
  fotoBulat: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', borderWidth: 4, borderColor: W.hijau },
  cap: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: W.merah, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-14deg' }] },
});
