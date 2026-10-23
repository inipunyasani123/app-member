import { memo } from 'react';
import { Svg, Path, Circle, Ellipse, Rect, G } from './svg';
import { acak } from '@/lib/format';
import { W } from './tema';

// Ilustrasi buatan sendiri bergaya perabot enamel (sama dengan Wadah.tsx) untuk hadiah tanpa foto produk
// dan keadaan kosong. viewBox 160×120.
export type JenisIlustrasi = 'shot' | 'naik' | 'potongan' | 'kelas' | 'musim' | 'kosong';

const bintik = (benih: number, x1: number, y1: number, x2: number, y2: number, n: number, warna: string) => {
  const r = acak(benih);
  return Array.from({ length: n }, (_, i) => (
    <Circle key={i} cx={x1 + r() * (x2 - x1)} cy={y1 + r() * (y2 - y1)} r={0.7 + r() * 1.5} fill={warna} opacity={0.55} />
  ));
};

/** Cangkir enamel bertepi hijau; x,y = pojok kiri atas badan; l,t = lebar & tinggi badan. */
function Cangkir({ x, y, l, t, benih, badan = W.kertas }: { x: number; y: number; l: number; t: number; benih: number; badan?: string }) {
  const r = Math.min(10, t / 4);
  return (
    <G>
      <Ellipse cx={x + l / 2} cy={y + t + 5} rx={l * 0.55} ry={4} fill="rgba(24,32,27,0.12)" />
      <Path d={`M${x + l} ${y + t * 0.22}h${l * 0.16}a${t * 0.25} ${t * 0.25} 0 0 1 0 ${t * 0.5}h-${l * 0.16}`} fill="none" stroke={W.hijau} strokeWidth={5} strokeLinecap="round" />
      <Path d={`M${x} ${y}h${l}v${t - r}a${r} ${r} 0 0 1-${r} ${r}h-${l - 2 * r}a${r} ${r} 0 0 1-${r}-${r}z`} fill={badan} stroke={W.hijau} strokeWidth={2.5} />
      <Rect x={x - 3} y={y - 4} width={l + 6} height={7} rx={3.5} fill={W.hijau} />
      {bintik(benih, x + 4, y + 8, x + l - 4, y + t - 4, Math.round((l * t) / 140), W.hijau)}
    </G>
  );
}

