import { RoundedBox } from "@react-three/drei";
import { FACES } from "src/lib/puzzles/cube3x3";
import type { Face, Facelet } from "src/lib/puzzles/cube3x3";
import Sticker from "./Sticker";

export type CubieFacelets = { [f in Face]?: Facelet };

interface CubieProps {
  cubieFacelets: CubieFacelets;
  oriented?: boolean;
  label?: Face;
  showHintStickers?: boolean;
}

export default function Cubie(
  props: JSX.IntrinsicElements["mesh"] & CubieProps
) {
  const { oriented = true, label: faceToLabel } = props;
  return (
    <mesh {...props}>
      {/* Base cubie */}
      <RoundedBox>
        <meshBasicMaterial color={oriented ? "black" : "#9b23eb"} />
      </RoundedBox>
      {/* All the stickers */}
      {FACES.flatMap((face) => {
        const facelet = props.cubieFacelets[face];
        const label = face === faceToLabel ? faceToLabel : undefined;
        return facelet ? (
          <Sticker
            key={face}
            oriented={oriented}
            label={label}
            face={face}
            facelet={facelet}
            showHintSticker={props.showHintStickers}
          />
        ) : (
          []
        );
      })}
    </mesh>
  );
}
