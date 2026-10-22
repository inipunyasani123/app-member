// Menulis public/sitemap.xml dari daftar rute + id di src/data. Jalankan ulang bila rute/data berubah.
import { readFileSync, writeFileSync } from 'node:fs';
const SITUS = 'https://app-member.pintuweb.id';
const ambil = (file, pola) => [...readFileSync(file, 'utf8').matchAll(pola)].map((m) => m[1]);
const hadiah = ambil('src/data/hadiah.ts', /\{ id: '([^']+)', nama: '[^']+', jenis:/g);
const musiman = ambil('src/data/menu.ts', /id: '([^']+)', nama: '[^']+', kategori: 'musiman'/g);
const outlet = ambil('src/data/outlet.ts', /slug: '([^']+)', nama:/g);
const rute = ['/', '/kartu', '/pesan', '/hadiah', '/akun', '/poin', '/level', '/voucher', '/promo', '/outlet', '/riwayat',
  ...musiman.map((s) => `/promo/${s}`), ...outlet.map((s) => `/outlet/${s}`), ...hadiah.map((s) => `/hadiah/${s}`)];
const tgl = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rute
  .map((r) => `  <url><loc>${SITUS}${r}</loc><lastmod>${tgl}</lastmod><priority>${r === '/' ? '1.0' : r.split('/').length > 2 ? '0.6' : '0.8'}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap: ${rute.length} alamat`);
