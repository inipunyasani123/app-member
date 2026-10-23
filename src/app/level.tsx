import { View, StyleSheet } from 'react-native';
import { Layar } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Ikon } from '@/ui/Ikon';
import { Wadah } from '@/ui/Wadah';
import { MeterBertambah } from '@/ui/Gerak';
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
        <Bintik benih={12} jumlah={70} warna={W.kertas} kuat={0.55} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <T v="label" warna={W.hijauPucat}>Level kamu</T>
            <T v="judul1" h={1} warna={W.kertas}>{d ? d.r.level.nama : 'Level member'}</T>
            {d ? (
              <T v="kecil" warna={W.hijauPucat}>{angka(d.r.terkumpul)} bintik didapat dalam {JENDELA_LEVEL_HARI} hari terakhir</T>
            ) : (
              <Kerangka tinggi={18} lebar={200} />
            )}
          </View>
          <View style={s.wadahTerang}>
            {d ? <Wadah id={d.r.level.id} ukuran={92} aktif label={`Lambang level ${d.r.level.nama}`} /> : <Kerangka tinggi={77} lebar={92} />}
          </View>
        </View>
        {d ? (
          <>
            <T v="kecilTebal" warna={W.mentega}>{d.r.level.manfaat.length} manfaat {d.r.level.nama} aktif</T>
            <View style={{ gap: 4 }}>
              {d.r.level.manfaat.map((m) => (
                <View key={m} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                  <Ikon n="centang" ukuran={18} warna={W.mentega} tebal={2.4} />
                  <T v="isi" warna={W.kertas} style={{ flex: 1 }}>{m}</T>
                </View>
              ))}
            </View>
            {d.r.berikut ? (
              <View style={{ gap: 6, marginTop: 4 }}>
                <MeterBertambah dari={0} ke={d.r.terkumpul} maks={d.r.berikut.min} terang jumlah={24} label={`${angka(d.r.terkumpul)} dari ${angka(d.r.berikut.min)} bintik menuju ${d.r.berikut.nama}`} />
                <T v="isiTebal" warna={W.kertas}>{angka(d.r.kurang)} bintik lagi ke {d.r.berikut.nama}</T>
                <T v="kecil" warna={W.hijauPucat}>Sekitar Rp{angka(Math.ceil(d.r.kurang / d.r.level.kali) * 1000)} belanja lagi dalam 180 hari, atau lebih cepat dengan menu musim hujan (bintik 2×).</T>
              </View>
            ) : (
              <T v="isiTebal" warna={W.kertas}>Kamu di level tertinggi. Pertahankan dengan 1.500 bintik dalam 180 hari.</T>
            )}
          </>
        ) : (
          <Kerangka tinggi={150} style={{ backgroundColor: 'rgba(250,252,243,0.18)' }} />
        )}
      </View>

      <View role="list" aria-label="Tangga level" style={s.tangga}>
        <View style={s.rel} />
        {LEVEL.map((l, i) => (
          <View role="listitem" key={l.id} style={s.anakTangga} aria-label={`${l.nama}, minimal ${angka(l.min)} bintik${i === iKini ? ', level kamu' : i < iKini ? ', terlewati' : ', belum'}`}>
            <View style={[s.lingkar, i === iKini && s.lingkarKini, i < iKini && s.lingkarLewat]}>
              <Wadah id={l.id} ukuran={44} aktif={i === iKini} terkunci={iKini >= 0 && i > iKini} />
            </View>
            <T v={i === iKini ? 'kecilTebal' : 'kecil'} warna={i === iKini ? W.hijauTua : W.tinta}>{l.nama}</T>
            <T v="kecil">{angka(l.min)}</T>
            {i === iKini ? <View style={s.kamu}><T v="kecilTebal" warna={W.hijauTua} style={{ fontSize: 12 }}>Kamu</T></View> : <View style={{ height: 20 }} />}
          </View>
        ))}
      </View>

      {d && d.r.berikut ? (
        <Kotak>
          <T v="judul3" h={2}>Terbuka di {d.r.berikut.nama}</T>
          {d.r.berikut.manfaat.filter((m) => !d.r.level.manfaat.some((x) => x.split(' ').slice(1).join(' ') === m.split(' ').slice(1).join(' '))).map((m) => (
            <View key={m} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View style={s.gembok}>
                <Ikon n="kunci" ukuran={16} warna={W.abu} tebal={2} />
              </View>
              <T v="isi" style={{ flex: 1 }}>{m}</T>
            </View>
          ))}
        </Kotak>
      ) : null}

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
  kepala: { backgroundColor: W.hijau, borderRadius: 28, padding: 18, gap: 10, overflow: 'hidden', marginTop: 12, borderWidth: 4, borderColor: W.hijauTua },
  wadahTerang: { backgroundColor: W.kertas, borderRadius: 24, padding: 6, borderWidth: 3, borderColor: W.mentega },
  tangga: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, paddingTop: 4 },
  rel: { position: 'absolute', left: 36, right: 36, top: 30, height: 4, borderRadius: 2, backgroundColor: W.tepi },
  anakTangga: { alignItems: 'center', gap: 2, width: 78 },
  lingkar: { width: 60, height: 60, borderRadius: 30, backgroundColor: W.kertas, borderWidth: 2, borderColor: W.garisKuat, alignItems: 'center', justifyContent: 'center' },
  lingkarKini: { borderColor: W.hijau, borderWidth: 4, backgroundColor: W.hijauPucat },
  lingkarLewat: { borderColor: W.hijau },
  kamu: { backgroundColor: W.mentega, borderRadius: 999, paddingHorizontal: 8, height: 20, justifyContent: 'center' },
  gembok: { width: 32, height: 32, borderRadius: 16, backgroundColor: W.enamel, borderWidth: 1, borderColor: W.garis, alignItems: 'center', justifyContent: 'center' },
  level: { backgroundColor: W.kertas, borderRadius: 24, borderWidth: 1.5, borderColor: W.garis, padding: 14, gap: 12 },
  levelKini: { borderColor: W.hijau, borderWidth: 3 },
  levelAtas: { flexDirection: 'row', gap: 12, alignItems: 'center' },
});
