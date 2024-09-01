import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { mergeDeepLeft } from "ramda";

import type { EOStep, LevelMode, NumOfMovesConfig } from "./eoStepTypes";
import type { CubeOrientation } from "src/libv2/puzzles/cube3x3";
import { numOfBadEdgesValid } from "./utils";

export interface EOStepOptions {
  eoStep: EOStep;
  levelMode: LevelMode;
  numOfBadEdges: number;
  numOfMoves: number;
  solutionOrientation: CubeOrientation;
  shortScrambles: boolean;
}

interface Actions {
  // getters: calculate something from state
  getNumOfMovesConfig: () => NumOfMovesConfig;
  // setters: change state
  setEOStep: (eoStep: EOStep) => void;
  setLevelMode: (mode: LevelMode) => void;
  setLevelNumOfBadEdges: (num: number) => void;
  setLevelNumOfMoves: (num: number) => void;
  setSolutionOrientation: (orientation: CubeOrientation) => void;
  setShortScrambles: (shortScrambles: boolean) => void;
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
        solutionOrientation: "YB",
        shortScrambles: true,
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
        setSolutionOrientation: (orientation) =>
          set((state) => {
            state.options.solutionOrientation = orientation;
          }),
        setShortScrambles: (shortScrambles) =>
          set((state) => {
            state.options.shortScrambles = shortScrambles;
          }),
      },
    })),
    {
      name: "eo-step",
      version: 0.1,
      // TODO: move this function out
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState ?? {}, currentState),
    }
  )
);

export const useOptions = () => useStore((state) => state.options);
export const useActions = () => useStore((state) => state.actions);

// prettier-ignore
export const NUM_OF_MOVES_CONFIGS: { [eoStep in EOStep]: NumOfMovesConfig } = {
  EO:           { min: 3, max: 7, iterationLimit: 2000 },
  EOLine:       { min: 3, max: 8, iterationLimit: 1000 },
  EOCross:      { min: 3, max: 9, iterationLimit: 200 },
  EOArrowBack:  { min: 3, max: 8, iterationLimit: 200 },
  EOArrowLeft:  { min: 3, max: 8, iterationLimit: 200 },
  EO222:        { min: 3, max: 9, iterationLimit: 200 },
};
