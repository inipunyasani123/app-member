import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { T } from './Teks';
import { Bintik, Gompal } from './Bintik';
import { Wadah } from './Wadah';
import { W } from './tema';
import type { Level } from '@/data/level';

type Props = { nama?: string; nomor?: string; level?: Level; atas?: ReactNode; children?: ReactNode; benih?: number };

/** Kartu member berbentuk pelat enamel: tepi hijau tebal, bintik blirik, dan dua gompal. */
export function KartuMember({ nama, nomor, level, atas, children, benih = 11 }: Props) {
  return (
    <View style={s.pelat}>
      <Bintik benih={benih} jumlah={90} warna={W.hijau} kuat={0.85} />
      <Gompal benih={benih} ukuran={20} style={{ top: -3, right: 46 }} />
      <Gompal benih={benih + 4} ukuran={14} style={{ top: 74, left: -5 }} />
      <View style={s.atas}>
        <View style={{ flex: 1 }}>
          <T v="judul2" warna={W.hijau} style={{ fontSize: 24, lineHeight: 28 }}>
            Kopi Blirik
          </T>
          <T v="label" warna={W.hijauTua}>
            Kartu Kawan Blirik
          </T>
        </View>
        {level ? (
          <View style={s.cap} aria-label={`Level ${level.nama}`}>
            <Wadah id={level.id} ukuran={44} aktif />
            <T v="kecilTebal" warna={W.hijauTua} style={{ fontSize: 12 }}>
              {level.nama}
            </T>
          </View>
        ) : null}
      </View>
      {atas}
      {children}
      {nama || nomor ? (
        <View style={s.bawah}>
          <T v="sub" numberOfLines={1} style={{ flex: 1 }}>
            {nama ?? ' '}
          </T>
          <T v="kode" style={{ fontSize: 13 }} aria-label={nomor ? `Nomor member ${nomor}` : undefined}>
            {nomor ?? ' '}
          </T>
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  pelat: {
    backgroundColor: W.kertas,
    borderRadius: 28,
    borderWidth: 5,
    borderColor: W.hijau,
    padding: 18,
    paddingTop: 16,
    overflow: 'hidden',
    gap: 12,
    shadowColor: W.hijauTua,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  atas: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cap: { alignItems: 'center', backgroundColor: W.mentegaPucat, borderRadius: 16, paddingHorizontal: 8, paddingTop: 4, paddingBottom: 4, borderWidth: 1.5, borderColor: W.mentega },
  bawah: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1.5, borderTopColor: W.garis, borderStyle: 'dashed', paddingTop: 10 },
});
