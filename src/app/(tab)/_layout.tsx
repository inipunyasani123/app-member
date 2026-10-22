import { View } from 'react-native';
import { Slot } from 'expo-router';
import { TabBar } from '@/ui/TabBar';
import { W } from '@/ui/tema';

export default function TataTab() {
  return (
    <View style={{ flex: 1, backgroundColor: W.enamel }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <TabBar />
    </View>
  );
}
