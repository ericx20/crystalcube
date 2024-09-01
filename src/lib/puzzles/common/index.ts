import { Perm } from "src/lib/types";

export function invertPerm<T>(perm: Perm<T>): Perm<T> {
  return perm.map(([src, dst]) => [dst, src]);
}

// TODO: generalize for repeating a perm `n` times
export function doublePerm<T>(perm: Perm<T>): Perm<T> {
  const dstMap = Object.fromEntries(perm);
  return perm.map(([src, dst]) => [src, dstMap[dst]]);
}
