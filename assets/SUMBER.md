# Sumber gambar dan huruf

Kopi Blirik, outlet, alamat, member, dan transaksinya adalah rekaan untuk demo PintuWeb.

## Foto (public/foto, varian WebP dibuat oleh `node scripts/foto.mjs <folder-asli>`)

Semua foto berlisensi CC0 atau domain publik, tanpa wajah orang. Nama berkas di aplikasi tidak sama dengan judul aslinya; isinya dipakai sebagai suasana outlet atau menu rekaan.

| Berkas | Dipakai untuk | Sumber | Pembuat | Lisensi |
| --- | --- | --- | --- | --- |
| kopi-susu-blirik | Kopi Susu Blirik | https://wordpress.org/photos/photo/7916a230fa/ | manjil2008 (WordPress Photo Directory) | CC0 |
| es-kopi-kelapa | Es Kopi Susu Kelapa | https://commons.wikimedia.org/wiki/File:Es_Kopi_Susu_Kekinian.jpg | Fhikri Latifi | CC0 |
| wedang-jahe-aren | Wedang Jahe Gula Aren | https://commons.wikimedia.org/wiki/File:Ginger_tea.jpg | congerdesign | CC0 |
| cokelat-kayu-manis | Cokelat Kayu Manis | https://commons.wikimedia.org/wiki/File:Hot-chocolate-1058197.jpg | Steve Buissinne | CC0 |
| pisang-goreng-madu | Pisang Goreng Madu | https://commons.wikimedia.org/wiki/File:Pisang_Goreng_Hangat.jpg | AndriFB | CC0 |
| roti-bakar-cokelat | Roti Bakar Cokelat Keju | https://commons.wikimedia.org/wiki/File:Roti_Bakar_Rumahan.jpg | Aqilla Rahmi | CC0 |
| biji-kopi | Hadiah biji kopi | https://commons.wikimedia.org/wiki/File:Roasted_coffee_beans.jpg | MarkSweep | Domain publik |
| cangkir-enamel | Hadiah set cangkir enamel | https://wordpress.org/photos/photo/631678ba29/ | pengguna 13994457 (WordPress Photo Directory) | CC0 |
| espresso | Hadiah tambah 1 shot espresso | https://commons.wikimedia.org/wiki/File:Espresso_Coffee_01.jpg | Jubair1985 | CC0 |
| latte-art | Hadiah naik ukuran gratis (pendekatan: cangkir latte) | https://commons.wikimedia.org/wiki/File:Latte_art_3.jpg | Kim Sanso | CC0 |
| latte-dingin | Hadiah minuman apa saja ukuran besar (pendekatan: gelas kopi susu dingin) | https://commons.wikimedia.org/wiki/File:Cold_latte_in_a_glass_cup_(Unsplash).jpg | Demi DeHerrera (demidearest) | CC0 |
| seduh-manual | Hadiah kelas seduh manual (pendekatan: seduh pour-over) | https://commons.wikimedia.org/wiki/File:Manual_drip_(pour-over)_coffee.jpg | Kim Sanso | CC0 |
| outlet-tulungagung | Suasana Blirik Tulungagung | https://wordpress.org/photos/photo/8236a11dc7/ | manjil2008 (WordPress Photo Directory) | CC0 |
| outlet-kediri | Suasana Blirik Kediri | https://wordpress.org/photos/photo/97767858db/ | pengguna 13994457 (WordPress Photo Directory) | CC0 |
| outlet-blitar | Suasana Blirik Blitar | https://wordpress.org/photos/photo/807640e093/ | sudeepizer (WordPress Photo Directory) | CC0 |
| outlet-malang | Suasana Blirik Malang | https://wordpress.org/photos/photo/7966a1eae2/ | wprashed (WordPress Photo Directory) | CC0 |
| outlet-surabaya | Suasana Blirik Surabaya | https://commons.wikimedia.org/wiki/File:Empty_coffee_shop_interior_with_wooden_table_and_water_skis.jpg | Drew Coffman | CC0 |

## Ilustrasi buatan sendiri

- Ikon aplikasi (cangkir enamel): `scripts/ikon.mjs`, sumber vektor di `design/ikon.svg`.
- Lambang level Lepek, Cangkir, Teko, Ceret: `src/ui/Wadah.tsx`.
- Ilustrasi hadiah non-produk (potongan harga dan cap musim hujan; hadiah lain kini foto) dan cangkir kosong: `src/ui/IlustrasiHadiah.tsx`. Kartu cap musim hujan: `src/ui/KartuCap.tsx`.
- Tekstur bintik blirik dan gompal enamel: `src/ui/Bintik.tsx`. Ikon garis: `src/ui/Ikon.tsx`.
- Tidak ada gambar orang. Avatar member berupa huruf awal nama.

## Huruf (SIL Open Font License 1.1, dari Google Fonts)

- Caprasimo (judul), Schibsted Grotesk (teks), Fragment Mono (kode voucher).
- Web: WOFF2 di `public/fonts`, dipangkas dari subset latin Google Fonts dengan fontTools:
  `pyftsubset <asli>.woff2 --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2192,U+2212" --layout-features="kern,liga,calt,tnum,lnum" --flavor=woff2`.
  Menambah aksara di luar rentang itu = ulangi subset dari berkas asli Google Fonts.
- Android/iOS: TTF utuh di `assets/fonts`.
