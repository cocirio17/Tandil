import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { EVENTO, JORNADAS } from '../datos/evento'
import styles from './Introduccion.module.css'

const PILARES = [
  {
    titulo: 'Conocimiento',
    texto:
      'Aprendizaje colaborativo entre pares, con prácticas reales e intercambio de experiencia.',
  },
  {
    titulo: 'Comunidad',
    texto:
      'Desarrolladores, estudiantes, emprendedores y referentes reunidos en un mismo espacio.',
  },
  {
    titulo: 'Oportunidades',
    texto:
      'Vínculos que conectan proyectos, talento y capital dentro del ecosistema tecnológico local.',
  },
]

const MANIFIESTO = 'La tecnología también se construye en comunidad.'

function PalabraProgresiva({ palabra, indice, cantidad, progreso, reducido }) {
  const desde = 0.12 + (indice / cantidad) * 0.42
  const hasta = desde + 0.2
  const opacidad = useTransform(progreso, [desde, hasta], [0.28, 1])

  return (
    <motion.span
      aria-hidden="true"
      className={styles.palabra}
      style={reducido ? undefined : { opacity: opacidad }}
    >
      {palabra}{' '}
    </motion.span>
  )
}

export default function Introduccion() {
  const manifiesto = useRef(null)
  const reducido = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: manifiesto,
    offset: ['start 0.82', 'end 0.38'],
  })
  const palabras = MANIFIESTO.split(' ')

  return (
    <section id="comunidad" className={`seccion ${styles.seccion}`} aria-labelledby="titulo-comunidad">
      <div className="contenedor">
        <div className={styles.rejilla}>
          <div data-aos="fade-up">
            <p className={`etiqueta ${styles.etiqueta}`}>El evento</p>
            <h2
              id="titulo-comunidad"
              ref={manifiesto}
              className={`seccion-titulo ${styles.titulo}`}
              aria-label={MANIFIESTO}
            >
              {palabras.map((palabra, indice) => (
                <PalabraProgresiva
                  key={`${palabra}-${indice}`}
                  palabra={palabra}
                  indice={indice}
                  cantidad={palabras.length}
                  progreso={scrollYProgress}
                  reducido={reducido}
                />
              ))}
            </h2>
          </div>

          <div className={styles.cuerpo} data-aos="fade-up" data-aos-delay="80">
            <p className="seccion-lede">
              Tandil Tech Week reúne a personas, organizaciones y proyectos del ecosistema tecnológico
              para compartir conocimientos, explorar nuevas ideas y generar conexiones. Dos jornadas
              diferentes se encuentran en un mismo espacio de innovación.
            </p>
            <p className={styles.nota}>
              {EVENTO.primeraEdicion ? 'Primera edición' : 'Nueva edición'} en Tandil:{' '}
              {JORNADAS.map((jornada) => jornada.nombre).join(' y ')}. Inscripción gratuita y sujeta
              a aprobación.
            </p>
          </div>
        </div>

        <ul className={styles.pilares}>
          {PILARES.map((pilar, indice) => (
            <li key={pilar.titulo} data-aos="fade-up" data-aos-delay={indice * 90}>
              <span className={styles.pilarIndice}>{String(indice + 1).padStart(2, '0')}</span>
              <h3 className={styles.pilarTitulo}>{pilar.titulo}</h3>
              <p className={styles.pilarTexto}>{pilar.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}