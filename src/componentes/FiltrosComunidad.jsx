import { motion } from 'motion/react'
import { CATEGORIAS, FILTRO_TODAS } from '../datos/comunidad'
import styles from './FiltrosComunidad.module.css'

/** Pestañas de filtro por temática, con el indicador animado por Motion. */
export default function FiltrosComunidad({ filtro, onFiltrar, totales }) {
  const pestanas = [
    { id: FILTRO_TODAS, etiqueta: 'Todo', total: totales.todas ?? 0 },
    ...CATEGORIAS.map((categoria) => ({
      id: categoria.id,
      etiqueta: categoria.etiqueta,
      total: totales[categoria.id] ?? 0,
    })),
  ]

  return (
    <div className={styles.filtros} role="tablist" aria-label="Filtrar el muro por temática">
      {pestanas.map((pestana) => {
        const activa = filtro === pestana.id
        return (
          <button
            key={pestana.id}
            type="button"
            role="tab"
            aria-selected={activa}
            className={`${styles.pestana} ${activa ? styles.pestanaActiva : ''}`}
            onClick={() => onFiltrar(pestana.id)}
          >
            {activa && (
              <motion.span
                layoutId="filtro-comunidad"
                className={styles.fondoActivo}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className={styles.texto}>{pestana.etiqueta}</span>
            <span className={styles.total}>{pestana.total}</span>
          </button>
        )
      })}
    </div>
  )
}