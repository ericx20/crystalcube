import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { mergeDeepLeft } from "ramda";

import type { EOStep, LevelMode, NumOfMovesConfig } from "./eoStepTypes";
import type { CubeOrientation } from "src/lib/puzzles/cube3x3";
import { numOfBadEdgesValid } from "./utils";

export interface EOStepOptions {
  eoStep: EOStep;
  levelMode: LevelMode;
  numOfBadEdges: number;
  numOfMoves: number;
  solutionOrientation: CubeOrientation;
  shortScrambles: boolean;
}

export interface UIOptions {
  enableHotkeys: boolean;
}

export interface Actions {
  getNumOfMovesConfig: () => NumOfMovesConfig;
  setEOStep: (eoStep: EOStep) => void;
  setLevelMode: (mode: LevelMode) => void;
  setLevelNumOfBadEdges: (num: number) => void;
  setLevelNumOfMoves: (num: number) => void;
  setSolutionOrientation: (orientation: CubeOrientation) => void;
  setShortScrambles: (shortScrambles: boolean) => void;

  setEnableHotkeys: (enable: boolean) => void;
}

interface State {
  eoStepOptions: EOStepOptions;
  uiOptions: UIOptions;
  actions: Actions;
}

const useStore = create(
  persist(
    immer<State>((set, get) => ({
      eoStepOptions: {
        eoStep: "EOCross",
        levelMode: "random",
        numOfBadEdges: 4,
        numOfMoves: 3,
        solutionOrientation: "YB",
        shortScrambles: true,
        enableHotkeys: true,
      },
      uiOptions: {
        enableHotkeys: true,
      },
      actions: {
        getNumOfMovesConfig: () =>
          NUM_OF_MOVES_CONFIGS[get().eoStepOptions.eoStep],
        setEOStep: (eoStep) =>
          set((state) => {
            const { min, max } = NUM_OF_MOVES_CONFIGS[eoStep];
            if (state.eoStepOptions.numOfMoves < min) {
              state.eoStepOptions.numOfMoves = min;
            } else if (state.eoStepOptions.numOfMoves > max) {
              state.eoStepOptions.numOfMoves = max;
            }
            state.eoStepOptions.eoStep = eoStep;
          }),
        setLevelMode: (levelMode) =>
          set((state) => {
            state.eoStepOptions.levelMode = levelMode;
          }),
        setLevelNumOfBadEdges: (numOfBadEdges) =>
          numOfBadEdgesValid(numOfBadEdges) &&
          set((state) => {
            state.eoStepOptions.numOfBadEdges = numOfBadEdges;
          }),
        setLevelNumOfMoves: (numOfMoves) =>
          set((state) => {
            state.eoStepOptions.numOfMoves = numOfMoves;
          }),
        setSolutionOrientation: (orientation) =>
          set((state) => {
            state.eoStepOptions.solutionOrientation = orientation;
          }),
        setShortScrambles: (shortScrambles) =>
          set((state) => {
            state.eoStepOptions.shortScrambles = shortScrambles;
          }),

        setEnableHotkeys: (enable) =>
          set((state) => {
            state.uiOptions.enableHotkeys = enable;
          }),
      },
    })),
    {
      name: "eo-step",
      version: 0.1,
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState ?? {}, currentState),
    }
  )
);

export const useEOStepOptions = () => useStore((state) => state.eoStepOptions);
export const useUIOptions = () => useStore((state) => state.uiOptions);
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
