import { RoundedBox } from "@react-three/drei";
import { FACES } from "src/lib/cubeDefs"
import type { Face, Facelet } from "src/lib/cubeDefs"
import Sticker from "./Sticker"

export type CubieFacelets = { [f in Face]?: Facelet }

interface CubieProps {
  cubieFacelets: CubieFacelets
  oriented?: boolean
}

export default function Cubie(props: JSX.IntrinsicElements['mesh'] & CubieProps) {
  // const ref = useRef<THREE.Mesh>(null!)
  const { oriented = true } = props
  return (
    <mesh
      {...props}
      // ref={ref}
    >
      {/* Base cubie */}
      <RoundedBox>
        <meshBasicMaterial color={oriented ? "black" : "purple"} />
      </RoundedBox>
      {/* All the stickers */}
      {FACES.flatMap(face => {
        const facelet = props.cubieFacelets[face]
        if (facelet) {
          return <Sticker key={face} oriented={oriented} face={face} facelet={facelet} />
        }
        return []
      })}
    </mesh>
  )
}