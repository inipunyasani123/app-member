// Web: lembar bawah sebagai dialog ARIA di dalam bingkai aplikasi (portal ke #lapisan),
// fokus dipindah ke dialog, Escape menutup, latar dibuat inert, fokus kembali ke pemicu saat ditutup.
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pressable, ScrollView, View } from 'react-native';
import { T } from './Teks';
import { TombolIkon } from './Tombol';
import { sLembar as s } from './lembarGaya';
import type { LembarProps } from './Lembar';

export function Lembar({ terbuka, onTutup, judul, children, bawah }: LembarProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const idJudul = useId();
  const dialog = useRef<HTMLElement | null>(null);
  const tutupRef = useRef(onTutup);
  tutupRef.current = onTutup;

  useEffect(() => setHost(document.getElementById('lapisan')), []);
  useEffect(() => {
    if (!terbuka) return;
    const pemicu = document.activeElement as HTMLElement | null;
    const tumpuk = document.getElementById('tumpuk');
    tumpuk?.setAttribute('inert', '');
    const tombol = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        tutupRef.current();
      }
    };
    document.addEventListener('keydown', tombol);
    return () => {
      document.removeEventListener('keydown', tombol);
      tumpuk?.removeAttribute('inert');
      if (pemicu && document.contains(pemicu)) pemicu.focus();
    };
  }, [terbuka]);

  // Fokus dipindah ke dialog setelah portal benar-benar terpasang (host bisa baru tersedia setelah render pertama).
  useEffect(() => {
    if (!terbuka || !host) return;
    const t = setTimeout(() => {
      const el = dialog.current;
      if (!el) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(t);
  }, [terbuka, host]);

  if (!terbuka || !host) return null;
  return createPortal(
    <View style={s.latar}>
      <Pressable style={s.tirai} onPress={onTutup} aria-hidden tabIndex={-1} />
      <View
        ref={(el) => {
          dialog.current = el as unknown as HTMLElement;
        }}
        role="dialog"
        aria-modal
        aria-labelledby={idJudul}
        tabIndex={-1}
        style={[s.lembar, { paddingBottom: 14 }]}
      >
        <View style={s.pegangan} />
        <View style={s.kepala}>
          <T v="judul2" h={2} nativeID={idJudul} style={{ flex: 1 }}>{judul}</T>
          <TombolIkon n="tutup" label="Tutup" onPress={onTutup} />
        </View>
        <ScrollView style={s.gulir} contentContainerStyle={s.isi}>{children}</ScrollView>
        {bawah ? <View style={s.bawah}>{bawah}</View> : null}
      </View>
    </View>,
    host,
  );
}
