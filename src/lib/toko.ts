import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Akun, ItemPesan, Pesanan, Pref, Notif, Trx } from './jenis';
import { baca, tulis } from './simpan';
import { benih, VERSI } from './benih';
import { ringkas, statusVoucher } from './hitung';
import { hadiahById } from '@/data/hadiah';
import { menuById, MENU } from '@/data/menu';
import { outletBySlug } from '@/data/outlet';
import { urutanLevel } from '@/data/level';
import { acak, idBaru, kodeVoucher } from './format';
import { buatItem, hitungBintik, subtotalDari } from './keranjang';
import { akhirHari, MENIT } from './waktu';

const KUNCI = 'kopi-blirik:akun';
let akun: Akun | null = null;
let sudahMuat = false;
const pendengar = new Set<() => void>();
const kabari = () => pendengar.forEach((f) => f());
const langganan = (f: () => void) => {
  pendengar.add(f);
  return () => pendengar.delete(f);
};

/** Dipanggil sekali setelah hidrasi. Data contoh dibuat relatif terhadap saat pertama dibuka. */
export function muat() {
  if (sudahMuat) return;
  sudahMuat = true;
  baca(KUNCI).then((teks) => {
    let a: Akun | null = null;
    try {
      a = teks ? (JSON.parse(teks) as Akun) : null;
    } catch {
      a = null;
    }
    if (!a || a.v !== VERSI) {
      a = benih(Date.now());
      tulis(KUNCI, JSON.stringify(a));
    }
    akun = a;
    kabari();
  });
}

/** null selama render statis dan sebelum data perangkat termuat. */
export function useAkun() {
  return useSyncExternalStore(langganan, () => akun, () => null);
}

/** Waktu sekarang yang berdetak; null saat render statis supaya HTML tidak bergantung pada jam build. */
export function useKini(tiap = 30_000) {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => {
    setT(Date.now());
    const id = setInterval(() => setT(Date.now()), tiap);
    return () => clearInterval(id);
  }, [tiap]);
  return t;
}

function ubah(f: (a: Akun) => Akun) {
  if (!akun) return;
  akun = f(akun);
  tulis(KUNCI, JSON.stringify(akun));
  kabari();
}

export function setelProfil(p: Partial<Pick<Akun, 'nama' | 'outletFav' | 'lokasi'>>) {
  ubah((a) => ({ ...a, ...p }));
}
export function setelPref(p: Partial<Pref>) {
  ubah((a) => ({ ...a, pref: { ...a.pref, ...p } }));
}
export function setelNotif(p: Partial<Notif>) {
  ubah((a) => ({ ...a, notif: { ...a.notif, ...p } }));
}
export function aturUlang() {
  akun = benih(Date.now());
  tulis(KUNCI, JSON.stringify(akun));
  kabari();
}

export type HasilTukar = { ok: true; kode: string } | { ok: false; alasan: string };
export function tukarHadiah(hadiahId: string): HasilTukar {
  if (!akun) return { ok: false, alasan: 'Data belum siap' };
  const h = hadiahById(hadiahId);
  if (!h) return { ok: false, alasan: 'Hadiah tidak ditemukan' };
  const kini = Date.now();
  const r = ringkas(akun, kini);
  if (h.minLevel && urutanLevel(r.level.id) < urutanLevel(h.minLevel)) return { ok: false, alasan: 'Level kamu belum cukup' };
  if (r.saldo < h.biaya) return { ok: false, alasan: 'Bintik belum cukup' };
  const kode = kodeVoucher();
  ubah((a) => ({
    ...a,
    mutasi: [...a.mutasi, { id: idBaru('m'), jenis: 'tukar', jumlah: -h.biaya, ket: `Tukar: ${h.nama}`, waktu: kini, kode }],
    voucher: [...a.voucher, { kode, hadiahId: h.id, nama: h.nama, dibuat: kini, berlaku: akhirHari(kini, h.berlakuHari), status: 'aktif' }],
  }));
  return { ok: true, kode };
}

export function pakaiVoucher(kode: string, catatan = 'Dipindai kasir (simulasi)') {
  ubah((a) => ({ ...a, voucher: a.voucher.map((v) => (v.kode === kode ? { ...v, status: 'terpakai', dipakai: Date.now(), catatan } : v)) }));
}

