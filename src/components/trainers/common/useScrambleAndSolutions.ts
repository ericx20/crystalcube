import { useCallback, useEffect, useState } from "react";

// State management for intuitive step trainers
// Stores the current scramble and the solution for that scramble
// Pass in an Options param to change the mode of the scrambler/solver
// For example, for ZZ trainer you could pass in "EOCross" or "EOLine"
// depending on the mode the user has selected
function useScrambleAndSolutions<MoveType, Options>(
  scrambler: (options: Options) => Promise<MoveType[] | null>,
  solver: (scramble: MoveType[], options: Options) => Promise<MoveType[][]>,
  options: Options,
  onNewScramble?: () => void
) {
  const [scramble, setScramble] = useState<MoveType[]>([]);
  const [solutions, setSolutions] = useState<MoveType[][]>([]);

  const [hasFirstScrambleLoaded, setHasFirstScrambleLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isScrambleLoading, setScrambleLoading] = useState(true);
  const [scrambleFailed, setScrambleFailed] = useState(false);

  const generateScramble = useCallback(async () => {
    setLoading(true);
    setScrambleLoading(true);
    const newScramble = await scrambler(options);
    const failed = newScramble === null;
    setScrambleFailed(failed);
    if (failed) {
      setLoading(false);
    } else {
      setScramble(newScramble);
    }
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
    if (hasFirstScrambleLoaded && !scrambleFailed) {
      generateSolutions();
    }
  }, [scramble, hasFirstScrambleLoaded, scrambleFailed]);

  const getNext = () => generateScramble();

  return {
    scramble,
    scrambleFailed,
    setScramble,
    solutions,
    getNext,
    isLoading,
    isScrambleLoading,
  };
}

export default useScrambleAndSolutions;
