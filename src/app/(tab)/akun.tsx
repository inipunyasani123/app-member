import { useEffect, useState } from 'react';
import { View, StyleSheet, Switch, TextInput, Pressable } from 'react-native';
import { Link, router, type Href } from 'expo-router';
import { Layar, Pita } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon, type NamaIkon } from '@/ui/Ikon';
import { Chip, KartuTaut, Tombol } from '@/ui/Tombol';
import { Kerangka, Kotak } from '@/ui/Kecil';
import { Lembar } from '@/ui/Lembar';
import { Bintik } from '@/ui/Bintik';
import { Wadah } from '@/ui/Wadah';
import { W, ui, BIBIR } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { setelProfil, setelPref, setelNotif, aturUlang, ulangiGabung } from '@/lib/toko';
import { meta } from '@/lib/meta';
import { tglSedang } from '@/lib/waktu';
import { OUTLET, outletBySlug } from '@/data/outlet';
import { KONTAK } from '@/data/merek';
import type { Pref } from '@/lib/jenis';

export function generateMetadata() {
  return meta({
    judul: 'Akun & Preferensi Minuman · Kopi Blirik',
    desk: 'Profil member Kopi Blirik: nama, outlet favorit, preferensi susu, gula, es, dan ukuran, serta pengaturan notifikasi. Semua tersimpan di perangkatmu.',
    jalur: '/akun',
  });
}

