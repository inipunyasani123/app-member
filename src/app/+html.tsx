import type { PropsWithChildren } from 'react';
import { useServerDocumentContext } from 'expo-router/html';
import { pathQR } from '@/lib/qr';
import { acak } from '@/lib/format';
import { SITUS, KONTAK, MEREK } from '@/data/merek';

// Berkas ini hanya dijalankan saat build (Node). Panel samping, QR, dan bilah demo adalah HTML statis
// di luar akar React, jadi tidak menambah JavaScript di perangkat.

function latarBintik() {
  const rnd = acak(87);
  let d = '';
  for (let i = 0; i < 140; i++) {
    const x = (rnd() * 600).toFixed(1), y = (rnd() * 600).toFixed(1);
    const r = (rnd() < 0.85 ? 0.8 + rnd() * 1.6 : 2.6 + rnd() * 2.2).toFixed(2);
    d += `<circle cx='${x}' cy='${y}' r='${r}' fill='%231B5536' fill-opacity='${(0.08 + rnd() * 0.16).toFixed(2)}'/>`;
  }
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E${d.replace(/</g, '%3C').replace(/>/g, '%3E')}%3C/svg%3E")`;
}

const CSS = `
@font-face{font-family:'Caprasimo';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/caprasimo-latin.woff2) format('woff2')}
@font-face{font-family:'Schibsted Grotesk';font-style:normal;font-weight:400 800;font-display:swap;src:url(/fonts/schibsted-grotesk-latin.woff2) format('woff2')}
@font-face{font-family:'Fragment Mono';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/fragment-mono-latin.woff2) format('woff2')}
@font-face{font-family:'Schibsted Fallback';src:local('Arial'),local('Helvetica Neue'),local('Roboto');size-adjust:101%;ascent-override:96%;descent-override:26%;line-gap-override:0%}
@font-face{font-family:'Caprasimo Fallback';src:local('Georgia'),local('Times New Roman');size-adjust:112%;ascent-override:88%;descent-override:24%;line-gap-override:0%}
:root{color-scheme:light}
html{background:#E7EEDF;-webkit-text-size-adjust:100%}
body{margin:0;background:#E7EEDF;color:#1A1F1B;font-family:'Schibsted Grotesk','Schibsted Fallback',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.ponsel{position:relative;height:100vh;height:100dvh}
#root{display:flex;flex-direction:column;height:100%;overflow:hidden;background:#E7EEDF}
#root>div{flex:1 1 auto}
#panel{display:none}
*:focus-visible{outline:3px solid #F0C14B;outline-offset:2px;box-shadow:0 0 0 2px #1A1F1B}
[inert]{pointer-events:none}
[role=dialog]:focus-visible{outline:none;box-shadow:none}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
@media (min-width:768px){
  html,body{background:#D9E4D2 ${latarBintik()} repeat}
  .halaman{min-height:100vh;display:flex;align-items:center;justify-content:center;gap:clamp(28px,6vw,96px);padding:32px 24px;box-sizing:border-box}
  .ponsel{flex:0 0 auto;width:390px;height:min(844px,calc(100vh - 64px));min-height:620px;padding:11px;border-radius:58px;background:#1A1F1B;box-shadow:0 0 0 5px #1B5536,0 0 0 7px #0F3524,0 40px 70px -28px rgba(15,53,36,.55)}
  .ponsel::before{content:'';position:absolute;top:22px;left:50%;width:96px;height:26px;margin-left:-48px;border-radius:14px;background:#1A1F1B;z-index:5;pointer-events:none}
  .ponsel #root{border-radius:47px;transform:translateZ(0);padding-top:40px;box-sizing:border-box}
  #panel{display:block;flex:0 1 360px;max-width:360px;color:#1A1F1B}
}
.p-label{margin:0 0 10px;font:800 12px/1.3 'Schibsted Grotesk','Schibsted Fallback',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#1B5536}
.p-judul{margin:0;font:400 46px/1.02 Caprasimo,'Caprasimo Fallback',Georgia,serif;color:#1B5536}
.p-tag{margin:10px 0 0;font:600 18px/1.4 'Schibsted Grotesk','Schibsted Fallback',sans-serif}
.p-desk{margin:12px 0 0;font:400 15px/1.55 'Schibsted Grotesk','Schibsted Fallback',sans-serif;color:#3F4A42}
.p-fitur{list-style:none;margin:20px 0 0;padding:0;display:grid;gap:10px}
.p-fitur li{display:flex;gap:10px;align-items:flex-start;font:500 15px/1.45 'Schibsted Grotesk','Schibsted Fallback',sans-serif}
.p-fitur li::before{content:'';flex:0 0 12px;height:12px;margin-top:5px;border-radius:50% 45% 55% 50%;background:#1B5536;box-shadow:3px -3px 0 -1px #F0C14B}
.p-qr{display:flex;gap:16px;align-items:center;margin:24px 0 0;padding:14px;background:#FAFCF3;border:2px solid #1B5536;border-top-width:5px;border-radius:22px}
.p-qr svg{flex:0 0 112px;width:112px;height:112px;border-radius:10px;background:#fff}
.p-qr p{margin:0;font:400 14px/1.45 'Schibsted Grotesk','Schibsted Fallback',sans-serif;color:#3F4A42}
.p-qr strong{display:block;color:#1A1F1B;font-weight:700;margin-bottom:2px}
.p-cta{display:inline-flex;align-items:center;gap:8px;margin:20px 0 0;min-height:50px;padding:0 24px;border-radius:999px;background:#1B5536;color:#FFFCF4;font:700 16px/1 'Schibsted Grotesk','Schibsted Fallback',sans-serif;text-decoration:none;border:2px solid #0F3524}
.p-cta:hover{background:#0F3524}
@media (min-width:768px) and (max-width:920px){.p-judul{font-size:38px}.p-qr{flex-direction:column;align-items:flex-start}}
.p-catatan{margin:14px 0 0;font:400 13px/1.5 'Schibsted Grotesk','Schibsted Fallback',sans-serif;color:#4B564D}
`;

