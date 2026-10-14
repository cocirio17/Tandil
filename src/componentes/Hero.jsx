import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, CalendarDays } from 'lucide-react'
import Boton from './Boton'
import CuentaRegresiva from './CuentaRegresiva'
import NodosFlotantes from './NodosFlotantes'
import SelloGiratorio from './SelloGiratorio'
import { EscenaHero } from './Elementos3D'
import ParallaxFondo from './ParallaxFondo'
import { crearCapasHero } from '../utils/capasParallax'
import { EVENTO, JORNADAS, MENSAJES_FASE } from '../datos/evento'
import { useFisicaDesplazamiento } from '../hooks/useFisicaDesplazamiento'
import { useMovimientoReducido } from '../hooks/useMovimientoReducido'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

/* Capas estables: se crean una sola vez, no por render. */
const CAPAS_HERO = crearCapasHero()

export default function Hero({ estadoEvento }) {
  const raiz = useRef(null)
  const capaNodos = useRef(null)
  const reducido = useMovimientoReducido()
  const fase = estadoEvento.fase
  const colorAcento = fase === 'hacking-day' ? '#EC4899' : fase === 'startup-day' ? '#A855F7' : '#EC4899'

  /**
   * GSAP tiene aquí dos responsabilidades exclusivas: la secuencia de entrada
   * del hero y el parallax controlado por scroll. Todo se ejecuta dentro de un
   * `gsap.context` que se revierte completo al desmontar.
   */
  useLayoutEffect(() => {
    if (reducido) return undefined

    const contexto = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-hero="estado"]', { yPercent: 130, autoAlpha: 0, duration: 0.6 })
        .from('[data-hero="titulo"]', { yPercent: 112, rotate: 1.5, duration: 1.15, stagger: 0.075 }, '-=0.32')
        .from('[data-hero="regla"]', { scaleX: 0, transformOrigin: 'left center', duration: 0.9 }, '-=0.8')
        .from('[data-hero="bajada"]', { y: 22, autoAlpha: 0, duration: 0.75, stagger: 0.09 }, '-=0.62')
        .from('[data-hero="acciones"]', { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, '-=0.55')
        .from('[data-hero="sello"]', { scale: 0.4, autoAlpha: 0, rotate: -90, duration: 1.3, ease: 'back.out(1.6)' }, '-=1.4')

      // Parallax ligero: solo sobre las capas decorativas.
      ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        animation: gsap.to('[data-hero="fondo-capa"]', { yPercent: 16, ease: 'none' }),
      })
    }, raiz)

    return () => contexto.revert()
  }, [reducido])

  const dispararFisica = useFisicaDesplazamiento(() =>
    capaNodos.current ? [...capaNodos.current.querySelectorAll('[data-cinetica]')] : [],
  )

  const mensaje = MENSAJES_FASE[estadoEvento.fase]
  const jornadaSiguiente = estadoEvento.jornadaSiguiente

  return (
    <section id="inicio" ref={raiz} className={styles.hero} aria-labelledby="titulo-evento">
      {/* Parallax multicapa de fondo */}
      <ParallaxFondo capas={CAPAS_HERO} scrub={0.8} />

      {/* Fondo base con gradientes y rejilla */}
      <div className={styles.fondo} data-hero="fondo-capa" data-cinetica="" aria-hidden="true">
        <span className={styles.rejilla} />
        <span className={`${styles.brillo} ${styles.brilloMagenta}`} />
        <span className={`${styles.brillo} ${styles.brilloVioleta}`} />
      </div>

      {/* Escena 3D interactiva (React Three Fiber) - solo en desktop y sin movimiento reducido */}
      {!reducido && (
        <div className={styles.escena3d} aria-hidden="true">
          <EscenaHero colorAcento={colorAcento} intensidad={1} semilla={0} />
        </div>
      )}

      {/* Nodos 2D flotantes (fallback y capa adicional) */}
      <div ref={capaNodos} className={styles.capaNodos}>
        <NodosFlotantes />
      </div>

      <div className={`contenedor ${styles.contenedor}`}>
        <div className={styles.contenido}>
          <div className={styles.envolturaEstado}>
            <p className={styles.envolturaEstadoLinea}>
              <span className={`${styles.estado} ${estadoEvento.enCurso ? styles.estadoActivo : ''}`} data-hero="estado">
                <span className={styles.punto} aria-hidden="true" />
                {mensaje.etiqueta}
              </span>
              <span className={styles.ubicacion}>Tandil · Buenos Aires · Argentina</span>
            </p>
          </div>

          <h1 id="titulo-evento" className={`${styles.titulo} ${styles.tituloGlitch}`}>
            <span className={styles.linea}>
              <span className={styles.lineaTexto} data-hero="titulo">
                Tandil
              </span>
            </span>
            <span className={`${styles.linea} ${styles.lineaAcento}`} data-glitch="Tech Week">
              <span className={styles.lineaTexto} data-hero="titulo">
                Tech Week
              </span>
            </span>
          </h1>

          <span className={styles.regla} data-hero="regla" aria-hidden="true" />

          <p className={styles.bajada} data-hero="bajada">
            Dos días. Dos experiencias. Una comunidad que construye el futuro de la tecnología.
          </p>

          <div className={styles.bloqueFecha}>
            <p className={styles.fecha}>
              <CalendarDays size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>
                14 <span className={styles.fechaGuion}>—</span> 15 Octubre {EVENTO.edicion}
              </span>
            </p>
            <div data-hero="acciones">
              {jornadaSiguiente && <CuentaRegresiva tiempo={estadoEvento.cuentaRegresiva} jornada={jornadaSiguiente} />}
            </div>
          </div>

          <div className={styles.acciones} data-hero="acciones">
            <Boton variante="primario" href="#jornadas" icono={ArrowUpRight}>
              Conocer las jornadas
            </Boton>
            <Boton variante="secundario" href={EVENTO.sitioOficial} target="_blank">
              Información oficial
            </Boton>
          </div>

          <nav className={styles.jornadasAcceso} aria-label="Accesos directos a cada jornada" data-hero="acciones">
            <ul>
              {JORNADAS.map((jornada) => (
                <li key={jornada.id}>
                  <a href={`#${jornada.id}`} className={`${styles.accesoJornada} ${styles[jornada.acento]}`}>
                    <span className={styles.accesoFecha}>{jornada.etiquetaFecha}</span>
                    <span className={styles.accesoNombre}>{jornada.nombre}</span>
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.selloZona} data-hero="sello">
          <SelloGiratorio onExplotar={dispararFisica} />
        </div>
      </div>

      <a href="#jornadas" className={styles.desplazar} data-hero="acciones">
        <span className={styles.desplazarLinea} aria-hidden="true" />
        Desplazate para explorar
      </a>
    </section>
  )
}