/** Construye un enlace de búsqueda en Google Maps a partir de una sede verificada. */
export function enlaceMapa(sede) {
  const parametros = new URLSearchParams({
    api: '1',
    query: sede.consultaMapa,
    query_place_id: sede.placeId,
  })
  return `https://www.google.com/maps/search/?${parametros.toString()}`
}

/** Dirección postal legible, tal como fue publicada por la organización. */
export function direccionCompleta(sede) {
  return `${sede.calle}, ${sede.codigoPostal} ${sede.localidad}, ${sede.provincia}, ${sede.pais}`
}