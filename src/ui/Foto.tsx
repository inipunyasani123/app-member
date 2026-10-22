// Native: gambar dibundel dari public/foto (varian terbesar), lewat peta require statis.
import { Image, type ImageStyle, type ViewStyle } from 'react-native';
import { FOTO } from './fotoNative';

type Props = { k: string; bentuk?: 'k' | 'l'; alt: string; style?: ViewStyle; prioritas?: boolean; lebarTampil?: number };

export function Foto({ k, bentuk = 'k', alt, style }: Props) {
  const src = FOTO[`${k}-${bentuk}`];
  if (!src) return null;
  return <Image source={src} accessibilityLabel={alt} accessible resizeMode="cover" style={[{ width: '100%', height: '100%' }, style as ImageStyle]} />;
}
