import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { T } from './Teks';
import { Ikon, type NamaIkon } from './Ikon';
import { W, BIBIR } from './tema';
import { IlustrasiHadiah } from './IlustrasiHadiah';
import type { Status } from '@/data/outlet';

/** Ruang kosong berukuran tetap selama data perangkat belum termuat (mencegah pergeseran tata letak). */
export function Kerangka({ tinggi, lebar = '100%', bulat = 18, style }: { tinggi: number; lebar?: number | `${number}%`; bulat?: number; style?: ViewStyle }) {
  return <View aria-hidden style={[{ height: tinggi, width: lebar, borderRadius: bulat, backgroundColor: 'rgba(133,125,107,0.14)' }, style]} />;
}

type RagamLencana = 'hijau' | 'merah' | 'mentega' | 'abu';
const LENCANA: Record<RagamLencana, { bg: string; fg: string }> = {
  hijau: { bg: W.hijauPucat, fg: W.hijauTua },
  merah: { bg: W.merahPucat, fg: W.merah },
  mentega: { bg: W.mentegaPucat, fg: W.hijauTua },
  abu: { bg: '#ECE6D9', fg: W.abu },
};
export function Lencana({ teks, ragam = 'hijau', ikon }: { teks: string; ragam?: RagamLencana; ikon?: NamaIkon }) {
  const w = LENCANA[ragam];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: w.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
      {ikon ? <Ikon n={ikon} ukuran={14} warna={w.fg} tebal={2.2} /> : null}
      <T v="kecilTebal" warna={w.fg} style={{ fontSize: 13, lineHeight: 17 }}>
        {teks}
      </T>
    </View>
  );
}

/** Status buka outlet sebagai teks + penanda bentuk (bukan sekadar warna). */
export function StatusBuka({ st }: { st: Status | null }) {
  if (!st) return <Kerangka tinggi={18} lebar={140} bulat={9} />;
  const warna = st.buka ? (st.segera ? W.merah : W.hijau) : W.abu;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 9, height: 9, borderRadius: st.buka ? 5 : 2, backgroundColor: st.buka ? warna : 'transparent', borderWidth: st.buka ? 0 : 1.5, borderColor: warna }} />
      <T v="kecilTebal" warna={warna}>
        {st.teks}
      </T>
    </View>
  );
}

export function Kotak({ children, style, gelap }: { children: ReactNode; style?: ViewStyle | ViewStyle[]; gelap?: boolean }) {
  return (
    <View style={[{ backgroundColor: gelap ? W.hijau : W.kertas, borderRadius: 22, padding: 16, gap: 8, overflow: 'hidden' }, gelap ? { borderWidth: 1, borderColor: W.hijauTua } : BIBIR, style as ViewStyle]}>
      {children}
    </View>
  );
}

/** Keadaan kosong: cangkir enamel terguling (ilustrasi sendiri), satu kalimat, dan satu aksi di tengah. */
export function Kosong({ judul, isi, aksi }: { judul: string; isi: string; ikon?: NamaIkon; aksi?: ReactNode }) {
  return (
    <View style={{ alignItems: 'center', gap: 8, paddingVertical: 20, paddingHorizontal: 16 }}>
      <IlustrasiHadiah id="kosong" ukuran={150} />
      <T v="judul3" tengah>
        {judul}
      </T>
      <T v="kecil" tengah warna={W.tinta}>
        {isi}
      </T>
      {aksi ? <View style={{ marginTop: 6, alignItems: 'center' }}>{aksi}</View> : null}
    </View>
  );
}

/** Lencana bulat untuk menu tanpa foto: lingkaran enamel dengan ikon. */
export function Medali({ ikon, ukuran = 64 }: { ikon: NamaIkon; ukuran?: number }) {
  return (
    <View style={{ width: ukuran, height: ukuran, borderRadius: ukuran / 2, backgroundColor: W.kertas, borderWidth: 3, borderColor: W.hijau, alignItems: 'center', justifyContent: 'center' }}>
      <Ikon n={ikon} ukuran={ukuran * 0.46} warna={W.hijau} tebal={2} />
    </View>
  );
}
