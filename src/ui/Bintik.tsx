import { memo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Svg, Path, G } from './svg';
import { acak } from '@/lib/format';
import { W } from './tema';

// Motif khas: bintik-bintik enamel "blirik" dan gompal (enamel terkelupas sampai besi).
const cache = new Map<string, string[]>();
function bintikPath(benih: number, jumlah: number) {
  const k = `${benih}:${jumlah}`;
  const ada = cache.get(k);
  if (ada) return ada;
  const rnd = acak(benih * 7919 + jumlah);
  const lapis = ['', '', ''];
  for (let i = 0; i < jumlah; i++) {
    const x = rnd() * 200, y = rnd() * 200;
    const u = rnd();
    const r = u < 0.72 ? 0.45 + rnd() * 0.7 : u < 0.95 ? 1.1 + rnd() * 0.9 : 1.9 + rnd() * 0.8;
    const ry = r * (0.65 + rnd() * 0.5);
    const rot = Math.round(rnd() * 180);
    const L = u < 0.5 ? 0 : u < 0.85 ? 1 : 2;
    lapis[L] += `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${ry.toFixed(2)} ${rot} 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${ry.toFixed(2)} ${rot} 1 0 ${(-2 * r).toFixed(2)} 0Z`;
  }
  cache.set(k, lapis);
  return lapis;
}

type BintikProps = { benih?: number; jumlah?: number; warna?: string; kuat?: number; style?: ViewStyle };
/** Tekstur bintik memenuhi induknya (induk perlu overflow hidden + position relative). */
export const Bintik = memo(function Bintik({ benih = 1, jumlah = 70, warna = W.hijau, kuat = 1, style }: BintikProps) {
  const [a, b, c] = bintikPath(benih, jumlah);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
        <G>
          <Path d={a} fill={warna} opacity={0.22 * kuat} />
          <Path d={b} fill={warna} opacity={0.42 * kuat} />
          <Path d={c} fill={warna} opacity={0.62 * kuat} />
        </G>
      </Svg>
    </View>
  );
});

function gompalPath(benih: number, r: number) {
  const rnd = acak(benih * 104729);
  const titik: [number, number][] = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const rr = r * (0.62 + rnd() * 0.5);
    titik.push([r + Math.cos(t) * rr * 1.15, r + Math.sin(t) * rr * 0.85]);
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = titik[i];
    const [x2, y2] = titik[(i + 1) % n];
    const mx = (x + x2) / 2, my = (y + y2) / 2;
    d += i === 0 ? `M${mx.toFixed(1)} ${my.toFixed(1)}` : '';
    const [nx, ny] = titik[(i + 1) % n];
    const [nx2, ny2] = titik[(i + 2) % n];
    d += `Q${nx.toFixed(1)} ${ny.toFixed(1)} ${((nx + nx2) / 2).toFixed(1)} ${((ny + ny2) / 2).toFixed(1)}`;
  }
  return d + 'Z';
}

/** Gompal: bekas enamel terkelupas, lapisan dasar abu dan besi gelap di tengah. */
export const Gompal = memo(function Gompal({ benih = 3, ukuran = 22, style }: { benih?: number; ukuran?: number; style?: ViewStyle }) {
  const r = ukuran / 2;
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: ukuran, height: ukuran }, style]}>
      <Svg width={ukuran} height={ukuran} viewBox={`0 0 ${ukuran} ${ukuran}`}>
        <Path d={gompalPath(benih, r)} fill="#A9B0A6" />
        <Path d={gompalPath(benih + 1, r * 0.7)} fill={W.karat} transform={`translate(${(r * 0.32).toFixed(1)} ${(r * 0.3).toFixed(1)})`} />
      </Svg>
    </View>
  );
});
