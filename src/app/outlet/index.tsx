import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { Chip, KartuTaut } from '@/ui/Tombol';
import { Kerangka, StatusBuka, Lencana } from '@/ui/Kecil';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { setelProfil } from '@/lib/toko';
import { meta } from '@/lib/meta';
import { jarakKm } from '@/lib/format';
import { bagian } from '@/lib/waktu';
import { OUTLET, LOKASI_CONTOH, jarak, statusBuka, teksJam } from '@/data/outlet';

export function generateMetadata() {
  return meta({
    judul: 'Outlet Terdekat & Jam Buka WIB · Kopi Blirik',
    desk: 'Lima outlet Kopi Blirik di Tulungagung, Kediri, Blitar, Malang, dan Surabaya: status buka dalam WIB, jam buka hari ini, jarak, dan fasilitas.',
    jalur: '/outlet',
  });
}

export default function DaftarOutlet() {
  const d = useData();
  const [lokasiId, setLokasiId] = useState<string | null>(null);
  const id = lokasiId ?? d?.a.lokasi ?? 'tulungagung';
  const lokasi = LOKASI_CONTOH.find((l) => l.id === id)!;
  const urut = d ? [...OUTLET].sort((a, b) => jarak(lokasi, a) - jarak(lokasi, b)) : OUTLET;
  const hari = d ? bagian(d.kini).hari : null;

  return (
    <Layar judul="Outlet" induk="/">
      <T v="judul1" h={1} style={{ marginTop: 10 }}>Outlet Kopi Blirik</T>
      <T v="isi">Demo ini tidak meminta izin lokasi. Pilih kota sebagai lokasi contoh untuk mengurutkan outlet dari yang terdekat.</T>
      <View role="radiogroup" aria-label="Lokasi contoh" style={s.lokasi}>
        {LOKASI_CONTOH.map((l) => (
          <Chip
            key={l.id}
            teks={l.nama}
            aktif={id === l.id}
            kecil
            onPress={() => {
              setLokasiId(l.id);
              setelProfil({ lokasi: l.id });
            }}
          />
        ))}
      </View>
      <View style={{ gap: 12 }}>
        {urut.map((o, i) => (
          <KartuTaut key={o.slug} href={`/outlet/${o.slug}`} style={s.kartu}>
            <View style={s.foto}>
              <Foto k={o.foto} alt={`Suasana ${o.nama}`} lebarTampil={110} prioritas={i === 0} />
            </View>
            <View style={{ flex: 1, gap: 4, paddingVertical: 2 }}>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <T v="judul3">{o.nama}</T>
                {d && i === 0 ? <Lencana teks="Terdekat" ragam="hijau" /> : null}
              </View>
              <T v="kecil" numberOfLines={1}>{o.julukan} · {o.alamat}</T>
              <StatusBuka st={d ? statusBuka(o, d.kini) : null} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {d ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Ikon n="lokasi" ukuran={15} warna={W.abu} />
                      <T v="kecil">{jarakKm(jarak(lokasi, o))}</T>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Ikon n="jam" ukuran={15} warna={W.abu} />
                      <T v="kecil">Hari ini {teksJam(o.jam[hari!])}</T>
                    </View>
                  </>
                ) : (
                  <Kerangka tinggi={16} lebar={170} />
                )}
              </View>
            </View>
          </KartuTaut>
        ))}
      </View>
      <T v="kecil">Jarak dihitung garis lurus dari pusat kota contoh. Nama, alamat, dan foto suasana outlet adalah rekaan untuk demo.</T>
    </Layar>
  );
}

const s = StyleSheet.create({
  lokasi: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  kartu: { flexDirection: 'row', gap: 12, backgroundColor: W.kertas, borderRadius: 22, borderWidth: 1, borderColor: W.garis, padding: 10 },
  foto: { width: 104, height: 104, borderRadius: 16, overflow: 'hidden', backgroundColor: W.garis },
});
