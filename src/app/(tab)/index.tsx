import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Layar, JudulBagian } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { KartuMember } from '@/ui/KartuMember';
import { Meter } from '@/ui/Meter';
import { Bintik } from '@/ui/Bintik';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { KartuTaut, TombolIkon } from '@/ui/Tombol';
import { Kerangka, StatusBuka, Lencana } from '@/ui/Kecil';
import { W, BIBIR } from '@/ui/tema';
import { KartuCap } from '@/ui/KartuCap';
import { Gabung } from '@/ui/Gabung';
import { useData } from '@/lib/pakai';
import { lewatiGabung } from '@/lib/toko';
import { voucherAktif } from '@/lib/hitung';
import { meta } from '@/lib/meta';
import { angka, jarakKm, rupiah } from '@/lib/format';
import { sapaan, tglPanjang, tglPendek, relatifHari, jamMenit, HARI } from '@/lib/waktu';
import { MUSIMAN } from '@/data/menu';
import { HADIAH } from '@/data/hadiah';
import { OUTLET, LOKASI_CONTOH, jarak, statusBuka, outletBySlug } from '@/data/outlet';
import { urutanLevel } from '@/data/level';

export function generateMetadata() {
  return meta({
    judul: 'Kopi Blirik: Aplikasi Member & Poin Kafe | PintuWeb',
    desk: 'Coba demo aplikasi member Kopi Blirik: kartu QR, saldo bintik, level, tukar voucher, menu musim hujan, outlet terdekat, dan pesan ambil.',
    jalur: '/',
  });
}

