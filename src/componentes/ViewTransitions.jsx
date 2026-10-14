import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import styles from './ViewTransitions.module.css'

/**
 * Componente envoltorio que habilita View Transitions API nativa
 * y proporciona fallback con Framer Motion para navegación SPA.
 */
export function ViewTransitionProvider({ nombreVista = 'principal' }) {
  const reducido = useReducedMotion()

  useEffect(() => {
    if (reducido) return

    // Verificar soporte nativo de View Transitions
    const soportaVT = 'startViewTransition' in document

    if (soportaVT) {
      document.documentElement.style.setProperty('--vt-duration', '400ms')
      document.documentElement.style.setProperty('--vt-easing', 'cubic-bezier(0.16, 1, 0.3, 1)')
    }

    return () => {
      if (soportaVT) {
        document.documentElement.style.removeProperty('--vt-duration')
        document.documentElement.style.removeProperty('--vt-easing')
      }
    }
  }, [reducido])

  return (
    <div className={`${styles.proveedor} ${nombreVista ? styles.proveedor : ''}`}>
      <ViewTransitionAPI nombre={nombreVista} />
      {children}
    </div>
  )
}

/**
 * Componente interno que aplica las pseudo-clases de View Transitions API
 * cuando están disponibles.
 */
function ViewTransitionAPI({ nombre }) {
  useEffect(() => {
    if (!('startViewTransition' in document)) return

    const style = document.createElement('style')
    style.textContent = `
      ::view-transition-old(${nombre}),
      ::view-transition-new(${nombre}) {
        animation-duration: var(--vt-duration, 400ms);
        animation-timing-function: var(--vt-easing, cubic-bezier(0.16, 1, 0.3, 1));
      }
      ::view-transition-old(${nombre}) {
        animation-name: -ua-view-transition-fade-out;
      }
      ::view-transition-new(${nombre}) {
        animation-name: -ua-view-transition-fade-in;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [nombre])

  return null
}

/**
 * Componente para transiciones entre pestañas con animación shared layout.
 */
export function TabsViewTransition({
  tabs,
  activeTab,
  onChange,
  className = '',
  renderTab,
  renderPanel,
}) {
  const reducido = useReducedMotion()

  return (
    <div className={`${styles.tabs} ${className}`}>
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActivo : ''}`}
            onClick={() => onChange(tab.id)}
            whileHover={{ scale: reducido ? 1 : 1.02 }}
            whileTap={{ scale: reducido ? 1 : 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            layout
          >
            {renderTab ? renderTab(tab, activeTab === tab.id) : tab.label}
          </motion.button>
        ))}
        <motion.div
          className={styles.indicador}
          layoutId="tab-indicador"
          transition={reducido ? { duration: 0.01 } : { type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            width: activeTab ? undefined : 0,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {tabs
          .filter((tab) => tab.id === activeTab)
          .map((tab) => (
            <motion.div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={styles.panel}
              initial={{ opacity: 0, y: reducido ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducido ? 0 : -16 }}
              transition={{ duration: reducido ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderPanel ? renderPanel(tab) : tab.content}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Modal con View Transition y animación de física (objetos saliendo volando).
 */
export function ModalViewTransition({
  isOpen,
  onClose,
  children,
  titulo,
  className = '',
  fisicaAlCerrar = false,
}) {
  const reducido = useReducedMotion()
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <motion.div
      ref={overlayRef}
      className={`${styles.modalOverlay} ${className}`}
      initial={reducido ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducido ? {} : { opacity: 0 }}
      transition={{ duration: reducido ? 0.01 : 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titulo ? 'modal-titulo' : undefined}
    >
      <motion.div
        ref={contentRef}
        className={styles.modalContent}
        initial={reducido ? {} : { opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reducido ? {} : { opacity: 0, scale: 0.95, y: -20 }}
        transition={{
          type: reducido ? undefined : 'spring',
          stiffness: 400,
          damping: 30,
          duration: reducido ? 0.01 : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {titulo && (
          <motion.header
            className={styles.modalHeader}
            initial={reducido ? {} : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 id="modal-titulo" className={styles.modalTitulo}>{titulo}</h2>
            <button
              className={styles.modalCerrar}
              onClick={onClose}
              aria-label="Cerrar modal"
              whileHover={{ rotate: reducido ? 0 : 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              ×
            </button>
          </motion.header>
        )}

        <motion.div
          className={styles.modalBody}
          initial={reducido ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {children}
        </motion.div>

        {fisicaAlCerrar && (
          <ParticulasFisica
            ref={contentRef}
            color={['#EC4899', '#A855F7', '#F9A8D4', '#D8B4FE']}
            cantidad={12}
            reducido={reducido}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

/** Partículas que "salen volando" con física al cerrar. */
function ParticulasFisica({ color, cantidad, reducido }) {
  const [particulas, setParticulas] = useState([])

  useEffect(() => {
    if (reducido) return

    const nuevas = Array.from({ length: cantidad }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 300,
      tamaño: 4 + Math.random() * 8,
      color: color[Math.floor(Math.random() * color.length)],
      velocidadX: (Math.random() - 0.5) * 20,
      velocidadY: -Math.random() * 15 - 5,
      gravedad: 0.5 + Math.random() * 0.5,
      rotacion: Math.random() * 360,
      rotacionVel: (Math.random() - 0.5) * 10,
      opacidad: 1,
    }))
    setParticulas(nuevas)
  }, [cantidad, color, reducido])

  useEffect(() => {
    if (particulas.length === 0 || reducido) return

    let id
    const animar = () => {
      setParticulas((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.velocidadX,
          y: p.y + p.velocidadY,
          velocidadY: p.velocidadY + p.gravedad,
          rotacion: p.rotacion + p.rotacionVel,
          opacidad: p.opacidad - 0.015,
        })).filter((p) => p.opacidad > 0)
      )

      if (particulas.some((p) => p.opacidad > 0)) {
        id = requestAnimationFrame(animar)
      }
    }
    id = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(id)
  }, [particulas, reducido])

  return (
    <div className={styles.particulasFisica} aria-hidden="true">
      {particulas.map((p) => (
        <motion.div
          key={p.id}
          className={styles.particula}
          style={{
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: p.tamaño,
            height: p.tamaño,
            background: p.color,
            opacity: p.opacidad,
            transform: `rotate(${p.rotacion}deg)`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Badge/insignia con rotación 360° continua.
 */
export function BadgeGiratorio({ children, className = '', velocidad = 8, colorAcento = '#EC4899' }) {
  const reducido = useReducedMotion()

  return (
    <motion.span
      className={`${styles.badgeGiratorio} ${className}`}
      style={{
        '--velocidad-giro': `${velocidad}s`,
        '--color-acento': colorAcento,
      }}
      animate={reducido ? {} : { rotate: 360 }}
      transition={reducido ? {} : { duration: velocidad, ease: 'linear', repeat: Infinity }}
    >
      {children}
    </motion.span>
  )
}

/**
 * Texto que gira 360° continuamente (para títulos decorativos).
 */
export function TextoGiratorio({ children, className = '', velocidad = 20, direction = 'normal' }) {
  const reducido = useReducedMotion()

  return (
    <motion.span
      className={`${styles.textoGiratorio} ${className}`}
      style={{ display: 'inline-block' }}
      animate={reducido ? {} : { rotate: direction === 'reverse' ? -360 : 360 }}
      transition={reducido ? {} : { duration: velocidad, ease: 'linear', repeat: Infinity }}
    >
      {children}
    </motion.span>
  )
}

/**
 * Componente para elementos con shared layout animations (FLIP).
 */
export function SharedLayout({ children }) {
  const reducido = useReducedMotion()

  return (
    <motion.div
      className={styles.sharedLayout}
      layout
      transition={reducido ? { duration: 0.01 } : { type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}
