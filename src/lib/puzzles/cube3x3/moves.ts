import { invertPerm, doublePerm } from "src/lib/puzzles/common";
import { Perm, MoveSet } from "src/lib/types";
import { FaceletIndex } from "./state";
import sample from "lodash/sample";

// Represents the 6 faces and their colors
export const FACES = ["R", "L", "U", "D", "F", "B"] as const;
export type Face = (typeof FACES)[number];

// prettier-ignore
// Represents the layers that can be twisted on the cube
export const LAYERS = [
  "R", "L", "U", "D", "F", "B",
  "r", "l", "u", "d", "f", "b",
  "M", "E", "S"
] as const;
export type Layer = (typeof LAYERS)[number];

// prettier-ignore
export const FACE_LAYERS = ["R", "L", "U", "D", "F", "B"] as const satisfies Readonly<Layer[]>;
export type FaceLayer = (typeof FACE_LAYERS)[number];

export const WIDE_LAYERS = [
  "r",
  "l",
  "u",
  "d",
  "f",
  "b",
] as const satisfies Readonly<Layer[]>;
export type WideLayer = (typeof WIDE_LAYERS)[number];

export const SLICE_LAYERS = ["M", "E", "S"] as const satisfies Readonly<
  Layer[]
>;
export type SliceLayer = (typeof SLICE_LAYERS)[number];

// Represents the axes when rotating the entire cube
export const AXES = ["x", "y", "z"] as const;
export type Axis = (typeof AXES)[number];

export const LAYERS_ALONG_AXES: Readonly<{
  [layer in Axis]: readonly Layer[];
}> = {
  x: ["R", "M", "L", "r", "l"],
  y: ["U", "E", "D", "u", "d"],
  z: ["F", "S", "B", "f", "b"],
};

// The suffixes of Singmaster notation
export const SUFFIXES = ["", "2", "'"] as const;
export type Suffix = (typeof SUFFIXES)[number];

export type LayerMove = `${Layer}${Suffix}`; // include slices and wide moves
export type FaceMove = `${FaceLayer}${Suffix}`;
export type WideMove = `${WideLayer}${Suffix}`;
export type SliceMove = `${SliceLayer}${Suffix}`;
export type RotationMove = `${Axis}${Suffix}`;
// TODO: rename Move3x3 to Move, and update generics to be like <M extends Move> not <Move extends Move3x3>
export type Move3x3 = `${Layer | Axis}${Suffix}`;

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

// TODO: can we make these static methods of Cube3x3 class?
export function invertMove<M extends Move3x3>(move: M): M {
  // This is only safe as long as Move3x3 is conventional Singmaster notation
  if (move.includes("2")) return move;
  if (move.includes("'")) return move[0] as M;
  return (move[0] + "'") as M;
}

export function invertMoves<M extends Move3x3>(moves: M[]): M[] {
  return moves.map(invertMove).reverse();
}

export function sameLayerOrAxis<M extends Move3x3>(a: M, b: M) {
  // This is only safe as long as Move3x3 is conventional Singmaster notation
  return a[0] === b[0];
}

export function isLayerMove(move: Move3x3): move is LayerMove {
  return !isCubeRotation(move);
}

export function isCubeRotation(move: Move3x3): move is RotationMove {
  return (AXES as Readonly<string[]>).includes(move[0]);
}

export function isFaceMove(move: Move3x3): move is FaceMove {
  return (
    !isCubeRotation(move) &&
    (FACE_LAYERS as Readonly<Layer[]>).includes(layerOfLayerMove(move))
  );
}

export function isWideMove(move: Move3x3): move is WideMove {
  return (
    !isCubeRotation(move) &&
    (WIDE_LAYERS as Readonly<Layer[]>).includes(layerOfLayerMove(move))
  );
}

export function isSliceMove(move: Move3x3): move is SliceMove {
  return (
    !isCubeRotation(move) &&
    (SLICE_LAYERS as Readonly<Layer[]>).includes(layerOfLayerMove(move))
  );
}

export function layerOfLayerMove(move: LayerMove): Layer {
  return move[0] as Layer;
}

export function axisOfRotation(move: RotationMove): Axis {
  return move[0] as Axis;
}

export function movesAreParallel(a: Move3x3, b: Move3x3) {
  if (!isLayerMove(a) || !isLayerMove(b)) {
    return false;
  }
  const layerA = layerOfLayerMove(a);
  const layerB = layerOfLayerMove(b);
  return AXES.some((axis) => {
    const parallelLayers = LAYERS_ALONG_AXES[axis];
    return parallelLayers.includes(layerA) && parallelLayers.includes(layerB);
  });
}

