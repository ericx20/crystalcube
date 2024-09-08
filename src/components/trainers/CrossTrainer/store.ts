import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { mergeDeepLeft } from "ramda";

import type { ColorNeutrality, CrossStep, LevelMode } from "./types";
import type { CubeOrientation } from "src/lib/puzzles/cube3x3";
import { NUM_OF_MOVES_CONFIGS } from "./constants";

// When these options change, scrambles and solutions are regenerated
export interface CrossOptions {
  crossStep: CrossStep;
  levelMode: LevelMode;
  numOfMoves: number;
  // This option is only shown on the UI, the solver will use crossOptions.solutionOrientations for solving color neutrality
  colorNeutrality: ColorNeutrality;
  solutionOrientations: CubeOrientation[];
  shortScrambles: boolean;
}

// These options control UI display settings, not the scramble and solver
export interface UIOptions {
  enableHotkeys: boolean;
  chooseExecutionAngle: boolean;
}

export interface Actions {
  setCrossStep: (crossStep: CrossStep) => void;
  setLevelMode: (mode: LevelMode) => void;
  setLevelNumOfMoves: (num: number) => void;
  setColorNeutrality: (colorNeutrality: ColorNeutrality) => void;
  setSolutionOrientations: (orientations: CubeOrientation[]) => void;
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
        colorNeutrality: "fixed",
        solutionOrientations: ["YB"],
        shortScrambles: true,
        crossStep: "Cross",
      },
      uiOptions: {
        chooseExecutionAngle: true,
        enableHotkeys: true,
      },
      actions: {
        setCrossStep: (crossStep) =>
          set((state) => {
            const { min, max } = NUM_OF_MOVES_CONFIGS[crossStep];
            if (state.crossOptions.numOfMoves < min) {
              state.crossOptions.numOfMoves = min;
            } else if (state.crossOptions.numOfMoves > max) {
              state.crossOptions.numOfMoves = max;
            }
            state.crossOptions.crossStep = crossStep;
          }),
        setLevelMode: (levelMode) =>
          set((state) => {
            state.crossOptions.levelMode = levelMode;
          }),
        setLevelNumOfMoves: (numOfMoves) =>
          set((state) => {
            state.crossOptions.numOfMoves = numOfMoves;
          }),
        setColorNeutrality: (colorNeutrality) =>
          set((state) => {
            state.crossOptions.colorNeutrality = colorNeutrality;
          }),
        setSolutionOrientations: (orientations) =>
          set((state) => {
            state.crossOptions.solutionOrientations = orientations;
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
      version: 0.2,
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState ?? {}, currentState),
      migrate: (persistedState, version) => {
        if (version === 0.1) {
          // We changed solutionOrientation from a CubeOrientation to a list of CubeOrientation
          (persistedState as any).crossOptions.solutionOrientations = [
            (persistedState as any).crossOptions.solutionOrientation,
          ];
          delete (persistedState as any).crossOptions.solutionOrientation;
        }
        return persistedState as State;
      },
    }
  )
);

export const useCrossOptions = () => useStore((state) => state.crossOptions);
export const useUIOptions = () => useStore((state) => state.uiOptions);
export const useActions = () => useStore((state) => state.actions);
