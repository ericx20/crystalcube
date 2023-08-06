import { useCallback, useEffect, useState } from "react"

// State management for intuitive step trainers
// Stores the current scramble and the solution for that scramble
// Pass in an Options param to change the mode of the scrambler/solver
// For example, for ZZ trainer you could pass in "EOCross" or "EOLine"
// depending on the mode the user has selected
function useScrambleAndSolutions<MoveType, Options>(
  scrambler: (options: Options) => Promise<MoveType[]>,
  solver: (scramble: MoveType[], options: Options) => Promise<MoveType[][]>,
  options: Options,
  onNewScramble?: () => void
) {
  const [scramble, setScramble] = useState<MoveType[]>([]);
  const [solutions, setSolutions] = useState<MoveType[][]>([]);
  const [isLoading, setLoading] = useState(false);

  const getNext = useCallback(async () => {
    setLoading(true);
    const newScramble = await scrambler(options);
    const newSolutions = await solver(newScramble, options);
    setScramble(newScramble);
    setSolutions(newSolutions);
    setLoading(false);

    onNewScramble && onNewScramble();
  }, [scrambler, onNewScramble]);

  // Generate scramble + solutions upon load or whenever the options change
  useEffect(() => {
    getNext()
  }, [options]);

  return {
    scramble,
    solutions,
    getNext,
    isLoading,
  };
}

export default useScrambleAndSolutions;
