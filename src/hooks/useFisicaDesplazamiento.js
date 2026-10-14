import { useCallback, useEffect, useRef } from 'react'

/**
 * Física suave de lanzamiento con GSAP.
 *
 * Cada objetivo recibe una dirección hacia el borde más cercano, una velocidad
 * y un giro; sale de pantalla y luego vuelve a su sitio con un elástico. Un
 * único tween por nodo, cerrados al desmontar el componente.
 *
 * @param {() => HTMLElement[]} obtenerNodos - Devuelve los nodos a lanzar.
 */
export function useFisicaDesplazamiento(obtenerNodos) {
  const tweens = useRef([])
  const reducido = useRef(false)

  useEffect(() => {
    reducido.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const disparar = useCallback(() => {
    if (reducido.current) return
    const nodos = obtenerNodos?.() ?? []

    nodos.forEach((nodo) => {
      gsap.killTweensOf(nodo)
      const ancho = window.innerWidth
      const alto = window.innerHeight
      const caja = nodo.getBoundingClientRect()

      // El objeto se escapa por el borde más cercano.
      const haciaDerecha = caja.left + caja.width / 2 > ancho / 2
      const haciaAbajo = caja.top + caja.height / 2 > alto / 2

      const tween = gsap.to(nodo, {
        x: (haciaDerecha ? 1 : -1) * (ancho * 0.6 + Math.random() * ancho * 0.3),
        y: (haciaAbajo ? 1 : -1) * (alto * 0.6 + Math.random() * alto * 0.3),
        rotation: (haciaDerecha ? 1 : -1) * (160 + Math.random() * 200),
        duration: 1 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(nodo, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.6,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.2,
          })
        },
      })
      tweens.current.push(tween)
    })
  }, [obtenerNodos])

  useEffect(
    () => () => {
      tweens.current.forEach((tween) => tween.kill())
      tweens.current = []
    },
    [],
  )

  return disparar
}