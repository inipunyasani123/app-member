import { Svg, Path, Circle } from './svg';
import { W } from './tema';

// Ikon garis 24×24 buatan sendiri, ujung membulat seperti tepi enamel.
const D = {
  beranda: 'M4 11.5 12 5l8 6.5M6.5 10v8.5h11V10M10 18.5v-4.5h4v4.5',
  kartu: 'M3.5 6.5h17v11h-17zM3.5 10h17M7 14.5h4',
  pesan: 'M7 8h10l-1.2 11.5H8.2zM6 8h12M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8',
  hadiah: 'M4.5 10h15v9.5h-15zM3.5 7h17v3h-17zM12 7v12.5M12 7c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1',
  akun: 'M12 12a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2ZM5 19.5c1.2-3.3 3.9-5 7-5s5.8 1.7 7 5',
  kembali: 'M14.5 5.5 8 12l6.5 6.5',
  kanan: 'M9.5 5.5 16 12l-6.5 6.5',
  tutup: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  tambah: 'M12 5.5v13M5.5 12h13',
  kurang: 'M5.5 12h13',
  jam: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 7.5V12l3 2',
  lokasi: 'M12 20.5s6.5-5.8 6.5-10.8a6.5 6.5 0 0 0-13 0c0 5 6.5 10.8 6.5 10.8ZM12 12a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z',
  voucher: 'M3.5 7.5h17v3a1.8 1.8 0 0 0 0 3.5v3h-17v-3a1.8 1.8 0 0 0 0-3.5zM14.5 7.5v10',
  struk: 'M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4zM9 8h6M9 11.5h6M9 15h3',
  bintang: 'M12 4.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z',
  cangkir: 'M5 8.5h11v6a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 14.5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 5.5c0-1 1-1 1-2M11.5 5.5c0-1 1-1 1-2',
  piring: 'M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM3.5 12h1M19.5 12h1M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  centang: 'M5.5 12.5 10 17l8.5-9',
  peringatan: 'M12 4.5 20.5 19h-17zM12 10v4M12 16.6v.4',
  pindai: 'M4 8.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3M4 12h16',
  daun: 'M5 19c0-8 5-13 14-14-.5 9-5.5 14-14 14ZM5 19l7-7',
  hujan: 'M7 14.5a4 4 0 0 1-.3-8 5.5 5.5 0 0 1 10.6 1.5A3.3 3.3 0 0 1 17 14.5zM8.5 17.5l-1 2M12.5 17.5l-1 2M16.5 17.5l-1 2',
  kunci: 'M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11M5.5 11h13v9h-13zM12 14.5v2',
  ulang: 'M5 12a7 7 0 0 1 12-4.9M19 12a7 7 0 0 1-12 4.9M17 4v3.5h-3.5M7 20v-3.5h3.5',
  telepon: 'M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15 15 0 0 1 5 5.6 1.5 1.5 0 0 1 6.5 4Z',
  luar: 'M14 5.5h4.5V10M18.5 5.5 11 13M16 13.5v4a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 17.5v-8A1.5 1.5 0 0 1 6.5 8h4',
} as const;

export type NamaIkon = keyof typeof D;

export function Ikon({ n, ukuran = 24, warna = W.tinta, tebal = 1.8, label }: { n: NamaIkon; ukuran?: number; warna?: string; tebal?: number; label?: string }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 24 24" label={label}>
      <Path d={D[n]} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Titik isi untuk ikon yang perlu bidang (mis. bintang terpilih). */
export function TitikPenuh({ ukuran = 8, warna = W.hijau }: { ukuran?: number; warna?: string }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 10 10">
      <Circle cx={5} cy={5} r={5} fill={warna} />
    </Svg>
  );
}
