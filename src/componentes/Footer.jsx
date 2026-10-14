import { ArrowUpRight } from 'lucide-react'
import { EVENTO, JORNADAS } from '../datos/evento'
import { ACOMPANAN, ORGANIZAN } from '../datos/organizaciones'
import styles from './Footer.module.css'

export default function Footer() {
  const anio = EVENTO.edicion

  return (
    <footer className={styles.pie} aria-labelledby="titulo-pie">
      <div className={`contenedor ${styles.contenedor}`}>
        <div className={styles.marcaBloque}>
          <h2 id="titulo-pie" className={styles.marca}>
            Tandil <span>Tech</span> Week
          </h2>
          <p className={styles.lema}>{EVENTO.lema}</p>
          <p className={styles.lugar}>
            {EVENTO.ciudad}, {EVENTO.provincia}, {EVENTO.pais}
          </p>
        </div>

        <nav className={styles.columnas} aria-label="Jornadas y organizaciones">
          <div className={styles.columna}>
            <h3 className={styles.columnaTitulo}>Jornadas</h3>
            <ul className={styles.lista}>
              {JORNADAS.map((jornada) => (
                <li key={jornada.id}>
                  <a href={`#${jornada.id}`} className={styles.enlace}>
                    {jornada.etiquetaFecha} · {jornada.nombre}
                  </a>
                </li>
              ))}
              <li>
                <a href={EVENTO.sitioOficial} target="_blank" rel="noopener noreferrer" className="enlace-saliente">
                  Sitio oficial
                  <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.columna}>
            <h3 className={styles.columnaTitulo}>Organizaciones</h3>
            <ul className={styles.lista}>
              {[...ORGANIZAN, ...ACOMPANAN].map((organizacion) => (
                <li key={organizacion.id}>
                  <a
                    href={organizacion.sitio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.enlace}
                  >
                    {organizacion.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.columna}>
            <h3 className={styles.columnaTitulo}>Fechas</h3>
            <ul className={styles.lista}>
              {JORNADAS.map((jornada) => (
                <li key={jornada.id} className={styles.dato}>
                  <span className={styles.datoFecha}>{jornada.etiquetaFecha}</span>
                  <span>{jornada.sede.nombre}</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className={`contenedor ${styles.legal}`}>
        <p>
          © {anio} Tandil Tech Week. {EVENTO.ciudad}, {EVENTO.provincia}, {EVENTO.pais}.
        </p>
        <p>
          Evento organizado por {ORGANIZAN.map((o) => o.nombre).join(', ')}. Los logotipos son
          propiedad de cada organización.
        </p>
      </div>
    </footer>
  )
}