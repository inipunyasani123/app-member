import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Platform, View, StyleSheet } from 'react-native';
import { Meter } from './Meter';
import { W } from './tema';

/** true bila pengguna meminta gerak dikurangi (web: prefers-reduced-motion, native: setelan aksesibilitas). */
export function useGerakDikurangi() {
  const [kurangi, setKurangi] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setKurangi(mq.matches);
        const f = (e: MediaQueryListEvent) => setKurangi(e.matches);
        mq.addEventListener('change', f);
        return () => mq.removeEventListener('change', f);
      } catch {
        return;
      }
    }
    AccessibilityInfo.isReduceMotionEnabled().then(setKurangi).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setKurangi);
    return () => sub.remove();
  }, []);
  return kurangi;
}

/** Meteran bintik yang bertambah titik demi titik dari `dari` ke `ke` (instan bila gerak dikurangi). */
export function MeterBertambah({ dari, ke, maks, label, terang, jumlah }: { dari: number; ke: number; maks: number; label: string; terang?: boolean; jumlah?: number }) {
  const kurangi = useGerakDikurangi();
  const [nilai, setNilai] = useState(kurangi ? ke : dari);
  useEffect(() => {
    if (kurangi) {
      setNilai(ke);
      return;
    }
    setNilai(dari);
    const langkah = Math.max(1, Math.round((ke - dari) / 14));
    const id = setInterval(() => {
      setNilai((v) => {
        const n = Math.min(ke, v + langkah);
        if (n >= ke) clearInterval(id);
        return n;
      });
    }, 70);
    return () => clearInterval(id);
  }, [dari, ke, kurangi]);
  return <Meter nilai={nilai} maks={maks} label={label} terang={terang} jumlah={jumlah} />;
}

/** Karcis yang keluar dari celah enamel seperti struk tercetak. */
export function Tercetak({ children }: { children: ReactNode }) {
  const kurangi = useGerakDikurangi();
  const geser = useRef(new Animated.Value(kurangi ? 0 : 1)).current;
  const [tinggi, setTinggi] = useState(0);
  useEffect(() => {
    if (kurangi || !tinggi) {
      geser.setValue(0);
      return;
    }
    geser.setValue(1);
    Animated.timing(geser, { toValue: 0, duration: 650, delay: 120, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [kurangi, tinggi, geser]);
  return (
    <View>
      <View style={s.celah} />
      <View style={s.wadah}>
        <Animated.View
          onLayout={(e) => setTinggi(e.nativeEvent.layout.height)}
          style={{ transform: [{ translateY: geser.interpolate({ inputRange: [0, 1], outputRange: [0, -(tinggi + 12)] }) }] }}
        >
          {children}
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  celah: { height: 12, marginHorizontal: -4, borderRadius: 6, backgroundColor: W.hijauTua, borderWidth: 2, borderColor: W.hijau, zIndex: 2 },
  wadah: { overflow: 'hidden', marginTop: -6, paddingTop: 6, paddingHorizontal: 2 },
});