export default function Beranda() {
  const d = useData();
  const nama = d ? d.a.nama.split(' ')[0] : null;
  const aktif = d ? voucherAktif(d.a, d.kini) : [];
  const lokasi = d ? LOKASI_CONTOH.find((l) => l.id === d.a.lokasi) ?? LOKASI_CONTOH[0] : null;
  const terdekat = lokasi ? [...OUTLET].sort((x, y) => jarak(lokasi, x) - jarak(lokasi, y))[0] : null;
  const fav = d ? outletBySlug(d.a.outletFav)! : null;
  const bisa = d ? HADIAH.filter((h) => h.biaya <= d.r.saldo && (!h.minLevel || urutanLevel(d.r.level.id) >= urutanLevel(h.minLevel))).sort((x, y) => y.biaya - x.biaya).slice(0, 3) : [];
  const [besar, ...kecil] = MUSIMAN.slice(0, 3);
  const aktifPesanan = d ? d.a.pesanan.find((p) => p.status === 'aktif') : null;
  const mingguIni = d ? d.r.riwayat.filter((e) => e.jumlah > 0 && e.waktu > d.kini - 7 * HARI).reduce((x, e) => x + e.jumlah, 0) : 0;
  const [gabung, setGabung] = useState(false);
  // Dari Akun > "Ulangi perkenalan": /?kenalan=1 langsung membuka lembar perkenalan.
  const { kenalan } = useLocalSearchParams<{ kenalan?: string }>();
  const siap = !!d;
  useEffect(() => {
    if (kenalan === '1' && siap) setGabung(true);
  }, [kenalan, siap]);

  return (
    <Layar tab>
      <View style={s.kepala}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="label" warna={W.hijau}>{d ? tglPanjang(d.kini) : 'Kawan Blirik'}</T>
          <T v="judul1" h={1} numberOfLines={2} style={{ minHeight: 70 }}>{d ? `${sapaan(d.kini)}, ${nama}` : 'Halo, kawan Blirik'}</T>
        </View>
        <KartuTaut href="/akun" label="Buka akun dan preferensi" style={s.avatar}>
          <Bintik benih={5} jumlah={24} warna={W.kertas} kuat={0.9} />
          <T v="judul2" warna={W.kertas} aria-hidden>{nama ? nama[0] : 'K'}</T>
        </KartuTaut>
      </View>

      <KartuTaut href="/kartu">
        <KartuMember nama={d?.a.nama} nomor={d?.a.nomor} level={d?.r.level}>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
              {d ? <T v="raksasa" warna={W.hijauTua}>{angka(d.r.saldo)}</T> : <Kerangka tinggi={48} lebar={130} />}
              <T v="isiTebal" style={{ marginBottom: 6 }}>bintik</T>
              <View style={{ flex: 1 }} />
              <View style={s.tunjuk}>
                <Ikon n="pindai" ukuran={18} warna={W.kertas} tebal={2} />
                <T v="kecilTebal" warna={W.kertas}>Tunjukkan</T>
              </View>
            </View>
            {d ? (
              <View style={s.kemajuan}>
                <Meter nilai={d.r.terkumpul} maks={d.r.berikut?.min ?? d.r.terkumpul} label={`Kemajuan ke level ${d.r.berikut?.nama ?? 'tertinggi'}`} />
                <View>
                  <T v="kecil" warna={W.tinta} numberOfLines={1}>
                    {d.r.berikut ? `${angka(d.r.kurang)} bintik lagi ke ${d.r.berikut.nama} (180 hari)` : 'Kamu sudah di level tertinggi'}
                  </T>
                  <T v="kecil" warna={W.tinta} numberOfLines={1}>{mingguIni ? `+${angka(mingguIni)} bintik dalam 7 hari terakhir` : 'Belum ada bintik minggu ini'}</T>
                </View>
              </View>
            ) : (
              <Kerangka tinggi={63} />
            )}
          </View>
        </KartuMember>
      </KartuTaut>

      <View style={s.duaKolom}>
        <KartuTaut href="/pesan" style={[s.ubin, s.ubinHijau]}>
          <Bintik benih={21} jumlah={40} warna={W.kertas} kuat={0.6} />
          <Ikon n="pesan" ukuran={30} warna={W.mentega} tebal={2} />
          <T v="judul2" warna={W.kertas}>Pesan ambil</T>
          <T v="kecil" warna={W.hijauPucat}>{fav ? `Siap ±15 menit di ${fav.nama}` : 'Pesan dulu, ambil tanpa antre'}</T>
        </KartuTaut>
        <KartuTaut href="/voucher" style={[s.ubin, s.ubinMentega]}>
          <Ikon n="voucher" ukuran={30} warna={W.hijauTua} tebal={2} />
          <T v="judul2" warna={W.hijauTua}>{d ? `${aktif.length} voucher` : 'Voucher'}</T>
          <T v="kecil" warna={W.tinta}>
            {d ? (aktif[0] ? `${aktif[0].nama} berakhir ${relatifHari(aktif[0].berlaku, d.kini)}` : 'Belum ada voucher aktif') : 'Voucher aktif kamu'}
          </T>
        </KartuTaut>
      </View>

      {/* Slot tetap supaya isi di bawahnya tidak bergeser saat data perangkat termuat. */}
      {!d ? (
        <Kerangka tinggi={66} />
      ) : !d.a.gabung && !aktifPesanan ? (
        <View style={[s.hangus, s.kenalan]}>
          <Pressable role="button" onPress={() => setGabung(true)} style={s.kenalanTombol}>
            <Ikon n="kartu" warna={W.hijauTua} tebal={2.2} />
            <T v="kecil" warna={W.tinta} style={{ flex: 1 }}>
              <T v="kecilTebal" warna={W.hijauTua}>Baru di sini? </T>
              Kenalan dulu dengan aplikasi ini, 3 langkah.
            </T>
            <Ikon n="kanan" ukuran={18} warna={W.hijauTua} />
          </Pressable>
          <TombolIkon n="tutup" label="Lewati perkenalan" onPress={lewatiGabung} latar={W.mentegaPucat} />
        </View>
      ) : aktifPesanan ? (
        <KartuTaut href={{ pathname: '/pesanan', params: { id: aktifPesanan.id } }} style={StyleSheet.flatten([s.hangus, s.aman])}>
          <Ikon n="pesan" warna={W.hijau} tebal={2.2} />
          <T v="kecil" warna={W.tinta} style={{ flex: 1 }}>
            <T v="kecilTebal" warna={W.hijauTua}>Pesanan {aktifPesanan.nomor} siap {jamMenit(aktifPesanan.ambil)} WIB. </T>
            Ambil di {outletBySlug(aktifPesanan.outlet)?.nama}.
          </T>
          <Ikon n="kanan" ukuran={18} warna={W.hijau} />
        </KartuTaut>
      ) : d.r.akanHangus ? (
        <KartuTaut href="/poin" style={s.hangus}>
          <Ikon n="peringatan" warna={W.merah} tebal={2} />
          <T v="kecil" warna={W.tinta} style={{ flex: 1 }}>
            <T v="kecilTebal" warna={W.merah}>{angka(d.r.akanHangus.jumlah)} bintik hangus {tglPendek(d.r.akanHangus.tanggal)}. </T>
            Tukar sebelum tanggal itu.
          </T>
          <Ikon n="kanan" ukuran={18} warna={W.merah} />
        </KartuTaut>
      ) : (
        <KartuTaut href="/poin" style={StyleSheet.flatten([s.hangus, s.aman])}>
          <Ikon n="centang" warna={W.hijau} tebal={2.2} />
          <T v="kecil" warna={W.tinta} style={{ flex: 1 }}>Tidak ada bintik yang hangus dalam 45 hari ke depan.</T>
          <Ikon n="kanan" ukuran={18} warna={W.hijau} />
        </KartuTaut>
      )}

      <JudulBagian judul="Menu musim hujan" href="/promo" tautan="Semua promo" label="Lihat semua promo dan menu musiman" />
      <View style={s.bento}>
        <KartuTaut href={`/promo/${besar.id}`} style={s.bentoBesar}>
          <Foto k={besar.foto!} alt={besar.nama} lebarTampil={180} prioritas style={StyleSheet.absoluteFill} />
          <View style={s.bentoTeks}>
            <Lencana teks="Bintik 2×" ragam="mentega" />
            <T v="sub" warna={W.kertas}>{besar.nama}</T>
            <T v="kecilTebal" warna={W.mentega}>{rupiah(besar.harga)}</T>
          </View>
        </KartuTaut>
        <View style={{ flex: 1, gap: 10 }}>
          {kecil.map((m) => (
            <KartuTaut key={m.id} href={`/promo/${m.id}`} style={s.bentoKecil}>
              <View style={s.bentoFoto}>
                <Foto k={m.foto!} alt={m.nama} lebarTampil={160} />
              </View>
              <View style={{ padding: 10, gap: 0 }}>
                <T v="kecilTebal" numberOfLines={2}>{m.nama}</T>
                <T v="kecil">{rupiah(m.harga)}</T>
              </View>
            </KartuTaut>
          ))}
        </View>
      </View>

      <KartuTaut href="/promo" style={s.capTaut}>
        <KartuCap cap={d ? d.a.cap : null} />
      </KartuTaut>

      <JudulBagian judul="Outlet terdekat" href="/outlet" tautan="Semua outlet" label="Lihat semua outlet" />
      {terdekat && lokasi && d ? (
        <KartuTaut href={`/outlet/${terdekat.slug}`} style={s.outlet}>
          <View style={s.outletFoto}>
            <Foto k={terdekat.foto} alt={`Suasana ${terdekat.nama}`} lebarTampil={96} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <T v="judul3">{terdekat.nama}</T>
            <StatusBuka st={statusBuka(terdekat, d.kini)} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ikon n="lokasi" ukuran={16} warna={W.abu} />
              <T v="kecil">{jarakKm(jarak(lokasi, terdekat))} dari {lokasi.nama} (lokasi contoh)</T>
            </View>
          </View>
        </KartuTaut>
      ) : (
        <Kerangka tinggi={112} />
      )}

      <JudulBagian judul="Bisa kamu tukar" href="/hadiah" tautan="Katalog" label="Buka katalog hadiah" />
      {d ? (
        <View style={{ gap: 10 }}>
          {bisa.map((h) => (
            <KartuTaut key={h.id} href={`/hadiah/${h.id}`} style={s.hadiah}>
              <View style={s.biaya}>
                <T v="judul3" warna={W.hijauTua}>{angka(h.biaya)}</T>
                <T v="kecil" warna={W.hijauTua} style={{ fontSize: 12, lineHeight: 14 }}>bintik</T>
              </View>
              <T v="isiTebal" style={{ flex: 1 }}>{h.nama}</T>
              <Ikon n="kanan" ukuran={18} warna={W.abu} />
            </KartuTaut>
          ))}
        </View>
      ) : (
        <Kerangka tinggi={190} />
      )}

      <JudulBagian judul="Bintik terakhir" href="/poin" tautan="Riwayat" label="Lihat riwayat bintik" />
      {d ? (
        <View style={s.daftar}>
          {d.r.riwayat.slice(0, 3).map((e, i) => (
            <View key={e.id} style={[s.barisBintik, i > 0 && { borderTopWidth: 1, borderTopColor: W.garis }]}>
              <View style={{ flex: 1 }}>
                <T v="isiTebal" numberOfLines={1}>{e.ket}</T>
                <T v="kecil">{tglPendek(e.waktu)}</T>
              </View>
              <T v="sub" warna={e.jumlah > 0 ? W.hijau : W.merah}>{e.jumlah > 0 ? `+${angka(e.jumlah)}` : angka(e.jumlah)}</T>
            </View>
          ))}
        </View>
      ) : (
        <Kerangka tinggi={180} />
      )}
      {d ? <Gabung a={d.a} level={d.r.level} terbuka={gabung} onTutup={() => setGabung(false)} /> : null}
    </Layar>
  );
}

