import { Perm } from "src/libv2/types";

export function invert<T>(perm: Perm<T>): Perm<T> {
  return perm.map(([src, dst]) => [dst, src]);
}

// TODO: generalize for repeating a perm `n` times
export function double<T>(perm: Perm<T>): Perm<T> {
  const dstMap = Object.fromEntries(perm);
  return perm.map(([src, dst]) => [src, dstMap[dst]]);
}
