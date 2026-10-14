import { motion, useReducedMotion } from 'motion/react'
import styles from './Boton.module.css'

/**
 * Botón unificado para anclas internas y enlaces externos.
 * Motion aporta exclusivamente la realimentación de hover y tap.
 */
export default function Boton({
  variante = 'primario',
  icono: Icono,
  children,
  className = '',
  ...props
}) {
  const reducido = useReducedMotion()
  const clases = [styles.boton, styles[variante], className].filter(Boolean).join(' ')

  const interaccion = reducido
    ? {}
    : {
        whileHover: { y: -2 },
        whileTap: { y: 0, scale: 0.985 },
        transition: { duration: 0.18, ease: [0.22, 0.68, 0.28, 1] },
      }

  const contenido = (
    <>
      <span className={styles.texto}>{children}</span>
      {Icono ? <Icono size={16} strokeWidth={2} aria-hidden="true" className={styles.icono} /> : null}
    </>
  )

  if (props.href) {
    const { target, rel, ...anclas } = props
    return (
      <motion.a
        {...anclas}
        className={clases}
        {...interaccion}
        target={target}
        rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
      >
        {contenido}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" className={clases} {...props} {...interaccion}>
      {contenido}
    </motion.button>
  )
}