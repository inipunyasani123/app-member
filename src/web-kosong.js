// Pengganti kosong (khusus web) untuk modul daftar virtual React Native Web yang tidak dipakai aplikasi ini.
// Dipasang oleh metro.config.js agar bundle web lebih ringan. Jangan pakai FlatList/SectionList di web.
import { forwardRef } from 'react';

const Kosong = forwardRef(function Kosong() {
  return null;
});
export default Kosong;
