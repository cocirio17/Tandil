import SkipLink from './componentes/SkipLink'
import Header from './componentes/Header'
import Hero from './componentes/Hero'
import Ticker from './componentes/Ticker'
import Introduccion from './componentes/Introduccion'
import Jornadas from './componentes/Jornadas'
import Ubicaciones from './componentes/Ubicaciones'
import Agenda from './componentes/Agenda'
import Comunidad from './componentes/Comunidad'
import Organizaciones from './componentes/Organizaciones'
import MuroComunidad from './componentes/MuroComunidad'
import BannerFlotante from './componentes/BannerFlotante'
import Cierre from './componentes/Cierre'
import { ViewTransitionProvider } from './componentes/ViewTransitions'
import { useState } from 'react'
import Footer from './componentes/Footer'
import { useAos } from './hooks/useAos'
import { useFaseEvento } from './hooks/useFaseEvento'
import { useHashInicial } from './hooks/useHashInicial'
import styles from './App.module.css'

const TEMAS = ['cyber', 'sunset', 'matrix']

export default function App() {
  useAos()
  useHashInicial()
  const [tema, setTema] = useState('cyber')
  const estadoEvento = useFaseEvento()

  return (
    <ViewTransitionProvider nombre="app">
      <div className={styles.pagina} data-fase={estadoEvento.fase} data-theme={tema}>
        <SkipLink />

        <Header estadoEvento={estadoEvento} tema={tema} temas={TEMAS} onTemaChange={setTema} />

        <main id="contenido">
          <Hero estadoEvento={estadoEvento} />
          <Ticker />
          <Introduccion />
          <Jornadas estadoEvento={estadoEvento} />
          <Ubicaciones estadoEvento={estadoEvento} />
          <Agenda />
          <Organizaciones />
          <MuroComunidad />
          <Cierre estadoEvento={estadoEvento} />
        </main>

        <Footer />

        <BannerFlotante estadoEvento={estadoEvento} />
      </div>
    </ViewTransitionProvider>
  )
}