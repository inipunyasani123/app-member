export type Kategori = 'musiman' | 'kopi' | 'nonkopi' | 'makanan';
export type Menu = {
  id: string;
  nama: string;
  kategori: Kategori;
  harga: number;
  desk: string;
  foto?: string;
  /** es, panas, atau keduanya (bisa dipilih). Kosong = makanan. */
  suhu?: 'es' | 'panas' | 'keduanya';
  susu?: boolean;
  gula?: boolean;
  shot?: boolean;
  rasa?: string[];
};

export const KATEGORI: { id: Kategori; nama: string }[] = [
  { id: 'musiman', nama: 'Musim hujan' },
  { id: 'kopi', nama: 'Kopi' },
  { id: 'nonkopi', nama: 'Bukan kopi' },
  { id: 'makanan', nama: 'Teman ngopi' },
];

export const MENU: Menu[] = [
  {
    id: 'es-kopi-kelapa', nama: 'Es Kopi Susu Kelapa', kategori: 'musiman', harga: 27000, foto: 'es-kopi-kelapa',
    desk: 'Espresso robusta Kediri, susu segar, santan kelapa bakar, dan gula aren cair.', suhu: 'es', susu: true, gula: true, shot: true,
    rasa: ['gurih', 'karamel', 'kelapa bakar'],
  },
  {
    id: 'wedang-jahe-aren', nama: 'Wedang Jahe Gula Aren', kategori: 'musiman', harga: 18000, foto: 'wedang-jahe-aren',
    desk: 'Jahe emprit dibakar lalu digeprek, direbus bersama sereh dan gula aren. Hangat sampai ke dada.', suhu: 'panas', gula: true,
    rasa: ['pedas hangat', 'sereh', 'manis legit'],
  },
  {
    id: 'cokelat-kayu-manis', nama: 'Cokelat Kayu Manis', kategori: 'musiman', harga: 25000, foto: 'cokelat-kayu-manis',
    desk: 'Cokelat hitam 60%, susu, sejumput kayu manis, dan krim kocok di atasnya.', suhu: 'keduanya', susu: true, gula: true,
    rasa: ['cokelat pekat', 'kayu manis', 'creamy'],
  },
  {
    id: 'pisang-goreng-madu', nama: 'Pisang Goreng Madu', kategori: 'musiman', harga: 17000, foto: 'pisang-goreng-madu',
    desk: 'Pisang kepok digoreng tepung renyah, disiram madu hutan dan taburan kayu manis.',
    rasa: ['renyah', 'madu', 'hangat'],
  },
  {
    id: 'kopi-susu-blirik', nama: 'Kopi Susu Blirik', kategori: 'kopi', harga: 22000, foto: 'kopi-susu-blirik',
    desk: 'Andalan kami: espresso, susu segar, dan gula aren. Disajikan di gelas kristal seperti di rumah nenek.', suhu: 'keduanya', susu: true, gula: true, shot: true,
  },
  { id: 'kopi-tubruk', nama: 'Kopi Tubruk Robusta', kategori: 'kopi', harga: 13000, desk: 'Robusta Kediri giling kasar, diseduh air mendidih, ampasnya dibiarkan turun.', suhu: 'panas', gula: true },
  { id: 'americano', nama: 'Americano', kategori: 'kopi', harga: 18000, desk: 'Dua shot espresso campuran arabika Kawi dan robusta, ditambah air.', suhu: 'keduanya', gula: true, shot: true },
  { id: 'cappuccino', nama: 'Cappuccino', kategori: 'kopi', harga: 25000, desk: 'Espresso dengan susu berbusa tebal. Cocok untuk pagi yang gerimis.', suhu: 'keduanya', susu: true, gula: true, shot: true },
  { id: 'teh-tarik-rempah', nama: 'Teh Tarik Rempah', kategori: 'nonkopi', harga: 19000, desk: 'Teh hitam, susu kental, kapulaga, dan cengkih, ditarik sampai berbusa.', suhu: 'keduanya', gula: true },
  { id: 'susu-gula-aren', nama: 'Susu Gula Aren', kategori: 'nonkopi', harga: 17000, desk: 'Susu segar dingin dengan gula aren cair. Tanpa kopi, tetap manis legit.', suhu: 'es', susu: true, gula: true },
  { id: 'roti-bakar-cokelat', nama: 'Roti Bakar Cokelat Keju', kategori: 'makanan', harga: 20000, foto: 'roti-bakar-cokelat', desk: 'Roti tebal dibakar mentega, isi cokelat, ditutup parutan keju.' },
  { id: 'kue-lumpur', nama: 'Kue Lumpur Kentang', kategori: 'makanan', harga: 9000, desk: 'Kue lumpur lembut dengan kismis. Dua potong per porsi.' },
  { id: 'nasi-pecel', nama: 'Nasi Pecel Telur Ceplok', kategori: 'makanan', harga: 22000, desk: 'Sayur rebus, sambal kacang pedas sedang, peyek, dan telur ceplok.' },
];

export const menuById = (id: string) => MENU.find((m) => m.id === id);
export const MUSIMAN = MENU.filter((m) => m.kategori === 'musiman');
export const HARGA_BESAR = 5000;
export const HARGA_OAT = 6000;
export const HARGA_SHOT = 6000;
