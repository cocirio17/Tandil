import { useCallback } from 'react'

/**
 * Animaciones de física con la Web Animations API nativa.
 *
 * `volarFuera` lanza un elemento fuera de pantalla con giro aleatorio y lo
 * desvanece; `reboteEntrada` lo hace aparecer con un rebote elástico. Ambas
 * devuelven una promesa para encadenarlas con cambios de estado.
 */
export function useAnimacionFisica() {
  const reducido =
    typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const volarFuera = useCallback((elemento, direccion = 'random') => {
    if (reducido || !elemento) return Promise.resolve()

    const angulo = direccion === 'random' ? Math.random() * Math.PI * 2
      : direccion === 'left' ? Math.PI
      : direccion === 'right' ? 0
      : direccion === 'up' ? -Math.PI / 2
      : Math.PI / 2

    const distancia = 500 + Math.random() * 300
    const rotacion = (Math.random() - 0.5) * 720

    return new Promise((resolver) => {
      const animacion = elemento.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1, offset: 0 },
          {
            transform: `translate(${Math.cos(angulo) * distancia}px, ${Math.sin(angulo) * distancia}px) rotate(${rotacion}deg)`,
            opacity: 0,
            offset: 1,
          },
        ],
        {
          duration: 600 + Math.random() * 400,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
          fill: 'forwards',
        },
      )
      animacion.onfinish = resolver
    })
  }, [reducido])

  const reboteEntrada = useCallback((elemento, retraso = 0) => {
    if (reducido || !elemento) return Promise.resolve()

    return new Promise((resolver) => {
      elemento.style.opacity = '0'
      elemento.style.transform = 'scale(0.3)'

      requestAnimationFrame(() => {
        const animacion = elemento.animate(
          [
            { opacity: 0, transform: 'scale(0.3)', offset: 0 },
            { opacity: 1, transform: 'scale(1.1)', offset: 0.6 },
            { opacity: 1, transform: 'scale(0.95)', offset: 0.8 },
            { opacity: 1, transform: 'scale(1)', offset: 1 },
          ],
          {
            duration: 500,
            delay: retraso,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards',
          },
        )
        animacion.onfinish = resolver
      })
    })
  }, [reducido])

  return { volarFuera, reboteEntrada }
}
