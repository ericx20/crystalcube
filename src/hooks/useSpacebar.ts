import { useCallback, useEffect, useState } from "react"

export default function useSpacebar(callback: () => any) {
  const [enabled, setEnabled] = useState(true)

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault()
      if (enabled) {
        callback()
        setEnabled(false)
      }
    }
  }, [enabled, callback])

  const onKeyUp = useCallback(() => setEnabled(true), [])

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [callback])
}
