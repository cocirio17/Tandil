import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Euler, Vector3 } from 'three'
import { useReducedMotion } from 'motion/react'

/**
 * Escenas 3D con React Three Fiber.
 *
 * Todo el movimiento ocurre dentro de `useFrame` mutando la malla directamente
 * (sin pasar por React): los props de `position`/`rotation` solo fijan el
 * estado inicial. Con movimiento reducido el canvas queda congelado.
 */

/** Semilla determinista: posición, forma, tamaño y fase de cada nodo. */
function construirNodos(cantidad, semilla) {
  const nodos = []
  for (let i = 0; i < cantidad; i += 1) {
    const idx = i + semilla * 100
    nodos.push({
      x: (((idx * 123.456) % 100) - 50) * 0.8,
      y: (((idx * 789.101) % 100) - 50) * 0.6,
      z: (((idx * 111.213) % 100) - 50) * 0.4 - 10,
      tipo: idx % 4,
      tamaño: 0.3 + (((idx * 7) % 100) / 100) * 0.5,
      velocidad: 0.2 + (((idx * 13) % 100) / 100) * 0.5,
      fase: (((idx * 17) % 100) / 100) * Math.PI * 2,
    })
  }
  return nodos
}

const GEOMETRIAS = {
  0: (t) => <tetrahedronGeometry args={[t, 0]} />,
  1: (t) => <octahedronGeometry args={[t, 0]} />,
  2: (t) => <icosahedronGeometry args={[t, 0]} />,
  3: (t) => <torusKnotGeometry args={[t * 0.7, t * 0.25, 64, 12]} />,
}

/**
 * Nodo flotante: deriva en tres ejes alrededor de su punto inicial, gira con
 * suavidad y escala cuando el cursor se le acerca. La reacción al puntero vive
 * dentro de useFrame (state.pointer); no provoca renders de React.
 */
function Nodo({ posicion, tipo, tamaño, velocidad, fase, intensidad = 1, color = '#F9A8D4' }) {
  const malla = useRef(null)
  const posicionInicial = useMemo(() => new Vector3(...posicion), [posicion])
  // Rotación inicial determinista, derivada de la fase del nodo (sin azar).
  const rotacionInicial = useMemo(
    () => new Euler(fase / 3, fase / 4, fase / 6),
    [fase],
  )

  useFrame((estado) => {
    const mallaActual = malla.current
    if (!mallaActual) return

    const t = estado.clock.getElapsedTime() * velocidad + fase

    mallaActual.position.set(
      posicionInicial.x + Math.cos(t * 0.5) * 1.2 * intensidad,
      posicionInicial.y + Math.sin(t * 0.7) * 1.6 * intensidad,
      posicionInicial.z + Math.sin(t * 0.3) * 0.8 * intensidad,
    )
    mallaActual.rotation.set(
      rotacionInicial.x + t * 0.3,
      rotacionInicial.y + t * 0.4,
      rotacionInicial.z,
    )

    const distancia = Math.hypot(
      estado.pointer.x - posicionInicial.x / 35,
      estado.pointer.y - posicionInicial.y / 22,
    )
    const objetivo = Math.max(0.85, Math.min(1.25, 1.3 - distancia * 0.4))
    const escala = mallaActual.scale.x + (objetivo - mallaActual.scale.x) * 0.08
    mallaActual.scale.setScalar(escala)
  })

  return (
    <mesh ref={malla} position={posicion} rotation={rotacionInicial}>
      {GEOMETRIAS[tipo](tamaño)}
      <meshPhysicalMaterial
        color={color}
        metalness={0.35}
        roughness={0.35}
        transparent
        opacity={0.8}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
      />
    </mesh>
  )
}

function NodosFlotantes({ cantidad = 12, intensidad = 1, semilla = 0, color = '#F9A8D4' }) {
  const nodos = useMemo(() => construirNodos(cantidad, semilla), [cantidad, semilla])
  return (
    <group>
      {nodos.map((nodo, i) => (
        <Nodo
          key={i}
          posicion={[nodo.x, nodo.y, nodo.z]}
          tipo={nodo.tipo}
          tamaño={nodo.tamaño}
          velocidad={nodo.velocidad}
          fase={nodo.fase}
          intensidad={intensidad}
          color={color}
        />
      ))}
    </group>
  )
}

/**
 * El grupo entero se inclina hacia el cursor: tilt 3D de la escena completa.
 */
