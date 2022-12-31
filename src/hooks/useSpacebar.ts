import { useCallback, useEffect } from "react"

export default function useSpacebar(callback: () => any) {
  const keyDownHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault()
      callback()
    }
  }, [callback])

  useEffect(() => {
    window.addEventListener("keyup", keyDownHandler)
    return () => {
      window.removeEventListener("keyup", keyDownHandler)
    }
  }, [callback, keyDownHandler])
}
