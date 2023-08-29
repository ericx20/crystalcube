import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { mergeDeepLeft } from "ramda";

import type { EOStep, EOStepOptions } from "./eoStepTypes"

interface Actions {
  changeEOStep: (eoStep: EOStep) => void;
}

interface State {
  options: EOStepOptions;
  actions: Actions;
}

// TODO: make a selector that takes the EOStepOptions and turns it into
// the solver config that's needed? or is that the scrambler's job?
// TODO: wrap this so it can be reused easily and with minimal boilerplate

const useStore = create(
  persist(
    immer<State>((set) => ({
      options: {
        eoStep: "EOCross",
      },
      actions: {
        changeEOStep: (eoStep) =>
          set((state) => {
            state.options.eoStep = eoStep;
          }),
      },
    })),
    {
      name: "eo-step",
      version: 0,
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState ?? {}, currentState),
    }
  )
);

export const useOptions = () => useStore((state) => state.options);
export const useActions = () => useStore((state) => state.actions);
