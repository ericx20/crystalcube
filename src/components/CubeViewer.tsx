import * as React from "react"
import { TwistyPlayer } from "cubing/twisty"
import { Alg } from "cubing/alg"

interface CubeViewerProps {
    alg: string | Alg
    mode: "2D" | "3D"
}

export const CubeViewer = ({ alg, mode }: CubeViewerProps) => {
    const player = new TwistyPlayer({
        puzzle: "3x3x3",
        alg,
        visualization: mode,
        background: "none",
        controlPanel: "none",
      })

    React.useEffect(() => {
        document.getElementById("player")?.appendChild(player)
        return () => { document.getElementById("player")?.removeChild(player) }
    }, [alg])

    return <div id="player" />
}