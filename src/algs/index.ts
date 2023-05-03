interface AlgSheet {
  name: string;
  description?: string;
  puzzle: PuzzleName;
  sets: Array<AlgSet>;
}

// todo: allow alg sets to just be links to other alg sheets
interface AlgSet {
  name: string;
  description?: string;
  stage: string;
  cases: Array<AlgCase>;
}

interface AlgCase {
  name: string;
  display: string;
  categories?: Array<string>;
  solutions: Array<AlgSolution>;
  probabilityWeight?: number;
}

interface AlgSolution {
  alg: string;
  labels?: Array<string>;
  preAdjust?: string;
  postAdjust?: string;
  notes?: string;
  videoUrl?: string;
}

type PuzzleName = "3x3x3" | "megaminx";

export type { AlgSheet, AlgSet, AlgCase, AlgSolution };
