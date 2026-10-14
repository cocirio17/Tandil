import { EVENTO } from '../datos/evento'
import styles from './Marca.module.css'

/** Marca tipográfica del evento. El isotipo oficial se usa como favicon. */
export default function Marca({ compacta = false }) {
  return (
    <span className={styles.marca}>
      <span className={styles.nombre}>
        Tandil <span className={styles.tech}>Tech</span> Week
      </span>
      {!compacta && <span className={styles.edicion}>{EVENTO.edicion}</span>}
    </span>
  )
}