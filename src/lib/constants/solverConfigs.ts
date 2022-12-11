import type { FaceletIndex, Mask, SolverConfig, SolverConfigName } from "src/lib/types"
import { HTM_MOVESET } from "./cube"

const CROSS_FACELETS: Array<FaceletIndex> = [4, 22, 25, 28, 31, 34, 37, 40, 43, 46, 48, 49, 50, 52]
const EO_FACELETS: Array<FaceletIndex> = [1, 3, 5, 7, 24, 26, 30, 32, 46, 48, 50, 52]

export const EOCROSS_MASK: Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
  eoFaceletIndices: EO_FACELETS,
}

export const CROSS_MASK: Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
}

// DEFINE SOLVERS HERE
export const SOLVER_CONFIG_NAMES = ["EOCross", "Cross"] as const

export const SOLVER_CONFIGS: { [name in SolverConfigName]: SolverConfig } = {
  EOCross: {
    moveset: HTM_MOVESET,
    mask: EOCROSS_MASK,
    pruningDepth: 4, // TODO: can we increase it to 5?
    depthLimit: 10,
  },
  Cross: {
    moveset: HTM_MOVESET,
    mask: CROSS_MASK,
    pruningDepth: 4, // TODO: can we increase it to 5?
    depthLimit: 10,
  }
} as const
 