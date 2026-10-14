import { useEffect, useState } from 'react'

/** Indica si la persona pidió menos movimiento en el sistema operativo. */
export function useMovimientoReducido() {
  const [reducido, setReducido] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const alCambiar = (evento) => setReducido(evento.matches)
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  return reducido
}