export function isValidMove(move: string): move is Move3x3 {
  if (move.length < 1 || move.length > 2) return false;
  const base = move[0];
  const suffix = move[1] ?? "";
  return (
    (LAYERS.includes(base as Layer) || AXES.includes(base as Axis)) &&
    SUFFIXES.includes(suffix as Suffix)
  );
}

export function randomMoves(
  length: number,
  moveSet: readonly Move3x3[] = MOVESETS.RUFLDB
) {
  const moves: Move3x3[] = [];
  for (let i = 0; i < length; i++) {
    appendRandomMove(moves, moveSet);
  }
  return moves;
}

/**
 * Note: mutates `moves`!
 */
export function appendRandomMove(
  moves: Move3x3[],
  moveSet: readonly Move3x3[] = MOVESETS.RUFLDB
): void {
  const move = sample(movesToAppend(moves, moveSet))!;
  move && moves.push(move);
}

/**
 * Gets a list of moves that can be added to a sequence of moves without cancellations
 */
export function movesToAppend(
  moves: Move3x3[],
  moveSet: readonly Move3x3[] = MOVESETS.RUFLDB
): Move3x3[] {
  const lastMove = moves.at(moves.length - 1);
  const secondLastMove = moves.at(moves.length - 2);
  const choiceIsValid = (choice: Move3x3) =>
    !lastMove || // if there is no last move, we can choose any move as valid
    (!sameLayerOrAxis(choice, lastMove) &&
      (!secondLastMove ||
        !endsWithRedundantParallelMoves([secondLastMove, lastMove, choice])));
  return moveSet.filter(choiceIsValid);
}

function endsWithRedundantParallelMoves(solution: Move3x3[]): boolean {
  if (solution.length < 3) {
    return false;
  }
  const [thirdLast, secondLast, last] = solution.slice(-3);
  if ([thirdLast, secondLast, last].some(isCubeRotation)) {
    return false;
  }
  return (
    sameLayerOrAxis(thirdLast, last) && movesAreParallel(thirdLast, secondLast)
  );
}

export type MovePower = 1 | 2 | 3;

export function powerOfMove(move: Move3x3): MovePower {
  const suffix = move[1];
  if (suffix === "'") {
    return 3;
  }
  if (suffix === "2") {
    return 2;
  }
  return 1;
}

export function movePowerToSuffix(power: MovePower): string {
  return {
    1: "",
    2: "2",
    3: "'",
  }[power];
}

// TODO: update OH scrambler
export function translateMoves(
  moves: Move3x3[],
  rotations: Readonly<Array<RotationMove>>
): Move3x3[] {
  return moves.map((move) => translateMove(move, rotations));
}

export function translateMove(
  move: Move3x3,
  rotations: Readonly<Array<RotationMove>>
): Move3x3 {
  let newMove = move;
  rotations.forEach((rotation) => {
    if (isCubeRotation(newMove)) {
      newMove = translateRotation(newMove, rotation);
    } else {
      newMove = translateLayerMove(newMove, rotation);
    }
  });
  return newMove;
}

type Cycle<T> = Array<T>;

// prettier-ignore
const ROTATION_TO_LAYER_CYCLES: Readonly<{ [rotation in RotationMove]: Array<Cycle<Layer>> }> = {
  "x":  [["U", "B", "D", "F"], ["u", "b", "d", "f"], ["E", "S"]],
  "x'": [["U", "F", "D", "B"], ["u", "f", "d", "b"], ["E", "S"]],
  "x2": [["U", "D"], ["F", "B"], ["u", "d"], ["f", "b"]],
  "y":  [["F", "L", "B", "R"], ["f", "l", "b", "r"], ["M", "S"]],
  "y'": [["F", "R", "B", "L"], ["f", "r", "b", "l"], ["M", "S"]],
  "y2": [["R", "L"], ["F", "B"], ["r", "l"], ["f", "b"]],
  "z":  [["U", "R", "D", "L"], ["u", "r", "d", "l"], ["E", "M"]],
  "z'": [["U", "L", "D", "R"], ["u", "l", "d", "r"], ["E", "M"]],
  "z2": [["U", "D"], ["L", "R"], ["u", "d"], ["l", "r"]],
}

// prettier-ignore
const LAYERS_REVERSED_MAP: Readonly<{ [rotation in RotationMove]?: Layer }> = {
  "x":  "S",
  "x'": "E",
  "y":  "M",
  "y'": "S",
  "z":  "M",
  "z'": "E",
};

