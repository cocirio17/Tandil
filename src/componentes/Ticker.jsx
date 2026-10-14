import { PALABRAS_CLAVE } from '../datos/evento'
import styles from './Ticker.module.css'

/** Tira rotativa de palabras clave del evento. Decorativa y sin animación con movimiento reducido. */
export default function Ticker() {
  const palabras = [...PALABRAS_CLAVE, ...PALABRAS_CLAVE]

  return (
    <div className={styles.tira} aria-hidden="true">
      <div className={styles.pista}>
        {palabras.map((palabra, indice) => (
          <span key={`${palabra}-${indice}`} className={styles.item}>
            {palabra}
            <span className={styles.separador} />
          </span>
        ))}
      </div>
    </div>
  )
}