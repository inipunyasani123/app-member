/** Promo berjalan. Tanggal relatif terhadap hari ini (data contoh), dihitung di perangkat dalam WIB. */
export type Promo = { id: string; judul: string; desk: string; mulaiHari?: number; akhirHari?: number; label: string };

export const PROMO: Promo[] = [
  { id: 'bintik-ganda', label: 'Bintik 2×', judul: 'Bintik dua kali lipat untuk menu musim hujan',
    desk: 'Setiap rupiah yang kamu belanjakan untuk menu musiman dihitung dua kali saat bintik dibagikan.', mulaiHari: -12, akhirHari: 38 },
  { id: 'pagi-ambil', label: 'Hemat Rp3.000', judul: 'Ambil sebelum 09.00 WIB, hemat Rp3.000',
    desk: 'Berlaku untuk pesan ambil dengan waktu ambil sebelum pukul 09.00 WIB. Potongan otomatis di ringkasan pesanan.', mulaiHari: -5, akhirHari: 25 },
  { id: 'tumbler', label: '+5 bintik', judul: 'Bawa tumbler sendiri, dapat 5 bintik',
    desk: 'Tunjukkan tumbler ke kasir saat memesan minuman di outlet. Berlaku setiap hari, tanpa batas waktu.' },
];

export const POTONGAN_PAGI = 3000;
export const BATAS_PAGI_MENIT = 9 * 60;
