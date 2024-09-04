import { useCallback, useEffect, useRef, useState } from "react";

// State management for scrambles and solutions in intuitive step trainers
// Generates the scrambles and solutions initially, and returns a function to get the next round of scrambles and solutions
// They regenerate when options change, and the next scrambles/solutions are also pre-fetched to save time.
export default function useScrambleAndSolutions<MoveType, Options>(
  scrambler: (options: Options) => Promise<MoveType[] | null>,
  solver: (scramble: MoveType[], options: Options) => Promise<MoveType[][]>,
  options: Options,
  onNewScramble?: () => void
) {
  const [scramble, setScramble] = useState<MoveType[]>([]);
  const [scrambleFailed, setScrambleFailed] = useState(false);
  const [solutions, setSolutions] = useState<MoveType[][]>([]);
  const [isLoading, setLoading] = useState(false);

  const cachedScramble = useRef<MoveType[] | null>(null);
  const cachedSolutions = useRef<MoveType[][] | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    const scramble = await scrambler(options);
    if (scramble) {
      const solutions = await solver(scramble, options);
      setScrambleFailed(false);
      setScramble(scramble);
      setSolutions(solutions);
    } else {
      setScrambleFailed(true);
    }
    setLoading(false);
  }, [scrambler, solver, options, onNewScramble]);

  const prefetch = useCallback(async () => {
    const scramble = await scrambler(options);
    if (!scramble) return;
    const solutions = await solver(scramble, options);
    cachedScramble.current = scramble;
    cachedSolutions.current = solutions;
  }, [scrambler, solver, options]);

  const getNext = useCallback(async () => {
    if (cachedScramble.current && cachedSolutions.current) {
      setScramble(cachedScramble.current);
      setSolutions(cachedSolutions.current);
      cachedScramble.current = null;
      cachedSolutions.current = null;
      prefetch();
    } else {
      await generate();
    }
    onNewScramble && onNewScramble();
  }, [prefetch, generate, onNewScramble]);

  const setCustomScramble = useCallback(
    async (scramble: MoveType[]) => {
      setLoading(true);
      const solutions = await solver(scramble, options);
      setScrambleFailed(false);
      setScramble(scramble);
      setSolutions(solutions);
      setLoading(false);
    },
    [solver, options]
  );

  // Generate fresh scrambles and invalidate cached scrambles whenever options change
  useEffect(() => {
    cachedScramble.current = null;
    cachedSolutions.current = null;
    generate();
    onNewScramble && onNewScramble();
  }, [options]);

  useEffect(() => {
    if (!isLoading && (!cachedScramble.current || !cachedSolutions.current)) {
      prefetch();
    }
  }, [isLoading, prefetch]);

  return {
    scramble,
    scrambleFailed,
    setScramble: setCustomScramble,
    solutions,
    getNext,
    isLoading,
  };
}
