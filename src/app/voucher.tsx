import { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Chip, Tombol, TautanTombol } from '@/ui/Tombol';
import { Kerangka, Kosong, Lencana } from '@/ui/Kecil';
import { Tiket } from '@/ui/Tiket';
import { Lembar } from '@/ui/Lembar';
import { QR } from '@/ui/QR';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { pakaiVoucher } from '@/lib/toko';
import { statusVoucher } from '@/lib/hitung';
import type { Voucher } from '@/lib/jenis';
import { meta } from '@/lib/meta';
import { tglSedang, relatifHari } from '@/lib/waktu';

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
      <View role="tablist" aria-label="Status voucher" style={s.tab}>
        {TAB.map((t) => (
          <Chip key={t.id} peran="tab" teks={`${t.nama}${d ? ` (${hitung(t.id)})` : ''}`} aktif={tab === t.id} onPress={() => setTab(t.id)} kecil />
        ))}
      </View>
      {!d ? <Kerangka tinggi={220} /> : daftar.length === 0 ? (
        <>
          <Kosong judul={tab === 'aktif' ? 'Belum ada voucher aktif' : 'Kosong'} isi={tab === 'aktif' ? 'Tukar bintik di katalog hadiah, vouchernya muncul di sini.' : 'Belum ada voucher di bagian ini.'} ikon="voucher" />
          {tab === 'aktif' ? <TautanTombol href="/hadiah" teks="Buka katalog hadiah" ikon="hadiah" /> : null}
        </>
      ) : (
        <View style={{ gap: 12 }}>
          {daftar.map((v) => {
            const st = statusVoucher(v, d.kini);
            const mepet = st === 'aktif' && v.berlaku - d.kini < 3 * 86400000;
            return (
              <Pressable key={v.kode} role="button" aria-label={`${v.nama}, kode ${v.kode}. Buka kode untuk kasir`} onPress={() => setBuka(v)}>
                <Tiket
                  redup={st !== 'aktif'}
                  kiri={
                    <>
                      <T v="isiTebal" warna={st === 'aktif' ? W.tinta : W.abu}>{v.nama}</T>
                      <T v="kode" warna={st === 'aktif' ? W.hijauTua : W.abu} style={st !== 'aktif' ? { textDecorationLine: 'line-through' } : undefined}>{v.kode}</T>
                      <T v="kecil" warna={mepet ? W.merah : W.abu}>
                        {st === 'aktif' ? `Berlaku sampai ${tglSedang(v.berlaku)} (${relatifHari(v.berlaku, d.kini)})` : st === 'terpakai' ? `Terpakai ${tglSedang(v.dipakai ?? v.dibuat)}` : `Berakhir ${tglSedang(v.berlaku)}`}
                      </T>
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

const s = StyleSheet.create({ tab: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