export const IlustrasiHadiah = memo(function IlustrasiHadiah({ id, ukuran = 150, label }: { id: JenisIlustrasi; ukuran?: number; label?: string }) {
  return (
    <Svg width={ukuran} height={(ukuran * 120) / 160} viewBox="0 0 160 120" label={label}>
      {id === 'shot' && (
        <G>
          <Cangkir x={46} y={50} l={56} t={46} benih={11} />
          <Path d="M74 14c6 9 9 14 9 19a9 9 0 0 1-18 0c0-5 3-10 9-19z" fill="#5B3A22" stroke={W.hijauTua} strokeWidth={2} />
          <Path d="M71 30a4 4 0 0 0 4 4" fill="none" stroke="#F4E3C8" strokeWidth={2} strokeLinecap="round" />
          <Path d="M74 40v6" stroke="#5B3A22" strokeWidth={3} strokeLinecap="round" strokeDasharray="2 4" />
          <Circle cx={124} cy={34} r={15} fill={W.mentega} stroke={W.hijauTua} strokeWidth={2} />
          <Path d="M117 34h14M124 27v14" stroke={W.hijauTua} strokeWidth={3} strokeLinecap="round" />
        </G>
      )}
      {id === 'naik' && (
        <G>
          <Cangkir x={18} y={66} l={36} t={30} benih={21} />
          <Cangkir x={86} y={34} l={50} t={62} benih={22} />
          <Path d="M60 52c8-12 16-17 22-18" fill="none" stroke={W.merah} strokeWidth={3} strokeLinecap="round" strokeDasharray="1 6" />
          <Path d="M74 30l9 4-6 8" fill="none" stroke={W.merah} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </G>
      )}
      {id === 'potongan' && (
        <G>
          <Ellipse cx={82} cy={104} rx={56} ry={5} fill="rgba(24,32,27,0.10)" />
          <G transform="rotate(-8 80 62)">
            <Path d="M24 34h112v18a8 8 0 0 0 0 16v18H24V68a8 8 0 0 0 0-16z" fill={W.kertas} stroke={W.hijau} strokeWidth={2.5} />
            <Path d="M102 36v48" stroke={W.garisKuat} strokeWidth={2} strokeDasharray="4 4" />
            <Rect x={34} y={46} width={46} height={7} rx={3.5} fill={W.hijau} opacity={0.85} />
            <Rect x={34} y={60} width={34} height={5} rx={2.5} fill={W.garisKuat} opacity={0.6} />
            <Rect x={34} y={70} width={40} height={5} rx={2.5} fill={W.garisKuat} opacity={0.6} />
            {bintik(31, 28, 38, 98, 82, 10, W.hijau)}
          </G>
          <G transform="rotate(14 118 58)">
            <Circle cx={118} cy={58} r={22} fill="none" stroke={W.merah} strokeWidth={3} />
            <Circle cx={118} cy={58} r={17} fill="none" stroke={W.merah} strokeWidth={1.2} strokeDasharray="2 3" />
            <Path d="M108 56h20M108 62h14" stroke={W.merah} strokeWidth={3} strokeLinecap="round" />
          </G>
        </G>
      )}
      {id === 'kelas' && (
        <G>
          <Cangkir x={88} y={72} l={40} t={26} benih={41} />
          <Path d="M90 46h36l-12 20h-12z" fill={W.kertas} stroke={W.hijau} strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M98 52h20" stroke={W.garisKuat} strokeWidth={1.5} />
          <Rect x={86} y={42} width={44} height={6} rx={3} fill={W.hijau} />
          <Path d="M26 92h42l-6-40H32z" fill={W.kertas} stroke={W.hijau} strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M62 58c14-4 22-6 26-12" fill="none" stroke={W.hijau} strokeWidth={4} strokeLinecap="round" />
          <Path d="M30 52c2-8 30-8 34 0z" fill={W.hijau} />
          <Circle cx={47} cy={42} r={3.5} fill={W.hijau} />
          <Path d="M24 60c-10 2-10 22 2 24" fill="none" stroke={W.hijau} strokeWidth={5} strokeLinecap="round" />
          <Path d="M90 48c2 4 2 7 0 10" fill="none" stroke="#8C6A4A" strokeWidth={2} strokeLinecap="round" />
          {bintik(42, 34, 60, 60, 88, 9, W.hijau)}
        </G>
      )}
      {id === 'musim' && (
        <G>
          <Cangkir x={48} y={52} l={54} t={44} benih={51} />
          <Path d="M48 34a14 14 0 0 1 12-20 18 18 0 0 1 32 2 11 11 0 0 1 8 18z" fill={W.hijauPucat} stroke={W.hijau} strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M60 40l-3 6M76 40l-3 6M92 40l-3 6" stroke={W.hijau} strokeWidth={2.5} strokeLinecap="round" />
          <Circle cx={124} cy={78} r={14} fill={W.mentega} stroke={W.hijauTua} strokeWidth={2} />
          <Path d="M118 78l4 4 8-9" fill="none" stroke={W.hijauTua} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </G>
      )}
      {id === 'kosong' && (
        <G>
          <Ellipse cx={80} cy={104} rx={48} ry={6} fill="rgba(24,32,27,0.10)" />
          <G transform="rotate(-18 78 70)">
            <Cangkir x={50} y={44} l={56} t={50} benih={61} />
            <Path d="M58 80q-3-10 6-12t11 6q2 9-6 11t-11-5z" fill="#A9B0A6" />
            <Path d="M63 80q-1-6 4-7t7 4q1 5-4 6t-7-3z" fill={W.karat} />
          </G>
          <Path d="M118 92c6 0 9-3 9-6" fill="none" stroke={W.garisKuat} strokeWidth={2} strokeLinecap="round" strokeDasharray="1 5" />
        </G>
      )}
    </Svg>
  );
});
