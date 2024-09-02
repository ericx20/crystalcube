import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { mergeDeepLeft } from "ramda";

import type { LevelMode } from "./crossTypes";
import type { CubeOrientation } from "src/lib/puzzles/cube3x3";

// When these options change, scrambles and solutions are regenerated
export interface CrossOptions {
  levelMode: LevelMode;
  numOfMoves: number;
  solutionOrientation: CubeOrientation;
  shortScrambles: boolean;
}

// These options control UI display settings, not the scramble and solver
export interface UIOptions {
  enableHotkeys: boolean;
  chooseExecutionAngle: boolean;
}

export interface Actions {
  setLevelMode: (mode: LevelMode) => void;
  setLevelNumOfMoves: (num: number) => void;
  setSolutionOrientation: (orientation: CubeOrientation) => void;
  setShortScrambles: (shortScrambles: boolean) => void;
  setChooseExecutionAngle: (chooseExecutionAngle: boolean) => void;

  setEnableHotkeys: (enable: boolean) => void;
}

interface State {
  crossOptions: CrossOptions;
  uiOptions: UIOptions;
  actions: Actions;
}

const useStore = create(
  persist(
    immer<State>((set, _get) => ({
      crossOptions: {
        levelMode: "random",
        numOfMoves: 3,
        solutionOrientation: "YB",
        shortScrambles: true,
      },
      uiOptions: {
        chooseExecutionAngle: true,
        enableHotkeys: true,
      },
      actions: {
        setLevelMode: (levelMode) =>
          set((state) => {
            state.crossOptions.levelMode = levelMode;
          }),
        setLevelNumOfMoves: (numOfMoves) =>
          set((state) => {
            state.crossOptions.numOfMoves = numOfMoves;
          }),
        setSolutionOrientation: (orientation) =>
          set((state) => {
            state.crossOptions.solutionOrientation = orientation;
          }),
        setShortScrambles: (shortScrambles) =>
          set((state) => {
            state.crossOptions.shortScrambles = shortScrambles;
          }),
        setChooseExecutionAngle: (chooseExecutionAngle) =>
          set((state) => {
            state.uiOptions.chooseExecutionAngle = chooseExecutionAngle;
          }),

        setEnableHotkeys: (enable) =>
          set((state) => {
            state.uiOptions.enableHotkeys = enable;
          }),
      },
    })),
    {
      name: "cross",
      version: 0.1,
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState ?? {}, currentState),
    }
  )
);

export const useCrossOptions = () => useStore((state) => state.crossOptions);
export const useUIOptions = () => useStore((state) => state.uiOptions);
export const useActions = () => useStore((state) => state.actions);
