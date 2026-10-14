import styles from './CuentaRegresiva.module.css'

/**
 * Cuenta regresiva hasta la próxima jornada.
 * Solo se monta cuando queda tiempo positivo; nunca muestra valores negativos.
 */
export default function CuentaRegresiva({ tiempo, jornada }) {
  if (!tiempo) return null

  const unidades = [
    { valor: tiempo.dias, etiqueta: 'días' },
    { valor: tiempo.horas, etiqueta: 'horas' },
    { valor: tiempo.minutos, etiqueta: 'min' },
    { valor: tiempo.segundos, etiqueta: 'seg' },
  ]

  return (
    <div className={styles.contador}>
      <p className={styles.contadorTitulo}>Empieza {jornada.nombre}</p>
      <ul className={styles.contadorCeldas}>
        {unidades.map((unidad) => (
          <li key={unidad.etiqueta} className={styles.celda}>
            <span className={styles.celdaValor}>{String(unidad.valor).padStart(2, '0')}</span>
            <span className={styles.celdaUnidad}>{unidad.etiqueta}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}