import styles from './GrafoRed.module.css'

/**
 * Composición gráfica original: nodos, enlaces y coordenadas.
 * Es puramente decorativa (`aria-hidden`), se dibuja con SVG y CSS y
 * la mueve GSAP. No simula datos reales ni una terminal interactiva.
 */
const NODOS = [
  { x: 118, y: 64, r: 4.5, destacado: true },
  { x: 268, y: 42, r: 3 },
  { x: 402, y: 120, r: 5.5, destacado: true },
  { x: 196, y: 186, r: 3.5 },
  { x: 344, y: 248, r: 3 },
  { x: 92, y: 286, r: 4, destacado: true },
  { x: 246, y: 344, r: 2.5 },
  { x: 430, y: 300, r: 3.5 },
  { x: 156, y: 402, r: 3 },
  { x: 366, y: 424, r: 4.5, destacado: true },
]

const ENLACES = [
  [0, 1],
  [0, 3],
  [1, 2],
  [2, 3],
  [2, 7],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
  [5, 8],
  [6, 8],
  [7, 9],
  [8, 9],
  [4, 7],
  [1, 4],
]

export default function GrafoRed() {
  return (
    <div className={styles.contenedor} aria-hidden="true">
      <svg
        className={styles.grafo}
        viewBox="0 0 520 470"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <defs>
          <linearGradient id="trazo-gradiente" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--magenta)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--violeta)" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="nodo-gradiente">
            <stop offset="0%" stopColor="var(--magenta)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--magenta)" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        <g className={styles.enlaces} stroke="url(#trazo-gradiente)" strokeWidth="1">
          {ENLACES.map(([a, b], indice) => (
            <line
              key={indice}
              x1={NODOS[a].x}
              y1={NODOS[a].y}
              x2={NODOS[b].x}
              y2={NODOS[b].y}
            />
          ))}
        </g>

        <g className={styles.nodos}>
          {NODOS.map((nodo, indice) => (
            <circle
              key={indice}
              cx={nodo.x}
              cy={nodo.y}
              r={nodo.r}
              fill={nodo.destacado ? 'url(#nodo-gradiente)' : 'var(--texto-tenue)'}
            />
          ))}
        </g>
      </svg>

      <div className={styles.marcaAgua}>TTW</div>
      <span className={`${styles.coordenada} ${styles.coordenadaA}`}>37°19&apos;S</span>
      <span className={`${styles.coordenada} ${styles.coordenadaB}`}>59°08&apos;W</span>
      <span className={`${styles.coordenada} ${styles.coordenadaC}`}>TTW/2026</span>
    </div>
  )
}