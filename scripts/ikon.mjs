// Membuat semua ikon aplikasi dari satu gambar vektor buatan sendiri (cangkir enamel blirik).
// Pakai: node scripts/ikon.mjs  → public/ (web, PWA) dan assets/ (Android/iOS lewat Expo).
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

function acak(b) { let a = b >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = acak(512);
const bintikLatar = Array.from({ length: 46 }, () => `<circle cx="${(rnd() * 512).toFixed(1)}" cy="${(rnd() * 512).toFixed(1)}" r="${(2 + rnd() * 6).toFixed(1)}"/>`).join('');
const bintikCangkir = Array.from({ length: 22 }, () => `<circle cx="${(168 + rnd() * 160).toFixed(1)}" cy="${(206 + rnd() * 150).toFixed(1)}" r="${(2.5 + rnd() * 5).toFixed(1)}"/>`).join('');

const cangkir = (badan = '#FFFCF4', bintik = '#1B5536', tepi = '#F0C14B', gompal = true) => `<g transform="translate(-14 0)">
  <path d="M344 214h22a46 46 0 0 1 0 92h-22" fill="none" stroke="${badan}" stroke-width="30" stroke-linecap="round"/>
  <path d="M140 172h214v148a62 62 0 0 1-62 62H202a62 62 0 0 1-62-62z" fill="${badan}"/>
  <rect x="126" y="150" width="242" height="40" rx="20" fill="${tepi}"/>
  ${bintik ? `<g fill="${bintik}" opacity=".55">${bintikCangkir}</g>` : ''}
  ${gompal ? '<path d="M150 330q-4-22 14-28t26 12q6 20-12 26t-28-10z" fill="#A9B0A6"/><path d="M160 330q-2-14 10-17t15 8q3 12-8 15t-17-6z" fill="#262B27"/>' : ''}</g>`;

const svg = (bulat = 112, isi = cangkir()) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${bulat}" fill="#1B5536"/><g fill="#FFFCF4" opacity=".14">${bintikLatar}</g>${isi}</svg>`;
const ikonSvg = svg(112);
writeFileSync('design/ikon.svg', ikonSvg);
writeFileSync('public/ikon.svg', ikonSvg);

const png = (s, u, file) => sharp(Buffer.from(s)).resize(u, u).png({ compressionLevel: 9 }).toFile(file);
await png(svg(112), 180, 'public/apple-touch-icon.png');
await png(svg(112), 192, 'public/ikon-192.png');
await png(svg(112), 512, 'public/ikon-512.png');
await png(svg(0), 512, 'public/ikon-maskable-512.png');
await png(svg(0), 1024, 'assets/icon.png');
await png(svg(112), 48, 'assets/favicon.png');

// Android adaptif: latar dan latar depan terpisah (isi di zona aman 66%).
const kecil = (isi) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g transform="translate(256 266) scale(.62) translate(-256 -266)">${isi}</g></svg>`;
await png(kecil(cangkir()), 1024, 'assets/android-icon-foreground.png');
await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#1B5536"/><g fill="#FFFCF4" opacity=".14">${bintikLatar}</g></svg>`, 1024, 'assets/android-icon-background.png');
await png(kecil(cangkir('#FFFFFF', null, '#FFFFFF', false)), 1024, 'assets/android-icon-monochrome.png');

// favicon.ico: satu gambar PNG 48×48 di dalam wadah ICO.
const p48 = await sharp(Buffer.from(svg(112))).resize(48, 48).png().toBuffer();
const kepala = Buffer.alloc(22);
kepala.writeUInt16LE(0, 0); kepala.writeUInt16LE(1, 2); kepala.writeUInt16LE(1, 4);
kepala.writeUInt8(48, 6); kepala.writeUInt8(48, 7); kepala.writeUInt8(0, 8); kepala.writeUInt8(0, 9);
kepala.writeUInt16LE(1, 10); kepala.writeUInt16LE(32, 12); kepala.writeUInt32LE(p48.length, 14); kepala.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([kepala, p48]));
console.log('ikon selesai');
