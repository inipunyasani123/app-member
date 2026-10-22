import { memo } from 'react';
import { Svg, Path, Circle, Ellipse, Rect, G } from './svg';
import type { LevelId } from '@/data/level';
import { acak } from '@/lib/format';
import { W } from './tema';

// Ilustrasi buatan sendiri: empat perabot enamel sebagai lambang level (lepek, cangkir, teko, ceret).
type Props = { id: LevelId; ukuran?: number; aktif?: boolean; terkunci?: boolean; label?: string };

const AREA: Record<LevelId, [number, number, number, number]> = {
  lepek: [22, 56, 98, 64],
  cangkir: [34, 38, 76, 80],
  teko: [34, 46, 86, 76],
  ceret: [44, 34, 84, 82],
};

function bintikDalam(id: LevelId, n: number) {
  const [x1, y1, x2, y2] = AREA[id];
  const rnd = acak(id.length * 31 + n);
  return Array.from({ length: n }, () => ({ x: x1 + rnd() * (x2 - x1), y: y1 + rnd() * (y2 - y1), r: 0.6 + rnd() * 1.3 }));
}

export const Wadah = memo(function Wadah({ id, ukuran = 96, aktif, terkunci, label }: Props) {
  const tepi = terkunci ? W.garisKuat : W.hijau;
  const badan = aktif ? W.hijau : terkunci ? '#EEE8DB' : W.kertas;
  const titik = aktif ? W.kertas : tepi;
  const b = bintikDalam(id, id === 'lepek' ? 14 : 18);
  return (
    <Svg width={ukuran} height={(ukuran * 100) / 120} viewBox="0 0 120 100" label={label}>
      {id === 'lepek' && (
        <G>
          <Ellipse cx={60} cy={76} rx={44} ry={6} fill="rgba(26,31,27,0.10)" />
          <Ellipse cx={60} cy={66} rx={48} ry={12} fill={tepi} />
          <Ellipse cx={60} cy={61} rx={48} ry={12} fill={badan} stroke={tepi} strokeWidth={3} />
          <Ellipse cx={60} cy={60} rx={24} ry={5.5} fill="none" stroke={aktif ? W.kertas : tepi} strokeWidth={1.6} opacity={0.8} />
        </G>
      )}
      {id === 'cangkir' && (
        <G>
          <Ellipse cx={56} cy={87} rx={30} ry={5} fill="rgba(26,31,27,0.10)" />
          <Path d="M80 42h5a12 12 0 0 1 0 24h-5" fill="none" stroke={tepi} strokeWidth={6} strokeLinecap="round" />
          <Path d="M30 30h50v44a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10z" fill={badan} stroke={tepi} strokeWidth={3} />
          <Rect x={27} y={25} width={56} height={8} rx={4} fill={tepi} />
        </G>
      )}
      {id === 'teko' && (
        <G>
          <Ellipse cx={60} cy={88} rx={36} ry={5} fill="rgba(26,31,27,0.10)" />
          <Path d="M33 60C22 57 16 46 9 37l6-3c5 7 10 14 19 16z" fill={badan} stroke={tepi} strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M87 47c15 0 15 27 0 28" fill="none" stroke={tepi} strokeWidth={6} strokeLinecap="round" />
          <Path d="M30 54c0-19 60-19 60 0v18c0 12-60 12-60 0z" fill={badan} stroke={tepi} strokeWidth={3} />
          <Path d="M42 41c4-10 32-10 36 0z" fill={tepi} />
          <Circle cx={60} cy={30} r={4.5} fill={tepi} />
          <Rect x={31} y={75} width={58} height={4} rx={2} fill={tepi} opacity={0.9} />
        </G>
      )}
      {id === 'ceret' && (
        <G>
          <Ellipse cx={62} cy={92} rx={30} ry={4.5} fill="rgba(26,31,27,0.10)" />
          <Path d="M41 72C30 67 22 51 13 34l6-3c8 15 14 27 24 30z" fill={badan} stroke={tepi} strokeWidth={2.5} strokeLinejoin="round" />
          <Path d="M83 37c18 2 18 33 3 40" fill="none" stroke={tepi} strokeWidth={6} strokeLinecap="round" />
          <Path d="M44 30h36l8 54c0 5-52 5-52 0z" fill={badan} stroke={tepi} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M46 24c4-10 28-10 32 0z" fill={badan} stroke={tepi} strokeWidth={2.5} />
          <Rect x={42} y={23} width={40} height={7} rx={3} fill={tepi} />
          <Circle cx={62} cy={13} r={3.5} fill={tepi} />
          <Rect x={36} y={80} width={52} height={5} rx={2.5} fill={tepi} />
        </G>
      )}
      <G>
        {b.map((t, i) => (
          <Circle key={i} cx={t.x} cy={t.y} r={t.r} fill={titik} opacity={0.55} />
        ))}
      </G>
      {terkunci ? (
        <G>
          <Circle cx={98} cy={22} r={13} fill={W.karat} />
          <Path d="M93 22v-3a5 5 0 0 1 10 0v3M91 22h14v9H91z" fill="none" stroke={W.kertas} strokeWidth={2} strokeLinejoin="round" />
        </G>
      ) : null}
    </Svg>
  );
});
