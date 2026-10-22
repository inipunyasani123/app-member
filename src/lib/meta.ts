import { SITUS, MEREK } from '@/data/merek';

type Masukan = { judul: string; desk: string; jalur: string; noindex?: boolean };

/** Metadata lengkap per rute (Expo Router SDK 58: generateMetadata dari berkas rute, tidak digabung dengan layout). */
export function meta({ judul, desk, jalur, noindex }: Masukan) {
  const url = SITUS + jalur;
  const gambar = { url: `${SITUS}/og.jpg`, width: 1200, height: 630, alt: 'Aplikasi member Kopi Blirik dalam bingkai ponsel: kartu enamel, saldo bintik, dan menu musim hujan' };
  return {
    title: judul,
    description: desk,
    applicationName: MEREK.nama,
    authors: [{ name: 'PintuWeb', url: 'https://www.pintuweb.id' }],
    creator: 'PintuWeb',
    publisher: 'PintuWeb',
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const, 'max-snippet': -1 } },
    openGraph: { type: 'website', locale: 'id_ID', url, siteName: MEREK.nama, title: judul, description: desk, images: [gambar] },
    twitter: { card: 'summary_large_image' as const, title: judul, description: desk, images: [{ url: gambar.url, alt: gambar.alt }] },
    appleWebApp: { title: MEREK.nama, statusBarStyle: 'default' as const },
    formatDetection: { telephone: false, address: false, email: false },
  };
}
