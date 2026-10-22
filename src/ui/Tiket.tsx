import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { W } from './tema';

/** Voucher berbentuk karcis: dua takik setengah lingkaran dan garis sobek putus-putus. */
export function Tiket({ kiri, kanan, redup, latar = W.enamel }: { kiri: ReactNode; kanan: ReactNode; redup?: boolean; latar?: string }) {
  return (
    <View style={[s.tiket, redup && { opacity: 1, backgroundColor: '#F5F1E8' }]}>
      <View style={s.kiri}>{kiri}</View>
      <View style={s.sobek}>
        <View style={[s.takik, { top: -11, backgroundColor: latar }]} />
        <View style={s.garis} />
        <View style={[s.takik, { bottom: -11, backgroundColor: latar }]} />
      </View>
      <View style={s.kanan}>{kanan}</View>
    </View>
  );
}

const s = StyleSheet.create({
  tiket: { flexDirection: 'row', backgroundColor: W.kertas, borderRadius: 18, borderWidth: 1.5, borderColor: W.garis, minHeight: 104 },
  kiri: { flex: 1, padding: 14, gap: 4, justifyContent: 'center' },
  kanan: { width: 104, padding: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  sobek: { width: 2, alignItems: 'center' },
  takik: { position: 'absolute', width: 22, height: 22, borderRadius: 11, left: -10, borderWidth: 1.5, borderColor: W.garis },
  garis: { flex: 1, width: 0, borderLeftWidth: 2, borderStyle: 'dashed', borderColor: W.garisKuat, marginVertical: 14 },
});
