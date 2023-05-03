import type { AlgSheet } from "src/algs";

interface AlgSheetViewerProps {
  algSheet: AlgSheet;
}

export default function AlgSheetViewer({ algSheet }: AlgSheetViewerProps) {
  return <h1>{algSheet.name}</h1>;
}
