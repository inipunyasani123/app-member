import { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Chip, Tombol, TautanTombol, KartuTaut } from '@/ui/Tombol';
import { Kerangka, Kosong, Lencana, Kotak } from '@/ui/Kecil';
import { GambarHadiah } from '@/ui/GambarHadiah';
import { HADIAH } from '@/data/hadiah';
import { urutanLevel } from '@/data/level';
import { angka } from '@/lib/format';
import type { NamaIkon } from '@/ui/Ikon';
import { Tiket } from '@/ui/Tiket';
import { Lembar } from '@/ui/Lembar';
import { QR } from '@/ui/QR';
import { W, BIBIR } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { pakaiVoucher } from '@/lib/toko';
import { statusVoucher } from '@/lib/hitung';
import type { Voucher } from '@/lib/jenis';
import { meta } from '@/lib/meta';
import { tglSedang, relatifHari, selisihHari } from '@/lib/waktu';

export function generateMetadata() {
  return meta({
    judul: 'Voucher Saya · Kopi Blirik',
    desk: 'Daftar voucher Kopi Blirik hasil tukar bintik: kode voucher, QR untuk kasir, masa berlaku dalam WIB, serta voucher terpakai dan kedaluwarsa.',
    jalur: '/voucher',
  });
}

const TAB = [
  { id: 'aktif', nama: 'Aktif' },
  { id: 'terpakai', nama: 'Terpakai' },
  { id: 'kedaluwarsa', nama: 'Kedaluwarsa' },
] as const;

