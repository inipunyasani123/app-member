// Native: muat font dari assets/fonts (satu berkas per bobot). Web memakai @font-face di +html.tsx (huruf.web.ts).
import { useFonts } from 'expo-font';

export function useHuruf() {
  const [siap] = useFonts({
    Caprasimo: require('../../assets/fonts/Caprasimo-Regular.ttf'),
    'Schibsted-400': require('../../assets/fonts/SchibstedGrotesk-Regular.ttf'),
    'Schibsted-600': require('../../assets/fonts/SchibstedGrotesk-SemiBold.ttf'),
    'Schibsted-800': require('../../assets/fonts/SchibstedGrotesk-ExtraBold.ttf'),
    FragmentMono: require('../../assets/fonts/FragmentMono-Regular.ttf'),
  });
  return siap;
}
