import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { mergeDeepLeft } from "ramda";

import type {
  EOStep,
  EOStepOptions,
  LevelMode,
  NumOfMovesConfig,
} from "./eoStepTypes";

interface Actions {
  // getters: calculate something from state
  getNumOfMovesConfig: () => NumOfMovesConfig;
  // setters: change state
  setEOStep: (eoStep: EOStep) => void;
  setLevelMode: (mode: LevelMode) => void;
  setLevelNumOfBadEdges: (num: number) => void;
  setLevelNumOfMoves: (num: number) => void;
}

interface State {
  options: EOStepOptions;
  actions: Actions;
}

const useStore = create(
  persist(
    immer<State>((set, get) => ({
      options: {
        eoStep: "EOCross",
        levelMode: "random",
        numOfBadEdges: 4,
        numOfMoves: 3,
      },
      actions: {
        // TODO: getter for solverConfig
        getNumOfMovesConfig: () => NUM_OF_MOVES_CONFIGS[get().options.eoStep],
        setEOStep: (eoStep) =>
          set((state) => {
            const { min, max } = NUM_OF_MOVES_CONFIGS[eoStep];
            if (state.options.numOfMoves < min) {
              state.options.numOfMoves = min;
            } else if (state.options.numOfMoves > max) {
              state.options.numOfMoves = max;
            }
            state.options.eoStep = eoStep;
          }),
        setLevelMode: (levelMode) =>
          set((state) => {
            state.options.levelMode = levelMode;
          }),
        setLevelNumOfBadEdges: (numOfBadEdges) =>
          numOfBadEdgesValid(numOfBadEdges) &&
          set((state) => {
            state.options.numOfBadEdges = numOfBadEdges;
          }),
        setLevelNumOfMoves: (numOfMoves) =>
          set((state) => {
            state.options.numOfMoves = numOfMoves;
          }),
      },
    })),
    {
      name: "eo-step",
      version: 0,
      // TODO: move this function out
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState ?? {}, currentState),
    }
  )
);

export const useOptions = () => useStore((state) => state.options);
export const useActions = () => useStore((state) => state.actions);

// prettier-ignore
const NUM_OF_MOVES_CONFIGS: { [eoStep in EOStep]: NumOfMovesConfig } = {
  EO:           { min: 3, max: 7 },
  EOLine:       { min: 3, max: 8 },
  EOCross:      { min: 3, max: 9 },
  EOArrowBack:  { min: 3, max: 8 },
  EOArrowLeft:  { min: 3, max: 8 },
  EO222:        { min: 3, max: 9 },
};

function numOfBadEdgesValid(n: number) {
  return Number.isInteger(n) && n % 2 === 0 && 0 <= n && n <= 12;
}
