import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Boton from './Boton'
import Marca from './Marca'
import Notificaciones from './Notificaciones'
import SelectorTema from './SelectorTema'
import { EVENTO, SECCIONES } from '../datos/evento'
import { useSeccionActiva } from '../hooks/useSeccionActiva'
import styles from './Header.module.css'

const IDS = SECCIONES.map((seccion) => seccion.id)

export default function Header({ estadoEvento, tema, temas, onTemaChange }) {
  const [desplazado, setDesplazado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const botonMenu = useRef(null)
  const panelMenu = useRef(null)
  const movimientoReducido = useReducedMotion()

  const { scrollY, scrollYProgress } = useScroll()
  useMotionValueEvent(scrollY, 'change', (valor) => setDesplazado(valor > 24))

  const seccionActiva = useSeccionActiva(IDS)

  // Cierre del menú con Escape, bloqueo del scroll y devolución del foco.
  useEffect(() => {
    if (!menuAbierto) return undefined

    const alTeclear = (evento) => {
      if (evento.key === 'Escape') {
        setMenuAbierto(false)
        botonMenu.current?.focus()
      }
    }

    document.addEventListener('keydown', alTeclear)
    document.body.classList.add('menu-abierto')
    panelMenu.current?.querySelector('a')?.focus()

    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.classList.remove('menu-abierto')
    }
  }, [menuAbierto])

  const cerrarMenu = () => setMenuAbierto(false)

  const inscripcionAbierta = estadoEvento.inscripcionesAbiertas

  return (
    <header className={`${styles.encabezado} ${desplazado ? styles.encabezadoSolido : ''}`}>
      <motion.span
        className={styles.progreso}
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <div className={styles.contenedor}>
        <a href="#inicio" className={styles.logo} onClick={cerrarMenu}>
          <Marca />
        </a>

        <nav className={styles.navegacion} aria-label="Secciones del evento">
          <ul className={styles.lista}>
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a
                  href={`#${seccion.id}`}
                  className={`${styles.enlaceNav} ${seccionActiva === seccion.id ? styles.enlaceNavActivo : ''}`}
                  aria-current={seccionActiva === seccion.id ? 'location' : undefined}
                >
                  {seccion.etiqueta}
                  {seccionActiva === seccion.id && (
                    <motion.span
                      layoutId="nav-activo"
                      className={styles.subrayado}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.acciones}>
          <Notificaciones estadoEvento={estadoEvento} />
          <SelectorTema tema={tema} temas={temas} onChange={onTemaChange} />
          {inscripcionAbierta ? (
            <Boton variante="primario" href={EVENTO.inscripcion} className={styles.inscribirse}>
              Inscribirme
            </Boton>
          ) : (
            <Boton variante="secundario" href={EVENTO.sitioOficial} target="_blank">
              Sitio oficial
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </Boton>
          )}

          <button
            ref={botonMenu}
            type="button"
            className={styles.botonMenu}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
          >
            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
            <span className="rotulo-visual">{menuAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            id="menu-movil"
            ref={panelMenu}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ opacity: 0, y: movimientoReducido ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={
              movimientoReducido
                ? { duration: 0.01 }
                : { type: 'spring', stiffness: 320, damping: 30 }
            }
          >
            <nav aria-label="Secciones del evento (móvil)">
              <ul className={styles.listaMovil}>
                {SECCIONES.map((seccion, indice) => (
                  <motion.li
                    key={seccion.id}
                    initial={{ opacity: 0, x: movimientoReducido ? 0 : -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: movimientoReducido ? 0 : 0.04 * indice + 0.06,
                      duration: movimientoReducido ? 0.01 : 0.3,
                    }}
                  >
                    <a href={`#${seccion.id}`} className={styles.enlaceMovil} onClick={cerrarMenu}>
                      <span className={styles.indiceMovil}>{String(indice + 1).padStart(2, '0')}</span>
                      {seccion.etiqueta}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className={styles.pieMovil}>
              <a href={EVENTO.sitioOficial} target="_blank" rel="noopener noreferrer" className="enlace-saliente">
                {EVENTO.sitioOficial.replace('https://www.', '')}
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}