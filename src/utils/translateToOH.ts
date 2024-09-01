import { Alg } from "cubing/alg";
import {
  isLayerMove,
  isWideMove,
  Layer,
  layerOfLayerMove,
  Move3x3,
  RotationMove,
  translateMove,
} from "src/lib/puzzles/cube3x3";

const translationMap: {
  [move in Move3x3]?: {
    newMove: Move3x3;
    rotateRemainingMovesBy: RotationMove;
  };
} = {
  R: {
    newMove: "l",
    rotateRemainingMovesBy: "x'",
  },
  "R'": {
    newMove: "l'",
    rotateRemainingMovesBy: "x",
  },
  R2: {
    newMove: "l2",
    rotateRemainingMovesBy: "x2",
  },
  L: {
    newMove: "r",
    rotateRemainingMovesBy: "x",
  },
  "L'": {
    newMove: "r'",
    rotateRemainingMovesBy: "x'",
  },
  L2: {
    newMove: "r2",
    rotateRemainingMovesBy: "x2",
  },
  U: {
    newMove: "d",
    rotateRemainingMovesBy: "y'",
  },
  "U'": {
    newMove: "d'",
    rotateRemainingMovesBy: "y",
  },
  U2: {
    newMove: "d2",
    rotateRemainingMovesBy: "y2",
  },
  D: {
    newMove: "u",
    rotateRemainingMovesBy: "y",
  },
  "D'": {
    newMove: "u'",
    rotateRemainingMovesBy: "y'",
  },
  D2: {
    newMove: "u2",
    rotateRemainingMovesBy: "y2",
  },
  F: {
    newMove: "b",
    rotateRemainingMovesBy: "z'",
  },
  "F'": {
    newMove: "b'",
    rotateRemainingMovesBy: "z",
  },
  F2: {
    newMove: "b2",
    rotateRemainingMovesBy: "z2",
  },
  B: {
    newMove: "f",
    rotateRemainingMovesBy: "z",
  },
  "B'": {
    newMove: "f'",
    rotateRemainingMovesBy: "z'",
  },
  B2: {
    newMove: "f2",
    rotateRemainingMovesBy: "z2",
  },
};

export function translateScrambleToOH(
  alg: Alg,
  hand: "left" | "right",
  lowercaseWide: boolean
): Alg {
  const scramble = (alg.toString()?.split(" ") as Move3x3[]) ?? [];
  const layersToTranslate: Layer[] =
    hand === "left" ? ["L", "D", "B"] : ["R", "D", "B"];

  for (let i = 0; i < scramble.length; i++) {
    // decide if scramble[i] needs to be translated
    const currMove = scramble[i];
    if (!isLayerMove(currMove)) continue;
    const layer = layerOfLayerMove(currMove);
    if (!layersToTranslate.includes(layer)) continue;
    const translation = translationMap[currMove];
    if (!translation) continue;

    const { newMove, rotateRemainingMovesBy } = translation;
    scramble[i] = newMove;
    for (let j = i + 1; j < scramble.length; j++) {
      scramble[j] = translateMove(scramble[j], [rotateRemainingMovesBy]);
    }
  }
  return new Alg(
    (lowercaseWide ? scramble : convertWideMoveNotation(scramble)).join(" ")
  );
}

/**
 * Converts r to Rw, etc.
 */
function convertWideMoveNotation(scramble: Move3x3[]): string[] {
  return scramble.map((move) => {
    if (isWideMove(move)) {
      const suffix = move[1] ?? "";
      return layerOfLayerMove(move).toUpperCase() + "w" + suffix;
    }
    return move;
  });
}
