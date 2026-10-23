import { useState } from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { Lembar } from './Lembar';
import { T } from './Teks';
import { Tombol } from './Tombol';
import { Ikon, type NamaIkon } from './Ikon';
import { KartuMember } from './KartuMember';
import { Tercetak } from './Gerak';
import { W, ui } from './tema';
import { OUTLET } from '@/data/outlet';
import type { Level } from '@/data/level';
import { selesaiGabung, lewatiGabung, BONUS_GABUNG } from '@/lib/toko';
import type { Akun, Pref } from '@/lib/jenis';

type Ubin<T extends string> = { id: T; teks: string; ket?: string };

function PilihUbin<T extends string>({ label, pilihan, nilai, ubah }: { label: string; pilihan: Ubin<T>[]; nilai: T; ubah: (v: T) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <T v="sub">{label}</T>
      <View role="radiogroup" aria-label={label} style={s.ubinBaris}>
        {pilihan.map((p) => {
          const aktif = p.id === nilai;
          return (
            <Pressable key={p.id} role="radio" aria-checked={aktif} onPress={() => ubah(p.id)} style={[s.ubin, aktif && s.ubinAktif]}>
              <T v="isiTebal" warna={aktif ? W.kertas : W.tinta} tengah>{p.teks}</T>
              {p.ket ? <T v="kecil" warna={aktif ? W.hijauPucat : W.abu} tengah>{p.ket}</T> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Lembar perkenalan sekali tampil. Jawaban dipakai sebagai profil dan pilihan awal di lembar menu. */
export function Gabung({ a, level, terbuka, onTutup }: { a: Akun; level: Level; terbuka: boolean; onTutup: () => void }) {
  const [langkah, setLangkah] = useState(0);
  const [nama, setNama] = useState('');
  const [outlet, setOutlet] = useState(a.outletFav);
  const [pref, setPref] = useState<Pref>(a.pref);
  const tutup = () => {
    if (!a.gabung) lewatiGabung();
    setLangkah(0);
    onTutup();
  };
  const judul = ['Selamat datang di Kopi Blirik', 'Nama di kartumu', 'Outlet langgananmu', 'Minuman andalanmu', 'Kartumu sudah terbit'][langkah];

  const bawah =
    langkah === 0 ? (
      <View style={{ gap: 8 }}>
        <Tombol teks="Mulai, 3 langkah" penuh onPress={() => setLangkah(1)} />
        <Tombol teks="Lewati, pakai contoh Sekar" ragam="garis" penuh onPress={tutup} />
      </View>
    ) : langkah < 4 ? (
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Tombol teks="Kembali" ragam="garis" onPress={() => setLangkah((x) => x - 1)} />
        <Tombol
          teks={langkah === 3 ? 'Terbitkan kartuku' : 'Lanjut'}
          penuh
          style={{ flex: 1 }}
          onPress={() => {
            if (langkah === 3) selesaiGabung({ nama: nama.trim() || a.nama, outletFav: outlet, pref });
            setLangkah((x) => x + 1);
          }}
        />
      </View>
    ) : (
      <Tombol teks="Mulai ngopi" penuh onPress={tutup} />
    );

  return (
    <Lembar terbuka={terbuka} onTutup={tutup} judul={judul} bawah={bawah}>
      {langkah >= 1 && langkah <= 3 ? (
        <View style={s.langkah} aria-label={`Langkah ${langkah} dari 3`}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={[s.titik, n <= langkah && s.titikIsi]} />
          ))}
          <T v="kecilTebal" warna={W.hijauTua}>Langkah {langkah} dari 3</T>
        </View>
      ) : null}

      {langkah === 0 ? (
        <View style={{ gap: 12 }}>
          <T v="isi">Ini demo aplikasi member kafe rekaan. Semua datanya contoh, tersimpan di perangkatmu saja, dan jamnya mengikuti WIB.</T>
          {([
            ['pindai', 'Di tab Kartu ada tombol "Simulasikan pindai kasir" untuk mencoba bintik masuk.'],
            ['pesan', 'Pesan ambil sampai selesai, lalu tekan "Sudah kuambil" untuk menutup pesanan.'],
            ['hadiah', 'Tukar bintik di Hadiah, vouchernya langsung tercetak.'],
          ] as [NamaIkon, string][]).map(([ikon, teks]) => (
            <View key={ikon} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <View style={s.bulat}>
                <Ikon n={ikon} ukuran={20} warna={W.hijau} tebal={2} />
              </View>
              <T v="isi" style={{ flex: 1 }}>{teks}</T>
            </View>
          ))}
        </View>
      ) : null}

      {langkah === 1 ? (
        <View style={{ gap: 8 }}>
          <T v="isi">Nama ini dicetak di kartu member dan dipakai kasir saat memanggil pesananmu.</T>
          <T v="label" nativeID="gabung-nama">Nama panggilan</T>
          <TextInput value={nama} onChangeText={setNama} placeholder="mis. Sekar" placeholderTextColor={W.abu} aria-labelledby="gabung-nama" aria-label="Nama panggilan" autoComplete="given-name" maxLength={40} style={s.input} />
        </View>
      ) : null}

      {langkah === 2 ? (
        <View role="radiogroup" aria-label="Outlet langganan" style={{ gap: 8 }}>
          <T v="isi">Dipakai sebagai tempat ambil pesanan dan untuk simulasi kasir.</T>
          {OUTLET.map((o) => {
            const aktif = o.slug === outlet;
            return (
              <Pressable key={o.slug} role="radio" aria-checked={aktif} onPress={() => setOutlet(o.slug)} style={[s.baris, aktif && s.barisAktif]}>
                <View style={{ flex: 1 }}>
                  <T v="isiTebal">{o.nama}</T>
                  <T v="kecil">{o.julukan} · {o.kota}</T>
                </View>
                {aktif ? <Ikon n="centang" warna={W.hijau} tebal={2.4} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {langkah === 3 ? (
        <View style={{ gap: 14 }}>
          <T v="isi">Jadi pilihan awal setiap kali kamu memesan. Tetap bisa diubah per minuman.</T>
          <PilihUbin label="Gula?" nilai={pref.gula} ubah={(gula) => setPref((p) => ({ ...p, gula }))} pilihan={[{ id: 'normal', teks: 'Normal' }, { id: 'kurang', teks: 'Sedikit' }, { id: 'tanpa', teks: 'Tanpa' }]} />
          <PilihUbin label="Susu?" nilai={pref.susu} ubah={(susu) => setPref((p) => ({ ...p, susu }))} pilihan={[{ id: 'sapi', teks: 'Sapi', ket: 'susu segar' }, { id: 'oat', teks: 'Oat', ket: '+Rp6.000' }]} />
          <PilihUbin label="Es?" nilai={pref.es} ubah={(es) => setPref((p) => ({ ...p, es }))} pilihan={[{ id: 'normal', teks: 'Normal' }, { id: 'sedikit', teks: 'Sedikit' }]} />
          <PilihUbin label="Ukuran?" nilai={pref.ukuran} ubah={(ukuran) => setPref((p) => ({ ...p, ukuran }))} pilihan={[{ id: 'sedang', teks: 'Sedang', ket: '250 ml' }, { id: 'besar', teks: 'Besar', ket: '+Rp5.000' }]} />
        </View>
      ) : null}

      {langkah === 4 ? (
        <View style={{ gap: 12 }}>
          <Tercetak>
            <KartuMember nama={a.nama} nomor={a.nomor} level={level} benih={23}>
              <T v="judul2" warna={W.hijauTua}>+{BONUS_GABUNG} bintik sambutan</T>
            </KartuMember>
          </Tercetak>
          <T v="isi" aria-live="polite">Selamat datang, {a.nama.split(' ')[0]}! {BONUS_GABUNG} bintik sambutan sudah masuk. Riwayat contoh dan levelmu tetap ada supaya semua fitur bisa dicoba.</T>
        </View>
      ) : null}
    </Lembar>
  );
}

const s = StyleSheet.create({
  langkah: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  titik: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: W.garisKuat },
  titikIsi: { backgroundColor: W.hijau, borderColor: W.hijau },
  bulat: { width: 38, height: 38, borderRadius: 19, backgroundColor: W.hijauPucat, alignItems: 'center', justifyContent: 'center' },
  input: { ...ui(400), fontSize: 16, color: W.tinta, borderWidth: 1.5, borderColor: W.garisKuat, borderRadius: 14, paddingHorizontal: 14, minHeight: 48, backgroundColor: '#fff' },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: W.garis, borderRadius: 16, padding: 12, minHeight: 56, backgroundColor: W.kertas },
  barisAktif: { borderColor: W.hijau, backgroundColor: W.hijauPucat },
  ubinBaris: { flexDirection: 'row', gap: 8 },
  ubin: { flex: 1, minHeight: 64, borderRadius: 18, borderWidth: 2, borderColor: W.garisKuat, alignItems: 'center', justifyContent: 'center', padding: 8, backgroundColor: W.kertas },
  ubinAktif: { backgroundColor: W.hijau, borderColor: W.hijauTua },
});
