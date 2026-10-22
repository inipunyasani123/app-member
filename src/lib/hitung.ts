import type { Akun, Mutasi, Voucher } from './jenis';
import { levelDari, LEVEL, JENDELA_LEVEL_HARI, MASA_BINTIK_HARI } from '@/data/level';
import { akhirHari, HARI } from './waktu';

export type Entri = Omit<Mutasi, 'jenis'> & { jenis: Mutasi['jenis'] | 'hangus' };

/**
 * Menghitung saldo bintik dengan aturan: bintik berlaku 365 hari sejak didapat, penukaran memakai bintik paling lama dulu,
 * level dari bintik yang didapat 180 hari terakhir.
 */
export function ringkas(a: Akun, kini: number) {
  const ev = a.mutasi.filter((m) => m.waktu <= kini).sort((x, y) => x.waktu - y.waktu);
  const lot: { sisa: number; habis: number }[] = [];
  const hangus = new Map<number, number>();
  const kedaluwarsa = (t: number) => {
    for (const l of lot) {
      if (l.sisa > 0 && l.habis <= t) {
        hangus.set(l.habis, (hangus.get(l.habis) || 0) + l.sisa);
        l.sisa = 0;
      }
    }
  };
  for (const m of ev) {
    kedaluwarsa(m.waktu);
    if (m.jumlah > 0) lot.push({ sisa: m.jumlah, habis: akhirHari(m.waktu, MASA_BINTIK_HARI) });
    else {
      let butuh = -m.jumlah;
      for (const l of lot) {
        if (!butuh) break;
        const ambil = Math.min(l.sisa, butuh);
        l.sisa -= ambil;
        butuh -= ambil;
      }
    }
  }
  kedaluwarsa(kini);
  const saldo = lot.reduce((s, l) => s + l.sisa, 0);
  const batas = kini + 45 * HARI;
  const segera = lot.filter((l) => l.sisa > 0 && l.habis <= batas);
  const akanHangus = segera.length
    ? { jumlah: segera.reduce((s, l) => s + l.sisa, 0), tanggal: Math.min(...segera.map((l) => l.habis)) }
    : null;
  const terkumpul = ev.filter((m) => m.jumlah > 0 && m.waktu > kini - JENDELA_LEVEL_HARI * HARI).reduce((s, m) => s + m.jumlah, 0);
  const level = levelDari(terkumpul);
  const iLevel = LEVEL.indexOf(level);
  const berikut = LEVEL[iLevel + 1] ?? null;
  const riwayat: Entri[] = [
    ...ev,
    ...[...hangus].map(([t, n]) => ({ id: `h${t}`, jenis: 'hangus' as const, jumlah: -n, ket: 'Bintik kedaluwarsa setelah 12 bulan', waktu: t })),
  ].sort((x, y) => y.waktu - x.waktu);
  return { saldo, akanHangus, terkumpul, level, berikut, kurang: berikut ? berikut.min - terkumpul : 0, riwayat };
}

export function statusVoucher(v: Voucher, kini: number): 'aktif' | 'terpakai' | 'kedaluwarsa' {
  if (v.status === 'terpakai') return 'terpakai';
  return v.berlaku < kini ? 'kedaluwarsa' : 'aktif';
}

export const voucherAktif = (a: Akun, kini: number) =>
  a.voucher.filter((v) => statusVoucher(v, kini) === 'aktif').sort((x, y) => x.berlaku - y.berlaku);
