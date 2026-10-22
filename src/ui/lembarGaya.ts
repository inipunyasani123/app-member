import { StyleSheet } from 'react-native';
import { W } from './tema';

export const sLembar = StyleSheet.create({
  latar: { ...StyleSheet.absoluteFill, justifyContent: 'flex-end', zIndex: 50 },
  tirai: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,53,36,0.55)' },
  lembar: { backgroundColor: W.kertas, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '88%', borderTopWidth: 3, borderColor: W.hijau },
  pegangan: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: W.garis, marginTop: 8 },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingTop: 6, paddingBottom: 6 },
  gulir: { flexGrow: 0, flexShrink: 1 },
  isi: { paddingHorizontal: 18, paddingBottom: 12, gap: 14 },
  bawah: { paddingHorizontal: 18, paddingTop: 10, borderTopWidth: 1, borderTopColor: W.garis, gap: 8 },
});
