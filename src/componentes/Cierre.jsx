import { ArrowUpRight } from 'lucide-react'
import Boton from './Boton'
import { EVENTO, MENSAJES_FASE } from '../datos/evento'
import styles from './Cierre.module.css'

export default function Cierre({ estadoEvento }) {
  const mensaje = MENSAJES_FASE[estadoEvento.fase]

  return (
    <section id="participar" className={`seccion ${styles.seccion}`} aria-labelledby="titulo-cierre">
      <div className={`contenedor ${styles.contenedor}`}>
        <div className={styles.panel}>
          <div className={styles.brillo} aria-hidden="true" />

          <p className={`etiqueta ${styles.etiqueta}`} data-aos="fade-up">
            {mensaje.etiqueta}
          </p>

          <h2 id="titulo-cierre" className={styles.titulo} data-aos="fade-up" data-aos-delay="60">
            El futuro de la tecnología también se construye en Tandil.
          </h2>

          <p className={styles.bajada} data-aos="fade-up" data-aos-delay="120">
            Dos jornadas para compartir conocimiento, conectar ideas y descubrir nuevas oportunidades.
          </p>

          <div className={styles.acciones} data-aos="fade-up" data-aos-delay="180">
            {estadoEvento.inscripcionesAbiertas ? (
              <Boton variante="primario" href={EVENTO.inscripcion} icono={ArrowUpRight}>
                Inscribirme gratis
              </Boton>
            ) : (
              <Boton variante="secundario" href={EVENTO.sitioOficial} target="_blank" icono={ArrowUpRight}>
                Ver información oficial
              </Boton>
            )}
            <Boton variante="secundario" href={EVENTO.sitioOficial} target="_blank">
              {EVENTO.sitioOficial.replace('https://www.', '')}
            </Boton>
          </div>

          <ul className={styles.redes} data-aos="fade-up" data-aos-delay="220">
            {EVENTO.redes.map((red) => (
              <li key={red.id}>
                <a href={red.url} target="_blank" rel="noopener noreferrer" className="enlace-saliente">
                  <span className={styles.redNombre}>{red.nombre}</span>
                  {red.usuario}
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                  <span className="rotulo-visual"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}