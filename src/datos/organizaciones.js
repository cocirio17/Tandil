/**
 * Organizaciones vinculadas al evento.
 *
 * La clasificación en "Organizan" y "Acompañan" proviene de los datos estructurados
 * y de la nota oficial del Clúster Tecnológico Tandil (08/10/2026), no de una inferencia.
 *
 * Los archivos de logo son los SVG oficiales publicados en tandemiltechweek.com,
 * extraídos sin modificar su geometría ni sus proporciones. Están en
 * `public/organizaciones/` para servirse como archivos estáticos cacheables.
 */

export const ORGANIZAN = [
  {
    id: 'picante',
    nombre: 'Picante',
    rol: 'VC Fund',
    area: 'Venture Capital',
    sitio: 'https://picante.fund',
    dominio: 'picante.fund',
    logo: '/organizaciones/picante.svg',
    descripcion:
      'Acompañan desde el principio a la nueva generación de founders latinoamericanos: ' +
      'AI Natives construyendo productos globales.',
  },
  {
    id: 'relaw',
    nombre: 'Relaw',
    rol: 'Venture Legal',
    area: 'Legal Tech',
    sitio: 'https://relaw.io',
    dominio: 'relaw.io',
    logo: '/organizaciones/relaw.svg',
    descripcion:
      'El partner legal de startups y empresas de tecnología, con experiencia legal y visión de negocio.',
  },
  {
    id: 'paisanos',
    nombre: 'Paisanos',
    rol: 'Product Studio',
    area: 'Product & Tech',
    sitio: 'https://paisanos.io',
    dominio: 'paisanos.io',
    logo: '/organizaciones/paisanos.svg',
    descripcion:
      'Estudio global de diseño y desarrollo de productos digitales que acompaña a startups y empresas.',
  },
  {
    id: 'hacktandil',
    nombre: 'HackTandil',
    rol: 'Community',
    area: 'Builder Community',
    sitio: 'https://hacktandil.org',
    dominio: 'hacktandil.org',
    logo: '/organizaciones/hacktandil.svg',
    descripcion:
      'Comunidad tecnológica de Tandil que conecta desarrolladores, estudiantes, emprendedores y entusiastas.',
  },
  {
    id: 'geonosis',
    nombre: 'Geonosis',
    rol: 'Tech Partner',
    area: 'Idea to Scale',
    sitio: 'https://geonosisgroup.com',
    dominio: 'geonosisgroup.com',
    logo: '/organizaciones/geonosis.svg',
    descripcion:
      'Brazo tecnológico de startups y empresas, acompañándolas desde la idea hasta el scale-up.',
  },
  {
    id: 'fardo',
    nombre: 'Fardo',
    rol: 'Brand Intelligence',
    area: 'AI Visibility',
    sitio: 'https://heyfardo.com',
    dominio: 'heyfardo.com',
    logo: '/organizaciones/fardo.svg',
    descripcion:
      'Plataforma de brand intelligence: mide cómo aparece una marca en los asistentes de IA y arma el plan para que la citen.',
  },
]

export const ACOMPANAN = [
  {
    id: 'grupo-rotonda',
    nombre: 'Grupo Rotonda',
    rol: 'Acompaña',
    area: null,
    sitio: 'https://gruporotonda.com.ar',
    dominio: 'gruporotonda.com.ar',
    logo: '/organizaciones/grupo-rotonda.svg',
    descripcion: null,
  },
  {
    id: 'payoneer',
    nombre: 'Payoneer',
    rol: 'Acompaña',
    area: null,
    sitio: 'https://www.payoneer.com',
    dominio: 'payoneer.com',
    logo: '/organizaciones/payoneer.svg',
    descripcion: null,
  },
]

export const GRUPOS_ORGANIZACIONES = [
  {
    id: 'organizan',
    titulo: 'Organizan',
    lede:
      'Equipos y fondos que construyen infraestructura, capital, producto y comunidad para el ' +
      'ecosistema tecnológico regional.',
    organizaciones: ORGANIZAN,
  },
  {
    id: 'acompanan',
    titulo: 'Acompañan',
    lede: 'Organizaciones que acompañan y hacen posible la realización de las jornadas.',
    organizaciones: ACOMPANAN,
  },
]