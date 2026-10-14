/**
 * Recetas de capas para el parallax multicapa.
 *
 * Viven fuera del componente para mantener `ParallaxFondo` como módulo de un
 * solo propósito (fast refresh) y poder reutilizarlas en varias secciones.
 * Cada capa declara su `velocidad` (0 - 1): el factor multiplicador del
 * desplazamiento de scroll. Valor negativo = movimiento opuesto.
 */

/** Hero: estrellas, nebulosas de acento y partículas de colores del evento. */
export function crearCapasHero() {
  return [
    { id: 'estrellas', velocidad: 0.05, className: 'estrellas' },
    { id: 'nebulosa-1', velocidad: 0.15, color: 'rgba(236,72,153,0.08)', className: 'nebulosa nebulosa-1' },
    { id: 'nebulosa-2', velocidad: 0.25, color: 'rgba(168,85,247,0.06)', className: 'nebulosa nebulosa-2' },
    { id: 'particulas', velocidad: 0.4, className: 'particulas' },
  ]
}

/** Secciones de contenido: malla vectorial con brillo de acento. */
export function crearCapasSeccion(colorAcento = '#EC4899') {
  return [
    { id: 'malla', velocidad: 0.05, color: 'transparent', opacidad: 0.4, className: 'grid-pattern' },
    {
      id: 'brillo-acento',
      velocidad: 0.12,
      color: `color-mix(in srgb, ${colorAcento} 8%, transparent)`,
    },
  ]
}

/** Tech Hub Wall: coordenadas (estrellas) y partículas sobre la malla. */
export function crearCapasMuro() {
  return [
    { id: 'malla', velocidad: 0.06, color: 'transparent', opacidad: 0.55, className: 'grid-pattern' },
    { id: 'coordenadas', velocidad: 0.16, color: 'transparent', className: 'estrellas' },
    { id: 'particulas', velocidad: 0.34, color: 'transparent', className: 'particulas' },
  ]
}
