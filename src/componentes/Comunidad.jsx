import { useState } from 'react'
import FichaComunidad from './FichaComunidad'
import FiltrosComunidad from './FiltrosComunidad'
import FormularioComunidad from './FormularioComunidad'
import { CATEGORIAS, CATEGORIA_POR_ID, FILTRO_TODAS } from '../datos/comunidad'
import { useMuroComunidad } from '../hooks/useMuroComunidad'
import styles from './Comunidad.module.css'

/**
 * Tech Hub Wall: muro de comunidad y feedback.
 *
 * Une fichas de la organización (preguntas reales respondidas con información
 * oficial) con los aportes que escribe cada visitante en su propio navegador.
 * Los filtros trabajan sobre la lista combinada.
 */
export default function Comunidad() {
  const { fichas, agregar, quitar } = useMuroComunidad()
  const [filtro, setFiltro] = useState(FILTRO_TODAS)

  const contadores = CATEGORIAS.reduce((acumulado, categoria) => {
    acumulado[categoria.id] = fichas.filter((ficha) => ficha.categoria === categoria.id).length
    return acumulado
  }, {})

  const visibles =
    filtro === FILTRO_TODAS ? fichas : fichas.filter((ficha) => ficha.categoria === filtro)

  return (
    <section id="comunidad" className={`seccion ${styles.seccion}`} aria-labelledby="titulo-comunidad">
      <div className="contenedor">
        <header className={styles.encabezado} data-aos="fade-up">
          <div>
            <p className={`etiqueta ${styles.etiqueta}`}>Tech Hub Wall</p>
            <h2 id="titulo-comunidad" className={`seccion-titulo ${styles.titulo}`}>
              La comunidad ya está hablando.
            </h2>
          </div>
          <p className="seccion-lede">
            Dudas, expectativas y proyectos. Dejá tu consulta y sumate al muro: queda guardada en
            este navegador y se combina con las preguntas frecuentes del evento.
          </p>
        </header>

        <FiltrosComunidad
          filtro={filtro}
          onFiltrar={setFiltro}
          totales={{ todas: fichas.length, ...contadores }}
        />

        {visibles.length === 0 ? (
          <p className={styles.vacio}>
            Todavía no hay aportes en esta categoría. Escribí el primero desde el formulario.
          </p>
        ) : (
          <ul className={styles.muro}>
            {visibles.map((ficha, indice) => (
              <li key={ficha.id}>
                <FichaComunidad
                  ficha={ficha}
                  categoria={CATEGORIA_POR_ID[ficha.categoria]}
                  indice={indice}
                  onQuitar={quitar}
                />
              </li>
            ))}
          </ul>
        )}

        <FormularioComunidad onAgregar={agregar} />
      </div>
    </section>
  )
}