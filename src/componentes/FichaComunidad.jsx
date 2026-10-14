import { useIman3D } from '../hooks/useIman3D'
import styles from './FichaComunidad.module.css'

/**
 * Ficha del muro de comunidad.
 *
 * `origen` distingue una ficha oficial del evento de un aporte propio, que
 * además puede borrarse. Sin nombres inventados en ningún caso.
 */
export default function FichaComunidad({ ficha, categoria, indice, onQuitar }) {
  const { nodo, alMover, reposo } = useIman3D({ intensidad: 6, escala: 1.01 })

  const etiquetas = [
    categoria?.etiqueta,
    ...(ficha.etiquetas ?? []),
    ficha.origen === 'propia' ? 'Tu aporte' : 'Oficial',
  ].filter(Boolean)

  return (
    <article
      ref={nodo}
      className={`${styles.ficha} ${styles[categoria?.jornada ?? 'general'] ?? ''} ${
        ficha.origen === 'propia' ? styles.propia : ''
      }`}
      data-cinetica=""
      data-categoria={ficha.categoria}
      data-aos="fade-up"
      data-aos-delay={Math.min(indice, 5) * 60}
      onMouseMove={alMover}
      onMouseLeave={reposo}
    >
      <h3 className={styles.titulo}>{ficha.titulo}</h3>
      <p className={styles.texto}>{ficha.texto}</p>

      {ficha.autorrespuesta && (
        <p className={styles.respuesta}>
          <span className={styles.respuestaEtiqueta}>Respuesta</span>
          {ficha.autorrespuesta}
        </p>
      )}

      <ul className={styles.etiquetas}>
        {etiquetas.map((etiqueta) => (
          <li key={etiqueta}>{etiqueta}</li>
        ))}
      </ul>

      {ficha.origen === 'propia' && (
        <div className={styles.pie}>
          <span className={styles.fecha}>
            {new Date(ficha.creado).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <button type="button" className={styles.quitar} onClick={() => onQuitar(ficha.id)}>
            Borrar
            <span className="rotulo-visual"> este aporte</span>
          </button>
        </div>
      )}
    </article>
  )
}