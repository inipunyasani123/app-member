import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { muat } from '@/lib/toko';
import { useHuruf } from '@/ui/huruf';
import { W } from '@/ui/tema';

export default function Akar() {
  const siap = useHuruf();
  useEffect(() => {
    muat();
  }, []);
  if (!siap) return <View style={{ flex: 1, backgroundColor: W.enamel }} />;
  return (
    <View style={s.akar}>
      <View nativeID="tumpuk" style={s.akar}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: W.enamel }, animation: 'slide_from_right' }} />
      </View>
      <View nativeID="lapisan" pointerEvents="box-none" style={StyleSheet.absoluteFill} />
      <StatusBar style="dark" />
    </View>
  );
}

const s = StyleSheet.create({ akar: { flex: 1, backgroundColor: W.enamel } });
