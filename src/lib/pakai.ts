import { useMemo } from 'react';
import { useAkun, useKini } from './toko';
import { ringkas } from './hitung';

/** Akun + waktu sekarang + ringkasan bintik. null selama render statis/hidrasi. */
export function useData(tiap?: number) {
  const a = useAkun();
  const kini = useKini(tiap);
  const r = useMemo(() => (a && kini ? ringkas(a, kini) : null), [a, kini]);
  return a && kini && r ? { a, kini, r } : null;
}
