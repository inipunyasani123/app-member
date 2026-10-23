import { menitDalamHari, bagian, jamDariMenit, NAMA_HARI, awalHari, HARI, MENIT } from '@/lib/waktu';

/** Jam buka per hari (0 = Minggu) dalam menit sejak 00.00 WIB. tutup > 1440 berarti lewat tengah malam. null = libur. */
type Jam = [number, number] | null;
export type Outlet = {
  slug: string;
  nama: string;
  kota: string;
  alamat: string;
  julukan: string;
  catatan: string;
  foto: string;
  lat: number;
  lng: number;
  jam: Jam[];
  fasilitas: string[];
  /** Perkiraan keramaian per jam (rekaan), indeks 0 = 06.00 … 17 = 23.00, skala 0–4. */
  ramai: number[];
  bayar: string[];
};

const j = (a: string, b: string): Jam => {
  const m = (s: string) => {
    const [h, mm] = s.split('.').map(Number);
    return h * 60 + mm;
  };
  return [m(a), m(b) < m(a) ? m(b) + 1440 : m(b)];
};

export const OUTLET: Outlet[] = [
  {
    slug: 'tulungagung', nama: 'Blirik Tulungagung', kota: 'Tulungagung', julukan: 'Rumah Sangrai',
    alamat: 'Jl. Wijaya Kusuma Lor 17, Tulungagung',
    catatan: 'Outlet pertama. Biji kopi untuk semua outlet disangrai di sini tiap Selasa dan Jumat pagi.',
    foto: 'outlet-tulungagung', lat: -8.0657, lng: 111.902,
    jam: [j('07.00', '22.00'), j('07.00', '22.00'), j('07.00', '22.00'), j('07.00', '22.00'), j('07.00', '22.00'), j('07.00', '23.00'), j('07.00', '23.00')],
    fasilitas: ['Colokan di tiap meja', 'Musala', 'Parkir motor dan mobil', 'Akses kursi roda', 'Area merokok terpisah'],
    ramai: [0, 2, 3, 2, 1, 1, 2, 2, 1, 1, 2, 3, 4, 4, 3, 2, 1, 0],
    bayar: ['QRIS', 'Tunai', 'Kartu debit'],
  },
  {
    slug: 'kediri', nama: 'Blirik Kediri', kota: 'Kediri', julukan: 'Bar Seduh',
    alamat: 'Jl. Pakis Sari 8, Kediri',
    catatan: 'Bar kecil dengan mesin espresso hijau tua. Paling ramai jam pulang kantor.',
    foto: 'outlet-kediri', lat: -7.8166, lng: 112.0114,
    jam: [j('08.00', '22.00'), j('07.00', '21.00'), j('07.00', '21.00'), j('07.00', '21.00'), j('07.00', '21.00'), j('07.00', '21.00'), j('08.00', '22.00')],
    fasilitas: ['Colokan di tiap meja', 'Parkir motor', 'Wi-Fi', 'Area merokok terpisah'],
    ramai: [0, 2, 2, 1, 1, 1, 2, 1, 1, 2, 3, 4, 4, 3, 2, 1, 0, 0],
    bayar: ['QRIS', 'Tunai'],
  },
  {
    slug: 'blitar', nama: 'Blirik Blitar', kota: 'Blitar', julukan: 'Jendela Hijau',
    alamat: 'Jl. Kenanga Tengah 21, Blitar',
    catatan: 'Lantai tegel lawas dan jendela lengkung hijau. Libur tiap Senin untuk perawatan.',
    foto: 'outlet-blitar', lat: -8.0983, lng: 112.1681,
    jam: [j('08.00', '21.30'), null, j('08.00', '21.30'), j('08.00', '21.30'), j('08.00', '21.30'), j('08.00', '21.30'), j('08.00', '21.30')],
    fasilitas: ['Area luar ruang', 'Ramah anak', 'Parkir motor', 'Akses kursi roda'],
    ramai: [0, 0, 2, 2, 1, 1, 2, 2, 2, 2, 3, 3, 4, 3, 2, 1, 0, 0],
    bayar: ['QRIS', 'Tunai'],
  },
  {
    slug: 'malang', nama: 'Blirik Malang', kota: 'Malang', julukan: 'Meja Panjang',
    alamat: 'Jl. Kembang Turi 9, Malang',
    catatan: 'Dekat kampus, buka paling pagi. Meja panjang di depan bar untuk yang datang sendirian.',
    foto: 'outlet-malang', lat: -7.9666, lng: 112.6326,
    jam: [j('06.30', '22.00'), j('06.30', '22.00'), j('06.30', '22.00'), j('06.30', '22.00'), j('06.30', '22.00'), j('06.30', '22.00'), j('06.30', '22.00')],
    fasilitas: ['Colokan di tiap meja', 'Wi-Fi', 'Musala', 'Parkir motor'],
    ramai: [2, 3, 4, 3, 2, 2, 3, 2, 2, 2, 3, 3, 3, 3, 2, 2, 1, 0],
    bayar: ['QRIS', 'Tunai', 'Kartu debit'],
  },
  {
    slug: 'surabaya', nama: 'Blirik Surabaya', kota: 'Surabaya', julukan: 'Tembok Bata',
    alamat: 'Jl. Pasar Kembang Wetan 30, Surabaya',
    catatan: 'Outlet terbesar dengan tembok bata ekspos. Jumat dan Sabtu buka sampai lewat tengah malam.',
    foto: 'outlet-surabaya', lat: -7.2575, lng: 112.7521,
    jam: [j('08.00', '23.00'), j('08.00', '23.00'), j('08.00', '23.00'), j('08.00', '23.00'), j('08.00', '23.00'), j('08.00', '00.30'), j('08.00', '00.30')],
    fasilitas: ['Colokan di tiap meja', 'Wi-Fi', 'Musala', 'Parkir motor dan mobil', 'Area luar ruang', 'Area merokok terpisah', 'Akses kursi roda'],
    ramai: [0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 3, 3, 4, 4, 4, 3, 3, 2],
    bayar: ['QRIS', 'Tunai', 'Kartu debit', 'Kartu kredit'],
  },
];

