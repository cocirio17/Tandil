import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion, useSpring, useMotionValue } from 'motion/react'
import { Send, Loader2, MessageSquare, Heart, Flag, User, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { CATEGORIAS, FICHAS_SEMILLA, CATEGORIA_POR_ID, FILTRO_TODAS } from '../datos/comunidad'
import { useAnimacionFisica } from '../hooks/useAnimacionFisica'
import Boton from './Boton'
import { ViewTransitionProvider, TabsViewTransition, BadgeGiratorio, ModalViewTransition } from './ViewTransitions'
import styles from './TechHubWall.module.css'

const STORAGE_KEY = 'tech-hub-wall-fichas'
const MAX_FICHAS = 100

/** Genera ID único para fichas nuevas. */
function generarId() {
  return `ficha-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** Carga fichas guardadas en localStorage. */
function cargarFichasGuardadas() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/** Guarda fichas en localStorage. */
function guardarFichas(fichas) {
  try {
    const ordenadas = [...fichas].sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_FICHAS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenadas))
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e)
  }
}

/** Componente principal del Tech Hub Wall. */
export default function TechHubWall() {
  const reducido = useReducedMotion()
  const [filtroActivo, setFiltroActivo] = useState(FILTRO_TODAS)
  const [fichasUsuario, setFichasUsuario] = useState([])
  const [nuevaFicha, setNuevaFicha] = useState({ categoria: '', titulo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [fichaExpandida, setFichaExpandida] = useState(null)
  const { reboteEntrada } = useAnimacionFisica()

  // Cargar fichas guardadas al montar
  useEffect(() => {
    setFichasUsuario(cargarFichasGuardadas())
  }, [])

  // Combinar fichas semilla + usuario
  const todasLasFichas = useMemo(() => {
    const usuario = [...fichasUsuario].sort((a, b) => b.timestamp - a.timestamp)
    return [...FICHAS_SEMILLA, ...usuario]
  }, [fichasUsuario])

  // Filtrar por categoría
  const fichasFiltradas = useMemo(() => {
    if (filtroActivo === FILTRO_TODAS) return todasLasFichas
    return todasLasFichas.filter((f) => f.categoria === filtroActivo)
  }, [todasLasFichas, filtroActivo])

  // Agrupar por categoría para mostrar contadores
  const contadoresPorCategoria = useMemo(() => {
    const contadores = { [FILTRO_TODAS]: todasLasFichas.length }
    CATEGORIAS.forEach((cat) => {
      contadores[cat.id] = todasLasFichas.filter((f) => f.categoria === cat.id).length
    })
    return contadores
  }, [todasLasFichas])

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setErrorEnvio('')
    setEnviando(true)

    if (!nuevaFicha.categoria || !nuevaFicha.titulo.trim() || !nuevaFicha.texto.trim()) {
      setErrorEnvio('Completá todos los campos.')
      setEnviando(false)
      return
    }

    // Simular envío a servidor
    await new Promise((r) => setTimeout(r, 800))

    const ficha = {
      id: generarId(),
      categoria: nuevaFicha.categoria,
      titulo: nuevaFicha.titulo.trim(),
      texto: nuevaFicha.texto.trim(),
      autorespuesta: `Recién publicado`,
      etiquetas: ['Comunidad'],
      origen: 'usuario',
      timestamp: Date.now(),
      reacciones: { corazones: 0, banderas: 0 },
    }

    const actualizadas = [ficha, ...fichasUsuario]
    setFichasUsuario(actualizadas)
    guardarFichas(actualizadas)
    setNuevaFicha({ categoria: '', titulo: '', texto: '' })
    setEnviando(false)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)

    if (filtroActivo !== FILTRO_TODAS && filtroActivo !== nuevaFicha.categoria) {
      setFiltroActivo(FILTRO_TODAS)
    }
  }

  const toggleReaccion = (id, tipo) => {
    setFichasUsuario((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f
        const actual = f.reacciones?.[tipo] || 0
        return {
          ...f,
          reacciones: { ...f.reacciones, [tipo]: actual + 1 },
        }
      })
    )
  }

  const tarjetasFiltro = useMemo(() => [
    { id: FILTRO_TODAS, etiqueta: 'Todas', icono: MessageSquare },
    ...CATEGORIAS.map((c) => ({ id: c.id, etiqueta: c.etiqueta, icono: c.jornada === 'hacking-day' ? Heart : c.jornada === 'startup-day' ? Flag : User })),
  ], [])

  return (
    <ViewTransitionProvider nombre="tech-hub-wall">
      <section id="comunidad" className={styles.seccion} aria-labelledby="titulo-comunidad">
        <div className="contenedor">
          <header className={styles.encabezado}>
            <div>
              <p className={`etiqueta ${styles.etiqueta}`}>Comunidad</p>
              <h2 id="titulo-comunidad" className={styles.titulo}>
                Tech Hub Wall
              </h2>
            </div>
            <p className={styles.lema}>
              Tu espacio para compartir dudas, proyectos, conexiones y feedback.
            </p>
          </header>

          {/* Filtros con tabs animadas */}
          <TabsViewTransition
            tabs={tarjetasFiltro}
            activeTab={filtroActivo}
            onChange={setFiltroActivo}
            className={styles.filtros}
            renderTab={(tab, activo) => (
              <span className={`${styles.tabContent} ${activo ? styles.tabActivo : ''}`}>
                <tab.icono size={16} strokeWidth={2} aria-hidden="true" />
                <span>{tab.etiqueta}</span>
                <span className={styles.contador}>{contadoresPorCategoria[tab.id]}</span>
              </span>
            )}
          />

          {/* Muro de fichas */}
          <div className={styles.muro} role="feed" aria-label="Muro de experiencias y preguntas">
            <AnimatePresence mode="popLayout">
              {fichasFiltradas.length === 0 ? (
                <motion.div
                  key="vacio"
                  className={styles.vacio}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MessageSquare size={48} strokeWidth={1.5} className={styles.iconoVacio} />
                  <p>No hay mensajes en esta categoría todavía.</p>
                  <p className={styles.vacioSub}>Sé el primero en escribir.</p>
                </motion.div>
              ) : (
                fichasFiltradas.map((ficha, index) => (
                  <FichaMuro
                    key={ficha.id}
                    ficha={ficha}
                    indice={index}
                    reducido={reducido}
                    onExpandir={setFichaExpandida}
                    onReaccion={toggleReaccion}
                    esUsuario={ficha.origen === 'usuario'}
                    reboteEntrada={reboteEntrada}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Caja de nueva ficha */}
          <div className={styles.formularioContenedor}>
            <motion.div
              className={styles.formulario}
              initial={reducido ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className={styles.formularioTitulo}>
                <MessageSquare size={20} strokeWidth={2} aria-hidden="true" />
                Compartí tu experiencia o duda
              </h3>

              {enviado && (
                <motion.div
                  className={styles.exito}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <span className={styles.exitoIcono} aria-hidden="true">✓</span>
                  <span>¡Tu mensaje fue publicado! Gracias por participar.</span>
                </motion.div>
              )}

              <form onSubmit={manejarEnvio} className={styles.form} noValidate>
                <div className={styles.campo}>
                  <label htmlFor="categoria-ficha" className={styles.label}>Categoría</label>
                  <select
                    id="categoria-ficha"
                    className={styles.select}
                    value={nuevaFicha.categoria}
                    onChange={(e) => setNuevaFicha({ ...nuevaFicha, categoria: e.target.value })}
                    required
                    aria-required="true"
                  >
                    <option value="">Seleccioná una categoría</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c.id} value={c.id}>{c.etiqueta}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="titulo-ficha" className={styles.label}>Título</label>
                  <input
                    id="titulo-ficha"
                    type="text"
                    className={styles.input}
                    value={nuevaFicha.titulo}
                    onChange={(e) => setNuevaFicha({ ...nuevaFicha, titulo: e.target.value })}
                    placeholder="Ej: ¿Cómo formar equipo para el Hacking Day?"
                    maxLength={80}
                    required
                    aria-required="true"
                  />
                </div>

                <div className={styles.campo}>
                  <label htmlFor="texto-ficha" className={styles.label}>Tu mensaje</label>
                  <textarea
                    id="texto-ficha"
                    className={styles.textarea}
                    value={nuevaFicha.texto}
                    onChange={(e) => setNuevaFicha({ ...nuevaFicha, texto: e.target.value })}
                    placeholder="Escribí tu pregunta, comentario, idea o experiencia..."
                    rows={4}
                    maxLength={500}
                    required
                    aria-required="true"
                  />
                </div>

                {errorEnvio && (
                  <motion.p
                    className={styles.error}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errorEnvio}
                  </motion.p>
                )}

                <div className={styles.accionesForm}>
                  <Boton
                    tipo="submit"
                    variante="primario"
                    icono={Send}
                    deshabilitado={enviando}
                    className={styles.botonEnviar}
                  >
                    {enviando ? (
                      <>
                        <Loader2 size={18} strokeWidth={2} className={styles.spinner} aria-hidden="true" />
                        Enviando...
                      </>
                    ) : (
                      'Publicar en el muro'
                    )}
                  </Boton>

                  <p className={styles.notaForm}>
                    Tu mensaje se guarda localmente y es visible para todos los visitantes.
                    No se publican datos personales.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal de ficha expandida */}
      <ModalViewTransition
        isOpen={!!fichaExpandida}
        onClose={() => setFichaExpandida(null)}
        titulo={fichaExpandida?.titulo}
        className={styles.modalFicha}
      >
        {fichaExpandida && (
          <FichaExpandida
            ficha={fichaExpandida}
            onReaccion={toggleReaccion}
            onCerrar={() => setFichaExpandida(null)}
            reducido={reducido}
          />
        )}
      </ModalViewTransition>
    </ViewTransitionProvider>
  )
}

/** Tarjeta individual del muro. */
function FichaMuro({
  ficha,
  indice,
  reducido,
  onExpandir,
  onReaccion,
  esUsuario,
  reboteEntrada,
}) {
  const categoria = CATEGORIA_POR_ID[ficha.categoria]
  const y = useMotionValue(0)
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 })
  const x = useMotionValue(0)
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 })

  const colorAcento = categoria?.jornada === 'hacking-day' ? '#EC4899' : categoria?.jornada === 'startup-day' ? '#A855F7' : '#8B86AC'

  return (
    <motion.article
      className={`${styles.ficha} ${styles[ficha.categoria]} ${esUsuario ? styles.fichaUsuario : ''}`}
      style={{
        '--acento-ficha': colorAcento,
        transform: `translate(${xSpring.get()}px, ${ySpring.get()}px)`,
      }}
      initial={reducido ? {} : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reducido ? 0 : Math.min(indice * 0.05, 0.4), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => { y.set(-4); x.set((Math.random() - 0.5) * 4) }}
      onHoverEnd={() => { y.set(0); x.set(0) }}
      onClick={() => onExpandir(ficha)}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onExpandir(ficha) } }}
      role="article"
      aria-label={`${ficha.titulo}. ${esUsuario ? 'Aporte de la comunidad' : 'Información oficial'}`}
    >
      <div className={styles.fichaEncabezado}>
        <span className={`${styles.badge} ${styles[ficha.categoria]}`}>
          {categoria?.etiqueta || ficha.categoria}
        </span>
        {esUsuario && <BadgeGiratorio velocidad={12} colorAcento={colorAcento}>Comunidad</BadgeGiratorio>}
        {!esUsuario && <span className={styles.badgeOficial}>Oficial</span>}
      </div>

      <h3 className={styles.fichaTitulo}>{ficha.titulo}</h3>

      <p className={styles.fichaTexto}>{ficha.texto}</p>

      {ficha.etiquetas && ficha.etiquetas.length > 0 && (
        <div className={styles.etiquetas}>
          {ficha.etiquetas.map((etq) => (
            <span key={etq} className={styles.etiqueta}>{etq}</span>
          ))}
        </div>
      )}

      <footer className={styles.fichaPie}>
        <div className={styles.reacciones}>
          <button
            className={`${styles.reaccion} ${styles.corazon}`}
            onClick={(e) => { e.stopPropagation(); onReaccion(ficha.id, 'corazones') }}
            aria-label={`Dar like. ${ficha.reacciones?.corazones || 0} likes`}
          >
            <Heart size={16} strokeWidth={2} fill={ficha.reacciones?.corazones ? 'currentColor' : 'none'} aria-hidden="true" />
            <span>{ficha.reacciones?.corazones || 0}</span>
          </button>
          <button
            className={`${styles.reaccion} ${styles.bandera}`}
            onClick={(e) => { e.stopPropagation(); onReaccion(ficha.id, 'banderas') }}
            aria-label={`Marcar como útil. ${ficha.reacciones?.banderas || 0} votos`}
          >
            <Flag size={16} strokeWidth={2} aria-hidden="true" />
            <span>{ficha.reacciones?.banderas || 0}</span>
          </button>
        </div>

        <div className={styles.meta}>
          <span className={styles.fecha}>
            <Clock size={13} strokeWidth={1.8} aria-hidden="true" />
            {ficha.autorespuesta}
          </span>
          {esUsuario && (
            <span className={styles.autor}>
              <User size={13} strokeWidth={1.8} aria-hidden="true" />
              Anónimo
            </span>
          )}
        </div>

        <span className={styles.expandir}>
          <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
          <span className="rotulo-visual">Ver más</span>
        </span>
      </footer>
    </motion.article>
  )
}

/** Ficha expandida en modal. */
function FichaExpandida({ ficha, onReaccion, onCerrar, reducido }) {
  const categoria = CATEGORIA_POR_ID[ficha.categoria]
  const colorAcento = categoria?.jornada === 'hacking-day' ? '#EC4899' : categoria?.jornada === 'startup-day' ? '#A855F7' : '#8B86AC'

  return (
    <div className={`${styles.fichaExpandida} ${styles[ficha.categoria]}`} style={{ '--acento-ficha': colorAcento }}>
      <div className={styles.fichaEncabezado}>
        <span className={`${styles.badge} ${styles[ficha.categoria]}`}>
          {categoria?.etiqueta || ficha.categoria}
        </span>
        {ficha.origen === 'usuario' && <BadgeGiratorio velocidad={12} colorAcento={colorAcento}>Comunidad</BadgeGiratorio>}
        {ficha.origen !== 'usuario' && <span className={styles.badgeOficial}>Oficial</span>}
      </div>

      <h3 className={styles.fichaTitulo}>{ficha.titulo}</h3>

      <div className={styles.fichaTextoExpandida}>{ficha.texto}</div>

      {ficha.etiquetas && ficha.etiquetas.length > 0 && (
        <div className={styles.etiquetas}>
          {ficha.etiquetas.map((etq) => (
            <span key={etq} className={styles.etiqueta}>{etq}</span>
          ))}
        </div>
      )}

      <div className={styles.reaccionesGrande}>
        <button
          className={`${styles.reaccionGrande} ${styles.corazon}`}
          onClick={() => onReaccion(ficha.id, 'corazones')}
          aria-label={`Dar like. ${ficha.reacciones?.corazones || 0} likes`}
        >
          <Heart size={22} strokeWidth={2} fill={ficha.reacciones?.corazones ? 'currentColor' : 'none'} aria-hidden="true" />
          <span>{ficha.reacciones?.corazones || 0}</span>
          <span className={styles.reaccionLabel}>Me gusta</span>
        </button>
        <button
          className={`${styles.reaccionGrande} ${styles.bandera}`}
          onClick={() => onReaccion(ficha.id, 'banderas')}
          aria-label={`Marcar como útil. ${ficha.reacciones?.banderas || 0} votos`}
        >
          <Flag size={22} strokeWidth={2} aria-hidden="true" />
          <span>{ficha.reacciones?.banderas || 0}</span>
          <span className={styles.reaccionLabel}>Útil</span>
        </button>
      </div>

      <div className={styles.metaExpandida}>
        <span className={styles.fecha}>
          <Clock size={14} strokeWidth={1.8} aria-hidden="true" />
          {ficha.autorespuesta}
        </span>
        {ficha.origen === 'usuario' && (
          <span className={styles.autor}>
            <User size={14} strokeWidth={1.8} aria-hidden="true" />
            Publicado por la comunidad
          </span>
        )}
      </div>
    </div>
  )
}