import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Layar, Pita } from '@/ui/Layar';
import { T } from '@/ui/Teks';
import { Foto } from '@/ui/Foto';
import { Ikon } from '@/ui/Ikon';
import { Tombol, Chip, TombolIkon } from '@/ui/Tombol';
import { Kerangka, Kotak, StatusBuka, Lencana, Medali } from '@/ui/Kecil';
import { Lembar } from '@/ui/Lembar';
import { W } from '@/ui/tema';
import { useData } from '@/lib/pakai';
import { useKeranjang, tambahKeKeranjang, ubahQty, kosongkanKeranjang, buatPesanan } from '@/lib/toko';
import { buatItem, hitungBintik, nilaiVoucher, potonganPagi, subtotalDari, type Opsi } from '@/lib/keranjang';
import { voucherAktif } from '@/lib/hitung';
import { meta } from '@/lib/meta';
import { angka, rupiah } from '@/lib/format';
import { tglPendek } from '@/lib/waktu';
import { KATEGORI, MENU, HARGA_BESAR, HARGA_OAT, HARGA_SHOT, menuById, type Kategori, type Menu } from '@/data/menu';
import { OUTLET, outletBySlug, slotAmbil, statusBuka } from '@/data/outlet';

export function generateMetadata() {
  return meta({
    judul: 'Pesan Ambil di Outlet · Kopi Blirik',
    desk: 'Pilih outlet, menu, dan jam ambil dalam WIB. Pakai voucher, lihat perkiraan bintik, lalu bayar di kasir saat mengambil. Simulasi tanpa server.',
    jalur: '/pesan',
  });
}

export default function Pesan() {
  const d = useData();
  const k = useKeranjang();
  const q = useLocalSearchParams<{ menu?: string; outlet?: string }>();
  const [kat, setKat] = useState<Kategori>('musiman');
  const [outletPilih, setOutletPilih] = useState<string | null>(null);
  const [gantiOutlet, setGantiOutlet] = useState(false);
  const [menuBuka, setMenuBuka] = useState<Menu | null>(null);
  const [kasir, setKasir] = useState(false);

  useEffect(() => {
    if (q.outlet && outletBySlug(q.outlet)) setOutletPilih(q.outlet);
    if (q.menu) {
      const m = menuById(q.menu);
      if (m) {
        setKat(m.kategori);
        setMenuBuka(m);
      }
    }
  }, [q.menu, q.outlet]);

  const slug = outletPilih ?? d?.a.outletFav ?? 'tulungagung';
  const outlet = outletBySlug(slug)!;
  const daftar = MENU.filter((m) => m.kategori === kat);
  const jumlah = k.reduce((s, i) => s + i.qty, 0);
  const sub = subtotalDari(k);

  return (
    <Layar
      tab
      bawah={
        jumlah > 0 ? (
          <View style={s.bilah}>
            <View style={{ flex: 1 }}>
              <T v="kecilTebal" warna={W.hijauPucat}>{jumlah} item · ambil di {outlet.nama}</T>
              <T v="judul3" warna={W.kertas}>{rupiah(sub)}</T>
            </View>
            <Tombol teks="Lanjut" ragam="mentega" onPress={() => setKasir(true)} disabled={!d} />
          </View>
        ) : null
      }
    >
      <Pita label="Pesan ambil" judul="Pesan dulu, ambil tanpa antre" />

      <Kotak style={s.outlet}>
        <View style={s.outletFoto}>
          <Foto k={outlet.foto} alt={`Suasana ${outlet.nama}`} lebarTampil={72} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="label">Ambil di</T>
          <T v="judul3">{outlet.nama}</T>
          <StatusBuka st={d ? statusBuka(outlet, d.kini) : null} />
        </View>
        <Tombol teks="Ganti" ragam="garis" kecil onPress={() => setGantiOutlet(true)} label="Ganti outlet pengambilan" />
      </Kotak>

      <View role="radiogroup" aria-label="Kategori menu" style={s.kategori}>
        {KATEGORI.map((c) => (
          <Chip key={c.id} teks={c.nama} aktif={kat === c.id} onPress={() => setKat(c.id)} />
        ))}
      </View>

      <View style={{ gap: 10 }}>
        {daftar.map((m) => (
          <View key={m.id} style={s.menu}>
            {m.foto ? (
              <View style={s.menuFoto}>
                <Foto k={m.foto} alt={m.nama} lebarTampil={84} />
              </View>
            ) : (
              <Medali ikon={m.suhu ? 'cangkir' : 'piring'} ukuran={72} />
            )}
            <View style={{ flex: 1, gap: 2 }}>
              <T v="judul3">{m.nama}</T>
              <T v="kecil" numberOfLines={2}>{m.desk}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <T v="isiTebal" style={{ flex: 1 }}>{rupiah(m.harga)}</T>
                <Tombol teks="Tambah" ikon="tambah" kecil onPress={() => setMenuBuka(m)} label={`Tambah ${m.nama}`} />
              </View>
            </View>
          </View>
        ))}
      </View>

      <T v="kecil" style={{ marginTop: 4 }}>Pembayaran dilakukan di kasir saat mengambil pesanan. Demo ini tidak memproses pembayaran apa pun.</T>

      <Lembar terbuka={gantiOutlet} onTutup={() => setGantiOutlet(false)} judul="Ambil di outlet mana?">
        <View role="radiogroup" aria-label="Outlet pengambilan" style={{ gap: 8 }}>
          {OUTLET.map((o) => {
            const aktif = o.slug === slug;
            const st = d ? statusBuka(o, d.kini) : null;
            return (
              <Pressable
                key={o.slug}
                role="radio"
                aria-checked={aktif}
                onPress={() => {
                  setOutletPilih(o.slug);
                  setGantiOutlet(false);
                }}
                style={[s.pilihOutlet, aktif && { borderColor: W.hijau, backgroundColor: W.hijauPucat }]}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <T v="isiTebal">{o.nama}</T>
                  <T v="kecil">{o.alamat}</T>
                  <StatusBuka st={st} />
                </View>
                {aktif ? <Ikon n="centang" warna={W.hijau} tebal={2.4} /> : null}
              </Pressable>
            );
          })}
        </View>
      </Lembar>

      {menuBuka ? <LembarMenu m={menuBuka} pref={d?.a.pref} onTutup={() => setMenuBuka(null)} /> : null}
      {d ? <LembarKasir terbuka={kasir} onTutup={() => setKasir(false)} outletSlug={slug} data={d} /> : null}
    </Layar>
  );
}

