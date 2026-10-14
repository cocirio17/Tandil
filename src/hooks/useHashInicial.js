import { useEffect } from 'react'

/**
 * La página se renderiza del lado del cliente, así que al abrir un enlace profundo
 * con ancla (`sitio/#jornadas`) el destino todavía no existe cuando el navegador
 * intenta desplazarse. Se resuelve una única vez, al montar.
 */
export function useHashInicial() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return

    const destino = document.getElementById(hash.slice(1))
    if (!destino) return

    destino.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [])
}