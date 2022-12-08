import type { FaceletIndex, Mask, SolverConfig } from "src/lib/types"
import { HTM_MOVESET } from "./cube"

const CROSS_FACELETS: Array<FaceletIndex> = [4, 22, 25, 28, 31, 34, 37, 40, 43, 46, 48, 49, 50, 52]
const EO_FACELETS: Array<FaceletIndex> = [1, 3, 5, 7, 24, 26, 30, 32, 46, 48, 50, 52]

export const EOCROSS_MASK: Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
  eoFaceletIndices: EO_FACELETS,
}

export const EOCROSS_CONFIG: SolverConfig = {
  name: 'EOCross',
  moveset: HTM_MOVESET,
  mask: EOCROSS_MASK,
  pruningDepth: 4, // TODO: can we increase it to 5?
  depthLimit: 10,
}