function LembarMenu({ m, pref, onTutup }: { m: Menu; pref?: { susu: 'sapi' | 'oat'; gula: 'normal' | 'kurang' | 'tanpa'; es: 'normal' | 'sedikit'; ukuran: 'sedang' | 'besar' }; onTutup: () => void }) {
  const [o, setO] = useState<Opsi>({ suhu: m.suhu === 'panas' ? 'panas' : 'es', ukuran: pref?.ukuran ?? 'sedang', gula: pref?.gula ?? 'normal', susu: pref?.susu ?? 'sapi', es: pref?.es ?? 'normal', shot: false });
  const [qty, setQty] = useState(1);
  const it = buatItem(m, o, qty);
  const atur = (p: Partial<Opsi>) => setO((x) => ({ ...x, ...p }));
  const grup = (label: string, pilihan: { teks: string; aktif: boolean; tekan: () => void }[]) => (
    <View style={{ gap: 8 }}>
      <T v="label">{label}</T>
      <View role="radiogroup" aria-label={label} style={s.kategori}>
        {pilihan.map((p) => (
          <Chip key={p.teks} teks={p.teks} aktif={p.aktif} onPress={p.tekan} kecil />
        ))}
      </View>
    </View>
  );
  const suhu = m.suhu === 'keduanya' ? o.suhu : m.suhu;
  return (
    <Lembar
      terbuka
      onTutup={onTutup}
      judul={m.nama}
      bawah={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={s.qty}>
            <TombolIkon n="kurang" label="Kurangi jumlah" onPress={() => setQty((x) => Math.max(1, x - 1))} ukuran={40} />
            <T v="judul3" aria-label={`Jumlah ${qty}`} style={{ minWidth: 22, textAlign: 'center' }}>{qty}</T>
            <TombolIkon n="tambah" label="Tambah jumlah" onPress={() => setQty((x) => Math.min(9, x + 1))} ukuran={40} />
          </View>
          <Tombol
            teks={`Masukkan · ${rupiah(it.harga * qty)}`}
            style={{ flex: 1 }}
            penuh
            onPress={() => {
              tambahKeKeranjang(it);
              onTutup();
            }}
          />
        </View>
      }
    >
      <T v="kecil">{m.desk}</T>
      {m.suhu === 'keduanya' ? grup('Suhu', [{ teks: 'Es', aktif: o.suhu === 'es', tekan: () => atur({ suhu: 'es' }) }, { teks: 'Panas', aktif: o.suhu === 'panas', tekan: () => atur({ suhu: 'panas' }) }]) : null}
      {m.suhu ? grup('Ukuran', [{ teks: 'Sedang', aktif: o.ukuran === 'sedang', tekan: () => atur({ ukuran: 'sedang' }) }, { teks: `Besar +${rupiah(HARGA_BESAR)}`, aktif: o.ukuran === 'besar', tekan: () => atur({ ukuran: 'besar' }) }]) : null}
      {m.gula ? grup('Gula', [
        { teks: 'Normal', aktif: o.gula === 'normal', tekan: () => atur({ gula: 'normal' }) },
        { teks: 'Sedikit', aktif: o.gula === 'kurang', tekan: () => atur({ gula: 'kurang' }) },
        { teks: 'Tanpa gula', aktif: o.gula === 'tanpa', tekan: () => atur({ gula: 'tanpa' }) },
      ]) : null}
      {suhu === 'es' ? grup('Es', [{ teks: 'Normal', aktif: o.es === 'normal', tekan: () => atur({ es: 'normal' }) }, { teks: 'Sedikit', aktif: o.es === 'sedikit', tekan: () => atur({ es: 'sedikit' }) }]) : null}
      {m.susu ? grup('Susu', [{ teks: 'Susu sapi', aktif: o.susu === 'sapi', tekan: () => atur({ susu: 'sapi' }) }, { teks: `Oat +${rupiah(HARGA_OAT)}`, aktif: o.susu === 'oat', tekan: () => atur({ susu: 'oat' }) }]) : null}
      {m.shot ? (
        <View style={{ gap: 8 }}>
          <T v="label">Tambahan</T>
          <View style={s.kategori}>
            <Chip peran="checkbox" teks={`Tambah shot +${rupiah(HARGA_SHOT)}`} aktif={o.shot} onPress={() => atur({ shot: !o.shot })} kecil />
          </View>
        </View>
      ) : null}
    </Lembar>
  );
}

