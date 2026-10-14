import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import { notificacionDestacada, useNotificaciones } from '../hooks/useNotificaciones'
import styles from './BannerFlotante.module.css'

const CLAVE_CERRADO = 'ttw2026-banner-cerrado'

/**
 * Banner flotante con la novedad de mayor prioridad del momento.
 * Se puede cerrar y vuelve solo cuando aparece una notificación nueva.
 */
export default function BannerFlotante({ estadoEvento }) {
  const { notificaciones } = useNotificaciones(estadoEvento)
  const destacada = notificacionDestacada(notificaciones)
  // El id cerrado queda fijo: si llega una novedad nueva (id distinto), el
  // banner vuelve sola sin necesidad de efectos sincronizadores.
  const [cerradoId, setCerradoId] = useState(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem(CLAVE_CERRADO) ?? 'null')
    } catch {
      return null
    }
  })
  const reducido = useReducedMotion()

  if (!destacada) return null

  const visible = cerradoId !== destacada.id
  const enVivo = destacada.estado === 'en-vivo'
  const externo = Boolean(destacada.accion?.externo)

  const cerrar = () => {
    setCerradoId(destacada.id)
    try {
      window.sessionStorage.setItem(CLAVE_CERRADO, JSON.stringify(destacada.id))
    } catch {
      // Sin sessionStorage el banner solo vive durante esta sesión en memoria.
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="status"
          aria-label="Novedad destacada del evento"
          className={`${styles.banner} ${enVivo ? styles.bannerEnVivo : styles.bannerProximamente}`}
          initial={reducido ? { opacity: 0 } : { opacity: 0, y: 24, x: '-50%' }}
          animate={reducido ? { opacity: 1 } : { opacity: 1, y: 0, x: '-50%' }}
          exit={reducido ? { opacity: 0 } : { opacity: 0, y: 20, x: '-50%' }}
          transition={
            reducido
              ? { duration: 0.01, delay: 0.4 }
              : { type: 'spring', stiffness: 260, damping: 26, delay: 0.8 }
          }
        >
          <span className={styles.punto} aria-hidden="true" />

          <div className={styles.contenido}>
            <p className={styles.etiqueta}>{enVivo ? 'En vivo ahora' : 'Próximamente'}</p>
            <p className={styles.mensaje}>
              <strong>{destacada.titulo}.</strong> {destacada.texto}
            </p>
          </div>

          {destacada.accion && (
            <a
              className={styles.enlace}
              href={destacada.accion.href}
              {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {destacada.accion.etiqueta}
              <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
              {externo && <span className="rotulo-visual">(se abre en una pestaña nueva)</span>}
            </a>
          )}

          <button type="button" className={styles.cerrar} onClick={cerrar}>
            <X size={15} strokeWidth={2} aria-hidden="true" />
            <span className="rotulo-visual">Cerrar novedad</span>
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
