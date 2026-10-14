import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Check, Bell, BellRing, Send, X } from 'lucide-react'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { conTransicionVista } from '../utils/transicionVista'
import styles from './Notificaciones.module.css'

const ETIQUETAS_ESTADO = {
  'en-vivo': 'En vivo',
  proximamente: 'Próximamente',
  aviso: 'Aviso',
  finalizado: 'Finalizado',
}

const CLASES_ESTADO = {
  'en-vivo': 'estadoEnVivo',
  proximamente: 'estadoProximamente',
  aviso: 'estadoAviso',
  finalizado: 'estadoFinalizado',
}

const USUARIO_OFICIAL = '@tandiltechweek'

function ElementoNotificacion({ notificacion, alNavegar }) {
  const externo = Boolean(notificacion.accion?.externo)
  return (
    <li className={styles.item}>
      <p className={`${styles.itemEstado} ${styles[CLASES_ESTADO[notificacion.estado]]}`}>
        {ETIQUETAS_ESTADO[notificacion.estado]}
      </p>
      <p className={styles.itemTitulo}>{notificacion.titulo}</p>
      <p className={styles.itemTexto}>{notificacion.texto}</p>
      {notificacion.accion && (
        <a
          className={styles.itemAccion}
          href={notificacion.accion.href}
          {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={alNavegar}
        >
          {notificacion.accion.etiqueta}
          <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
          {externo && <span className="rotulo-visual">(se abre en una pestaña nueva)</span>}
        </a>
      )}
    </li>
  )
}

/** Centro de novedades: campana con badge, panel desplegable y suscripción. */
export default function Notificaciones({ estadoEvento }) {
  const {
    notificaciones,
    sinLeer,
    marcarVistas,
    suscripcion,
    suscribir,
    desuscribir,
  } = useNotificaciones(estadoEvento)

  const [abierto, setAbierto] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const boton = useRef(null)
  const campo = useRef(null)
  const reducido = useReducedMotion()

  const hayEnVivo = notificaciones.some((notificacion) => notificacion.estado === 'en-vivo')
  const IconoCampana = hayEnVivo ? BellRing : Bell

  // Cierre con Escape y clic por fuera, como el menú del encabezado.
  useEffect(() => {
    if (!abierto) return undefined

    const alTeclear = (evento) => {
      if (evento.key === 'Escape') {
        setAbierto(false)
        boton.current?.focus()
      }
    }
    const alPulsarFuera = (evento) => {
      if (!evento.target.closest('[data-notificaciones]')) setAbierto(false)
    }

    document.addEventListener('keydown', alTeclear)
    document.addEventListener('pointerdown', alPulsarFuera)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.removeEventListener('pointerdown', alPulsarFuera)
    }
  }, [abierto])

  const alternar = () => {
    conTransicionVista(() => {
      setAbierto(abre => {
        if (!abre) marcarVistas()
        return !abre
      })
    })
  }

  const enviar = (evento) => {
    evento.preventDefault()
    const resultado = suscribir(email)
    if (resultado.ok) {
      setError(null)
      setEmail('')
      campo.current?.focus()
    } else {
      setError(resultado.error)
      campo.current?.focus()
    }
  }

  return (
    <div className={styles.botones} data-notificaciones="">
      <button
        ref={boton}
        type="button"
        className={styles.campana}
        onClick={alternar}
        aria-expanded={abierto}
        aria-controls="panel-novedades"
      >
        <IconoCampana
          size={19}
          strokeWidth={1.8}
          className={reducido ? undefined : styles.timbre}
          aria-hidden="true"
        />
        {sinLeer > 0 && (
          <motion.span
            key={sinLeer}
            className={styles.insignia}
            initial={reducido ? false : { scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 480, damping: 18 }}
          >
            {sinLeer}
          </motion.span>
        )}
        <span className="rotulo-visual">
          {`Novedades del evento${sinLeer > 0 ? `, ${sinLeer} sin leer` : ''}`}
        </span>
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id="panel-novedades"
            role="dialog"
            aria-label="Novedades de Tandil Tech Week"
            className={styles.panelNovedades}
            initial={reducido ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
            animate={reducido ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducido ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={reducido ? { duration: 0.01 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className={styles.cabecera}>
              <p className={styles.cabeceraTitulo}>
                Live hub · <strong>{notificaciones.length} novedades</strong>
              </p>
              <button type="button" className={styles.quitar} onClick={() => setAbierto(false)}>
                <X size={16} strokeWidth={2} aria-hidden="true" />
                <span className="rotulo-visual">Cerrar novedades</span>
              </button>
            </header>

            <ul className={styles.lista}>
              {notificaciones.map((notificacion) => (
                <ElementoNotificacion
                  key={notificacion.id}
                  notificacion={notificacion}
                  alNavegar={() => setAbierto(false)}
                />
              ))}
            </ul>

            <footer className={styles.pie}>
              <p className={styles.pieTitulo} id="rotulo-suscripcion">
                Suscribite a las novedades
              </p>

              {suscripcion ? (
                <motion.p
                  className={styles.mensajeExito}
                  initial={reducido ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className={styles.notaPrivacidad}>
                    <Check size={12} strokeWidth={2.4} aria-hidden="true" /> Avisos activados para {' '}
                    <strong>{suscripcion.email}</strong>. Sin backend: queda guardado solo en este
                    navegador.
                  </span>
                  <button type="button" className={styles.quitar} onClick={desuscribir}>
                    Quitar
                  </button>
                </motion.p>
              ) : (
                <>
                  <form className={styles.formulario} onSubmit={enviar}>
                    <input
                      ref={campo}
                      className={styles.entrada}
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      aria-labelledby="rotulo-suscripcion"
                      value={email}
                      onChange={(evento) => {
                        setEmail(evento.target.value)
                        setError(null)
                      }}
                    />
                    <button type="submit" className={styles.enviar}>
                      <Send size={15} strokeWidth={2} aria-hidden="true" />
                      <span className="rotulo-visual">Activar avisos</span>
                    </button>
                  </form>
                  {error && <p className={styles.mensajeError} role="alert">{error}</p>}
                  <p className={styles.notaPrivacidad}>
                    Recibí los avisos del evento antes que nadie. Tu email se guarda solo en este
                    navegador: los anuncios oficiales se publican en {USUARIO_OFICIAL}.
                  </p>
                </>
              )}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
