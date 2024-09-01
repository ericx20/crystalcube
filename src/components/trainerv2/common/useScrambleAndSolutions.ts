import { useCallback, useEffect, useState } from "react";

// State management for intuitive step trainers
// Stores the current scramble and the solution for that scramble
// Pass in an Options param to change the mode of the scrambler/solver
// For example, for ZZ trainer you could pass in "EOCross" or "EOLine"
// depending on the mode the user has selected
function useScrambleAndSolutions<MoveType, Options>(
  scrambler: (options: Options) => Promise<MoveType[]>, // TODO: Promise<MoveType[] | null> for failure
  solver: (scramble: MoveType[], options: Options) => Promise<MoveType[][]>,
  options: Options,
  onNewScramble?: () => void
) {
  const [scramble, setScramble] = useState<MoveType[]>([]);
  const [solutions, setSolutions] = useState<MoveType[][]>([]);

  const [hasFirstScrambleLoaded, setHasFirstScrambleLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isScrambleLoading, setScrambleLoading] = useState(true);

  const generateScramble = useCallback(async () => {
    setLoading(true);
    setScrambleLoading(true);
    const newScramble = await scrambler(options);
    setScramble(newScramble);
    setScrambleLoading(false);
    setHasFirstScrambleLoaded(true);

    onNewScramble && onNewScramble();
  }, [scrambler, options, onNewScramble]);

  const generateSolutions = useCallback(async () => {
    const newSolutions = await solver(scramble, options);
    setSolutions(newSolutions);
    setLoading(false);
  }, [scramble, solver, options]);

  // generate a new scramble when options change (including upon page load)
  useEffect(() => {
    generateScramble();
  }, [options]);

  // generate new solutions when the scramble changes
  useEffect(() => {
    if (hasFirstScrambleLoaded) {
      generateSolutions();
    }
  }, [scramble, hasFirstScrambleLoaded]);

  const getNext = () => generateScramble();

  return {
    scramble,
    setScramble,
    solutions,
    getNext,
    isLoading,
    isScrambleLoading,
  };
}

export default useScrambleAndSolutions;
