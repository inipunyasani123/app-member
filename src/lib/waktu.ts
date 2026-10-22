// Semua logika waktu memakai WIB (UTC+7, tanpa musim panas), apa pun zona waktu perangkat.
export const MENIT = 60_000;
export const JAM = 60 * MENIT;
export const HARI = 24 * JAM;
const GESER = 7 * JAM;

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function bagian(t: number) {
  const d = new Date(t + GESER);
  return { th: d.getUTCFullYear(), bl: d.getUTCMonth(), tg: d.getUTCDate(), hari: d.getUTCDay(), jam: d.getUTCHours(), mnt: d.getUTCMinutes() };
}
/** Pukul 00.00 WIB pada hari yang memuat t. */
export function awalHari(t: number) {
  return Math.floor((t + GESER) / HARI) * HARI - GESER;
}
/** Akhir hari (23.59.59 WIB) n hari setelah t. */
export function akhirHari(t: number, tambahHari = 0) {
  return awalHari(t) + (tambahHari + 1) * HARI - 1000;
}
export function menitDalamHari(t: number) {
  const b = bagian(t);
  return b.jam * 60 + b.mnt;
}
const dua = (n: number) => String(n).padStart(2, '0');
export const jamMenit = (t: number) => {
  const b = bagian(t);
  return `${dua(b.jam)}.${dua(b.mnt)}`;
};
export const jamDariMenit = (m: number) => `${dua(Math.floor(m / 60) % 24)}.${dua(m % 60)}`;
export const tglPendek = (t: number) => {
  const b = bagian(t);
  return `${b.tg} ${BLN[b.bl]}`;
};
export const tglSedang = (t: number) => {
  const b = bagian(t);
  return `${b.tg} ${BLN[b.bl]} ${b.th}`;
};
export const tglPanjang = (t: number) => {
  const b = bagian(t);
  return `${NAMA_HARI[b.hari]}, ${b.tg} ${BULAN[b.bl]} ${b.th}`;
};
export const bulanTahun = (t: number) => {
  const b = bagian(t);
  return `${BULAN[b.bl]} ${b.th}`;
};
export function selisihHari(dari: number, ke: number) {
  return Math.round((awalHari(ke) - awalHari(dari)) / HARI);
}
/** "hari ini", "besok", "lusa", "dalam 5 hari" */
export function relatifHari(t: number, kini: number) {
  const n = selisihHari(kini, t);
  if (n === 0) return 'hari ini';
  if (n === 1) return 'besok';
  if (n === 2) return 'lusa';
  if (n === -1) return 'kemarin';
  if (n < 0) return `${-n} hari lalu`;
  return `dalam ${n} hari`;
}
export function sapaan(t: number) {
  const j = bagian(t).jam;
  if (j < 4) return 'Selamat malam';
  if (j < 11) return 'Selamat pagi';
  if (j < 15) return 'Selamat siang';
  if (j < 18) return 'Selamat sore';
  return 'Selamat malam';
}
