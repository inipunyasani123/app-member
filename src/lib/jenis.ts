export type Mutasi = {
  id: string;
  jenis: 'dapat' | 'bonus' | 'tukar';
  jumlah: number;
  ket: string;
  waktu: number;
  trxId?: string;
  kode?: string;
};

export type Voucher = {
  kode: string;
  hadiahId: string;
  nama: string;
  dibuat: number;
  berlaku: number;
  status: 'aktif' | 'terpakai';
  dipakai?: number;
  catatan?: string;
};

export type ItemPesan = {
  kunci: string;
  menuId: string;
  nama: string;
  qty: number;
  harga: number;
  opsi: string[];
  musiman: boolean;
  minuman: boolean;
  besar: boolean;
  shot: boolean;
};

export type Trx = {
  id: string;
  waktu: number;
  outlet: string;
  jenis: 'kasir' | 'ambil';
  item: ItemPesan[];
  subtotal: number;
  potongan: number;
  total: number;
  bintik: number;
  voucher?: { kode: string; nama: string };
  pesananId?: string;
};

export type Pesanan = {
  id: string;
  nomor: string;
  dibuat: number;
  ambil: number;
  outlet: string;
  item: ItemPesan[];
  subtotal: number;
  potongan: number;
  rincianPotongan: string[];
  total: number;
  bintik: number;
  voucher?: { kode: string; nama: string };
  catatan?: string;
  status: 'aktif' | 'diambil' | 'batal';
  selesai?: number;
};

export type Pref = { susu: 'sapi' | 'oat'; gula: 'normal' | 'kurang' | 'tanpa'; es: 'normal' | 'sedikit'; ukuran: 'sedang' | 'besar' };
export type Notif = { promo: boolean; hangus: boolean; pesanan: boolean };

export type Akun = {
  v: number;
  dibuat: number;
  nama: string;
  nomor: string;
  telp: string;
  lahir: string;
  outletFav: string;
  lokasi: string;
  pref: Pref;
  notif: Notif;
  mutasi: Mutasi[];
  voucher: Voucher[];
  trx: Trx[];
  pesanan: Pesanan[];
  /** Cap kartu musim hujan (0–5); penuh 6 = voucher minuman musim hujan. */
  cap: number;
  /** Sudah melewati perkenalan "Gabung Kawan Blirik". */
  gabung: boolean;
};