function translateLayerMove(
  move: LayerMove,
  rotation: RotationMove
): LayerMove {
  const layerCycles = ROTATION_TO_LAYER_CYCLES[rotation];
  for (const cycle of layerCycles) {
    const moveLayer = layerOfLayerMove(move);
    const index = cycle.indexOf(moveLayer);
    if (index !== -1) {
      const newLayer = nextElement(cycle, index);
      const newSuffix = move[1] ?? "";
      const newMove = (newLayer + newSuffix) as LayerMove;
      const needToReverse = LAYERS_REVERSED_MAP[rotation] === moveLayer;
      return needToReverse ? invertMove(newMove) : newMove;
    }
  }
  return move;
}

type RotationMap = Readonly<{ [rotation in RotationMove]: RotationMove }>;
// prettier-ignore
const AXIS_TO_ROTATION_MAP: Readonly<{ [axis in Axis]: RotationMap }> = {
  x: {
    "x" : "x",
    "y" : "z'",
    "z" : "y",
    "x'": "x'",
    "y'": "z",
    "z'": "y'",
    "x2": "x2",
    "y2": "z2",
    "z2": "y2",
  },
  y: {
    "x" : "z",
    "y" : "y",
    "z" : "x'",
    "x'": "z'",
    "y'": "y'",
    "z'": "x",
    "x2": "z2",
    "y2": "y2",
    "z2": "x2",
  },
  z: {
    "x" : "y'",
    "y" : "x",
    "z" : "z",
    "x'": "y",
    "y'": "x'",
    "z'": "z'",
    "x2": "y2",
    "y2": "x2",
    "z2": "z2",
  },
}

function translateRotation(
  rotationToTranslate: RotationMove,
  rotation: RotationMove
): RotationMove {
  const rotationPower = powerOfMove(rotation);
  const axis = axisOfRotation(rotation);
  const rotationMap = AXIS_TO_ROTATION_MAP[axis];
  let translatedRotation = rotationToTranslate;
  for (let i = 0; i < rotationPower; i++) {
    translatedRotation = rotationMap[translatedRotation];
  }
  return translatedRotation;
}

function nextElement<T>(arr: Array<T>, index: number): T {
  return arr[(index + 1) % arr.length];
}

/**
 * Note: for now, does not deal with rotations, slice moves or wide moves. <RUFLDB> only.
 */
export function simplifyMoves(moves: Move3x3[]): Move3x3[] {
  const simplified: Move3x3[] = [];
  for (const curr of moves) {
    // does the current move cancel with the previous? e.g. R R
    const prev = simplified.at(-1);
    if (!prev) {
      simplified.push(curr);
      continue;
    }
    const result = cancelTwoMoves(prev, curr);
    if (result === true) {
      // cancel completely (e.g. R R' = nothing)
      simplified.pop();
      continue;
    } else if (typeof result === "string") {
      // combined (e.g. R R = R2)
      simplified.pop();
      simplified.push(result);
      continue;
    }

    // at this point, the current move does not cancel with the previous
    // does the current move cancel with the second previous?
    const secondPrev = simplified.at(-2);
    // assumption: no slice moves or wide moves
    if (
      secondPrev &&
      movesAreParallel(secondPrev, prev) &&
      movesAreParallel(prev, curr)
    ) {
      const result2 = cancelTwoMoves(secondPrev, curr);
      if (result2 === true) {
        // cancelled completely, need to remove the second previous move entirely. e.g. U D U' => D
        simplified.splice(simplified.length - 2, 1);
        continue;
      } else if (typeof result2 === "string") {
        // combine with the second previous move
        simplified[simplified.length - 2] = result2;
        continue;
      }
    }

    simplified.push(curr);
  }
  return simplified;
}

// given two moves A and B, it returns:
// true if A and B are inverses of each other (cancel completely)
// false if A and B can't cancel each other at all
// C where C = A B, if A and B can combine into one move
function cancelTwoMoves<M extends Move3x3>(a: M, b: M): boolean | M {
  // if not the same layer/rotation, they cannot cancel
  if (a[0] !== b[0]) return false;
  const powerOfC = ((powerOfMove(a) + powerOfMove(b)) % 4) as MovePower | 0;
  if (powerOfC === 0) {
    // A and B are like R R' (1+3) or U2 U2 (2+2): cancel completely
    return true;
  }
  // otherwise, A and B are like R R2
  const newMove = (a[0] + movePowerToSuffix(powerOfC)) as M;
  return newMove;
}
