import type { Akun, ItemPesan, Mutasi, Trx, Voucher } from './jenis';
import { MENU, menuById } from '@/data/menu';
import { outletBySlug } from '@/data/outlet';
import { hadiahById } from '@/data/hadiah';
import { levelDari, JENDELA_LEVEL_HARI } from '@/data/level';
import { acak, kodeVoucher } from './format';
import { buatItem, hitungBintik, subtotalDari } from './keranjang';
import { akhirHari, awalHari, bagian, HARI, MENIT } from './waktu';

export const VERSI = 3;

const BIASA = ['kopi-susu-blirik', 'kopi-susu-blirik', 'americano', 'cappuccino', 'kopi-tubruk', 'teh-tarik-rempah', 'susu-gula-aren'];
const MAKAN = ['roti-bakar-cokelat', 'kue-lumpur', 'nasi-pecel'];
const MUSIM = ['es-kopi-kelapa', 'wedang-jahe-aren', 'cokelat-kayu-manis', 'pisang-goreng-madu'];

/**
 * Data contoh relatif terhadap saat aplikasi pertama dibuka: 13 bulan kunjungan, beberapa penukaran,
 * dua voucher aktif (satu hampir habis), satu voucher kedaluwarsa. Hasilnya: level Cangkir, menuju Teko.
 */
