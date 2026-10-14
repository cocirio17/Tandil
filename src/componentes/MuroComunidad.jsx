import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BadgeCheck, Send, Trash2 } from 'lucide-react'
import { useMuroComunidad } from '../hooks/useMuroComunidad'
import { CATEGORIA_POR_ID, CATEGORIAS, FILTRO_TODAS } from '../datos/comunidad'
import { conTransicionVista } from '../utils/transicionVista'
import { crearCapasMuro } from '../utils/capasParallax'
import { useAnimacionFisica } from '../hooks/useAnimacionFisica'
import ParallaxFondo from './ParallaxFondo'
import { Fondo3D } from './Elementos3D'
import styles from './MuroComunidad.module.css'

const MINIMO_TITULO = 4
const MINIMO_TEXTO = 12

function Ficha({ ficha, propia, alQuitar, reducido }) {
  const categoria = CATEGORIA_POR_ID[ficha.categoria]

  return (
    <motion.li
      layout
      className={styles.fichaWrapper}
      initial={reducido ? false : { opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <article
        className={`${styles.ficha} ${propia ? styles.fichaPropia : ''}`}
        aria-label={`${ficha.titulo}${propia ? ' (publicada por ti)' : ''}`}
      >
        <header className={styles.fichaCabecera}>
          {categoria && <p className={styles.categoria}>{categoria.etiqueta}</p>}
          <p className={`${styles.origen} ${propia ? styles.origenPropia : ''}`}>
            {propia ? 'Tu aporte' : 'Oficial'}
          </p>
        </header>

        <h3 className={styles.fichaTitulo}>{ficha.titulo}</h3>
        <p className={styles.fichaTexto}>{ficha.texto}</p>

        {ficha.autorespuesta && (
          <p className={styles.respuesta}>
            <BadgeCheck size={14} strokeWidth={2} aria-hidden="true" />
            {ficha.autorespuesta}
          </p>
        )}

        {ficha.etiquetas?.length > 0 && (
          <ul className={styles.etiquetas} aria-label="Temas">
            {ficha.etiquetas.map((etiqueta) => (
              <li key={etiqueta} className={styles.etiquetaFicha}>{etiqueta}</li>
            ))}
          </ul>
        )}

        {propia && (
          <button
            type="button"
            className={styles.quitar}
            onClick={(evento) => alQuitar(ficha, evento.currentTarget)}
          >
            <Trash2 size={14} strokeWidth={2} aria-hidden="true" />
            <span className="rotulo-visual">Quitar tu aporte</span>
          </button>
        )}
      </article>
    </motion.li>
  )
}

/**
 * Tech Hub Wall: muro de experiencias, foro por temática y caja de consultas.
 * El filtro usa View Transitions; las fichas propias salen volando al quitarse.
 */
export default function MuroComunidad() {
  const { fichas, agregar, quitar } = useMuroComunidad()
  const [filtro, setFiltro] = useState(FILTRO_TODAS)
  const [campos, setCampos] = useState({ categoria: CATEGORIAS[0].id, titulo: '', texto: '' })
  const [errores, setErrores] = useState({})
  const [publicado, setPublicado] = useState(false)
  const { volarFuera } = useAnimacionFisica()
  const reducido = useReducedMotion()

  const visibles = filtro === FILTRO_TODAS
    ? fichas
    : fichas.filter((ficha) => ficha.categoria === filtro)

  const esPropia = (ficha) => ficha.origen === 'propia'

  const cambiarFiltro = (id) => {
    conTransicionVista(() => setFiltro(id))
  }

  /** La ficha propia sale volando con física y luego se elimina. */
  const alQuitar = async (ficha, boton) => {
    if (reducido) {
      quitar(ficha.id)
      return
    }
    // La tarjeta vive en el wrapper animado: se toma desde el botón.
    const wrapper = boton?.closest('li')
    const tarjeta = wrapper?.querySelector('article') ?? wrapper
    if (tarjeta) await volarFuera(tarjeta)
    quitar(ficha.id)
  }

  const enviar = (evento) => {
    evento.preventDefault()
    const validacion = {}
    if (campos.titulo.trim().length < MINIMO_TITULO) {
      validacion.titulo = `El título necesita al menos ${MINIMO_TITULO} caracteres.`
    }
    if (campos.texto.trim().length < MINIMO_TEXTO) {
      validacion.texto = `Contanos un poco más: al menos ${MINIMO_TEXTO} caracteres.`
    }
    setErrores(validacion)

    if (Object.keys(validacion).length > 0) return

    agregar({
      categoria: campos.categoria,
      titulo: campos.titulo.trim(),
      texto: campos.texto.trim(),
    })
    setCampos((previos) => ({ ...previos, titulo: '', texto: '' }))
    setPublicado(true)
  }

  const pestanas = [
    { id: FILTRO_TODAS, etiqueta: 'Todas' },
    ...CATEGORIAS.map((categoria) => ({ id: categoria.id, etiqueta: categoria.etiqueta })),
  ]

  return (
    <section id="comunidad" className="seccion seccion--borde" aria-labelledby="titulo-comunidad">
      <div className={styles.fondo} aria-hidden="true">
        <ParallaxFondo capas={crearCapasMuro()} />
        <div className={styles.escena3d}>
          <Fondo3D colorAcento="#A855F7" semilla={7} />
        </div>
        <span className={styles.brillo} />
      </div>

      <div className="contenedor">
        <header className={styles.encabezado} data-aos="fade-up">
          <p className="etiqueta">Tech Hub Wall</p>
          <h2 id="titulo-comunidad" className={`seccion-titulo ${styles.titulo}`}>
            El muro donde la comunidad <span className={styles.tituloSubrayado}>deja su marca</span>.
          </h2>
          <p className="seccion-lede">
            Expectativas, preguntas y experiencias de quienes van a participar. Las respuestas
            oficiales están verificadas; tus aportes se guardan en este navegador.
          </p>
        </header>

        <div className={styles.pestanas} role="tablist" aria-label="Filtrar fichas por temática" data-aos="fade-up">
          {pestanas.map((pesta) => {
            const activa = filtro === pestaña.id
            const total = pestaña.id === FILTRO_TODAS
              ? fichas.length
              : fichas.filter((ficha) => ficha.categoria === pestaña.id).length

            return (
              <button
                key={pesta.id}
                type="button"
                role="tab"
                aria-selected={activa}
                className={styles.pestanasInactiva}
                onClick={() => cambiarFiltro(pesta.id)}
              >
                {activa && <motion.span layoutId="muro-pildora" className={styles.pildora} transition={reducido ? { duration: 0.01 } : { type: 'spring', stiffness: 420, damping: 32 }} aria-hidden="true" />}
                {pesta.etiqueta}
                <span className={styles.contador}>{total}</span>
                <span className="rotulo-visual">{activa ? '(activo)' : ''}</span>
              </button>
            )
          })}
        </div>

        <motion.ul className={styles.rejilla} layout aria-live="polite">
          <AnimatePresence>
            {visibles.map((ficha) => (
              <Ficha
                key={ficha.id}
                ficha={ficha}
                propia={esPropia(ficha)}
                alQuitar={alQuitar}
                reducido={reducido}
              />
            ))}
          </AnimatePresence>
          {visibles.length === 0 && (
            <li className={styles.vacio}>Todavía no hay fichas en esta temática. Abrí el camino.</li>
          )}
        </motion.ul>

        <form className={styles.formulario} onSubmit={enviar} noValidate data-aos="fade-up">
          <h3 className={styles.formularioTitulo}>Dejá tu consulta o expectativa</h3>
          <p className={styles.formularioLede}>
            Se publica al instante en el muro de este navegador y se suma a la conversación del evento.
          </p>

          <div className={styles.campos}>
            <div className={styles.campo}>
              <label className={styles.rotuloCampo} htmlFor="muro-categoria">Temática</label>
              <select
                id="muro-categoria"
                className={styles.selector}
                value={campos.categoria}
                onChange={(evento) => setCampos((previos) => ({ ...previos, categoria: evento.target.value }))}
              >
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.etiqueta}</option>
                ))}
              </select>
            </div>

            <div className={styles.campo}>
              <label className={styles.rotuloCampo} htmlFor="muro-titulo">Título</label>
              <input
                id="muro-titulo"
                className={styles.entrada}
                type="text"
                placeholder="¿Qué te gustaría ver en el evento?"
                value={campos.titulo}
                aria-invalid={Boolean(errores.titulo)}
                onChange={(evento) => {
                  setCampos((previos) => ({ ...previos, titulo: evento.target.value }))
                  setErrores((previos) => ({ ...previos, titulo: null }))
                }}
              />
            </div>

            <div className={`${styles.campo} ${styles.campoAncho}`}>
              <label className={styles.rotuloCampo} htmlFor="muro-texto">Tu mensaje</label>
              <textarea
                id="muro-texto"
                className={styles.textarea}
                placeholder="Contá qué esperás del Hacking Day, del Startup Day o de la comunidad."
                value={campos.texto}
                aria-invalid={Boolean(errores.texto)}
                onChange={(evento) => {
                  setCampos((previos) => ({ ...previos, texto: evento.target.value }))
                  setErrores((previos) => ({ ...previos, texto: null }))
                }}
              />
            </div>
          </div>

          <div className={styles.pie}>
            <button
              type="submit"
              className={styles.publicar}
            >
              <Send size={15} strokeWidth={2} aria-hidden="true" />
              Publicar en el muro
            </button>

            <div className={styles.avisos} role="status">
              {Object.values(errores).some(Boolean) ? (
                <p className={styles.avisoError}>
                  {Object.values(errores).filter(Boolean).map((error) => <span key={error}>{error}</span>)}
                </p>
              ) : publicado ? (
                <motion.p
                  className={styles.avisoExito}
                  initial={reducido ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BadgeCheck size={14} strokeWidth={2} aria-hidden="true" />
                  ¡Tu ficha ya está en el muro de este navegador!
                </motion.p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
