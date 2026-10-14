import { useEffect } from 'react'
import AOS from 'aos'

/**
 * AOS se inicializa una sola vez por aplicación. El flag de módulo evita que el doble
 * montaje de React en modo estricto registre dos veces los listeners.
 */
let inicializado = false

/**
 * Revelado progresivo de secciones al entrar en el viewport.
 *
 * AOS marca `<body>` con `data-aos-easing` cuando se inicializa correctamente. Esa
 * señal cancela la salvaguarda global de `index.html`, que está pensada para el caso
 * en que AOS ni siquiera llega a arrancar (fallo de red, error previo, etc.) y dejaría
 * todo el contenido oculto de forma permanente.
 */
export function useAos() {
  useEffect(() => {
    if (inicializado) return undefined
    inicializado = true

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70,
      disable: () => reducido,
    })
    AOS.refreshHard()

    if (document.body.hasAttribute('data-aos-easing')) {
      window.clearTimeout(window.__aosRescate)
    }

    return undefined
  }, [])
}
