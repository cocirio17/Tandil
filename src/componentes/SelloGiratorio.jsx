import styles from './SelloGiratorio.module.css'

/**
 * Insignia circular con texto en trayectoria, girando sin fin.
 * Es el disparador del efecto de "objetos que salen volando": al accionarla,
 * los nodos decorativos se lanzan fuera de pantalla.
 */
export default function SelloGiratorio({ onExplotar, activa }) {
  return (
    <button
      type="button"
      className={`${styles.sello} ${activa ? styles.selloDisparada : ''}`}
      onClick={onExplotar}
      data-cinetica=""
    >
      <span className={styles.pista} data-cinetica="">
        <svg viewBox="0 0 200 200" className={styles.svg} aria-hidden="true" focusable="false">
          <defs>
            <path
              id="trayectoria-sello"
              d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
              fill="none"
            />
            <linearGradient id="sello-gradiente" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--magenta)" />
              <stop offset="100%" stopColor="var(--violeta)" />
            </linearGradient>
          </defs>

          <circle cx="100" cy="100" r="98" fill="rgba(30, 27, 75, 0.55)" stroke="url(#sello-gradiente)" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="var(--linea-fuerte)" strokeWidth="1" />

          <text className={styles.textoAnillo}>
            <textPath href="#trayectoria-sello" startOffset="0%">
              TANDIL TECH WEEK · DOS JORNADAS ·
            </textPath>
          </text>
        </svg>
      </span>

      <span className={styles.nucleo}>
        <span className={styles.nucleoLinea}>Tandil</span>
        <span className={styles.nucleoLinea}>14—15</span>
        <span className={styles.nucleoLinea}>OCT 2026</span>
      </span>

      <span className="rotulo-visual">Activar el efecto cinético</span>
    </button>
  )
}