import { invertPerm, doublePerm } from "src/libv2/puzzles/common";
import { FaceletIndex, Move3x3 } from "./types";
import { Perm, MoveSet } from "src/libv2/types";

// Represents the 6 faces and their colors
export const FACES = ["R", "L", "U", "D", "F", "B"] as const;

// prettier-ignore
// Represents the layers that can be twisted on the cube
export const LAYERS = [
  "R", "L", "U", "D", "F", "B",
  "r", "l", "u", "d", "f", "b",
  "M", "E", "S"
] as const;

// Represents the axes when rotating the entire cube
export const AXES = ["x", "y", "z"] as const;

// The suffixes of Singmaster notation
export const SUFFIXES = ["", "2", "'"] as const;

export const MOVESETS = (() => {
  const R = ["R", "R'", "R2"] as const;
  const L = ["L", "L'", "L2"] as const;
  const U = ["U", "U'", "U2"] as const;
  const D = ["D", "D'", "D2"] as const;
  const F = ["F", "F'", "F2"] as const;
  const B = ["B", "B'", "B2"] as const;
  const r = ["r", "r'", "r2"] as const;
  const l = ["L", "L'", "L2"] as const;
  const u = ["u", "u'", "u2"] as const;
  const d = ["d", "d'", "d2"] as const;
  const f = ["f", "f'", "f2"] as const;
  const b = ["b", "b'", "b2"] as const;
  const M = ["M", "M'", "M2"] as const;
  const E = ["E", "E'", "E2"] as const;
  const S = ["S", "S'", "S2"] as const;
  const x = ["x", "x'", "x2"] as const;
  const y = ["y", "y'", "y2"] as const;
  const z = ["z", "z'", "z2"] as const;

  // prettier-ignore
  const movesets = {
    Full: [
      ...R, ...L, ...U, ...D, ...F, ...B,
      ...r, ...l, ...u, ...d, ...f, ...b,
      ...M, ...E, ...S,
      ...x, ...y, ...z,
    ],
    RUFLDB: [
      ...R, ...U, ...F, ...L, ...D, ...B,
    ],
    MU: [...M, ...U],
    RrUM: [...R, ...r, ...U, ...M],
    RrUMDFB: [...R, ...r, ...U, ...M, ...D, ...F, ...B],
  } as const satisfies { [name: string]: MoveSet<Move3x3> };
  return movesets;
})();

// prettier-ignore
export const MOVE_PERMS = (() => {
  const R: Perm<FaceletIndex> = [[ 2, 42], [ 5, 30], [ 8, 18], [14,  2], [15, 17], [16, 29], [17, 41], [18, 53], [26,  5], [27, 16], [29, 40], [30, 50], [38,  8], [39, 15], [40, 27], [41, 39], [42, 47], [47, 14], [50, 26], [53, 38]];
  const L: Perm<FaceletIndex> = [[ 0, 12], [ 3, 24], [ 6, 36], [ 9, 11], [10, 23], [11, 35], [12, 45], [20,  6], [21, 10], [23, 34], [24, 48], [32,  3], [33,  9], [34, 21], [35, 33], [36, 51], [44,  0], [45, 44], [48, 32], [51, 20]];
  const U: Perm<FaceletIndex> = [[ 0,  2], [ 1,  5], [ 2,  8], [ 3,  1], [ 5,  7], [ 6,  0], [ 7,  3], [ 8,  6], [ 9, 18], [10, 19], [11, 20], [12,  9], [13, 10], [14, 11], [15, 12], [16, 13], [17, 14], [18, 15], [19, 16], [20, 17]];
  const D: Perm<FaceletIndex> = [[33, 36], [34, 37], [35, 38], [36, 39], [37, 40], [38, 41], [39, 42], [40, 43], [41, 44], [42, 33], [43, 34], [44, 35], [45, 47], [46, 50], [47, 53], [48, 46], [50, 52], [51, 45], [52, 48], [53, 51]];
  const F: Perm<FaceletIndex> = [[ 6, 15], [ 7, 27], [ 8, 39], [11,  8], [12, 14], [13, 26], [14, 38], [15, 47], [23,  7], [24, 13], [26, 37], [27, 46], [35,  6], [36, 12], [37, 24], [38, 36], [39, 45], [45, 11], [46, 23], [47, 35]];
  const B: Perm<FaceletIndex> = [[ 0, 33], [ 1, 21], [ 2,  9], [ 9, 51], [17,  0], [18, 20], [19, 32], [20, 44], [21, 52], [29,  1], [30, 19], [32, 43], [33, 53], [41,  2], [42, 18], [43, 30], [44, 42], [51, 41], [52, 29], [53, 17]];
  const M: Perm<FaceletIndex> = [[ 1, 13], [ 4, 25], [ 7, 37], [13, 46], [19,  7], [25, 49], [31,  4], [37, 52], [43,  1], [46, 43], [49, 31], [52, 19]];
  const E: Perm<FaceletIndex> = [[21, 24], [22, 25], [23, 26], [24, 27], [25, 28], [26, 29], [27, 30], [28, 31], [29, 32], [30, 21], [31, 22], [32, 23]];
  const S: Perm<FaceletIndex> = [[ 3, 16], [ 4, 28], [ 5, 40], [10,  5], [16, 50], [22,  4], [28, 49], [34,  3], [40, 48], [48, 10], [49, 22], [50, 34]];
  const BASIC_MOVE_PERMS = {
    R,
    L,
    U,
    D,
    F,
    B,
    M,
    E,
    S,
    r: [...R, ...invertPerm(M)],
    l: [...L, ...M],
    u: [...U, ...invertPerm(E)],
    d: [...D, ...E],
    f: [...F, ...S],
    b: [...B, ...invertPerm(S)],
    x: [...R, ...invertPerm(M), ...invertPerm(L)],
    y: [...U, ...invertPerm(E), ...invertPerm(D)],
    z: [...F, ...S, ...invertPerm(B)],
  };
  return Object.fromEntries(
    Object.entries(BASIC_MOVE_PERMS).flatMap(([name, perm]) => [
      [name, perm],
      [name + "'", invertPerm(perm)],
      [name + "2", doublePerm(perm)],
    ])
  ) as { [move in Move3x3]: Perm<FaceletIndex> };
})();

export function invertMove<M extends Move3x3>(move: M): M {
  // This is only safe as long as Move3x3 is conventional Singmaster notation
  if (move.includes("2")) return move;
  if (move.includes("'")) return move[0] as M;
  return (move[0] + "'") as M;
}

export function invertMoves<M extends Move3x3>(moves: M[]): M[] {
  return moves.map(invertMove);
}

export function sameLayerOrAxis<M extends Move3x3>(a: M, b: M) {
  // This is only safe as long as Move3x3 is conventional Singmaster notation
  return a[0] === b[0];
}