const s = StyleSheet.create({
  kepala: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: W.hijau, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: W.mentega },
  kemajuan: { gap: 8, height: 63 },
  tunjuk: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: W.hijau, borderRadius: 999, paddingHorizontal: 12, minHeight: 34, marginBottom: 6 },
  duaKolom: { flexDirection: 'row', gap: 10 },
  ubin: { flex: 1, borderRadius: 24, padding: 16, gap: 6, minHeight: 156, overflow: 'hidden' },
  ubinHijau: { backgroundColor: W.hijau },
  ubinMentega: { backgroundColor: W.mentegaPucat, borderWidth: 2, borderColor: W.mentega },
  hangus: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: W.merahPucat, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, minHeight: 66, borderWidth: 1, borderColor: '#EBC3B6' },
  aman: { backgroundColor: W.hijauPucat, borderColor: '#B9CFBF' },
  capTaut: { borderRadius: 22 },
  kenalan: { backgroundColor: W.mentegaPucat, borderColor: W.mentega, paddingVertical: 6, paddingRight: 8 },
  kenalanTombol: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50 },
  bento: { flexDirection: 'row', gap: 10, height: 300 },
  bentoBesar: { flex: 1.1, borderRadius: 24, overflow: 'hidden', backgroundColor: W.garis, justifyContent: 'flex-end' },
  bentoTeks: { padding: 14, gap: 4, backgroundColor: 'rgba(15,53,36,0.82)' },
  bentoKecil: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: W.kertas, ...BIBIR },
  bentoFoto: { height: 74, backgroundColor: W.garis },
  outlet: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: W.kertas, borderRadius: 22, ...BIBIR, padding: 10 },
  outletFoto: { width: 92, height: 92, borderRadius: 16, overflow: 'hidden', backgroundColor: W.garis },
  hadiah: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.kertas, borderRadius: 18, ...BIBIR, padding: 10, minHeight: 60 },
  biaya: { width: 62, height: 46, borderRadius: 14, backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center' },
  daftar: { backgroundColor: W.kertas, borderRadius: 20, ...BIBIR, paddingHorizontal: 14 },
  barisBintik: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
});
