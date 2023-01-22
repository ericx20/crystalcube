import type { FaceletIndex, Mask, Method, SolverConfig, SolverConfigName } from "../types"
import { HTM_MOVESET_BIASED_RUF } from "./cube"

const CENTERS: Array<FaceletIndex> = [4, 22, 25, 28, 31, 49]
const EO_FACELETS: Array<FaceletIndex> = [1, 3, 5, 7, 24, 26, 30, 32, 46, 48, 50, 52]
const CROSS_FACELETS: Array<FaceletIndex> = [4, 22, 25, 28, 31, 34, 37, 40, 43, 46, 48, 49, 50, 52]
const LINE_FACELETS: Array<FaceletIndex> = [4, 22, 25, 28, 31, 37, 43, 46, 49, 52]

export const EO_MASK: Mask = {
  solvedFaceletIndices: CENTERS,
  eoFaceletIndices: EO_FACELETS,
}

export const EOLINE_MASK: Mask = {
  solvedFaceletIndices: LINE_FACELETS,
  eoFaceletIndices: EO_FACELETS,
}

export const EOCROSS_MASK: Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
  eoFaceletIndices: EO_FACELETS,
}

export const CROSS_MASK: Mask = {
  solvedFaceletIndices: CROSS_FACELETS,
}

// DEFINE SOLVERS HERE
export const SOLVER_CONFIG_NAMES = ["EO", "EOLine", "EOCross", "Cross"] as const

export const SOLVER_CONFIGS: { [name in SolverConfigName]: SolverConfig } = {
  EO: {
    moveSet: HTM_MOVESET_BIASED_RUF,
    mask: EO_MASK,
    pruningDepth: 4, // TODO: can we increase it to 5?
    depthLimit: 7,
    nMoveScrambleConfig: {
      min: 2,
      max: 7,
      iterationLimit: 2000,
    },
    isEOStep: true,
  },
  EOLine: {
    moveSet: HTM_MOVESET_BIASED_RUF,
    mask: EOLINE_MASK,
    pruningDepth: 4,
    depthLimit: 9,
    nMoveScrambleConfig: {
      min: 2,
      max: 8,
      iterationLimit: 1000,
    },
    isEOStep: true,
  },
  EOCross: {
    moveSet: HTM_MOVESET_BIASED_RUF,
    mask: EOCROSS_MASK,
    pruningDepth: 4,
    depthLimit: 10,
    nMoveScrambleConfig: {
      min: 2,
      max: 9,
      iterationLimit: 200,
    },
    isEOStep: true,
  },
  Cross: {
    moveSet: HTM_MOVESET_BIASED_RUF,
    mask: CROSS_MASK,
    pruningDepth: 4,
    depthLimit: 8,
    nMoveScrambleConfig: {
      min: 2,
      max: 7,
      iterationLimit: 500,
    },
  }
} as const

export const METHODS = ["CFOP", "ZZ"] as const

export const METHOD_SOLVERS = {
  CFOP: ["Cross"],
  ZZ: ["EO", "EOLine", "EOCross"],
} as const satisfies { [method in Method]: Readonly<Array<SolverConfigName>> }
