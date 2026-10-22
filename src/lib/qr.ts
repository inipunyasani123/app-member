import qrcode from 'qrcode-generator';

/** Matriks QR → satu path SVG (modul gelap sebagai kotak 1×1), dengan zona tenang 4 modul. */
export function pathQR(teks: string, tingkat: 'L' | 'M' | 'Q' | 'H' = 'M') {
  const qr = qrcode(0, tingkat);
  qr.addData(teks);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (qr.isDark(r, c)) {
        let p = c;
        while (p < n && qr.isDark(r, p)) p++;
        d += `M${c + 4} ${r + 4}h${p - c}v1h-${p - c}z`;
        c = p;
      } else c++;
    }
  }
  return { d, sisi: n + 8 };
}
