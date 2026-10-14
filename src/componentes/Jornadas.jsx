import TarjetaJornada from './TarjetaJornada'
import { JORNADAS } from '../datos/evento'
import styles from './Jornadas.module.css'

export default function Jornadas({ estadoEvento }) {
  return (
    <section id="jornadas" className={`seccion seccion--borde ${styles.seccion}`} aria-labelledby="titulo-jornadas">
      <div className="contenedor">
        <header className={styles.encabezado}>
          <div data-aos="fade-up">
            <p className={`etiqueta ${styles.etiqueta}`}>Dos jornadas, un mismo ecosistema</p>
            <h2 id="titulo-jornadas" className={`seccion-titulo ${styles.titulo}`}>
              Dos formatos distintos. Un objetivo compartido.
            </h2>
          </div>
          <p className="seccion-lede" data-aos="fade-up" data-aos-delay="70">
            El miércoles compite la técnica. El jueves se conecta el ecosistema. Cada jornada tiene su
            propio lugar, su propio tono y su propia forma de participar.
          </p>
        </header>

        <div className={styles.rejilla}>
          {JORNADAS.map((jornada, indice) => (
            <div key={jornada.id} data-aos="fade-up" data-aos-delay={indice * 120}>
              <TarjetaJornada
                jornada={jornada}
                activa={estadoEvento.jornadaActiva?.id === jornada.id}
                destaque={estadoEvento.fase === jornada.id}
                inscripcionAbierta={estadoEvento.inscripcionesAbiertas}
                semilla={indice + 1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}