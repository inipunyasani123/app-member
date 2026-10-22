import { View, StyleSheet } from 'react-native';
import { Layar, JudulBagian } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { KartuMember } from '@/ui/KartuMember';
import { Meter } from '@/ui/Meter';
import { Bintik } from '@/ui/Bintik';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { KartuTaut } from '@/ui/Tombol';
import { Kerangka, StatusBuka, Lencana } from '@/ui/Kecil';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { voucherAktif } from '@/lib/hitung';
import { meta } from '@/lib/meta';
import { angka, jarakKm, rupiah } from '@/lib/format';
import { sapaan, tglPanjang, tglPendek, relatifHari } from '@/lib/waktu';
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

  return (
    <Layar tab>
      <View style={s.kepala}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="label" warna={W.hijau}>{d ? tglPanjang(d.kini) : 'Kawan Blirik'}</T>
          <T v="judul1" h={1}>{d ? `${sapaan(d.kini)}, ${nama}` : 'Halo, kawan Blirik'}</T>
        </View>
        <KartuTaut href="/akun" label="Buka akun dan preferensi" style={s.avatar}>
          <Bintik benih={5} jumlah={24} warna={W.kertas} kuat={0.9} />
          <T v="judul2" warna={W.kertas}>{nama ? nama[0] : 'K'}</T>
        </KartuTaut>
      </View>

      <KartuTaut href="/kartu" label={d ? `Kartu member, saldo ${angka(d.r.saldo)} bintik, level ${d.r.level.nama}. Buka kode QR` : 'Buka kartu member'}>
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
              <>
                <Meter nilai={d.r.terkumpul} maks={d.r.berikut?.min ?? d.r.terkumpul} label={`Kemajuan ke level ${d.r.berikut?.nama ?? 'tertinggi'}`} />
                <T v="kecil" warna={W.tinta}>
                  {d.r.berikut ? `${angka(d.r.kurang)} bintik lagi dalam 180 hari untuk naik ke ${d.r.berikut.nama}` : 'Kamu sudah di level tertinggi'}
                </T>
              </>
            ) : (
              <Kerangka tinggi={36} />
            )}
          </View>
        </KartuMember>
      </KartuTaut>

      <View style={s.duaKolom}>
        <KartuTaut href="/pesan" label="Pesan ambil di outlet" style={[s.ubin, s.ubinHijau]}>
          <Bintik benih={21} jumlah={40} warna={W.kertas} kuat={0.6} />
          <Ikon n="pesan" ukuran={30} warna={W.mentega} tebal={2} />
          <T v="judul2" warna={W.kertas}>Pesan ambil</T>
          <T v="kecil" warna={W.hijauPucat}>{fav ? `Siap ±15 menit di ${fav.nama}` : 'Pesan dulu, ambil tanpa antre'}</T>
        </KartuTaut>
        <KartuTaut href="/voucher" label={`Voucher saya, ${aktif.length} aktif`} style={[s.ubin, s.ubinMentega]}>
          <Ikon n="voucher" ukuran={30} warna={W.hijauTua} tebal={2} />
          <T v="judul2" warna={W.hijauTua}>{d ? `${aktif.length} voucher` : 'Voucher'}</T>
          <T v="kecil" warna={W.tinta}>
            {d ? (aktif[0] ? `${aktif[0].nama} berakhir ${relatifHari(aktif[0].berlaku, d.kini)}` : 'Belum ada voucher aktif') : 'Voucher aktif kamu'}
          </T>
        </KartuTaut>
      </View>

      {d?.r.akanHangus ? (
        <KartuTaut href="/poin" label="Lihat bintik yang akan hangus" style={s.hangus}>
          <Ikon n="peringatan" warna={W.merah} tebal={2} />
          <T v="kecil" warna={W.tinta} style={{ flex: 1 }}>
            <T v="kecilTebal" warna={W.merah}>{angka(d.r.akanHangus.jumlah)} bintik hangus {tglPendek(d.r.akanHangus.tanggal)}. </T>
            Tukar sebelum tanggal itu.
          </T>
          <Ikon n="kanan" ukuran={18} warna={W.merah} />
        </KartuTaut>
      ) : null}

      <JudulBagian judul="Menu musim hujan" href="/promo" tautan="Semua promo" label="Lihat semua promo dan menu musiman" />
      <View style={s.bento}>
        <KartuTaut href={`/promo/${besar.id}`} label={`${besar.nama}, ${rupiah(besar.harga)}`} style={s.bentoBesar}>
          <Foto k={besar.foto!} alt={besar.nama} lebarTampil={180} style={StyleSheet.absoluteFill} />
          <View style={s.bentoTeks}>
            <Lencana teks="Bintik 2×" ragam="mentega" />
            <T v="sub" warna={W.kertas}>{besar.nama}</T>
            <T v="kecilTebal" warna={W.mentega}>{rupiah(besar.harga)}</T>
          </View>
        </KartuTaut>
        <View style={{ flex: 1, gap: 10 }}>
          {kecil.map((m) => (
            <KartuTaut key={m.id} href={`/promo/${m.id}`} label={`${m.nama}, ${rupiah(m.harga)}`} style={s.bentoKecil}>
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

      <JudulBagian judul="Outlet terdekat" href="/outlet" tautan="Semua outlet" label="Lihat semua outlet" />
      {terdekat && lokasi && d ? (
        <KartuTaut href={`/outlet/${terdekat.slug}`} label={`${terdekat.nama}, ${statusBuka(terdekat, d.kini).teks}`} style={s.outlet}>
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
            <KartuTaut key={h.id} href={`/hadiah/${h.id}`} label={`${h.nama}, ${angka(h.biaya)} bintik`} style={s.hadiah}>
              <View style={s.biaya}>
                <T v="judul3" warna={W.hijauTua}>{angka(h.biaya)}</T>
                <T v="kecil" warna={W.hijauTua} style={{ fontSize: 11, lineHeight: 13 }}>bintik</T>
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
    </Layar>
  );
}

const s = StyleSheet.create({
  kepala: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: W.hijau, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: W.mentega },
  tunjuk: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: W.hijau, borderRadius: 999, paddingHorizontal: 12, minHeight: 34, marginBottom: 6 },
  duaKolom: { flexDirection: 'row', gap: 10 },
  ubin: { flex: 1, borderRadius: 24, padding: 16, gap: 6, minHeight: 156, overflow: 'hidden' },
  ubinHijau: { backgroundColor: W.hijau },
  ubinMentega: { backgroundColor: W.mentegaPucat, borderWidth: 2, borderColor: W.mentega },
  hangus: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: W.merahPucat, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#EBC3B6' },
  bento: { flexDirection: 'row', gap: 10, height: 300 },
  bentoBesar: { flex: 1.1, borderRadius: 24, overflow: 'hidden', backgroundColor: W.garis, justifyContent: 'flex-end' },
  bentoTeks: { padding: 14, gap: 4, backgroundColor: 'rgba(15,53,36,0.82)' },
  bentoKecil: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: W.kertas, borderWidth: 1, borderColor: W.garis },
  bentoFoto: { height: 74, backgroundColor: W.garis },
  outlet: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: W.kertas, borderRadius: 22, borderWidth: 1, borderColor: W.garis, padding: 10 },
  outletFoto: { width: 92, height: 92, borderRadius: 16, overflow: 'hidden', backgroundColor: W.garis },
  hadiah: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.kertas, borderRadius: 18, borderWidth: 1, borderColor: W.garis, padding: 10, minHeight: 60 },
  biaya: { width: 62, height: 46, borderRadius: 14, backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center' },
  daftar: { backgroundColor: W.kertas, borderRadius: 20, borderWidth: 1, borderColor: W.garis, paddingHorizontal: 14 },
  barisBintik: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
});
