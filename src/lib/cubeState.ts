import type { Facelet, FaceletCube, IndexedFaceletCube, Mask } from "./types";
import { SOLVED_INDEXED_FACELET_CUBE } from "./constants";

/**
 * @deprecated
 */
export function colorOfIndexedFacelet(index: number): Facelet {
  const table: Array<Facelet> = ["U", "U", "U", "L", "F", "R", "B", "L", "F", "R", "B", "L", "F", "R", "B", "D", "D", "D"];
  return table[Math.floor(index / 3)];
}

/**
 * @deprecated
 */
export function faceletCubeToString(cube: FaceletCube): string {
  return cube.join("");
}

/**
 * @deprecated
 */
export function indexedFaceletCubeToFaceletCube(indexedFaceletCube: IndexedFaceletCube): FaceletCube {
  return indexedFaceletCube.map(indexedFacelet => colorOfIndexedFacelet(indexedFacelet));
}

// apply mask to a regular facelet cube on its current state
/**
 * @deprecated
 */
export function applyMask(cube: FaceletCube, mask: Mask): FaceletCube {
  return SOLVED_INDEXED_FACELET_CUBE.map(faceletIdx => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return cube[faceletIdx]
    }
    if (mask.eoFaceletIndices?.includes(faceletIdx)) {
      return "O"
    }
    return "X"
  })
}

// Puts a mask on an IndexedFaceletCube
/**
 * @deprecated
 */
export function getMaskedFaceletCube(cube: IndexedFaceletCube, mask: Mask): FaceletCube {
  return cube.map(faceletIdx => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return colorOfIndexedFacelet(faceletIdx)
    }
    if (mask.eoFaceletIndices?.includes(faceletIdx)) {
      return "O"
    }
    return "X"
  })
}

const xxx = "➖➖➖"
const xxxxxx = "➖➖➖➖➖➖"
const xxxxxxxxxxxx = "➖➖➖➖➖➖➖➖➖➖➖➖"
/**
 * @deprecated
 */
export function printFaceletCube(cube: FaceletCube): void {
  const emojiCube = faceletCubeToEmojiCube(cube)
  const slice = (start: number, end: number) => emojiCube.slice(start, end).join("")
  console.log(xxxxxxxxxxxx)
  console.log(xxx + slice( 0,  3) + xxxxxx)
  console.log(xxx + slice( 3,  6) + xxxxxx)
  console.log(xxx + slice( 6,  9) + xxxxxx)
  console.log(slice( 9, 21))
  console.log(slice(21, 33))
  console.log(slice(33, 45))
  console.log(xxx + slice(45, 48) + xxxxxx)
  console.log(xxx + slice(48, 51) + xxxxxx)
  console.log(xxx + slice(51, 54) + xxxxxx)
  console.log(xxxxxxxxxxxx)
}

const faceletToEmoji: { [f in Facelet]: string } = {
  R: "🟥",
  L: "🟧",
  U: "⬜",
  D: "🟨",
  F: "🟩",
  B: "🟦",
  O: "🟪",
  X: "⬛",
}

/**
 * @deprecated
 */
function faceletCubeToEmojiCube(cube: FaceletCube): Array<string> {
  return cube.map(facelet => faceletToEmoji[facelet])
}
