import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Svg, Path, Rect } from './svg';
import { W } from './tema';

type Hasil = { d: string; sisi: number };
const simpanan = new Map<string, Hasil>();

/** Kode QR dibuat di perangkat (tanpa server). Pembuat QR dimuat terpisah supaya tidak membebani layar lain. */
export function QR({ teks, ukuran = 220, label, warna = W.tinta }: { teks: string; ukuran?: number; label: string; warna?: string }) {
  const [qr, setQr] = useState<Hasil | null>(() => simpanan.get(teks) ?? null);
  useEffect(() => {
    let hidup = true;
    const ada = simpanan.get(teks);
    if (ada) setQr(ada);
    else
      import('@/lib/qr').then(({ pathQR }) => {
        const h = pathQR(teks);
        simpanan.set(teks, h);
        if (hidup) setQr(h);
      });
    return () => {
      hidup = false;
    };
  }, [teks]);
  return (
    <View style={{ width: ukuran, height: ukuran, borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff' }}>
      {qr ? (
        <Svg width={ukuran} height={ukuran} viewBox={`0 0 ${qr.sisi} ${qr.sisi}`} label={label}>
          <Rect x={0} y={0} width={qr.sisi} height={qr.sisi} fill="#ffffff" />
          <Path d={qr.d} fill={warna} {...({ shapeRendering: 'crispEdges' } as object)} />
        </Svg>
      ) : null}
    </View>
  );
}