const SW = `if('serviceWorker' in navigator){addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`;

export default function Root({ children, pathname }: PropsWithChildren<{ pathname?: string }>) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  const jalur = pathname && !/[+_\[]|^\/404/.test(pathname) ? pathname : '/';
  const qr = pathQR(SITUS + jalur, 'M');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['MobileApplication', 'WebApplication'],
    name: MEREK.nama,
    alternateName: 'Kopi Blirik: Member & Poin',
    description: 'Demo aplikasi member dan poin untuk jaringan kafe rekaan di Jawa Timur, dibuat PintuWeb dengan React Native dan Expo.',
    url: `${SITUS}/`,
    image: `${SITUS}/og.jpg`,
    screenshot: `${SITUS}/og.jpg`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android, iOS, Web',
    inLanguage: 'id',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
    featureList: MEREK.fitur,
    creator: { '@type': 'Organization', name: 'PintuWeb', url: 'https://www.pintuweb.id' },
  };
  return (
    <html lang="id" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1B5536" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/ikon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preload" href="/fonts/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/caprasimo-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {headNodes}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body {...bodyAttributes}>
        <div className="halaman">
          <div className="ponsel">{children}</div>
          <aside id="panel" aria-label="Tentang demo aplikasi ini">
            <p className="p-label">Demo aplikasi mobile · PintuWeb</p>
            <p className="p-judul">{MEREK.nama}</p>
            <p className="p-tag">Aplikasi member dan poin untuk jaringan kafe.</p>
            <p className="p-desk">Satu kode React Native untuk Android, iOS, dan web. Yang kamu coba di bingkai ini adalah versi webnya, dengan data contoh di perangkatmu.</p>
            <ul className="p-fitur">
              {MEREK.fitur.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="p-qr">
              <svg viewBox={`0 0 ${qr.sisi} ${qr.sisi}`} role="img" aria-label={`Kode QR menuju ${SITUS}${jalur}`}>
                <rect width={qr.sisi} height={qr.sisi} fill="#fff" />
                <path d={qr.d} fill="#1A1F1B" shapeRendering="crispEdges" />
              </svg>
              <p>
                <strong>Buka di HP</strong>
                Pindai kode ini dengan kamera. Di HP, aplikasinya tampil layar penuh dan bisa dipasang ke layar utama.
              </p>
            </div>
            <a className="p-cta" href={KONTAK}>
              Pesan aplikasi seperti ini
            </a>
            <p className="p-catatan">Kopi Blirik, outlet, dan data member di demo ini rekaan.</p>
          </aside>
        </div>
        {bodyNodes}
        <aside
          aria-label="Tentang situs demo ini"
          style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}
        >
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href={KONTAK} style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Buat yang seperti ini →
          </a>
        </aside>
        <script dangerouslySetInnerHTML={{ __html: SW }} />
      </body>
    </html>
  );
}
