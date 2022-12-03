import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";
import type { Mask, Move, Piece } from "src/lib/cubeDefs"
import { SOLVED_INDEXED_FACELET_CUBE, SOLVED_FACELET_CUBE, applyMoves, getMaskedFaceletCube, getFaceletCubeEO } from 'src/lib/cube';
import Cubie, { CubieFacelets } from "./Cubie"

const checkerboard: Array<Move> = ["R2", "L2", "U2", "D2", "F2", "B2"]

interface CubieData {
  name: Piece
  position: [number, number, number]
  cubieFacelets: CubieFacelets
  oriented?: boolean
}

interface CubeProps {
  moves?: Array<Move>
  mask?: Mask
  showEO?: boolean
}

export default function Cube({ moves = [], mask, showEO }: CubeProps) {
  const solvedFaceletState = mask ? getMaskedFaceletCube(SOLVED_INDEXED_FACELET_CUBE, mask) : [...SOLVED_FACELET_CUBE]
  const facelets = applyMoves(solvedFaceletState, moves)
  const eo = showEO ? getFaceletCubeEO(facelets) : Array<boolean>(12).fill(true)
  const cubies: Array<CubieData> = [
    { name: "DBL",                   position: [-1, -1, -1], cubieFacelets: { D: facelets[51], B: facelets[44], L: facelets[33] } },
    { name: "DL",  oriented: eo[ 9], position: [-1, -1,  0], cubieFacelets: { D: facelets[48], L: facelets[34] } },
    { name: "DFL",                   position: [-1, -1,  1], cubieFacelets: { D: facelets[45], F: facelets[36], L: facelets[35] } },
    { name: "BL",  oriented: eo[ 4], position: [-1,  0, -1], cubieFacelets: { B: facelets[32], L: facelets[21] } },
    { name: "L",                     position: [-1,  0,  0], cubieFacelets: { L: facelets[22] } },
    { name: "FL",  oriented: eo[ 5], position: [-1,  0,  1], cubieFacelets: { F: facelets[24], L: facelets[23] } },
    { name: "UBL",                   position: [-1,  1, -1], cubieFacelets: { U: facelets[ 0], B: facelets[20], L: facelets[ 9] } },
    { name: "UL",  oriented: eo[ 1], position: [-1,  1,  0], cubieFacelets: { U: facelets[ 3], L: facelets[10] } },
    { name: "UFL",                   position: [-1,  1,  1], cubieFacelets: { U: facelets[ 6], F: facelets[12], L: facelets[11] } },
    { name: "DB",  oriented: eo[11], position: [ 0, -1, -1], cubieFacelets: { D: facelets[52], B: facelets[43] } },
    { name: "D",                     position: [ 0, -1,  0], cubieFacelets: { D: facelets[49] } },
    { name: "DF",  oriented: eo[ 8], position: [ 0, -1,  1], cubieFacelets: { D: facelets[46], F: facelets[37] } },
    { name: "B",                     position: [ 0,  0, -1], cubieFacelets: { B: facelets[31] } },
    { name: "F",                     position: [ 0,  0,  1], cubieFacelets: { F: facelets[25] } },
    { name: "UB",  oriented: eo[ 0], position: [ 0,  1, -1], cubieFacelets: { U: facelets[ 1], B: facelets[19] } },
    { name: "U",                     position: [ 0,  1,  0], cubieFacelets: { U: facelets[ 4] } },
    { name: "UF",  oriented: eo[ 3], position: [ 0,  1,  1], cubieFacelets: { U: facelets[ 7], F: facelets[13] } },
    { name: "DBR",                   position: [ 1, -1, -1], cubieFacelets: { D: facelets[53], B: facelets[42], R: facelets[41] } },
    { name: "DR",  oriented: eo[10], position: [ 1, -1,  0], cubieFacelets: { D: facelets[50], R: facelets[40] } },
    { name: "DFR",                   position: [ 1, -1,  1], cubieFacelets: { D: facelets[47], F: facelets[38], R: facelets[39] } },
    { name: "BR",  oriented: eo[ 7], position: [ 1,  0, -1], cubieFacelets: { B: facelets[30], R: facelets[29] } },
    { name: "R",                     position: [ 1,  0,  0], cubieFacelets: { R: facelets[28] } },
    { name: "FR",  oriented: eo[ 6], position: [ 1,  0,  1], cubieFacelets: { F: facelets[26], R: facelets[27] } },
    { name: "UBR",                   position: [ 1,  1, -1], cubieFacelets: { U: facelets[ 2], B: facelets[18], R: facelets[17] } },
    { name: "UR",  oriented: eo[ 2], position: [ 1,  1,  0], cubieFacelets: { U: facelets[ 5], R: facelets[16]} },
    { name: "UFR",                   position: [ 1,  1,  1], cubieFacelets: { U: facelets[ 8], F: facelets[14], R: facelets[15] } },
  ]

  return (
    <Canvas camera={{ zoom: 2, position: [10, 10, 10] }}>
      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 3 / 4}
        minDistance={10}
        maxDistance={24}
        enablePan={false}
        dampingFactor={0.3}
      />
      {cubies.map(({ name, oriented, position, cubieFacelets }) => {
        return <Cubie key={name} oriented={oriented} position={position} cubieFacelets={cubieFacelets} />
      })}
    </Canvas>
  )
}
