import { motion, useReducedMotion } from 'motion/react'
import { Palette } from 'lucide-react'
import styles from './SelectorTema.module.css'

const OPCIONES = [
  { id: 'cyber', nombre: 'Cyber Obsidian', color: '#00ff9d' },
  { id: 'sunset', nombre: 'Sunset Tech', color: '#ff0055' },
  { id: 'matrix', nombre: 'Deep Matrix', color: '#39ff14' },
]

export default function SelectorTema({ tema, temas, onChange }) {
  const reducido = useReducedMotion()

  return (
    <div className={styles.selector} role="group" aria-label="Tema de color">
      <span className={styles.icono} aria-hidden="true">
        <Palette size={15} strokeWidth={1.8} />
      </span>
      {OPCIONES.filter((opcion) => temas.includes(opcion.id)).map((opcion) => {
        const seleccionado = tema === opcion.id
        return (
          <motion.button
            key={opcion.id}
            type="button"
            className={`${styles.opcion} ${seleccionado ? styles.seleccionado : ''}`}
            style={{ '--color-tema': opcion.color }}
            aria-label={`Tema ${opcion.nombre}`}
            aria-pressed={seleccionado}
            title={opcion.nombre}
            onClick={() => onChange(opcion.id)}
            whileTap={reducido ? undefined : { scale: 0.86 }}
          >
            {seleccionado && (
              <motion.span
                className={styles.indicador}
                layoutId="tema-seleccionado"
                transition={reducido ? { duration: 0.01 } : { type: 'spring', stiffness: 420, damping: 30 }}
              />
            )}
            <span className={styles.punto} />
            <span className="rotulo-visual">{opcion.nombre}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
