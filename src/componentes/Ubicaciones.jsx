import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import Boton from './Boton'
import { JORNADAS } from '../datos/evento'
import { direccionCompleta, enlaceMapa } from '../utils/mapa'
import styles from './Ubicaciones.module.css'

export default function Ubicaciones({ estadoEvento }) {
  const reducido = useReducedMotion()

  return (
    <section
      id="ubicaciones"
      className={`seccion ${styles.seccion}`}
      aria-labelledby="titulo-ubicaciones"
    >
      <div className="contenedor">
        <header className={styles.encabezado} data-aos="fade-up">
          <p className={`etiqueta ${styles.etiqueta}`}>Dónde sucede</p>
          <h2 id="titulo-ubicaciones" className={`seccion-titulo ${styles.titulo}`}>
            Dos sedes, una ciudad.
          </h2>
          <p className="seccion-lede">
            Cada jornada se desarrolla en un punto distinto de Tandil. Las direcciones corresponden a
            las publicadas por la organización.
          </p>
        </header>

        <ol className={styles.lineaTiempo}>
          {JORNADAS.map((jornada, indice) => {
            const activa = estadoEvento.jornadaActiva?.id === jornada.id
            return (
              <motion.li
                key={jornada.id}
                className={`${styles.hito} ${styles[jornada.acento]} ${activa ? styles.hitoActivo : ''}`}
                initial={reducido ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: indice * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.marcaTiempo} aria-hidden="true">
                  <span className={styles.nodo} />
                </div>

                <div className={styles.tarjeta}>
                  <p className={styles.fecha}>
                    <time dateTime={jornada.fecha}>
                      {jornada.diaSemanaCorto} {jornada.etiquetaFecha}
                    </time>
                    <span className={styles.jornadaNombre}>{jornada.nombre}</span>
                  </p>

                  <h3 className={styles.nombreSede}>
                    <MapPin size={18} strokeWidth={1.8} aria-hidden="true" />
                    {jornada.sede.nombre}
                  </h3>

                  <address className={styles.direccion}>{direccionCompleta(jornada.sede)}</address>

                  <p className={styles.nota}>{jornada.sedeNota}</p>

                  <Boton variante="secundario" href={enlaceMapa(jornada.sede)} target="_blank" icono={ArrowUpRight}>
                    Cómo llegar
                  </Boton>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}