/** Simulasi kasir memindai kartu: membuat transaksi acak di outlet favorit dan membagikan bintik. */
export function simulasiPindai(): Trx | null {
  if (!akun) return null;
  const kini = Date.now();
  const rnd = acak(kini % 100000);
  const r = ringkas(akun, kini);
  const minum = MENU.filter((m) => m.suhu);
  const makan = MENU.filter((m) => !m.suhu);
  const pilihan = [minum[Math.floor(rnd() * minum.length)]];
  if (rnd() < 0.6) pilihan.push(makan[Math.floor(rnd() * makan.length)]);
  const item = pilihan.map((m) =>
    buatItem(m, { ukuran: akun!.pref.ukuran, suhu: 'es', gula: akun!.pref.gula, susu: akun!.pref.susu, es: akun!.pref.es, shot: false }, 1),
  );
  const subtotal = subtotalDari(item);
  const b = hitungBintik(item, subtotal, r.level.kali);
  const trx: Trx = { id: idBaru('t'), waktu: kini, outlet: akun.outletFav, jenis: 'kasir', item, subtotal, potongan: 0, total: subtotal, bintik: b.jumlah };
  ubah((a) => ({
    ...a,
    trx: [trx, ...a.trx],
    mutasi: [...a.mutasi, { id: idBaru('m'), jenis: 'dapat', jumlah: b.jumlah, ket: outletBySlug(a.outletFav)!.nama, waktu: kini, trxId: trx.id }],
  }));
  return trx;
}

export function buatPesanan(p: Omit<Pesanan, 'id' | 'nomor' | 'dibuat' | 'status'>): Pesanan {
  const kini = Date.now();
  const huruf = outletBySlug(p.outlet)!.nama.split(' ')[1][0];
  const pesanan: Pesanan = { ...p, id: idBaru('p'), nomor: `${huruf}${String(10 + Math.floor(Math.random() * 89))}`, dibuat: kini, status: 'aktif' };
  ubah((a) => ({
    ...a,
    pesanan: [pesanan, ...a.pesanan],
    voucher: p.voucher ? a.voucher.map((v) => (v.kode === p.voucher!.kode ? { ...v, status: 'terpakai', dipakai: kini, catatan: `Dipakai di pesan ambil ${pesanan.nomor}` } : v)) : a.voucher,
  }));
  return pesanan;
}

export function ambilPesanan(id: string) {
  ubah((a) => {
    const p = a.pesanan.find((x) => x.id === id);
    if (!p || p.status !== 'aktif') return a;
    const kini = Date.now();
    const trx: Trx = { id: idBaru('t'), waktu: kini, outlet: p.outlet, jenis: 'ambil', item: p.item, subtotal: p.subtotal, potongan: p.potongan, total: p.total, bintik: p.bintik, voucher: p.voucher, pesananId: p.id };
    return {
      ...a,
      pesanan: a.pesanan.map((x) => (x.id === id ? { ...x, status: 'diambil', selesai: kini } : x)),
      trx: [trx, ...a.trx],
      mutasi: [...a.mutasi, { id: idBaru('m'), jenis: 'dapat', jumlah: p.bintik, ket: `Pesan ambil ${p.nomor}`, waktu: kini, trxId: trx.id }],
    };
  });
}

export function batalPesanan(id: string) {
  ubah((a) => {
    const p = a.pesanan.find((x) => x.id === id);
    if (!p || p.status !== 'aktif') return a;
    const kini = Date.now();
    return {
      ...a,
      pesanan: a.pesanan.map((x) => (x.id === id ? { ...x, status: 'batal', selesai: kini } : x)),
      voucher: p.voucher
        ? a.voucher.map((v) => (v.kode === p.voucher!.kode && statusVoucher({ ...v, status: 'aktif' }, kini) === 'aktif' ? { ...v, status: 'aktif', dipakai: undefined, catatan: undefined } : v))
        : a.voucher,
    };
  });
}

/** Keranjang pesan ambil: hanya di memori (tidak perlu bertahan setelah aplikasi ditutup). */
let keranjang: ItemPesan[] = [];
const pendengarK = new Set<() => void>();
export const useKeranjang = () =>
  useSyncExternalStore(
    (f) => {
      pendengarK.add(f);
      return () => pendengarK.delete(f);
    },
    () => keranjang,
    () => keranjang,
  );
function setK(k: ItemPesan[]) {
  keranjang = k;
  pendengarK.forEach((f) => f());
}
export function tambahKeKeranjang(it: ItemPesan) {
  const ada = keranjang.find((x) => x.kunci === it.kunci);
  setK(ada ? keranjang.map((x) => (x.kunci === it.kunci ? { ...x, qty: Math.min(9, x.qty + it.qty) } : x)) : [...keranjang, it]);
}
export function ubahQty(kunci: string, d: number) {
  setK(keranjang.map((x) => (x.kunci === kunci ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0));
}
export const kosongkanKeranjang = () => setK([]);
export const menuTersedia = (id: string) => !!menuById(id);
export const MENIT_SIAP = 10 * MENIT;