export default function Akun() {
  const d = useData(60_000);
  const [nama, setNama] = useState('');
  const [reset, setReset] = useState(false);
  useEffect(() => {
    if (d) setNama(d.a.nama);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!d]);

  const grupPref = <K extends keyof Pref>(label: string, kunci: K, pilihan: [Pref[K], string][]) => (
    <View style={{ gap: 8 }}>
      <T v="label">{label}</T>
      <View role="radiogroup" aria-label={label} style={s.chip}>
        {pilihan.map(([v, teks]) => (
          <Chip key={String(v)} teks={teks} aktif={d?.a.pref[kunci] === v} onPress={() => setelPref({ [kunci]: v } as Partial<Pref>)} kecil />
        ))}
      </View>
    </View>
  );

  return (
    <Layar tab>
      <Pita label="Akun" judul="Profil & preferensi" />
      <View style={s.profil}>
        <Bintik benih={29} jumlah={70} warna={W.kertas} kuat={0.55} />
        <View style={s.avatar}>
          <T v="judul1" warna={W.hijau}>{d ? d.a.nama[0] : 'K'}</T>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          {d ? <T v="judul3" warna={W.kertas}>{d.a.nama}</T> : <Kerangka tinggi={20} lebar={150} />}
          <T v="kode" warna={W.hijauPucat} style={{ fontSize: 13 }}>{d?.a.nomor ?? ' '}</T>
          <T v="kecil" warna={W.hijauPucat}>{d ? `Kawan sejak ${tglSedang(d.a.dibuat)} · ${d.a.telp}` : ' '}</T>
        </View>
        {d ? (
          <View style={s.cap}>
            <Wadah id={d.r.level.id} ukuran={52} aktif label={`Level ${d.r.level.nama}`} />
            <T v="kecilTebal" warna={W.hijauTua} style={{ fontSize: 12, lineHeight: 14 }}>{d.r.level.nama}</T>
          </View>
        ) : null}
      </View>

      <View style={s.menu}>
        {([
          ['/riwayat', 'struk', 'Riwayat transaksi'],
          ['/poin', 'bintang', 'Riwayat bintik'],
          ['/voucher', 'voucher', 'Voucher saya'],
          ['/level', 'cangkir', 'Level member'],
          ['/outlet', 'lokasi', 'Outlet & jam buka'],
          ['/promo', 'hujan', 'Promo & menu musiman'],
        ] as [string, NamaIkon, string][]).map(([href, ikon, teks], i) => (
          <KartuTaut key={href} href={href as '/riwayat'} style={StyleSheet.flatten([s.barisMenu, i > 0 ? { borderTopWidth: 1, borderTopColor: W.garis } : {}])}>
            <Ikon n={ikon} warna={W.hijau} />
            <T v="isiTebal" style={{ flex: 1 }}>{teks}</T>
            <Ikon n="kanan" ukuran={18} warna={W.abu} />
          </KartuTaut>
        ))}
      </View>

      <Kotak>
        <T v="judul3" h={2}>Profil</T>
        <T v="label" nativeID="label-nama">Nama panggilan di kartu</T>
        <TextInput
          value={nama}
          onChangeText={setNama}
          onBlur={() => nama.trim() && setelProfil({ nama: nama.trim().slice(0, 40) })}
          onSubmitEditing={() => nama.trim() && setelProfil({ nama: nama.trim().slice(0, 40) })}
          aria-labelledby="label-nama"
          aria-label="Nama panggilan di kartu"
          autoComplete="name"
          maxLength={40}
          editable={!!d}
          style={s.input}
          placeholder="Nama kamu"
          placeholderTextColor={W.abu}
        />
        <T v="label">Outlet favorit (untuk pesan ambil dan simulasi kasir)</T>
        <View role="radiogroup" aria-label="Outlet favorit" style={s.chip}>
          {OUTLET.map((o) => (
            <Chip key={o.slug} teks={o.kota} aktif={d?.a.outletFav === o.slug} onPress={() => setelProfil({ outletFav: o.slug })} kecil label={o.nama} />
          ))}
        </View>
        {d ? <T v="kecil">Sekarang: {outletBySlug(d.a.outletFav)?.nama}. Ulang tahun tercatat {d.a.lahir}.</T> : null}
      </Kotak>

      <Kotak>
        <T v="judul3" h={2}>Minuman andalanku</T>
        <T v="kecil">Dipakai sebagai pilihan awal saat memesan. Tetap bisa diubah per minuman.</T>
        {grupPref('Susu', 'susu', [['sapi', 'Susu sapi'], ['oat', 'Oat']])}
        {grupPref('Gula', 'gula', [['normal', 'Normal'], ['kurang', 'Sedikit'], ['tanpa', 'Tanpa gula']])}
        {grupPref('Es', 'es', [['normal', 'Normal'], ['sedikit', 'Sedikit']])}
        {grupPref('Ukuran', 'ukuran', [['sedang', 'Sedang'], ['besar', 'Besar']])}
      </Kotak>

      <Kotak>
        <T v="judul3" h={2}>Notifikasi</T>
        <T v="kecil">Demo web tidak mengirim notifikasi. Di aplikasi Android/iOS, pilihan ini menentukan pemberitahuan yang muncul.</T>
        {([
          ['promo', 'Promo dan menu musiman'],
          ['hangus', 'Pengingat bintik akan hangus'],
          ['pesanan', 'Pesanan siap diambil'],
        ] as const).map(([k, teks]) => (
          <View key={k} style={s.saklar}>
            <T v="isi" style={{ flex: 1 }} nativeID={`notif-${k}`}>{teks}</T>
            <Switch
              value={d?.a.notif[k] ?? false}
              onValueChange={(v) => setelNotif({ [k]: v })}
              disabled={!d}
              aria-label={teks}
              trackColor={{ false: W.garisKuat, true: W.hijau }}
              thumbColor={W.kertas}
              {...({ activeThumbColor: W.kertas } as object)}
            />
          </View>
        ))}
      </Kotak>

      <Kotak style={{ backgroundColor: W.mentegaPucat, borderColor: W.mentega }}>
        <T v="judul3" h={2}>Tentang demo ini</T>
        <T v="isi">Kopi Blirik adalah merek rekaan. Aplikasi ini dibuat PintuWeb dengan React Native dan Expo; datamu hanya tersimpan di perangkat ini dan tidak dikirim ke server mana pun.</T>
        <Link href={KONTAK as Href} asChild>
          <Pressable role="link" style={s.tautan}>
            <T v="isiTebal" warna={W.hijauTua} style={{ textDecorationLine: 'underline' }}>Pesan aplikasi seperti ini ke PintuWeb</T>
            <Ikon n="luar" ukuran={18} warna={W.hijauTua} />
          </Pressable>
        </Link>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Tombol teks="Ulangi perkenalan" ragam="garis" ikon="kartu" kecil onPress={() => { ulangiGabung(); router.navigate({ pathname: '/', params: { kenalan: '1' } }); }} disabled={!d} />
          <Tombol teks="Atur ulang data contoh" ragam="bahaya" ikon="ulang" kecil onPress={() => setReset(true)} disabled={!d} />
        </View>
      </Kotak>

      <Lembar terbuka={reset} onTutup={() => setReset(false)} judul="Atur ulang data?" bawah={<Tombol teks="Ya, atur ulang" ragam="bahaya" penuh onPress={() => { aturUlang(); setReset(false); }} />}>
        <T v="isi">Semua bintik, voucher, pesanan, dan preferensi kembali ke data contoh awal, relatif terhadap hari ini.</T>
      </Lembar>
    </Layar>
  );
}

const s = StyleSheet.create({
  profil: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.hijau, borderRadius: 26, padding: 16, overflow: 'hidden', borderWidth: 4, borderColor: W.hijauTua },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: W.kertas, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: W.mentega },
  cap: { alignItems: 'center', backgroundColor: W.mentegaPucat, borderRadius: 16, paddingHorizontal: 6, paddingVertical: 4, borderWidth: 1.5, borderColor: W.mentega },
  menu: { backgroundColor: W.kertas, borderRadius: 22, ...BIBIR, paddingHorizontal: 14 },
  barisMenu: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54 },
  chip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { ...ui(400), fontSize: 16, color: W.tinta, borderWidth: 1.5, borderColor: W.garisKuat, borderRadius: 14, paddingHorizontal: 14, minHeight: 48, backgroundColor: '#fff' },
  saklar: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  tautan: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40 },
});