export function benih(kini: number): Akun {
  const rnd = acak(20261022);
  const hariIni = awalHari(kini);
  const dibuat = hariIni - 412 * HARI + (10 * 60 + 14) * MENIT;
  const mutasi: Mutasi[] = [{ id: 'm-daftar', jenis: 'bonus', jumlah: 50, ket: 'Bonus kawan baru', waktu: dibuat + 6 * MENIT }];
  const trx: Trx[] = [];
  const voucher: Voucher[] = [];
  const pilih = <T,>(xs: T[]) => xs[Math.floor(rnd() * xs.length)];
  const terkumpulPada = (t: number) =>
    mutasi.filter((m) => m.jumlah > 0 && m.waktu <= t && m.waktu > t - JENDELA_LEVEL_HARI * HARI).reduce((s, m) => s + m.jumlah, 0);

  // Voucher yang ditukar lalu dipakai pada kunjungan berikutnya.
  const rencanaTukar: Record<number, string> = { 9: 'naik-ukuran' };
  let menunggu: Voucher | null = null;

  let hari = 404;
  let n = 0;
  let traktir = false;
  while (hari >= 2) {
    const awal = hariIni - hari * HARI;
    const hariMinggu = bagian(awal + 12 * 60 * MENIT).hari;
    let outlet = rnd() < 0.66 ? 'tulungagung' : rnd() < 0.55 ? 'kediri' : 'blitar';
    if (outlet === 'blitar' && hariMinggu === 1) outlet = 'tulungagung';
    const menitKe = 8 * 60 + 20 + Math.floor(rnd() * 12 * 60);
    const waktu = awal + menitKe * MENIT;
    const kali = levelDari(terkumpulPada(waktu)).kali;
    const daftar = [pilih(hari <= 12 ? MUSIM.slice(0, 3) : BIASA)];
    if (rnd() < 0.55) daftar.push(pilih(hari <= 12 ? [...MAKAN, 'pisang-goreng-madu'] : MAKAN));
    if (rnd() < 0.25) daftar.push(pilih(BIASA));
    // Sekali traktir satu ruangan kantor: bintiknya besar dan sebagian akan hangus bulan depan.
    if (!traktir && hari <= 345) {
      traktir = true;
      outlet = 'tulungagung';
      daftar.splice(0, daftar.length, ...Array(5).fill('kopi-susu-blirik'), 'roti-bakar-cokelat', 'roti-bakar-cokelat', 'teh-tarik-rempah');
    }
    const item: ItemPesan[] = [];
    for (const id of daftar) {
      const m = menuById(id)!;
      const it = daftar.length > 3 ? buatItem(m, { ukuran: 'sedang', suhu: 'es', shot: false }, 1) : buatItem(m, { ukuran: rnd() < 0.3 ? 'besar' : 'sedang', suhu: rnd() < 0.6 ? 'es' : 'panas', gula: rnd() < 0.3 ? 'kurang' : 'normal', susu: 'sapi', shot: false }, 1);
      const ada = item.find((x) => x.kunci === it.kunci);
      if (ada) ada.qty += 1;
      else item.push(it);
    }
    const subtotal = subtotalDari(item);
    let potongan = 0;
    let pakaiV: Trx['voucher'];
    if (menunggu) {
      const h = hadiahById(menunggu.hadiahId)!;
      potongan = h.pakai.tipe === 'gratis-menu' ? menuById(h.pakai.menuId)!.harga : h.pakai.tipe === 'tambah-shot' ? 6000 : 5000;
      if (h.pakai.tipe === 'gratis-menu' && !item.some((i) => i.menuId === (h.pakai as { menuId: string }).menuId)) {
        const m = menuById(h.pakai.menuId)!;
        item.push(buatItem(m, { ukuran: 'sedang', suhu: 'es', shot: false }, 1));
      }
      menunggu.status = 'terpakai';
      menunggu.dipakai = waktu;
      pakaiV = { kode: menunggu.kode, nama: menunggu.nama };
      menunggu = null;
    }
    const sub2 = subtotalDari(item);
    const total = Math.max(0, sub2 - potongan);
    const promoMusim = hari <= 12;
    const b = hitungBintik(promoMusim ? item : item.map((i) => ({ ...i, musiman: false })), total, kali);
    const id = `t${n}`;
    trx.push({ id, waktu, outlet, jenis: rnd() < 0.22 ? 'ambil' : 'kasir', item, subtotal: Math.max(subtotal, sub2), potongan, total, bintik: b.jumlah, voucher: pakaiV });
    mutasi.push({ id: `m${n}`, jenis: 'dapat', jumlah: b.jumlah, ket: outletBySlug(outlet)!.nama, waktu: waktu + MENIT, trxId: id });
    if (rnd() < 0.16) mutasi.push({ id: `mt${n}`, jenis: 'bonus', jumlah: 5, ket: 'Bawa tumbler sendiri', waktu: waktu + 2 * MENIT, trxId: id });

    const tukar = rencanaTukar[n];
    if (tukar) {
      const h = hadiahById(tukar)!;
      const t = waktu + 40 * MENIT;
      const kode = kodeVoucher(rnd);
      mutasi.push({ id: `mx${n}`, jenis: 'tukar', jumlah: -h.biaya, ket: `Tukar: ${h.nama}`, waktu: t, kode });
      menunggu = { kode, hadiahId: h.id, nama: h.nama, dibuat: t, berlaku: akhirHari(t, h.berlakuHari), status: 'aktif' };
      voucher.push(menunggu);
    }
    n += 1;
    hari -= (hari > 200 ? 22 : 10) + Math.floor(rnd() * 6);
  }

  // Voucher yang belum dipakai: satu kedaluwarsa, satu hampir habis, satu baru.
  const tambahVoucher = (hadiahId: string, hariLalu: number) => {
    const h = hadiahById(hadiahId)!;
    const t = hariIni - hariLalu * HARI + (17 * 60 + 5) * MENIT;
    const kode = kodeVoucher(rnd);
    mutasi.push({ id: `mv${hadiahId}`, jenis: 'tukar', jumlah: -h.biaya, ket: `Tukar: ${h.nama}`, waktu: t, kode });
    voucher.push({ kode, hadiahId, nama: h.nama, dibuat: t, berlaku: akhirHari(t, h.berlakuHari), status: 'aktif' });
  };
  tambahVoucher('tambah-shot', 33);
  tambahVoucher('potongan-10rb', 12);
  tambahVoucher('naik-ukuran', 3);

  return {
    v: VERSI,
    dibuat,
    nama: 'Sekar Wulandari',
    nomor: '2406 1187 0417',
    telp: '0812-3••• ••17',
    lahir: '17 Maret',
    outletFav: 'tulungagung',
    lokasi: 'tulungagung',
    pref: { susu: 'sapi', gula: 'kurang', es: 'normal', ukuran: 'sedang' },
    notif: { promo: true, hangus: true, pesanan: true },
    mutasi,
    voucher,
    trx: trx.sort((x, y) => y.waktu - x.waktu),
    pesanan: [],
  };
}

export const SEMUA_MENU_ID = MENU.map((m) => m.id);
