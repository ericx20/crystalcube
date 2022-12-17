import { RoundedBox } from "@react-three/drei";
import { FACES } from "src/lib/constants"
import type { Face, Facelet } from "src/lib/types"
import Sticker from "./Sticker"

export type CubieFacelets = { [f in Face]?: Facelet }

interface CubieProps {
  cubieFacelets: CubieFacelets
  oriented?: boolean
  label?: Face
}

export default function Cubie(props: JSX.IntrinsicElements['mesh'] & CubieProps) {
  // const ref = useRef<THREE.Mesh>(null!)
  const { oriented = true, label: faceToLabel } = props
  return (
    <mesh
      {...props}
      // ref={ref}
    >
      {/* Base cubie */}
      <RoundedBox>
        <meshBasicMaterial color={oriented ? "black" : "#8104d4"} />
      </RoundedBox>
      {/* All the stickers */}
      {FACES.flatMap(face => {
        const facelet = props.cubieFacelets[face]
        const label = face === faceToLabel ? faceToLabel : undefined
        if (facelet) {
          return <Sticker key={face} oriented={oriented} label={label} face={face} facelet={facelet} />
        }
        return []
      })}
    </mesh>
  )
}