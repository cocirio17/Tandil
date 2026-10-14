import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Bell, Clock } from 'lucide-react'
import { AGENDA, JORNADAS } from '../datos/evento'
import styles from './Agenda.module.css'

/**
 * La agenda detallada se publica por los canales oficiales. Cuando esté disponible,
 * alcanza con poner `AGENDA.disponible = true` y cargar los bloques horarios:
 * la sección ya está preparada para mostrarlos sin cambiar el diseño.
 */
export default function Agenda() {
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(JORNADAS[0].id)
  const reducido = useReducedMotion()
  const jornadaDe = (id) => JORNADAS.find((jornada) => jornada.id === id)
  const jornada = jornadaDe(jornadaSeleccionada)
  const bloque = AGENDA.bloques.find((item) => item.jornadaId === jornadaSeleccionada)

  const moverTab = (evento, indice) => {
    const ultimo = JORNADAS.length - 1
    let siguiente = indice
    if (evento.key === 'ArrowRight') siguiente = indice === ultimo ? 0 : indice + 1
    else if (evento.key === 'ArrowLeft') siguiente = indice === 0 ? ultimo : indice - 1
    else if (evento.key === 'Home') siguiente = 0
    else if (evento.key === 'End') siguiente = ultimo
    else return

    evento.preventDefault()
    setJornadaSeleccionada(JORNADAS[siguiente].id)
    evento.currentTarget.parentElement
      .querySelectorAll('[role="tab"]')
      .item(siguiente)
      ?.focus()
  }

  return (
    <section id="agenda" className={`seccion seccion--borde ${styles.seccion}`} aria-labelledby="titulo-agenda">
      <div className="contenedor">
        <header className={styles.encabezado} data-aos="fade-up">
          <p className={`etiqueta ${styles.etiqueta}`}>Agenda</p>
          <h2 id="titulo-agenda" className={`seccion-titulo ${styles.titulo}`}>
            Dos jornadas para construir y conectar.
          </h2>
          <p className="seccion-lede">
            Los horarios detallados, desafíos y charlas se anuncian por los canales oficiales del
            evento.
          </p>
        </header>

        <div className={styles.selector} role="tablist" aria-label="Seleccionar jornada">
          {JORNADAS.map((item, indice) => (
            <button
              key={item.id}
              id={`tab-agenda-${item.id}`}
              className={`${styles.tab} ${styles[item.acento]}`}
              type="button"
              role="tab"
              aria-selected={jornadaSeleccionada === item.id}
              aria-controls={`panel-agenda-${item.id}`}
              tabIndex={jornadaSeleccionada === item.id ? 0 : -1}
              onClick={() => setJornadaSeleccionada(item.id)}
              onKeyDown={(evento) => moverTab(evento, indice)}
            >
              <span>{item.etiquetaFecha}</span>
              {item.nombre}
              {jornadaSeleccionada === item.id && (
                <motion.span
                  layoutId="agenda-activa"
                  className={styles.tabIndicador}
                  transition={reducido ? { duration: 0.01 } : { type: 'spring', stiffness: 360, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {jornada && (
            <motion.article
              key={jornada.id}
              id={`panel-agenda-${jornada.id}`}
              className={`${styles.panel} ${styles[jornada.acento]}`}
              role="tabpanel"
              aria-labelledby={`tab-agenda-${jornada.id}`}
              tabIndex={0}
              initial={reducido ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducido ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reducido ? 0.01 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className={styles.panelEncabezado}>
                <p className={styles.panelFecha}>
                  <time dateTime={jornada.fecha}>{jornada.fechaLarga}</time>
                </p>
                <h3 className={styles.panelTitulo}>{jornada.nombre}</h3>
                <p className={styles.panelSede}>{jornada.sede.nombre}</p>
              </header>

              <ul className={styles.lista}>
                {bloque?.items.map((item) => (
                  <li key={item.titulo} className={styles.item}>
                    <span className={styles.itemMarca} aria-hidden="true" />
                    <div>
                      <p className={styles.itemTitulo}>{item.titulo}</p>
                      <p className={styles.itemDescripcion}>{item.descripcion}</p>
                    </div>
                  </li>
                ))}
                <li className={styles.item}>
                  <span className={styles.itemMarca} aria-hidden="true" />
                  <div>
                    <p className={styles.itemTitulo}>
                      <Clock size={15} strokeWidth={1.8} aria-hidden="true" />
                      Ventana de la jornada
                    </p>
                    <p className={styles.itemDescripcion}>
                      {jornada.horario} · {jornada.categoria}.
                    </p>
                  </div>
                </li>
              </ul>

              {!AGENDA.disponible && (
                <p className={styles.aviso}>
                  <Bell size={15} strokeWidth={1.8} aria-hidden="true" />
                  {AGENDA.aviso}
                </p>
              )}
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}