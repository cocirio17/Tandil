import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { GRUPOS_ORGANIZACIONES } from '../datos/organizaciones'
import ParallaxFondo from './ParallaxFondo'
import styles from './Organizaciones.module.css'

/** Capas de fondo con velocidades distintas: profundidad durante el scroll. */
const CAPAS_FONDO = [
  { id: 'malla', velocidad: 0.05, opacidad: 0.4, className: 'grid-pattern' },
  { id: 'estrellas', velocidad: 0.14, className: 'estrellas' },
  { id: 'particulas', velocidad: 0.3, className: 'particulas' },
]

/** Muro de logos. Las marcas se muestran con su SVG oficial, sin redibujar. */
function Logo({ organizacion }) {
  return (
    <motion.a
      className={styles.logo}
      href={organizacion.sitio}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${organizacion.nombre} — ${organizacion.dominio} (sitio oficial, se abre en una pestaña nueva)`}
      initial={false}
      whileHover="resaltado"
      whileFocus="resaltado"
    >
      <motion.span
        className={styles.logoMarco}
        variants={{
          resaltado: {
            borderColor: 'color-mix(in srgb, var(--acento-hacking) 45%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--acento-hacking) 5%, transparent)',
          },
        }}
        transition={{ duration: 0.28, ease: [0.22, 0.68, 0.28, 1] }}
      >
        <img
          className={styles.logoImagen}
          src={organizacion.logo}
          alt=""
          width="240"
          height="72"
          loading="lazy"
          decoding="async"
        />
        <span className={styles.logoSalida}>
          <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
        </span>
      </motion.span>

      <span className={styles.logoPie}>
        <span className={styles.logoNombre}>{organizacion.nombre}</span>
        {organizacion.area && <span className={styles.logoArea}>{organizacion.area}</span>}
      </span>
    </motion.a>
  )
}

export default function Organizaciones() {
  const reducido = useReducedMotion()

  return (
    <section
      id="organizaciones"
      className={`seccion seccion--borde ${styles.seccion}`}
      aria-labelledby="titulo-organizaciones"
    >
      <ParallaxFondo capas={CAPAS_FONDO} trigger={undefined} />

      <div className="contenedor">
        <header className={styles.encabezado} data-aos="fade-up">
          <p className={`etiqueta ${styles.etiqueta}`}>Comunidad</p>
          <h2 id="titulo-organizaciones" className={`seccion-titulo ${styles.titulo}`}>
            Impulsado por una comunidad que crea.
          </h2>
          <p className="seccion-lede">
            Organizaciones que forman parte del ecosistema tecnológico y emprendedor de Tandil.
          </p>
        </header>

        {GRUPOS_ORGANIZACIONES.map((grupo) => (
          <section key={grupo.id} className={styles.grupo} aria-labelledby={`grupo-${grupo.id}`}>
            <div className={styles.grupoEncabezado} data-aos="fade-up">
              <h3 id={`grupo-${grupo.id}`} className={styles.grupoTitulo}>
                {grupo.titulo}
              </h3>
              <p className={styles.grupoLede}>{grupo.lede}</p>
            </div>

            <ul
              className={styles.rejilla}
            >
              {grupo.organizaciones.map((organizacion, indice) => (
                <li
                  key={organizacion.id}
                  data-aos="zoom-in-up"
                  data-aos-delay={Math.min(indice * 70 + (grupo.id === 'acompanan' ? 60 : 0), 420)}
                >
                  <Logo organizacion={organizacion} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <motion.p
          className={styles.nota}
          initial={reducido ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          Los logotipos pertenecen a cada organización y se utilizan con su formato oficial. Cada
          enlace lleva a su sitio web.
        </motion.p>
      </div>
    </section>
  )
}