/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import type { Face, Facelet } from "src/lib/puzzles/cube3x3";
import { Image } from "@react-three/drei";

import LabelR from "./labels/label-r.png";
import LabelL from "./labels/label-l.png";
import LabelU from "./labels/label-u.png";
import LabelD from "./labels/label-d.png";
import LabelF from "./labels/label-f.png";
import LabelB from "./labels/label-b.png";

const colorScheme: { [name in Facelet]: string } = {
  R: "red",
  L: "orange",
  U: "white",
  D: "yellow",
  F: "green",
  B: "blue",
  O: "#718096", // display oriented facelet same as masked facelet
  X: "#718096",
};

const halfTurn = Math.PI;
const quarterTurn = Math.PI / 2;
const eighthTurn = Math.PI / 4;

// let F sticker be the "default" sticker position
// other stickers are rotated versions of the U sticker
const stickerRotationMap: { [name in Face]: THREE.Euler } = {
  R: new THREE.Euler(0, quarterTurn, 0),
  L: new THREE.Euler(0, -quarterTurn, 0),
  U: new THREE.Euler(-quarterTurn, 0, 0),
  D: new THREE.Euler(quarterTurn, 0, 0),
  F: new THREE.Euler(0, 0, 0),
  B: new THREE.Euler(0, halfTurn, 0),
};

const labelMap: { [label in Face]: string } = {
  R: LabelR,
  L: LabelL,
  U: LabelU,
  D: LabelD,
  F: LabelF,
  B: LabelB,
};

const stickerSize = 0.85;
const misorientedDotSize = 0.2;
const stickerThickness = 0.005;
const hintStickerDistance = 4;
const labelDistance = 0.01;

interface StickerProps {
  face: Face;
  facelet: Facelet;
  oriented: boolean;
  label?: Face;
  showHintSticker?: boolean;
}

export default function Sticker({
  face,
  facelet,
  oriented,
  label,
  showHintSticker = true,
}: StickerProps) {
  return (
    <mesh rotation={stickerRotationMap[face]}>
      {/* sticker */}
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[stickerSize, stickerSize, stickerThickness]} />
        <meshBasicMaterial color={colorScheme[facelet]} />
      </mesh>
      {/* hint sticker */}
      {showHintSticker && (
        <mesh
          position={[0, 0, hintStickerDistance]}
          rotation={[0, halfTurn, 0]}
        >
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshBasicMaterial color={colorScheme[facelet]} />
        </mesh>
      )}
      {/* center label */}
      {label && (
        <mesh position={[0, 0, 0.5 + labelDistance]}>
          <Image url={labelMap[label]} transparent />
        </mesh>
      )}
      {!oriented && (
        <>
          {/* dot */}
          <mesh position={[0, 0, 0.5]} rotation={[0, 0, eighthTurn]}>
            <boxGeometry
              args={[
                misorientedDotSize,
                misorientedDotSize,
                2 * stickerThickness,
              ]}
            />
            <meshBasicMaterial color="#9b23eb" />
          </mesh>
          {/* hint dot */}
          {showHintSticker && (
            <mesh
              position={[0, 0, hintStickerDistance - stickerThickness]}
              rotation={[0, halfTurn, eighthTurn]}
            >
              <planeGeometry args={[misorientedDotSize, misorientedDotSize]} />
              <meshBasicMaterial color="#9b23eb" />
            </mesh>
          )}
        </>
      )}
    </mesh>
  );
}
