import { View } from 'react-native';
import { Foto } from './Foto';
import { Bintik } from './Bintik';
import { IlustrasiHadiah } from './IlustrasiHadiah';
import { W } from './tema';
import type { Hadiah } from '@/data/hadiah';

/** Gambar hadiah: foto CC0 untuk produk, ilustrasi enamel buatan sendiri untuk hadiah non-produk. */
export function GambarHadiah({ h, lebar, tinggi, prioritas, ukuranIlustrasi }: { h: Hadiah; lebar?: boolean; tinggi: number; prioritas?: boolean; ukuranIlustrasi?: number }) {
  return (
    <View style={{ height: tinggi, backgroundColor: W.hijauPucat, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      {h.foto ? (
        <Foto k={h.foto} bentuk={lebar ? 'l' : 'k'} alt={h.nama} lebarTampil={lebar ? 360 : 172} prioritas={prioritas} />
      ) : (
        <>
          <Bintik benih={h.biaya} jumlah={50} kuat={0.7} />
          <IlustrasiHadiah id={h.ikon ?? 'shot'} ukuran={ukuranIlustrasi ?? (lebar ? 190 : 150)} label={`Ilustrasi ${h.nama}`} />
        </>
      )}
    </View>
  );
}

