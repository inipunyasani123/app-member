import type { ItemPesan, Voucher } from './jenis';
import { HARGA_BESAR, HARGA_OAT, HARGA_SHOT, type Menu } from '@/data/menu';
import { hadiahById } from '@/data/hadiah';
import { BATAS_PAGI_MENIT, POTONGAN_PAGI } from '@/data/promo';
import { menitDalamHari } from './waktu';

export type Opsi = { suhu?: 'es' | 'panas'; ukuran: 'sedang' | 'besar'; gula?: 'normal' | 'kurang' | 'tanpa'; susu?: 'sapi' | 'oat'; shot: boolean; es?: 'normal' | 'sedikit' };

export function buatItem(m: Menu, o: Opsi, qty: number): ItemPesan {
  const minuman = !!m.suhu;
  let harga = m.harga;
  const opsi: string[] = [];
  if (minuman) {
    const suhu = m.suhu === 'keduanya' ? o.suhu ?? 'es' : m.suhu!;
    opsi.push(suhu === 'es' ? 'Es' : 'Panas');
    opsi.push(o.ukuran === 'besar' ? 'Besar' : 'Sedang');
    if (o.ukuran === 'besar') harga += HARGA_BESAR;
    if (m.susu && o.susu === 'oat') { opsi.push('Susu oat'); harga += HARGA_OAT; }
    if (m.gula && o.gula && o.gula !== 'normal') opsi.push(o.gula === 'kurang' ? 'Gula sedikit' : 'Tanpa gula');
    if (suhu === 'es' && o.es === 'sedikit') opsi.push('Es sedikit');
    if (m.shot && o.shot) { opsi.push('Tambah shot'); harga += HARGA_SHOT; }
  }
  return { kunci: `${m.id}|${opsi.join(',')}`, menuId: m.id, nama: m.nama, qty, harga, opsi, musiman: m.kategori === 'musiman', minuman, besar: o.ukuran === 'besar' && minuman, shot: !!(m.shot && o.shot && minuman) };
}

export const subtotalDari = (item: ItemPesan[]) => item.reduce((s, i) => s + i.harga * i.qty, 0);

/** Nilai potongan voucher untuk isi keranjang; alasan diisi jika voucher belum bisa dipakai. */
export function nilaiVoucher(v: Voucher, item: ItemPesan[]): { nilai: number; alasan?: string } {
  const h = hadiahById(v.hadiahId);
  if (!h) return { nilai: 0, alasan: 'Voucher tidak dikenal' };
  const sub = subtotalDari(item);
  const p = h.pakai;
  switch (p.tipe) {
    case 'potongan':
      return sub >= p.minimal ? { nilai: p.nilai } : { nilai: 0, alasan: `Minimal belanja Rp${(p.minimal / 1000).toFixed(0)}.000` };
    case 'gratis-menu': {
      const it = item.filter((i) => i.menuId === p.menuId);
      if (!it.length) return { nilai: 0, alasan: `Tambahkan ${h.nama} dulu` };
      const base = Math.min(...it.map((i) => i.harga - (i.besar ? HARGA_BESAR : 0) - (i.shot ? HARGA_SHOT : 0) - (i.opsi.includes('Susu oat') ? HARGA_OAT : 0)));
      return { nilai: base };
    }
    case 'naik-ukuran':
      return item.some((i) => i.besar) ? { nilai: HARGA_BESAR } : { nilai: 0, alasan: 'Pilih minuman ukuran besar dulu' };
    case 'tambah-shot':
      return item.some((i) => i.shot) ? { nilai: HARGA_SHOT } : { nilai: 0, alasan: 'Pilih tambah shot di minuman kopi dulu' };
    case 'minuman-bebas': {
      const min = item.filter((i) => i.minuman && i.besar);
      if (!min.length) return { nilai: 0, alasan: 'Pilih minuman ukuran besar dulu' };
      return { nilai: Math.max(...min.map((i) => i.harga - (i.shot ? HARGA_SHOT : 0) - (i.opsi.includes('Susu oat') ? HARGA_OAT : 0))) };
    }
    default:
      return { nilai: 0, alasan: 'Tukarkan langsung di kasir' };
  }
}

export function potonganPagi(ambil: number) {
  return menitDalamHari(ambil) < BATAS_PAGI_MENIT ? POTONGAN_PAGI : 0;
}

/** Bintik = (total / 1000) × pengali level, ditambah bonus menu musiman (dihitung dua kali). */
export function hitungBintik(item: ItemPesan[], total: number, kali: number) {
  const musiman = item.filter((i) => i.musiman).reduce((s, i) => s + i.harga * i.qty, 0);
  const dasar = Math.floor((Math.max(0, total) / 1000) * kali);
  const bonus = Math.floor((Math.min(musiman, Math.max(0, total)) / 1000) * kali);
  return { dasar, bonus, jumlah: dasar + bonus };
}
