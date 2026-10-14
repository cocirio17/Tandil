import styles from './SkipLink.module.css'

/** Acceso directo al contenido para navegación por teclado. */
export default function SkipLink() {
  return (
    <a href="#contenido" className={styles.salto}>
      Saltar al contenido principal
    </a>
  )
}