export const outletBySlug = (s: string) => OUTLET.find((o) => o.slug === s);

export const LOKASI_CONTOH = [
  { id: 'tulungagung', nama: 'Tulungagung', lat: -8.0712, lng: 111.9098 },
  { id: 'kediri', nama: 'Kediri', lat: -7.8241, lng: 112.0172 },
  { id: 'blitar', nama: 'Blitar', lat: -8.1021, lng: 112.1601 },
  { id: 'malang', nama: 'Malang', lat: -7.9781, lng: 112.6216 },
  { id: 'surabaya', nama: 'Surabaya', lat: -7.2661, lng: 112.7378 },
];

export function jarak(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(b.lat - a.lat), dLng = r(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export const teksJam = (x: Jam) => (x ? `${jamDariMenit(x[0])}–${jamDariMenit(x[1])}` : 'Libur');

export type Status = { buka: boolean; teks: string; segera?: boolean };

/** Status buka dalam WIB, termasuk jam yang melewati tengah malam dari hari sebelumnya. */
export function statusBuka(o: Outlet, kini: number): Status {
  const hari = bagian(kini).hari;
  const m = menitDalamHari(kini);
  const kemarin = o.jam[(hari + 6) % 7];
  if (kemarin && kemarin[1] > 1440 && m < kemarin[1] - 1440) {
    const sisa = kemarin[1] - 1440 - m;
    return { buka: true, segera: sisa <= 45, teks: `Buka · tutup ${jamDariMenit(kemarin[1])}` };
  }
  const ini = o.jam[hari];
  if (ini && m >= ini[0] && m < ini[1]) {
    const sisa = ini[1] - m;
    return { buka: true, segera: sisa <= 45, teks: sisa <= 45 ? `Segera tutup · ${jamDariMenit(ini[1])}` : `Buka · tutup ${jamDariMenit(ini[1])}` };
  }
  if (ini && m < ini[0]) return { buka: false, teks: `Tutup · buka ${jamDariMenit(ini[0])}` };
  for (let n = 1; n <= 7; n++) {
    const h = (hari + n) % 7;
    const x = o.jam[h];
    if (x) return { buka: false, teks: `Tutup · buka ${n === 1 ? 'besok' : NAMA_HARI[h]} ${jamDariMenit(x[0])}` };
  }
  return { buka: false, teks: 'Tutup' };
}

/** Pilihan waktu ambil tiap 15 menit: paling cepat 15 menit dari sekarang, paling lambat 15 menit sebelum tutup. */
export function slotAmbil(o: Outlet, kini: number, maks = 12) {
  const hasil: { t: number; label: string; besok: boolean }[] = [];
  for (let hariKe = 0; hariKe < 3 && hasil.length < maks; hariKe++) {
    const awal = awalHari(kini) + hariKe * HARI;
    const hari = (bagian(kini).hari + hariKe) % 7;
    const x = o.jam[hari];
    if (!x) continue;
    const paling = hariKe === 0 ? Math.ceil((menitDalamHari(kini) + 15) / 15) * 15 : 0;
    for (let m = Math.max(x[0] + 15, paling); m <= x[1] - 15 && hasil.length < maks; m += 15) {
      if (hariKe === 0 && m < x[0] + 15) continue;
      hasil.push({ t: awal + m * MENIT, label: jamDariMenit(m), besok: hariKe > 0 });
    }
    if (hasil.length) break;
  }
  return hasil;
}
