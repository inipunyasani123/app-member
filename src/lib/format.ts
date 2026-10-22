export function angka(n: number) {
  const s = String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return n < 0 ? `-${s}` : s;
}
export const rupiah = (n: number) => `Rp${angka(n)}`;
export const bintik = (n: number) => `${angka(n)} bintik`;
export const jarakKm = (km: number) => (km < 10 ? km.toFixed(1).replace('.', ',') : String(Math.round(km))) + ' km';

/** PRNG kecil yang dapat diulang (mulberry32) untuk data contoh. */
export function acak(benih: number) {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash FNV-1a 32-bit, dipakai untuk tanda cek kode QR simulasi. */
export function fnv(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36).toUpperCase().padStart(7, '0').slice(-6);
}

const HURUF_KODE = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export function kodeVoucher(rnd: () => number = Math.random) {
  const ambil = (n: number) => Array.from({ length: n }, () => HURUF_KODE[Math.floor(rnd() * HURUF_KODE.length)]).join('');
  return `BLR-${ambil(4)}-${ambil(4)}`;
}
export const idBaru = (awalan: string, rnd: () => number = Math.random) => `${awalan}${Date.now().toString(36)}${Math.floor(rnd() * 1e6).toString(36)}`;
