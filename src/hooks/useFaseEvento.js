import { useEffect, useState } from 'react'
import { EVENTO, JORNADAS } from '../datos/evento'
import { descomponer } from '../utils/fecha'

/**
 * Calcula el estado temporal del evento a partir de las fechas de `JORNADAS`.
 * No hay ninguna fecha escrita a mano en la vista: todo sale de la configuración.
 */
function calcular(momento = Date.now()) {
  const [primera, segunda] = JORNADAS
  const inicioPrimera = Date.parse(primera.inicio)
  const fechaLocal = new Intl.DateTimeFormat('en-CA', {
    timeZone: EVENTO.zonaHoraria,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(new Date(momento))
    .filter((parte) => parte.type !== 'literal')
    .map((parte) => parte.value)
    .join('-')

  // El estado editorial sigue el día calendario de Argentina, no las horas de cada sede.
  const jornadaActiva = JORNADAS.find((jornada) => jornada.fecha === fechaLocal) ?? null
  const finalizado = fechaLocal > segunda.fecha
  const fase = finalizado ? 'finalizado' : jornadaActiva?.id ?? 'proximo'
  const jornadaSiguiente = fechaLocal < primera.fecha ? primera : null

  // Antes del primer día cuenta hasta su horario oficial de inicio.
  const cuentaRegresiva =
    jornadaSiguiente && momento < inicioPrimera
      ? descomponer(inicioPrimera - momento)
      : null

  return {
    fase,
    jornadaActiva,
    jornadaSiguiente,
    cuentaRegresiva,
    enCurso: jornadaActiva !== null,
    finalizado,
    /** Una vez terminado el evento no se ofrece inscripción. */
    inscripcionesAbiertas: !finalizado,
    ahora: new Date(momento),
    zonaHoraria: EVENTO.zonaHoraria,
  }
}

/**
 * Estado del evento, refrescado en vivo.
 * @param {number} intervalo - Frecuencia de actualización en milisegundos.
 */
export function useFaseEvento(intervalo = 1000) {
  const [estado, setEstado] = useState(calcular)

  useEffect(() => {
    const temporizador = setInterval(() => setEstado(calcular()), intervalo)
    // Al volver a la pestaña se recalcula al instante: no hay desfases por inactividad.
    const alVolver = () => setEstado(calcular())
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(temporizador)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [intervalo])

  return estado
}

export { calcular as estadoEvento }