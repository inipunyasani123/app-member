export type LevelId = 'lepek' | 'cangkir' | 'teko' | 'ceret';
export type Level = { id: LevelId; nama: string; min: number; kali: number; arti: string; manfaat: string[] };

/** Level ditentukan dari bintik yang didapat dalam 180 hari terakhir. Menukar hadiah tidak menurunkan level. */
export const LEVEL: Level[] = [
  { id: 'lepek', nama: 'Lepek', min: 0, kali: 1, arti: 'Tatakan cangkir. Semua kawan mulai dari sini.',
    manfaat: ['1 bintik tiap belanja Rp1.000', 'Voucher naik ukuran di bulan ulang tahun'] },
  { id: 'cangkir', nama: 'Cangkir', min: 250, kali: 1.25, arti: 'Sudah jadi langganan.',
    manfaat: ['1,25 bintik tiap belanja Rp1.000', 'Voucher naik ukuran di bulan ulang tahun', 'Coba menu musiman 3 hari lebih awal'] },
  { id: 'teko', nama: 'Teko', min: 750, kali: 1.5, arti: 'Teman ngopi yang selalu kembali.',
    manfaat: ['1,5 bintik tiap belanja Rp1.000', 'Satu minuman sedang gratis tiap bulan', 'Pesan ambil didahulukan saat ramai', 'Bisa menukar set cangkir enamel'] },
  { id: 'ceret', nama: 'Ceret', min: 1500, kali: 2, arti: 'Yang paling sering mengisi ulang.',
    manfaat: ['2 bintik tiap belanja Rp1.000', 'Dua minuman sedang gratis tiap bulan', 'Undangan cupping bulanan di Rumah Sangrai', 'Bisa menukar kelas seduh manual'] },
];

export const levelById = (id: LevelId) => LEVEL.find((l) => l.id === id)!;
export function levelDari(terkumpul: number) {
  let l = LEVEL[0];
  for (const x of LEVEL) if (terkumpul >= x.min) l = x;
  return l;
}
export const urutanLevel = (id: LevelId) => LEVEL.findIndex((l) => l.id === id);
export const JENDELA_LEVEL_HARI = 180;
export const MASA_BINTIK_HARI = 365;
