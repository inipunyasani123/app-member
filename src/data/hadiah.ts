import type { LevelId } from './level';

export type Pakai =
  | { tipe: 'potongan'; nilai: number; minimal: number }
  | { tipe: 'gratis-menu'; menuId: string }
  | { tipe: 'naik-ukuran' }
  | { tipe: 'tambah-shot' }
  | { tipe: 'minuman-bebas' }
  | { tipe: 'gratis-musiman' }
  | { tipe: 'di-kasir' };

export type Hadiah = {
  id: string;
  nama: string;
  jenis: 'minuman' | 'makanan' | 'potongan' | 'barang' | 'pengalaman';
  biaya: number;
  foto?: string;
  ikon?: 'shot' | 'naik' | 'potongan' | 'kelas' | 'musim';
  desk: string;
  berlakuHari: number;
  minLevel?: LevelId;
  pakai: Pakai;
};

export const JENIS_HADIAH = [
  { id: 'semua', nama: 'Semua' },
  { id: 'bisa', nama: 'Bisa kutukar' },
  { id: 'minuman', nama: 'Minuman' },
  { id: 'makanan', nama: 'Makanan' },
  { id: 'barang', nama: 'Barang & kelas' },
] as const;

export const HADIAH: Hadiah[] = [
  { id: 'tambah-shot', nama: 'Tambah 1 shot espresso', jenis: 'minuman', biaya: 40, ikon: 'shot', berlakuHari: 14, pakai: { tipe: 'tambah-shot' },
    desk: 'Satu shot espresso tambahan untuk minuman kopi apa pun. Biar makin melek.' },
  { id: 'naik-ukuran', nama: 'Naik ukuran gratis', jenis: 'minuman', biaya: 60, ikon: 'naik', berlakuHari: 14, pakai: { tipe: 'naik-ukuran' },
    desk: 'Pesan ukuran sedang, bayar sedang, terima ukuran besar. Berlaku untuk semua minuman.' },
  { id: 'potongan-10rb', nama: 'Potongan Rp10.000', jenis: 'potongan', biaya: 110, ikon: 'potongan', berlakuHari: 14, pakai: { tipe: 'potongan', nilai: 10000, minimal: 35000 },
    desk: 'Potongan langsung untuk belanja minimal Rp35.000 dalam satu transaksi.' },
  { id: 'pisang-goreng', nama: 'Pisang Goreng Madu', jenis: 'makanan', biaya: 130, foto: 'pisang-goreng-madu', berlakuHari: 14, pakai: { tipe: 'gratis-menu', menuId: 'pisang-goreng-madu' },
    desk: 'Satu porsi pisang goreng madu, renyah dan masih hangat.' },
  { id: 'roti-bakar', nama: 'Roti Bakar Cokelat Keju', jenis: 'makanan', biaya: 150, foto: 'roti-bakar-cokelat', berlakuHari: 14, pakai: { tipe: 'gratis-menu', menuId: 'roti-bakar-cokelat' },
    desk: 'Satu porsi roti bakar tebal isi cokelat dan keju.' },
  { id: 'kopi-susu', nama: 'Kopi Susu Blirik', jenis: 'minuman', biaya: 190, foto: 'kopi-susu-blirik', berlakuHari: 14, pakai: { tipe: 'gratis-menu', menuId: 'kopi-susu-blirik' },
    desk: 'Satu Kopi Susu Blirik ukuran sedang, es atau panas.' },
  { id: 'minuman-bebas', nama: 'Minuman apa saja, ukuran besar', jenis: 'minuman', biaya: 280, foto: 'es-kopi-kelapa', berlakuHari: 14, pakai: { tipe: 'minuman-bebas' },
    desk: 'Pilih minuman apa pun di menu, termasuk menu musiman, ukuran besar.' },
  { id: 'biji-kopi', nama: 'Biji kopi sangrai 200 g', jenis: 'barang', biaya: 650, foto: 'biji-kopi', berlakuHari: 30, pakai: { tipe: 'di-kasir' },
    desk: 'Robusta Kediri atau arabika Kawi, disangrai di Rumah Sangrai Tulungagung. Bisa minta digiling.' },
  { id: 'set-cangkir-enamel', nama: 'Set cangkir enamel merah (2 buah)', jenis: 'barang', biaya: 900, foto: 'cangkir-enamel', berlakuHari: 30, minLevel: 'teko', pakai: { tipe: 'di-kasir' },
    desk: 'Dua cangkir enamel 250 ml dengan tepi hitam. Khusus member Teko dan Ceret.' },
  { id: 'kelas-seduh', nama: 'Kelas seduh manual 90 menit', jenis: 'barang', biaya: 1200, ikon: 'kelas', berlakuHari: 30, minLevel: 'ceret', pakai: { tipe: 'di-kasir' },
    desk: 'Belajar seduh V60 dan tubruk bersama barista di Rumah Sangrai. Untuk satu orang, jadwal tiap Sabtu.' },
];

/** Hadiah yang tidak dijual di katalog: diberikan otomatis oleh kartu cap musim hujan (6 cap). */
export const HADIAH_KHUSUS: Hadiah[] = [
  { id: 'cap-musim', nama: 'Minuman musim hujan gratis', jenis: 'minuman', biaya: 0, ikon: 'musim', berlakuHari: 14, pakai: { tipe: 'gratis-musiman' },
    desk: 'Hadiah kartu cap musim hujan: satu minuman musim hujan ukuran sedang, gratis.' },
];
export const CAP_PENUH = 6;

export const hadiahById = (id: string) => HADIAH.find((h) => h.id === id) ?? HADIAH_KHUSUS.find((h) => h.id === id);

export const SYARAT_UMUM = [
  'Satu voucher untuk satu transaksi, tidak bisa digabung dengan voucher lain.',
  'Tidak bisa diuangkan atau dikembalikan menjadi bintik.',
  'Berlaku di semua outlet Kopi Blirik, di kasir maupun lewat pesan ambil.',
];
