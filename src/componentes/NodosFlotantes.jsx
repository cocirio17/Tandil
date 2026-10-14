import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './NodosFlotantes.module.css'

/**
 * Nodos decorativos flotantes.
 *
 * GSAP los mantiene con una deriva leve y continua, usando solo transform y
 * opacidad para que no dispare reflow. El lanzamiento fuera de pantalla se
 * dispara desde el hero mediante `useFisicaDesplazamiento`.
 */
const NODOS = [
  { x: 7, y: 20, t: 3.4 },
  { x: 21, y: 63, t: 4.2 },
  { x: 39, y: 31, t: 5.0 },
  { x: 57, y: 74, t: 3.8 },
  { x: 72, y: 23, t: 6.0 },
  { x: 85, y: 56, t: 4.4 },
  { x: 33, y: 85, t: 5.2 },
  { x: 65, y: 41, t: 3.6 },
]

function NodosFlotantes() {
  const contenedor = useRef(null)
  const nodos = useRef([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const contexto = gsap.context(() => {
      nodos.current.forEach((nodo, indice) => {
        if (!nodo) return
        gsap.to(nodo, {
          y: `+=${16 + (indice % 3) * 10}`,
          x: `+=${14 - (indice % 4) * 8}`,
          duration: 3.4 + (indice % 4) * 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: (indice % 5) * 0.35,
        })
      })
    }, contenedor)

    return () => {
      contexto.revert()
      nodos.current = []
    }
  }, [])

  return (
    <div className={styles.contenedor} ref={contenedor} data-cinetica="" aria-hidden="true">
      {NODOS.map((nodo, indice) => (
        <span
          key={indice}
          ref={(elemento) => {
            nodos.current[indice] = elemento
          }}
          className={styles.nodo}
          style={{ left: `${nodo.x}%`, top: `${nodo.y}%` }}
          data-cinetica=""
        />
      ))}
    </div>
  )
}

export default NodosFlotantes