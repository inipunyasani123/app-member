import { View, StyleSheet } from 'react-native';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Wadah } from '@/ui/Wadah';
import { Meter } from '@/ui/Meter';
import { Kerangka, Kotak, Lencana } from '@/ui/Kecil';
import { Bintik } from '@/ui/Bintik';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { meta } from '@/lib/meta';
import { angka } from '@/lib/format';
import { LEVEL, JENDELA_LEVEL_HARI } from '@/data/level';

export function generateMetadata() {
  return meta({
    judul: 'Level Member Lepek sampai Ceret · Kopi Blirik',
    desk: 'Empat level member Kopi Blirik dengan syarat jelas: bintik yang didapat 180 hari terakhir. Pengali bintik dan keuntungan tiap level Lepek, Cangkir, Teko, Ceret.',
    jalur: '/level',
  });
}

export default function HalamanLevel() {
  const d = useData();
  const iKini = d ? LEVEL.indexOf(d.r.level) : -1;
  return (
    <Layar judul="Level member" induk="/">
      <View style={s.kepala}>
        <Bintik benih={12} jumlah={60} kuat={0.7} />
        <View style={{ flex: 1, gap: 4 }}>
          <T v="label" warna={W.hijau}>Level kamu</T>
          <T v="judul1" h={1}>{d ? d.r.level.nama : 'Level member'}</T>
          {d ? (
            <T v="kecil" warna={W.tinta}>{angka(d.r.terkumpul)} bintik didapat dalam {JENDELA_LEVEL_HARI} hari terakhir</T>
          ) : (
            <Kerangka tinggi={18} lebar={200} />
          )}
        </View>
        {d ? <Wadah id={d.r.level.id} ukuran={110} aktif label={`Lambang level ${d.r.level.nama}`} /> : <Kerangka tinggi={92} lebar={110} />}
      </View>

      {d ? (
        <Kotak>
          {d.r.berikut ? (
            <>
              <T v="isiTebal">{angka(d.r.kurang)} bintik lagi untuk naik ke {d.r.berikut.nama}</T>
              <Meter nilai={d.r.terkumpul} maks={d.r.berikut.min} label={`Kemajuan menuju level ${d.r.berikut.nama}`} jumlah={24} />
              <T v="kecil">Belanja sekitar Rp{angka(Math.ceil(d.r.kurang / d.r.level.kali) * 1000)} lagi dalam 180 hari, atau lebih cepat dengan menu musiman (bintik 2×).</T>
            </>
          ) : (
            <T v="isiTebal">Kamu di level tertinggi. Pertahankan dengan 1.500 bintik dalam 180 hari.</T>
          )}
        </Kotak>
      ) : (
        <Kerangka tinggi={110} />
      )}

      <Kotak style={{ backgroundColor: W.mentegaPucat, borderColor: W.mentega }}>
        <T v="judul3" h={2}>Aturannya</T>
        <T v="isi">Level ditentukan oleh jumlah bintik yang kamu dapat dalam 180 hari terakhir dan dihitung ulang setiap ada bintik masuk. Menukar hadiah tidak menurunkan level. Bintik yang lewat 180 hari tetap bisa ditukar sampai umurnya 12 bulan, hanya tidak lagi dihitung untuk level.</T>
      </Kotak>

      <View style={{ gap: 12 }}>
        {LEVEL.map((l, i) => {
          const kini = i === iKini;
          const lewat = iKini >= 0 && i < iKini;
          return (
            <View key={l.id} style={[s.level, kini && s.levelKini]}>
              <View style={s.levelAtas}>
                <Wadah id={l.id} ukuran={84} aktif={kini} terkunci={iKini >= 0 && i > iKini} />
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <T v="judul2" h={2}>{l.nama}</T>
                    {kini ? <Lencana teks="Level kamu" ragam="hijau" ikon="centang" /> : lewat ? <Lencana teks="Terlewati" ragam="abu" /> : null}
                  </View>
                  <T v="kecilTebal" warna={W.hijauTua}>{l.min === 0 ? 'Mulai dari 0 bintik' : `Minimal ${angka(l.min)} bintik / 180 hari`}</T>
                  <T v="kecil">{l.arti}</T>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                {l.manfaat.map((m) => (
                  <View key={m} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                    <Ikon n="centang" ukuran={18} warna={W.hijau} tebal={2.4} />
                    <T v="isi" style={{ flex: 1 }}>{m}</T>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </Layar>
  );
}

const s = StyleSheet.create({
  kepala: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, overflow: 'hidden' },
  level: { backgroundColor: W.kertas, borderRadius: 24, borderWidth: 1.5, borderColor: W.garis, padding: 14, gap: 12 },
  levelKini: { borderColor: W.hijau, borderWidth: 3 },
  levelAtas: { flexDirection: 'row', gap: 12, alignItems: 'center' },
});
