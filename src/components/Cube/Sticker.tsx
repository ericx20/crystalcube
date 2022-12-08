import * as THREE from 'three'
import type { Face, Facelet } from "src/lib/types"

const colorScheme: { [name in Facelet]: string } = {
  R: "red",
  L: "orange",
  U: "white",
  D: "yellow",
  F: "green",
  B: "blue",
  O: "grey", // display oriented facelet same as masked facelet
  X: "grey",
}

const quarterTurn = Math.PI / 2
const halfTurn = Math.PI

// let U sticker be the "default" sticker position
// other stickers are rotated versions of the U sticker
const stickerRotationMap: { [name in Face]: THREE.Euler } = {
  R: new THREE.Euler( 0, 0, -quarterTurn),
  L: new THREE.Euler( 0, 0, quarterTurn),
  U: new THREE.Euler( 0, 0, 0),
  D: new THREE.Euler(halfTurn, 0, 0),
  F: new THREE.Euler(quarterTurn, 0, 0),
  B: new THREE.Euler(-quarterTurn, 0, 0),
}

const stickerSize = 0.85
const misorientedDotSize = 0.2
const stickerThickness = 0.005
const hintStickerDistance = 4

interface StickerProps {
  face: Face,
  facelet: Facelet,
  oriented: boolean
}

export default function Sticker({ face, facelet, oriented }: StickerProps) {
  return (
    <mesh
      rotation={stickerRotationMap[face]}
    >
      {/* Sticker */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[stickerSize, stickerThickness, stickerSize]} />
        <meshBasicMaterial color={colorScheme[facelet]} toneMapped={false} />
      </mesh>
      {/* Hint sticker */}
      <mesh position={[0, hintStickerDistance, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[stickerSize, stickerSize]} />
        <meshBasicMaterial color={colorScheme[facelet]} toneMapped={false} />
      </mesh>
      {/* "Misoriented edge" indicator dot */}
      {!oriented && (
        <>
          {/* Dot */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[misorientedDotSize, 2*stickerThickness, misorientedDotSize]} />
            <meshBasicMaterial color="purple" toneMapped={false} />
          </mesh>
          {/* Hint dot */}
          <mesh position={[0, hintStickerDistance - stickerThickness, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[misorientedDotSize, misorientedDotSize]} />
            <meshBasicMaterial color="purple" toneMapped={false} />
          </mesh>
        </>
      )}
    </mesh>
  )
}