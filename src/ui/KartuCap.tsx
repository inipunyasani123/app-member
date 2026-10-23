import { View, StyleSheet } from 'react-native';
import { Svg, Path, Rect, Circle, G } from './svg';
import { T } from './Teks';
import { Bintik } from './Bintik';
import { Kerangka } from './Kecil';
import { W } from './tema';
import { CAP_PENUH } from '@/data/hadiah';

// Kartu cap musim hujan: enam cangkir enamel (gambar sendiri). Tiap transaksi berisi menu musim hujan = 1 cap.
function CangkirCap({ isi, i }: { isi: boolean; i: number }) {
  return (
    <Svg width={38} height={38} viewBox="0 0 40 40">
      <Path d="M29 14h3a6 6 0 0 1 0 12h-3" fill="none" stroke={isi ? W.hijau : W.garisKuat} strokeWidth={3} strokeLinecap="round" />
      <Path d="M7 11h22v16a6 6 0 0 1-6 6H13a6 6 0 0 1-6-6z" fill={isi ? W.hijau : 'none'} stroke={isi ? W.hijau : W.garisKuat} strokeWidth={2.2} strokeDasharray={isi ? undefined : '3 3'} />
      <Rect x={5} y={8} width={26} height={5} rx={2.5} fill={isi ? W.hijauTua : W.garisKuat} opacity={isi ? 1 : 0.6} />
      {isi ? (
        <G>
          <Circle cx={12 + (i % 3) * 2} cy={19} r={1.4} fill={W.kertas} opacity={0.8} />
          <Circle cx={21} cy={24 - (i % 2) * 3} r={1.1} fill={W.kertas} opacity={0.8} />
          <Circle cx={16} cy={28} r={0.9} fill={W.kertas} opacity={0.8} />
          <Path d="M14 6c0-2 2-2 2-4M21 6c0-2 2-2 2-4" fill="none" stroke={W.hijau} strokeWidth={1.6} strokeLinecap="round" />
        </G>
      ) : null}
    </Svg>
  );
}

function Hadiahnya() {
  return (
    <Svg width={44} height={38} viewBox="0 0 44 40">
      <Path d="M3 10h38v7a4 4 0 0 0 0 8v7H3v-7a4 4 0 0 0 0-8z" fill={W.mentega} stroke={W.hijauTua} strokeWidth={2} />
      <Path d="M30 11v20" stroke={W.hijauTua} strokeWidth={1.5} strokeDasharray="2 3" />
      <Path d="M10 19h13M10 24h9" stroke={W.hijauTua} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function KartuCap({ cap }: { cap: number | null }) {
  const sisa = cap === null ? null : CAP_PENUH - cap;
  return (
    <View style={s.kartu}>
      <Bintik benih={66} jumlah={40} kuat={0.5} />
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <T v="judul3" style={{ flex: 1 }}>Kartu cap musim hujan</T>
        {cap === null || sisa === null ? <Kerangka tinggi={22} lebar={96} bulat={11} /> : <T v="nominal" warna={W.hijauTua}>{cap}/{CAP_PENUH} · {sisa} lagi</T>}
      </View>
      <View role="img" aria-label={cap === null ? 'Kartu cap musim hujan' : `${cap} dari ${CAP_PENUH} cap terisi`} style={s.deret}>
        {Array.from({ length: CAP_PENUH }, (_, i) => (
          <CangkirCap key={i} isi={cap !== null && i < cap} i={i} />
        ))}
        <Hadiahnya />
      </View>
      <T v="kecil" warna={W.tinta}>Tiap transaksi berisi menu musim hujan dapat satu cap. Cap ke-6 = satu minuman musim hujan gratis.</T>
    </View>
  );
}

const s = StyleSheet.create({
  kartu: { backgroundColor: W.kertas, borderRadius: 22, padding: 14, gap: 8, overflow: 'hidden', borderWidth: 2, borderColor: W.hijau, borderStyle: 'dashed' },
  deret: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
