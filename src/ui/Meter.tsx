import { View } from 'react-native';
import { W } from './tema';

/** Meter bintik: deretan bintik enamel yang terisi sesuai kemajuan (bukan bar polos). */
export function Meter({ nilai, maks, label, jumlah = 20, terang }: { nilai: number; maks: number; label: string; jumlah?: number; terang?: boolean }) {
  const isi = maks > 0 ? Math.max(0, Math.min(jumlah, Math.round((nilai / maks) * jumlah))) : jumlah;
  const penuh = terang ? W.mentega : W.hijau;
  const kosong = terang ? 'rgba(255,252,244,0.35)' : W.garisKuat;
  return (
    <View
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={maks}
      aria-valuenow={Math.min(nilai, maks)}
      style={{ flexDirection: 'row', gap: 4, alignItems: 'center', flexWrap: 'nowrap' }}
    >
      {Array.from({ length: jumlah }, (_, i) => {
        const aktif = i < isi;
        const besar = i % 5 === 4;
        const d = besar ? 11 : 8;
        return (
          <View
            key={i}
            style={{
              width: d,
              height: d,
              borderRadius: d / 2,
              backgroundColor: aktif ? penuh : 'transparent',
              borderWidth: aktif ? 0 : 1.5,
              borderColor: kosong,
              transform: [{ rotate: `${(i * 37) % 30}deg` }, { scaleX: aktif ? 1.08 : 1 }],
            }}
          />
        );
      })}
    </View>
  );
}
