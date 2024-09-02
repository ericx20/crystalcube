import { NoToneMapping } from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cubie, { CubieFacelets } from "./Cubie";
import { Cube3x3, Face } from "src/lib/puzzles/cube3x3";

interface CubieData {
  name: string;
  position: [number, number, number];
  cubieFacelets: CubieFacelets;
  oriented?: boolean;
  label?: Face;
}

interface CubeProps {
  cube: Cube3x3;
  showEO?: boolean;
  disableControls?: boolean;
  cameraPosition?: [number, number, number];
  showHintStickers?: boolean;
}

const SOLVED_EO = Array<boolean>(12).fill(true);

export default function Cube({
  cube,
  showEO,
  disableControls = false,
  cameraPosition = [8, 8, 8],
  showHintStickers = true,
}: CubeProps) {
  const eo = showEO ? cube.EO : SOLVED_EO;
  const facelets = cube.stateData;
  // prettier-ignore
  const cubies: Array<CubieData> = [
    { name: "DBL",                   position: [-1, -1, -1], cubieFacelets: { D: facelets[51], B: facelets[44], L: facelets[33] } },
    { name: "DL",  oriented: eo[ 9], position: [-1, -1,  0], cubieFacelets: { D: facelets[48], L: facelets[34] } },
    { name: "DFL",                   position: [-1, -1,  1], cubieFacelets: { D: facelets[45], F: facelets[36], L: facelets[35] } },
    { name: "BL",  oriented: eo[ 4], position: [-1,  0, -1], cubieFacelets: { B: facelets[32], L: facelets[21] } },
    { name: "L",   label: "L",       position: [-1,  0,  0], cubieFacelets: { L: facelets[22] } },
    { name: "FL",  oriented: eo[ 5], position: [-1,  0,  1], cubieFacelets: { F: facelets[24], L: facelets[23] } },
    { name: "UBL",                   position: [-1,  1, -1], cubieFacelets: { U: facelets[ 0], B: facelets[20], L: facelets[ 9] } },
    { name: "UL",  oriented: eo[ 1], position: [-1,  1,  0], cubieFacelets: { U: facelets[ 3], L: facelets[10] } },
    { name: "UFL",                   position: [-1,  1,  1], cubieFacelets: { U: facelets[ 6], F: facelets[12], L: facelets[11] } },
    { name: "DB",  oriented: eo[11], position: [ 0, -1, -1], cubieFacelets: { D: facelets[52], B: facelets[43] } },
    { name: "D",   label: "D",       position: [ 0, -1,  0], cubieFacelets: { D: facelets[49] } },
    { name: "DF",  oriented: eo[ 8], position: [ 0, -1,  1], cubieFacelets: { D: facelets[46], F: facelets[37] } },
    { name: "B",   label: "B",       position: [ 0,  0, -1], cubieFacelets: { B: facelets[31] } },
    { name: "F",   label: "F",       position: [ 0,  0,  1], cubieFacelets: { F: facelets[25] } },
    { name: "UB",  oriented: eo[ 0], position: [ 0,  1, -1], cubieFacelets: { U: facelets[ 1], B: facelets[19] } },
    { name: "U",   label: "U",       position: [ 0,  1,  0], cubieFacelets: { U: facelets[ 4] } },
    { name: "UF",  oriented: eo[ 3], position: [ 0,  1,  1], cubieFacelets: { U: facelets[ 7], F: facelets[13] } },
    { name: "DBR",                   position: [ 1, -1, -1], cubieFacelets: { D: facelets[53], B: facelets[42], R: facelets[41] } },
    { name: "DR",  oriented: eo[10], position: [ 1, -1,  0], cubieFacelets: { D: facelets[50], R: facelets[40] } },
    { name: "DFR",                   position: [ 1, -1,  1], cubieFacelets: { D: facelets[47], F: facelets[38], R: facelets[39] } },
    { name: "BR",  oriented: eo[ 7], position: [ 1,  0, -1], cubieFacelets: { B: facelets[30], R: facelets[29] } },
    { name: "R",   label: "R",       position: [ 1,  0,  0], cubieFacelets: { R: facelets[28] } },
    { name: "FR",  oriented: eo[ 6], position: [ 1,  0,  1], cubieFacelets: { F: facelets[26], R: facelets[27] } },
    { name: "UBR",                   position: [ 1,  1, -1], cubieFacelets: { U: facelets[ 2], B: facelets[18], R: facelets[17] } },
    { name: "UR",  oriented: eo[ 2], position: [ 1,  1,  0], cubieFacelets: { U: facelets[ 5], R: facelets[16]} },
    { name: "UFR",                   position: [ 1,  1,  1], cubieFacelets: { U: facelets[ 8], F: facelets[14], R: facelets[15] } },
  ]

  return (
    <Canvas
      camera={{ zoom: 2, position: cameraPosition }}
      gl={{ antialias: true, toneMapping: NoToneMapping, pixelRatio: 2 }}
    >
      <OrbitControls
        enabled={!disableControls}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
        minDistance={10}
        maxDistance={24}
        enablePan={false}
        dampingFactor={0.3}
      />
      {cubies.map(({ name, oriented, label, position, cubieFacelets }) => (
        <Cubie
          key={name}
          oriented={oriented}
          label={label}
          position={position}
          cubieFacelets={cubieFacelets}
          showHintStickers={showHintStickers}
        />
      ))}
    </Canvas>
  );
}
