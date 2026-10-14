import { useCallback, useMemo, useState } from 'react'
import { AGENDA, EVENTO, INSCRIPCION, JORNADAS } from '../datos/evento'
import { fechaLargaEnZona } from '../utils/fecha'

const CLAVE_VISTAS = 'ttw2026-novedades-vistas'
const CLAVE_SUSCRIPCION = 'ttw2026-suscripcion'

/** Estados que encienden el badge de la campana. */
const ESTADOS_ACTIVOS = ['en-vivo', 'proximamente', 'aviso']

function leerGuardado(clave, porDefecto) {
  try {
    const bruto = window.localStorage.getItem(clave)
    return bruto ? JSON.parse(bruto) : porDefecto
  } catch {
    return porDefecto
  }
}

function guardar(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // Modo privado o cuota agotada: el centro sigue funcionando en memoria.
  }
}

/**
 * Notificación por cada jornada, con estado calculado en tiempo de ejecución
 * a partir de la fecha del evento (nunca con fechas escritas a mano).
 */
function notificacionesDeJornadas(estadoEvento) {
  return JORNADAS.map((jornada) => {
    const finalizada = estadoEvento.finalizado || jornada.fecha < (estadoEvento.jornadaActiva?.fecha ?? '')
    const enVivo = estadoEvento.jornadaActiva?.id === jornada.id

    let estado
    let titulo
    let texto

    if (enVivo) {
      estado = 'en-vivo'
      titulo = `¡HOY es ${jornada.nombre}!`
      texto = `La jornada ya está en curso en ${jornada.sede.nombre}. ${jornada.horario}.`
    } else if (finalizada) {
      estado = 'finalizado'
      titulo = `${jornada.nombre} ya ocurrió`
      texto = `${fechaLargaEnZona(jornada.inicio, EVENTO.zonaHoraria)} en ${jornada.sede.nombre}. Queda el registro en los canales oficiales.`
    } else {
      estado = 'proximamente'
      titulo = `${jornada.nombre} se acerca`
      texto = `${fechaLargaEnZona(jornada.inicio, EVENTO.zonaHoraria)} · ${jornada.sede.nombre}. ${jornada.horario}.`
    }

    return {
      id: jornada.id,
      estado,
      titulo,
      texto,
      accion: { href: `#${jornada.id}`, etiqueta: `Ver ${jornada.nombre}` },
    }
  })
}

/**
 * Avisos editoriales derivados de la configuración: solo se muestran mientras
 * los datos del evento los justifican (inscripción abierta, agenda sin publicar).
 */
function notificacionesEditoriales(estadoEvento) {
  const avisos = []

  if (estadoEvento.inscripcionesAbiertas) {
    avisos.push({
      id: 'inscripcion',
      estado: 'aviso',
      titulo: 'Inscripción abierta',
      texto: INSCRIPCION.mensaje,
      accion: { href: EVENTO.inscripcion, etiqueta: 'Inscribirme', externo: true },
    })
  }

  if (!AGENDA.disponible) {
    avisos.push({
      id: 'agenda',
      estado: 'aviso',
      titulo: 'Agenda completa por anunciar',
      texto: AGENDA.aviso,
      accion: { href: EVENTO.redes[0].url, etiqueta: `Seguir ${EVENTO.redes[0].usuario}`, externo: true },
    })
  }

  return avisos
}

/** Orden de prioridad para la lista y para el banner flotante. */
const PESO_ESTADO = { 'en-vivo': 0, aviso: 1, proximamente: 2, finalizado: 3 }

/**
 * Centro de novedades: lista viva, badge de no leídas y suscripción local.
 *
 * No hay backend: las vistas y la suscripción se guardan en `localStorage` y el
 * texto de la suscripción lo dice sin rodeos, como el resto del sitio.
 *
 * @param {object} estadoEvento - Estado devuelto por `useFaseEvento`.
 */
export function useNotificaciones(estadoEvento) {
  const [vistas, setVistas] = useState(() => {
    const guardadas = leerGuardado(CLAVE_VISTAS, [])
    return Array.isArray(guardadas) ? guardadas : []
  })
  const [suscripcion, setSuscripcion] = useState(() => leerGuardado(CLAVE_SUSCRIPCION, null))

  const notificaciones = useMemo(() => {
    const todas = [
      ...notificacionesDeJornadas(estadoEvento),
      ...notificacionesEditoriales(estadoEvento),
    ]
    return todas.sort((a, b) => PESO_ESTADO[a.estado] - PESO_ESTADO[b.estado])
    // La lista solo depende del fase del evento, no del tick por segundo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoEvento.fase, estadoEvento.inscripcionesAbiertas])

  const sinLeer = notificaciones.filter(
    (notificacion) => ESTADOS_ACTIVOS.includes(notificacion.estado) && !vistas.includes(notificacion.id),
  ).length

  const marcarVistas = useCallback(() => {
    setVistas((previas) => {
      const ids = [...new Set([...previas, ...notificaciones.map((n) => n.id)])]
      guardar(CLAVE_VISTAS, ids)
      return ids
    })
  }, [notificaciones])

  const suscribir = useCallback((email) => {
    const valor = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      return { ok: false, error: 'Ingresá un email válido para continuar.' }
    }

    const registro = { email: valor, creado: new Date().toISOString() }
    setSuscripcion(registro)
    guardar(CLAVE_SUSCRIPCION, registro)
    return { ok: true }
  }, [])

  const desuscribir = useCallback(() => {
    setSuscripcion(null)
    guardar(CLAVE_SUSCRIPCION, null)
  }, [])

  return {
    notificaciones,
    sinLeer,
    marcarVistas,
    suscripcion,
    suscribir,
    desuscribir,
  }
}

/** Notificación de mayor prioridad para el banner flotante. */
export function notificacionDestacada(notificaciones) {
  return notificaciones.find((notificacion) => notificacion.estado === 'en-vivo')
    ?? notificaciones.find((notificacion) => notificacion.estado === 'proximamente')
    ?? null
}
