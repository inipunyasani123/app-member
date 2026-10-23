// Native: getar ringan untuk momen penting (bintik masuk, tukar hadiah). Versi web (getar.web.ts) diam.
import * as Haptics from 'expo-haptics';

export function getarBerhasil() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
export function getarRingan() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
