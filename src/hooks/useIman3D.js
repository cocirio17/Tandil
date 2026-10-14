import { useCallback, useEffect, useRef } from 'react'

/**
 * Iman y rotación 3D: el elemento sigue al puntero dentro de su propia caja.
 *
 * Se escribe `transform` directamente sobre el nodo (sin `setState`) para no
 * provocar renders por frame. En pantallas táctiles y con movimiento reducido
 * no se activa: allí el comportamiento queda en reposo.
 *
 * @param {object} opciones
 * @param {number} opciones.intensidad - Amplitud máxima de inclinación en grados.
 * @param {number} opciones.escala - Escala en el estado activo.
 */
export function useIman3D({ intensidad = 12, escala = 1.02 } = {}) {
  const nodo = useRef(null)
  const desactivado = useRef(false)

  useEffect(() => {
    desactivado.current =
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const reposo = useCallback(() => {
    if (!nodo.current || desactivado.current) return
    nodo.current.style.transition = 'transform 520ms cubic-bezier(0.22,0.68,0.28,1)'
    nodo.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  const alMover = useCallback(
    (evento) => {
      if (!nodo.current || desactivado.current) return
      const caja = nodo.current.getBoundingClientRect()
      // Posición del puntero normalizada en el rango [-1, 1]
      const x = ((evento.clientX - caja.left) / caja.width) * 2 - 1
      const y = ((evento.clientY - caja.top) / caja.height) * 2 - 1

      nodo.current.style.transition = 'transform 90ms linear'
      nodo.current.style.transform = `perspective(900px) rotateX(${(-y * intensidad).toFixed(2)}deg) rotateY(${(x * intensidad).toFixed(2)}deg) scale(${escala})`
    },
    [intensidad, escala],
  )

  return { nodo, alMover, reposo }
}