import type { Facelet, FaceletCube, IndexedFaceletCube, Mask } from "./types";
import { SOLVED_INDEXED_FACELET_CUBE } from "./constants";


export function colorOfIndexedFacelet(index: number): Facelet {
  const table: Array<Facelet> = ["U", "U", "U", "L", "F", "R", "B", "L", "F", "R", "B", "L", "F", "R", "B", "D", "D", "D"];
  return table[Math.floor(index / 3)];
}

export function faceletCubeToString(cube: FaceletCube): string {
  return cube.join("");
}

export function indexedFaceletCubeToFaceletCube(indexedFaceletCube: IndexedFaceletCube): FaceletCube {
  return indexedFaceletCube.map(indexedFacelet => colorOfIndexedFacelet(indexedFacelet));
}

// apply mask to a regular facelet cube on its current state
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
