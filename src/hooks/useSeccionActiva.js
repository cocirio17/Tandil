import { useEffect, useState } from 'react'

/**
 * Marca la sección visible del documento para la navegación del encabezado.
 * Usa IntersectionObserver en lugar de listeners de scroll: sin trabajo por frame.
 */
export function useSeccionActiva(ids) {
  // Arranca en `null`: en el hero todavía no hay ninguna sección activa.
  const [activa, setActiva] = useState(null)

  useEffect(() => {
    const secciones = ids
      .map((id) => document.getElementById(id))
      .filter((elemento) => elemento !== null)

    if (secciones.length === 0) return undefined

    const visibles = new Map()
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visibles.set(entrada.target.id, entrada.intersectionRatio)
          else visibles.delete(entrada.target.id)
        }
        if (visibles.size === 0) return
        // Con varias secciones en pantalla manda la que ocupa más viewport.
        const [id] = [...visibles.entries()].sort((a, b) => b[1] - a[1])[0]
        setActiva(id)
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.15, 0.4, 0.75, 1],
      },
    )

    secciones.forEach((seccion) => observador.observe(seccion))
    return () => observador.disconnect()
  }, [ids])

  return activa
}