type Data = NonNullable<ReturnType<typeof useData>>;
function LembarKasir({ terbuka, onTutup, outletSlug, data }: { terbuka: boolean; onTutup: () => void; outletSlug: string; data: Data }) {
  const k = useKeranjang();
  const outlet = outletBySlug(outletSlug)!;
  const slot = useMemo(() => slotAmbil(outlet, data.kini), [outlet, data.kini]);
  const [ambil, setAmbil] = useState<number | null>(null);
  const [kode, setKode] = useState<string | null>(null);
  const t = ambil && slot.some((x) => x.t === ambil) ? ambil : slot[0]?.t ?? null;
  const vouchers = voucherAktif(data.a, data.kini);
  const v = vouchers.find((x) => x.kode === kode) ?? null;
  const nv = v ? nilaiVoucher(v, k) : { nilai: 0 };
  const sub = subtotalDari(k);
  const pagi = t ? potonganPagi(t) : 0;
  const potongan = Math.min(sub, nv.nilai + pagi);
  const total = sub - potongan;
  const b = hitungBintik(k, total, data.r.level.kali);

  const kirim = () => {
    if (!t || !k.length) return;
    const rincian: string[] = [];
    if (nv.nilai && v) rincian.push(`${v.nama}: -${rupiah(nv.nilai)}`);
    if (pagi) rincian.push(`Ambil sebelum 09.00: -${rupiah(pagi)}`);
    const p = buatPesanan({ ambil: t, outlet: outletSlug, item: k, subtotal: sub, potongan, rincianPotongan: rincian, total, bintik: b.jumlah, voucher: nv.nilai && v ? { kode: v.kode, nama: v.nama } : undefined });
    kosongkanKeranjang();
    onTutup();
    router.push({ pathname: '/pesanan', params: { id: p.id } });
  };

  return (
    <Lembar
      terbuka={terbuka}
      onTutup={onTutup}
      judul="Ringkasan pesanan"
      bawah={<Tombol teks={t ? `Kirim pesanan · ${rupiah(total)}` : 'Outlet belum menerima pesanan'} penuh disabled={!t || !k.length} onPress={kirim} />}
    >
      {k.length === 0 ? <T v="isi">Keranjang masih kosong.</T> : null}
      {k.map((i) => (
        <View key={i.kunci} style={s.barisItem}>
          <View style={{ flex: 1 }}>
            <T v="isiTebal">{i.nama}</T>
            {i.opsi.length ? <T v="kecil">{i.opsi.join(' · ')}</T> : null}
            <T v="kecil" warna={W.tinta}>{rupiah(i.harga)} / item</T>
          </View>
          <View style={s.qty}>
            <TombolIkon n="kurang" label={`Kurangi ${i.nama}`} onPress={() => ubahQty(i.kunci, -1)} ukuran={36} />
            <T v="isiTebal" style={{ minWidth: 18, textAlign: 'center' }}>{i.qty}</T>
            <TombolIkon n="tambah" label={`Tambah ${i.nama}`} onPress={() => ubahQty(i.kunci, 1)} ukuran={36} />
          </View>
        </View>
      ))}

      <View style={{ gap: 8 }}>
        <T v="label">Jam ambil (WIB) di {outlet.nama}</T>
        {slot.length ? (
          <>
            {slot[0].besok ? <Lencana teks={`Tidak ada jam ambil lagi hari ini · pilihan untuk ${tglPendek(slot[0].t)}`} ragam="mentega" /> : null}
            <View role="radiogroup" aria-label="Jam ambil" style={s.kategori}>
              {slot.map((x) => (
                <Chip key={x.t} teks={x.label} aktif={x.t === t} onPress={() => setAmbil(x.t)} kecil label={`Ambil pukul ${x.label} WIB${x.besok ? ', ' + tglPendek(x.t) : ''}`} />
              ))}
            </View>
          </>
        ) : (
          <T v="isi">Outlet ini belum menerima pesanan dalam dua hari ke depan.</T>
        )}
      </View>

      <View style={{ gap: 8 }}>
        <T v="label">Voucher</T>
        <View role="radiogroup" aria-label="Pilih voucher" style={{ gap: 8 }}>
          <Pressable role="radio" aria-checked={!v} onPress={() => setKode(null)} style={[s.voucher, !v && s.voucherAktif]}>
            <T v="isiTebal" style={{ flex: 1 }}>Tanpa voucher</T>
            {!v ? <Ikon n="centang" warna={W.hijau} tebal={2.4} /> : null}
          </Pressable>
          {vouchers.map((x) => {
            const n = nilaiVoucher(x, k);
            const aktif = x.kode === kode;
            return (
              <Pressable key={x.kode} role="radio" aria-checked={aktif} onPress={() => setKode(x.kode)} style={[s.voucher, aktif && s.voucherAktif]}>
                <View style={{ flex: 1 }}>
                  <T v="isiTebal">{x.nama}</T>
                  <T v="kecil" warna={n.nilai ? W.hijau : W.abu}>{n.nilai ? `Hemat ${rupiah(n.nilai)}` : n.alasan}</T>
                </View>
                {aktif ? <Ikon n="centang" warna={W.hijau} tebal={2.4} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Kotak style={{ backgroundColor: W.enamel }}>
        <Baris k="Subtotal" n={rupiah(sub)} />
        {nv.nilai ? <Baris k={v!.nama} n={`-${rupiah(nv.nilai)}`} /> : null}
        {pagi ? <Baris k="Ambil sebelum 09.00 WIB" n={`-${rupiah(pagi)}`} /> : null}
        <Baris k="Total dibayar di kasir" n={rupiah(total)} tebal />
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 }}>
          <Ikon n="bintang" ukuran={18} warna={W.hijau} />
          <T v="kecil" warna={W.tinta} style={{ flex: 1 }}>
            Perkiraan +{angka(b.jumlah)} bintik ({data.r.level.nama} ×{String(data.r.level.kali).replace('.', ',')}{b.bonus ? `, termasuk bonus musiman ${angka(b.bonus)}` : ''})
          </T>
        </View>
      </Kotak>
    </Lembar>
  );
}

function Baris({ k, n, tebal }: { k: string; n: string; tebal?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <T v={tebal ? 'isiTebal' : 'isi'} style={{ flex: 1 }}>{k}</T>
      <T v={tebal ? 'isiTebal' : 'isi'}>{n}</T>
    </View>
  );
}

const s = StyleSheet.create({
  outlet: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 },
  outletFoto: { width: 64, height: 64, borderRadius: 14, overflow: 'hidden', backgroundColor: W.garis },
  kategori: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menu: { flexDirection: 'row', gap: 12, backgroundColor: W.kertas, borderRadius: 20, borderWidth: 1, borderColor: W.garis, padding: 10, alignItems: 'flex-start' },
  menuFoto: { width: 72, height: 72, borderRadius: 16, overflow: 'hidden', backgroundColor: W.garis },
  bilah: { position: 'absolute', left: 12, right: 12, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: W.hijau, borderRadius: 22, padding: 12, paddingLeft: 16, borderWidth: 2, borderColor: W.hijauTua },
  pilihOutlet: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: W.garis, borderRadius: 18, padding: 12, backgroundColor: W.kertas },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barisItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: W.garis },
  voucher: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: W.garis, borderRadius: 16, padding: 12, minHeight: 52, backgroundColor: W.kertas },
  voucherAktif: { borderColor: W.hijau, backgroundColor: W.hijauPucat },
});
