// Native: lembar bawah memakai Modal bawaan React Native. Versi web: Lembar.web.tsx (portal + dialog ARIA).
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from './Teks';
import { TombolIkon } from './Tombol';
import { sLembar as s } from './lembarGaya';

export type LembarProps = { terbuka: boolean; onTutup: () => void; judul: string; children: ReactNode; bawah?: ReactNode };

export function Lembar({ terbuka, onTutup, judul, children, bawah }: LembarProps) {
  const ins = useSafeAreaInsets();
  return (
    <Modal visible={terbuka} transparent animationType="slide" onRequestClose={onTutup} statusBarTranslucent>
      <View style={s.latar}>
        <Pressable style={s.tirai} onPress={onTutup} accessibilityLabel="Tutup" />
        <View style={[s.lembar, { paddingBottom: ins.bottom + 12 }]} accessibilityViewIsModal>
          <View style={s.pegangan} />
          <View style={s.kepala}>
            <T v="judul2" h={2} style={{ flex: 1 }}>{judul}</T>
            <TombolIkon n="tutup" label="Tutup" onPress={onTutup} />
          </View>
          <ScrollView style={s.gulir} contentContainerStyle={s.isi}>{children}</ScrollView>
          {bawah ? <View style={s.bawah}>{bawah}</View> : null}
        </View>
      </View>
    </Modal>
  );
}