function GrupoTiltable({ intensidad = 0.08, children }) {
  const grupo = useRef(null)

  useFrame((estado) => {
    const grupoActual = grupo.current
    if (!grupoActual) return
    const objetivoX = -estado.pointer.y * intensidad * 30
    const objetivoY = estado.pointer.x * intensidad * 40
    grupoActual.rotation.x += (objetivoX - grupoActual.rotation.x) * 0.06
    grupoActual.rotation.y += (objetivoY - grupoActual.rotation.y) * 0.06
  })

  return <group ref={grupo}>{children}</group>
}

/** Chips que orbitan alrededor del centro de la escena. */
function ChipsOrbita({ cantidad = 6, radio = 10, velocidad = 0.15, color = '#D8B4FE' }) {
  const grupo = useRef(null)

  useFrame((estado) => {
    const grupoActual = grupo.current
    if (!grupoActual) return
    const t = estado.clock.getElapsedTime() * velocidad
    grupoActual.rotation.y = t
    grupoActual.rotation.x = Math.sin(t * 0.6) * 0.18
  })

  const chips = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        angulo: (i / cantidad) * Math.PI * 2,
        offset: (i % 4) * 0.7,
      })),
    [cantidad],
  )

  return (
    <group ref={grupo}>
      {chips.map((chip, i) => (
        <ChipOrbita key={i} radio={radio} velocidad={velocidad * 2} anguloInicial={chip.angulo} offset={chip.offset} color={color} />
      ))}
    </group>
  )
}

function ChipOrbita({ radio, velocidad, anguloInicial, offset, color }) {
  const malla = useRef(null)
  const angulo = useRef(anguloInicial)

  useFrame((estado, delta) => {
    const mallaActual = malla.current
    if (!mallaActual) return
    angulo.current += delta * velocidad
    mallaActual.position.set(
      Math.cos(angulo.current) * radio,
      Math.sin(angulo.current * 1.5 + offset) * radio * 0.22,
      Math.sin(angulo.current) * radio,
    )
    mallaActual.rotation.y += delta * 0.8
  })

  return (
    <mesh ref={malla}>
      <torusGeometry args={[1.1, 0.22, 16, 32]} />
      <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.25} transparent opacity={0.85} clearcoat={0.9} clearcoatRoughness={0.15} />
    </mesh>
  )
}

/** Escena WebGL completa del hero (exportada para reuso futuro). */
export function EscenaHero({ colorAcento = '#EC4899', intensidad = 1, semilla = 0 }) {
  const reducido = useReducedMotion()

  return (
    <Canvas
      camera={{ position: [0, 0, 35], fov: 45 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows={false}
      frameloop={reducido ? 'never' : 'always'}
    >
      <color attach="background" args={['#0F172A']} />
      <fog attach="fog" args={['#0F172A', 25, 70]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={0.8} />
      <directionalLight position={[-10, -5, -10]} intensity={0.4} color={colorAcento} />
      <pointLight position={[0, 10, 15]} intensity={2} color={colorAcento} distance={50} decay={2} />

      <GrupoTiltable intensidad={intensidad * 0.08}>
        <NodosFlotantes cantidad={18} intensidad={intensidad} semilla={semilla} />
        <ChipsOrbita cantidad={8} radio={12} velocidad={0.1} />
      </GrupoTiltable>
    </Canvas>
  )
}

/**
 * Escena sutil para el interior de las tarjetas de jornada: pocos nodos,
 * cámara cercana y reacción directa al cursor que recorre la tarjeta.
 */
export function EscenaJornada({ colorAcento = '#EC4899', semilla = 0 }) {
  const reducido = useReducedMotion()

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 40 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      shadows={false}
      frameloop={reducido ? 'never' : 'always'}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 10, 5]} intensity={0.9} />
      <pointLight position={[0, 5, 10]} intensity={1.4} color={colorAcento} distance={30} decay={2} />

      <GrupoTiltable intensidad={0.05}>
        <NodosFlotantes cantidad={7} intensidad={0.5} semilla={semilla} color={colorAcento} />
      </GrupoTiltable>
    </Canvas>
  )
}

/** Elemento decorativo 3D para el fondo del muro de comunidad. */
export function Fondo3D({ colorAcento = '#EC4899', semilla = 0 }) {
  const reducido = useReducedMotion()

  return (
    <Canvas
      camera={{ position: [0, 0, 40], fov: 50 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      shadows={false}
      frameloop={reducido ? 'never' : 'always'}
    >
      <fog attach="fog" args={['#080B1A', 35, 90]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />
      <directionalLight position={[-10, -5, -10]} intensity={0.3} color={colorAcento} />

      <NodosFlotantes cantidad={12} intensidad={0.4} semilla={semilla} color={colorAcento} />
    </Canvas>
  )
}
