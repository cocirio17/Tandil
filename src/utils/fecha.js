/**
 * Utilidades de fecha para el evento.
 *
 * Todas las comparaciones se hacen contra instantes absolutos (los `inicio`/`fin` de
 * `datos/evento.js` llevan el desplazamiento -03:00 explícito, y Argentina no aplica
 * horario de verano), por lo que el resultado es idéntico desde cualquier zona horaria.
 */

const TOTAL_SEGUNDOS_DIA = 86400

/** Descompone una duración en días, horas, minutos y segundos, sin valores negativos. */
export function descomponer(milisegundos) {
  const total = Math.max(0, Math.floor(milisegundos / 1000))
  return {
    dias: Math.floor(total / TOTAL_SEGUNDOS_DIA),
    horas: Math.floor((total % TOTAL_SEGUNDOS_DIA) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  }
}

/**
 * Devuelve un `Date` cuyas partes locales coinciden con las de la zona horaria indicada.
 * Se usa solo para mostrar fechas ("hoy es 14 de octubre"), nunca para comparar instantes.
 */
export function instanteEnZona(fecha, zonaHoraria) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: zonaHoraria,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(fecha)

  const valores = Object.fromEntries(
    partes.filter((parte) => parte.type !== 'literal').map((parte) => [parte.type, parte.value]),
  )

  return new Date(
    Number(valores.year),
    Number(valores.month) - 1,
    Number(valores.day),
    Number(valores.hour) % 24,
    Number(valores.minute),
    Number(valores.second),
  )
}

/** Formatea un instante ISO en la zona del evento: "14 de octubre de 2026". */
export function fechaLargaEnZona(iso, zonaHoraria) {
  const fecha = instanteEnZona(new Date(iso), zonaHoraria)
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha)
}