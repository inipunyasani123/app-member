import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { JUDUL } from '@/lib/judul';
import { StatusBar } from 'expo-status-bar';
import { muat } from '@/lib/toko';
import { useHuruf } from '@/ui/huruf';
import { W } from '@/ui/tema';

/** Web: judul tab ikut berganti saat pindah halaman di dalam aplikasi (HTML statis sudah benar sejak awal). */
function JudulTab() {
  const path = usePathname();
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const judul = JUDUL[path] ?? JUDUL['/404'];
    if (document.title !== judul) document.title = judul;
  }, [path]);
  return null;
}

export default function Akar() {
  const siap = useHuruf();
  useEffect(() => {
    muat();
  }, []);
  if (!siap) return <View style={{ flex: 1, backgroundColor: W.enamel }} />;
  return (
    <View style={s.akar}>
      <JudulTab />
      <View nativeID="tumpuk" style={s.akar}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: W.enamel }, animation: 'slide_from_right' }} />
      </View>
      <View nativeID="lapisan" pointerEvents="box-none" style={StyleSheet.absoluteFill} />
      <StatusBar style="dark" />
    </View>
  );
}

const s = StyleSheet.create({ akar: { flex: 1, backgroundColor: W.enamel } });
