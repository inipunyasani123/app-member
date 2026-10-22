// Web: localStorage langsung (setara AsyncStorage di web), dibungkus try/catch untuk mode privat.
export async function baca(kunci: string): Promise<string | null> {
  try {
    return window.localStorage.getItem(kunci);
  } catch {
    return null;
  }
}
export async function tulis(kunci: string, nilai: string) {
  try {
    window.localStorage.setItem(kunci, nilai);
  } catch {}
}
export async function hapus(kunci: string) {
  try {
    window.localStorage.removeItem(kunci);
  } catch {}
}
