import { useCallback, useEffect, useState } from 'react'
import { FICHAS_SEMILLA } from '../datos/comunidad'

const CLAVE = 'ttw2026-tech-hub'

/** Lee las fichas guardadas sin asumir que localStorage está disponible. */
function leer() {
  try {
    const bruto = window.localStorage.getItem(CLAVE)
    const datos = bruto ? JSON.parse(bruto) : []
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

/**
 * Muro de comunidad. Las fichas propias se guardan solo en el navegador del
 * visitante: no hay backend, ni datos inventados, ni estados de red falsos.
 */
export function useMuroComunidad() {
  const [fichasPropias, setFichasPropias] = useState(leer)

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(fichasPropias))
    } catch {
      // Modo privado o cuota agotada: el muro sigue funcionando en memoria.
    }
  }, [fichasPropias])

  const agregar = useCallback((ficha) => {
    setFichasPropias((previas) => [
      {
        ...ficha,
        id: `propia-${Date.now()}`,
        autorrespuesta: null,
        etiquetas: [],
        origen: 'propia',
        creado: new Date().toISOString(),
      },
      ...previas,
    ])
  }, [])

  const quitar = useCallback((id) => {
    setFichasPropias((previas) => previas.filter((ficha) => ficha.id !== id))
  }, [])

  return {
    fichas: [...fichasPropias, ...FICHAS_SEMILLA],
    fichasPropias,
    agregar,
    quitar,
  }
}