export default function HalamanVoucher() {
  const d = useData();
  const q = useLocalSearchParams<{ kode?: string }>();
  const [tab, setTab] = useState<(typeof TAB)[number]['id']>('aktif');
  const [buka, setBuka] = useState<Voucher | null>(null);
  useEffect(() => {
    if (q.kode && d) {
      const v = d.a.voucher.find((x) => x.kode === q.kode);
      if (v) setBuka(v);
    }
    // hanya saat pertama data siap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.kode, !!d]);

  const daftar = d ? d.a.voucher.filter((v) => statusVoucher(v, d.kini) === tab).sort((x, y) => (tab === 'aktif' ? x.berlaku - y.berlaku : y.dibuat - x.dibuat)) : [];
  const hitung = (id: string) => (d ? d.a.voucher.filter((v) => statusVoucher(v, d.kini) === id).length : 0);
  const bukaKini = buka && d ? d.a.voucher.find((v) => v.kode === buka.kode) ?? buka : null;

  return (
    <Layar judul="Voucher saya" induk="/hadiah">
      <T v="judul1" h={1} style={{ marginTop: 10 }}>Voucher saya</T>
      <T v="isi" style={s.pengantar}>
        Voucher hasil tukar bintik dan kartu cap musim hujan. Tunjukkan QR-nya ke kasir atau pilih saat pesan ambil. Semua berlaku sampai pukul 23.59 WIB di hari terakhir.
      </T>
      <View role="tablist" aria-label="Status voucher" style={s.tab}>
        {TAB.map((t) => (
          <Chip key={t.id} peran="tab" teks={`${t.nama}${d ? ` (${hitung(t.id)})` : ''}`} aktif={tab === t.id} onPress={() => setTab(t.id)} kecil />
        ))}
      </View>
      {!d ? <Kerangka tinggi={220} /> : daftar.length === 0 ? (
        <Kosong
          judul={tab === 'aktif' ? 'Belum ada voucher aktif' : tab === 'terpakai' ? 'Belum ada voucher terpakai' : 'Tidak ada voucher yang lewat'}
          isi={tab === 'aktif' ? 'Tukar bintik di katalog hadiah, vouchernya langsung tercetak di sini.' : tab === 'terpakai' ? 'Voucher yang sudah dipakai di kasir atau pesan ambil muncul di sini.' : 'Bagus, belum ada voucher yang terlewat masa berlakunya.'}
          aksi={tab === 'aktif' ? <TautanTombol href="/hadiah" teks="Buka katalog hadiah" ikon="hadiah" /> : undefined}
        />
      ) : (
        <View style={{ gap: 12 }}>
          {daftar.map((v) => {
            const st = statusVoucher(v, d.kini);
            const sisaHari = Math.max(0, selisihHari(d.kini, v.berlaku));
            const mepet = st === 'aktif' && sisaHari <= 2;
            return (
              <Pressable key={v.kode} role="button" onPress={() => setBuka(v)}>
                <Tiket
                  redup={st !== 'aktif'}
                  kiri={
                    <>
                      <T v="isiTebal" warna={st === 'aktif' ? W.tinta : W.abu}>{v.nama}</T>
                      <T v="kode" warna={st === 'aktif' ? W.hijauTua : W.abu} style={st !== 'aktif' ? { textDecorationLine: 'line-through' } : undefined}>{v.kode}</T>
                      {st === 'aktif' ? (
                        <Lencana teks={sisaHari <= 0 ? 'Berakhir hari ini' : `Sisa ${sisaHari} hari · ${tglSedang(v.berlaku)}`} ragam={mepet ? 'merah' : 'mentega'} ikon="jam" />
                      ) : (
                        <T v="kecil" warna={W.abu}>{st === 'terpakai' ? `Terpakai ${tglSedang(v.dipakai ?? v.dibuat)}` : `Berakhir ${tglSedang(v.berlaku)}`}</T>
                      )}
                    </>
                  }
                  kanan={
                    st === 'aktif' ? (
                      <>
                        <Ikon n="pindai" ukuran={30} warna={W.hijau} />
                        <T v="kecilTebal" warna={W.hijau} tengah>Tunjukkan</T>
                      </>
                    ) : (
                      <Lencana teks={st === 'terpakai' ? 'Terpakai' : 'Lewat'} ragam="abu" />
                    )
                  }
                />
              </Pressable>
            );
          })}
        </View>
      )}

      <Kotak>
        <T v="judul3" h={2}>Cara pakai voucher</T>
        {([
          ['pindai', 'Di kasir: buka voucher, tunjukkan QR atau sebutkan kodenya sebelum membayar.'],
          ['pesan', 'Pesan ambil: pilih voucher di ringkasan pesanan, potongannya langsung dihitung.'],
          ['jam', 'Satu voucher untuk satu transaksi, berlaku sampai 23.59 WIB di hari terakhir.'],
        ] as [NamaIkon, string][]).map(([ikon, teks], i) => (
          <View key={ikon} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <View style={s.nomor}><T v="kecilTebal" warna={W.kertas}>{i + 1}</T></View>
            <T v="isi" style={{ flex: 1 }}>{teks}</T>
            <Ikon n={ikon} ukuran={20} warna={W.hijau} />
          </View>
        ))}
      </Kotak>

      {d ? (
        <View style={{ gap: 10 }}>
          <T v="judul2" h={2}>Tukar lagi</T>
          {HADIAH.filter((h) => h.biaya <= d.r.saldo && (!h.minLevel || urutanLevel(d.r.level.id) >= urutanLevel(h.minLevel)))
            .sort((x, y) => y.biaya - x.biaya)
            .slice(0, 3)
            .map((h) => (
              <KartuTaut key={h.id} href={`/hadiah/${h.id}`} style={s.tukar}>
                <View style={s.tukarGambar}>
                  <GambarHadiah h={h} tinggi={56} ukuranIlustrasi={56} />
                </View>
                <T v="isiTebal" style={{ flex: 1 }}>{h.nama}</T>
                <T v="nominal" warna={W.hijauTua}>{angka(h.biaya)}</T>
              </KartuTaut>
            ))}
        </View>
      ) : null}

      <Lembar terbuka={!!bukaKini} onTutup={() => setBuka(null)} judul={bukaKini?.nama ?? 'Voucher'}
        bawah={bukaKini && d && statusVoucher(bukaKini, d.kini) === 'aktif' ? <Tombol teks="Simulasikan: dipakai kasir" ragam="garis" penuh onPress={() => { pakaiVoucher(bukaKini.kode); setBuka(null); }} /> : undefined}
      >
        {bukaKini && d ? (
          <View style={{ alignItems: 'center', gap: 10 }}>
            {statusVoucher(bukaKini, d.kini) === 'aktif' ? <QR teks={`BLIRIK|V|${bukaKini.kode}`} ukuran={200} label={`Kode QR voucher ${bukaKini.kode}`} /> : null}
            <T v="kode" selectable style={{ fontSize: 22, lineHeight: 28 }}>{bukaKini.kode}</T>
            <T v="isi" tengah>
              {statusVoucher(bukaKini, d.kini) === 'aktif'
                ? `Berlaku sampai ${tglSedang(bukaKini.berlaku)}, 23.59 WIB. Tunjukkan QR atau sebutkan kodenya ke kasir.`
                : bukaKini.catatan ?? (bukaKini.status === 'terpakai' ? 'Voucher sudah dipakai.' : 'Masa berlaku voucher sudah lewat.')}
            </T>
          </View>
        ) : null}
      </Lembar>
    </Layar>
  );
}

const s = StyleSheet.create({
  tab: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pengantar: { maxWidth: 520 },
  nomor: { width: 26, height: 26, borderRadius: 13, backgroundColor: W.hijau, alignItems: 'center', justifyContent: 'center' },
  tukar: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.kertas, borderRadius: 18, padding: 8, ...BIBIR },
  tukarGambar: { width: 56, height: 56, borderRadius: 12, overflow: 'hidden' },
});
