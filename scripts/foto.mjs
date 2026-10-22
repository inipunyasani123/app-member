// Membuat varian WebP foto (CC0/PD) untuk aplikasi: kotak 1:1 (k) dan lebar 4:3 (l), dua ukuran masing-masing.
// Pakai: node scripts/foto.mjs <folder-foto-asli>
// Foto asli tidak disimpan di repo (ukurannya besar); sumber & lisensi tiap foto ada di public/foto/SUMBER.md.
// Titik potong: [cx, cy, lebar] dalam pecahan lebar/tinggi foto asli.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const asal = process.argv[2];
if (!asal) { console.error('Pakai: node scripts/foto.mjs <folder-foto-asli>'); process.exit(1); }
const keluar = path.resolve('public/foto');
mkdirSync(keluar, { recursive: true });

const FOTO = {
  'kopi-susu-blirik': { k: [0.47, 0.64, 0.78], l: [0.5, 0.6, 1] },
  'es-kopi-kelapa': { k: [0.42, 0.5, 0.82], l: [0.42, 0.46, 0.84] },
  'wedang-jahe-aren': { k: [0.5, 0.42, 1], l: [0.5, 0.42, 1] },
  'cokelat-kayu-manis': { k: [0.5, 0.5, 0.62], l: [0.5, 0.5, 0.95] },
  'roti-bakar-cokelat': { k: [0.48, 0.42, 0.95], l: [0.5, 0.4, 1] },
  'pisang-goreng-madu': { k: [0.5, 0.52, 0.95], l: [0.5, 0.5, 1] },
  'cangkir-enamel': { k: [0.5, 0.55, 0.66], l: [0.45, 0.5, 0.95] },
  'biji-kopi': { k: [0.5, 0.5, 0.75], l: [0.5, 0.5, 1] },
  'outlet-tulungagung': { k: [0.5, 0.55, 1], l: [0.5, 0.52, 1] },
  'outlet-kediri': { k: [0.5, 0.55, 0.66], l: [0.5, 0.5, 1] },
  'outlet-blitar': { k: [0.5, 0.55, 1], l: [0.5, 0.55, 1] },
  'outlet-malang': { k: [0.5, 0.58, 1], l: [0.5, 0.45, 1] },
  'outlet-surabaya': { k: [0.42, 0.5, 0.66], l: [0.5, 0.5, 1] },
};
const BENTUK = { k: { rasio: 1, ukuran: [320, 640] }, l: { rasio: 4 / 3, ukuran: [480, 960] } };

function wilayah(w, h, [cx, cy, frac], rasio) {
  let cw = Math.round(w * frac), ch = Math.round(cw / rasio);
  if (ch > h) { ch = h; cw = Math.round(ch * rasio); }
  const left = Math.min(Math.max(0, Math.round(cx * w - cw / 2)), w - cw);
  const top = Math.min(Math.max(0, Math.round(cy * h - ch / 2)), h - ch);
  return { left, top, width: cw, height: ch };
}

const daftar = {};
for (const [kunci, potong] of Object.entries(FOTO)) {
  const masuk = await sharp(path.join(asal, `${kunci}.jpg`)).rotate().toBuffer();
  const { width, height } = await sharp(masuk).metadata();
  daftar[kunci] = {};
  for (const [b, { rasio, ukuran }] of Object.entries(BENTUK)) {
    const reg = wilayah(width, height, potong[b], rasio);
    for (const u of ukuran) {
      const nama = `${kunci}-${b}${u}.webp`;
      await sharp(masuk).extract(reg).resize(u, Math.round(u / rasio)).modulate({ saturation: 1.04 }).webp({ quality: u > 500 ? 72 : 76, effort: 6 }).toFile(path.join(keluar, nama));
    }
    daftar[kunci][b] = ukuran;
  }
  console.log('ok', kunci);
}
writeFileSync(path.resolve('src/data/foto-daftar.json'), JSON.stringify(daftar) + '\n');
