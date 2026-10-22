# Kopi Blirik · demo aplikasi member & poin kafe

Demo aplikasi mobile buatan [PintuWeb](https://www.pintuweb.id): kartu member QR (berganti tiap 60 detik), bintik dan riwayatnya, level Lepek–Ceret, katalog hadiah dan voucher, menu musim hujan, outlet dengan jam buka WIB, pesan ambil, riwayat transaksi, serta profil dan preferensi. Merek, outlet, dan datanya rekaan; data contoh dibuat di perangkat relatif terhadap hari pertama dibuka.

- Live: https://app-member.pintuweb.id
- Teknologi: React Native + Expo SDK 58 (expo-router, web `output: "static"`), satu kode untuk Android, iOS, dan web.
- Data: AsyncStorage di Android/iOS, localStorage di web. Tanpa server.

```bash
npm install
npm run web            # pengembangan (port 3770)
npx expo export -p web # build statis ke dist/ (dipakai Vercel)
npx expo run:android   # atau run:ios, butuh Android Studio/Xcode
```

Skrip aset: `node scripts/foto.mjs <folder-foto-asli>` (varian WebP), `node scripts/ikon.mjs` (ikon), `node scripts/sitemap.mjs`. Sumber foto dan huruf: `assets/SUMBER.md`.
