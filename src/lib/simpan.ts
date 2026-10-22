// Native: AsyncStorage. Versi web ada di simpan.web.ts (localStorage).
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function baca(kunci: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(kunci);
  } catch {
    return null;
  }
}
export async function tulis(kunci: string, nilai: string) {
  try {
    await AsyncStorage.setItem(kunci, nilai);
  } catch {}
}
export async function hapus(kunci: string) {
  try {
    await AsyncStorage.removeItem(kunci);
  } catch {}
}
