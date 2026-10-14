import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMovimientoReducido } from '../hooks/useMovimientoReducido'
import styles from './ParallaxFondo.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Parallax multicapa para fondos de sección.
 * Cada capa se mueve a diferente velocidad según `velocidad` (0.1 - 1).
 * Negativo = se mueve en dirección opuesta al scroll (efecto profundidad).
 */
export default function ParallaxFondo({
  capas = [],
  trigger,
  start = 'top bottom',
  end = 'bottom top',
  scrub = 0.8,
  className = '',
}) {  const reducido = useMovimientoReducido()
  const contenedorRef = useRef(null)
  const capasRef = useRef([])

  useLayoutEffect(() => {
    if (reducido || capas.length === 0) return undefined

    const ctx = gsap.context(() => {
      capas.forEach((capa, i) => {
        const el = capasRef.current[i]
        if (!el) return

        const velocidad = capa.velocidad ?? 0.3
        const direccion = capa.invertida ? -1 : 1

        gsap.to(el, {
          yPercent: 100 * velocidad * direccion,
          ease: 'none',
          scrollTrigger: {
            trigger: trigger || contenedorRef.current,
            start,
            end,
            scrub,
          },
        })
      })
    }, contenedorRef)

    return () => ctx.revert()
  }, [capas, reducido, trigger, start, end, scrub])

  return (
    <div ref={contenedorRef} className={`${styles.parallax} ${className}`} aria-hidden="true">
      {capas.map((capa, i) => (
        <div
          key={capa.id || i}
          ref={(el) => { capasRef.current[i] = el }}
          className={`${styles.capa} ${capa.className || ''}`}
          style={{
            backgroundImage: capa.imagen ? `url(${capa.imagen})` : undefined,
            backgroundColor: capa.color,
            backgroundSize: capa.tamano || 'cover',
            backgroundPosition: capa.posicion || 'center',
            backgroundRepeat: capa.repetir ? 'repeat' : 'no-repeat',
            opacity: capa.opacidad ?? 1,
            transform: capa.transformInicial || 'none',
          }}
        />
      ))}
    </div>
  )
}
