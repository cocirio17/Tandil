import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Check, MessageSquarePlus } from 'lucide-react'
import { CATEGORIAS } from '../datos/comunidad'
import styles from './FormularioComunidad.module.css'

/**
 * Caja de preguntas y mensajes.
 *
 * No hay backend: el aporte se guarda en el navegador y se refleja al instante
 * en el muro. El estado de éxito es real (ya está en pantalla), no una promesa.
 */
export default function FormularioComunidad({ onAgregar }) {
  const reducido = useReducedMotion()
  const [categoria, setCategoria] = useState(CATEGORIAS[0].id)
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [enviado, setEnviado] = useState(false)

  const valido = titulo.trim().length >= 4 && texto.trim().length >= 10

  const enviar = (evento) => {
    evento.preventDefault()
    if (!valido) return
    onAgregar({
      categoria,
      titulo: titulo.trim(),
      texto: texto.trim(),
    })
    setTitulo('')
    setTexto('')
    setEnviado(true)
    window.setTimeout(() => setEnviado(false), 4000)
  }

  return (
    <form
      className={styles.formulario}
      onSubmit={enviar}
      aria-labelledby="titulo-formulario"
      data-aos="fade-up"
      noValidate
    >
      <div className={styles.encabezado}>
        <h3 id="titulo-formulario" className={styles.titulo}>
          <MessageSquarePlus size={20} strokeWidth={1.8} aria-hidden="true" />
          Dejá tu pregunta o idea
        </h3>
        <p className={styles.ayuda}>
          Se guarda en este navegador y aparece arriba en el muro. Sin cuentas ni datos personales.
        </p>
      </div>

      <fieldset className={styles.campo}>
        <legend className={styles.etiqueta}>Temática</legend>
        <div className={styles.opciones}>
          {CATEGORIAS.map((opcion) => (
            <label
              key={opcion.id}
              className={`${styles.opcion} ${categoria === opcion.id ? styles.opcionActiva : ''}`}
            >
              <input
                type="radio"
                name="categoria"
                value={opcion.id}
                checked={categoria === opcion.id}
                onChange={() => setCategoria(opcion.id)}
              />
              <span>{opcion.etiqueta}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.campo}>
        <label className={styles.etiqueta} htmlFor="comunidad-titulo">
          Título
        </label>
        <input
          id="comunidad-titulo"
          className={styles.entrada}
          type="text"
          value={titulo}
          onChange={(evento) => setTitulo(evento.target.value)}
          placeholder="Ej.: ¿hay que llevar notebook?"
          maxLength={80}
          required
        />
        <span className={styles.contador}>{titulo.length}/80</span>
      </div>

      <div className={styles.campo}>
        <label className={styles.etiqueta} htmlFor="comunidad-texto">
          Mensaje
        </label>
        <textarea
          id="comunidad-texto"
          className={`${styles.entrada} ${styles.textarea}`}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Contá tu duda, tu proyecto o qué te gustaría encontrarte en la jornada."
          rows={4}
          maxLength={400}
          required
        />
        <span className={styles.contador}>{texto.length}/400</span>
      </div>

      <div className={styles.pie}>
        <button type="submit" className={styles.enviar} disabled={!valido}>
          Publicar en el muro
        </button>
        <span className={styles.aviso} role="status">
          {enviado && (
            <motion.span
              className={styles.exito}
              initial={reducido ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Check size={15} strokeWidth={2.2} aria-hidden="true" />
              ¡Publicado! Ya aparece arriba en el muro.
            </motion.span>
          )}
        </span>
      </div>
    </form>
  )
}