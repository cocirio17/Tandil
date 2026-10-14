/**
 * View Transitions API (same-document).
 *
 * Envuelve un cambio de estado de la interfaz (abrir el panel de novedades,
 * cambiar de pestaña del muro) en `document.startViewTransition`, de modo que
 * el navegador anime el antes y el después sin recargas ni cortes abruptos.
 *
 * Si el navegador no la soporta, o si la persona pidió movimiento reducido, el
 * cambio se aplica directamente: la funcionalidad nunca depende de la API.
 */

const ID_ESTILO = 'transicion-vista-base'

/** Inyecta una sola vez la duración y la curva del crossfade de raíz. */
function asegurarEstilos() {
  if (document.getElementById(ID_ESTILO)) return

  const estilo = document.createElement('style')
  estilo.id = ID_ESTILO
  estilo.textContent = `
    ::view-transition-old(raiz),
    ::view-transition-new(raiz) {
      animation-duration: 320ms;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }
  `
  document.head.appendChild(estilo)
}

/**
 * Ejecuta `actualizar` dentro de una transición de vista cuando es posible.
 * @param {() => void} actualizar - Cambio de estado (síncrono o que retorna promesa).
 */
export function conTransicionVista(actualizar) {
  if (typeof document === 'undefined') {
    actualizar()
    return
  }

  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducido || !('startViewTransition' in document)) {
    actualizar()
    return
  }

  asegurarEstilos()
  document.startViewTransition(actualizar)
}
