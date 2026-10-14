import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import Boton from './Boton'
import { useIman3D } from '../hooks/useIman3D'
import styles from './TarjetaJornada.module.css'

/** Ornamento visual propio de cada jornada. Puramente decorativo. */
function Ornamento({ acento }) {
  if (acento === 'hacking') {
    return (
      <svg className={styles.ornamento} viewBox="0 0 300 220" fill="none" aria-hidden="true" focusable="false">
        <g stroke="currentColor" strokeWidth="1" opacity="0.55">
          <path d="M20 40h80M20 60h140M20 80h110" strokeDasharray="2 6" />
          <path d="M200 30v70h60" />
          <path d="M40 150h60l20-30 30 60 25-40h85" />
          <circle cx="120" cy="120" r="3" />
          <circle cx="175" cy="180" r="3" />
          <circle cx="260" cy="140" r="3" />
        </g>
      </svg>
    )
  }

  return (
    <svg className={styles.ornamento} viewBox="0 0 300 220" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1" opacity="0.55">
        <circle cx="60" cy="160" r="22" />
        <circle cx="150" cy="80" r="32" />
        <circle cx="245" cy="150" r="18" />
        <path d="M60 160 150 80l95 70" />
        <path d="M150 32v-18M150 164v18M82 60 68 46M226 60l14-14" strokeDasharray="2 6" />
        <path d="M198 176h82M198 190h56" strokeDasharray="2 6" />
      </g>
    </svg>
  )
}

export default function TarjetaJornada({ jornada, activa, destaque, inscripcionAbierta }) {
  const reducido = useReducedMotion()
  const { nodo, alMover, reposo } = useIman3D({ intensidad: 9, escala: 1.015 })

  const clasesTarjeta = [styles.tarjeta, styles[jornada.acento], activa ? styles.activa : '']
    .filter(Boolean)
    .join(' ')

  return (
    <motion.article
      id={jornada.id}
      ref={nodo}
      className={clasesTarjeta}
      aria-labelledby={`titulo-${jornada.id}`}
      data-cinetica=""
      onMouseMove={alMover}
      onMouseLeave={reposo}
      initial={reducido ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.ornamentoCapa}>
        <Ornamento acento={jornada.acento} />
      </div>

      <header className={styles.encabezado}>
        <p className={styles.fecha}>
          <time dateTime={jornada.fecha}>{jornada.etiquetaFecha}</time>
          <span className={styles.fechaBarra} aria-hidden="true" />
          <span className={styles.diaSemana}>{jornada.diaSemana}</span>
        </p>
        {activa && (
          <p className={styles.insignia}>
            <span className={styles.insigniaPunto} aria-hidden="true" />
            En curso
          </p>
        )}
      </header>

      <p className={styles.track}>{jornada.trackTexto}</p>

      <h3 id={`titulo-${jornada.id}`} className={styles.titulo}>
        {jornada.nombre}
      </h3>

      <p className={styles.categoria}>{jornada.categoria}</p>
      <p className={styles.descripcion}>{jornada.descripcion}</p>

      <dl className={styles.datos}>
        <div>
          <dt>Sede</dt>
          <dd>
            <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
            {jornada.sede.nombre}
          </dd>
        </div>
        <div>
          <dt>Horario</dt>
          <dd>{jornada.horario}</dd>
        </div>
      </dl>

      <div className={styles.pie}>
        <div className={styles.acciones}>
          <Boton variante="acento" href={jornada.sitioOficial} target="_blank" icono={ArrowUpRight}>
            Conocer {jornada.nombre}
          </Boton>
          {inscripcionAbierta && (
            <Boton variante="secundario" href={jornada.inscripcion} target="_blank">
              Inscribirme
            </Boton>
          )}
        </div>
        {destaque && <span className={styles.nota}>{jornada.sedeNota}</span>}
      </div>
    </motion.article>
  )
}