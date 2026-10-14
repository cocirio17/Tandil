/**
 * Fuente única de verdad del evento.
 *
 * Todos los datos provienen de fuentes oficiales verificadas:
 *  - https://www.tandiltechweek.com/  (contenido publicado y datos estructurados)
 *  - https://www.clustertecnologicotandil.org.ar/nota-tandil-tech-week-2026-dos-jornadas-para-conectar-tecnologia--startups-e-innovacion-63931
 *
 * Si se completan datos nuevos (agenda, speakers, sedes), se editan únicamente estos archivos.
 */

/** Zona horaria de referencia para todos los cálculos de fecha del sitio. */
export const ZONA_HORARIA = 'America/Argentina/Buenos_Aires'

/** Inscripciones declaradas por la organización: gratuitas y subjects a aprobación. */
export const INSCRIPCION = {
  abre: '2026-09-17T19:00:00-03:00',
  mensaje: 'La inscripción es gratuita y sujeta a aprobación.',
  gratuita: true,
  sujetaAprobacion: true,
}

export const EVENTO = {
  nombre: 'Tandil Tech Week',
  edicion: '2026',
  lema: 'Un encuentro para construir lo que viene.',
  descripcion:
    'Dos días para conectar el ecosistema startup y conocer a los que hacen. ' +
    'Hacking Day en el Campus Universitario de la UNICEN y Startup Day en el Distrito Avellaneda.',
  ciudad: 'Tandil',
  provincia: 'Buenos Aires',
  pais: 'Argentina',
  zonaHoraria: ZONA_HORARIA,
  /** Fin de la primera jornada (apertura oficial del evento). */
  inicio: '2026-10-14T09:00:00-03:00',
  /** Cierre de la segunda jornada. */
  fin: '2026-10-15T20:00:00-03:00',
  primeraEdicion: true,
  sitioOficial: 'https://www.tandiltechweek.com/',
  /** Punto de entrada oficial a las inscripciones (sección del sitio del evento). */
  inscripcion: 'https://www.tandiltechweek.com/#inscribirme',
  redes: [
    { id: 'instagram', nombre: 'Instagram', usuario: '@tandiltechweek', url: 'https://instagram.com/tandiltechweek' },
    { id: 'x', nombre: 'X', usuario: '@tandiltechweek', url: 'https://x.com/tandiltechweek' },
  ],
}

/** Sedes verificadas, publicadas por la organización. */
export const SEDES = {
  'campus-unicen': {
    id: 'campus-unicen',
    nombre: 'Campus Universitario UNICEN',
    nombreCorto: 'Campus UNICEN',
    calle: 'Paraje Arroyo Seco s/n',
    localidad: 'Tandil',
    provincia: 'Buenos Aires',
    codigoPostal: 'B7000',
    pais: 'Argentina',
    consultaMapa: 'UNICEN - Campus Universitario',
    placeId: 'ChIJXTwhmjjgkJURMlmVPKCu-c8',
  },
  'distrito-avellaneda': {
    id: 'distrito-avellaneda',
    nombre: 'Distrito Avellaneda',
    nombreCorto: 'Distrito Avellaneda',
    calle: 'Av. Avellaneda 1140',
    localidad: 'Tandil',
    provincia: 'Buenos Aires',
    codigoPostal: 'B7000',
    pais: 'Argentina',
    consultaMapa: 'Distrito Avellaneda',
    placeId: 'ChIJd4DI7SQfkZURHTIIjbDa3TE',
  },
}

/**
 * Las dos jornadas. `inicio`/`fin` corresponden a las ventanas horarias publicadas
 * oficialmente en los datos estructurados del sitio del evento.
 */
export const JORNADAS = [
  {
    id: 'hacking-day',
    nombre: 'Hacking Day',
    track: 'Track 01',
    diaSemana: 'miércoles',
    diaSemanaCorto: 'Mié',
    fecha: '2026-10-14',
    etiquetaFecha: '14 OCT',
    fechaLarga: 'Miércoles 14 de octubre de 2026',
    inicio: '2026-10-14T09:00:00-03:00',
    fin: '2026-10-14T18:00:00-03:00',
    horario: '09:00 – 18:00 h',
    sede: SEDES['campus-unicen'],
    categoria: 'Ciberseguridad y desafíos técnicos',
    trackTexto: 'Track 01 · Ciberseguridad',
    /** Clave de acento visual. Cada jornada tiene su propia familia cromática. */
    acento: 'hacking',
    descripcion:
      'Una jornada dedicada a explorar la ciberseguridad, resolver desafíos técnicos y compartir ' +
      'conocimientos en comunidad.',
    descripcionOficial:
      'Jornada de hacking en equipos. Juntá a tus amigos y vení a divertirte aprendiendo de ciberseguridad.',
    sedeNota: 'Competencia técnica de hacking en equipos, con aprendizaje colaborativo y mentoría.',
    sitioOficial: 'https://www.tandiltechweek.com/hacking-day',
    inscripcion: 'https://luma.com/8dy1oypg',
  },
  {
    id: 'startup-day',
    nombre: 'Startup Day',
    track: 'Track 02',
    diaSemana: 'jueves',
    diaSemanaCorto: 'Jue',
    fecha: '2026-10-15',
    etiquetaFecha: '15 OCT',
    fechaLarga: 'Jueves 15 de octubre de 2026',
    inicio: '2026-10-15T09:00:00-03:00',
    fin: '2026-10-15T20:00:00-03:00',
    horario: '09:00 – 20:00 h',
    sede: SEDES['distrito-avellaneda'],
    categoria: 'Emprendimiento, innovación y networking',
    trackTexto: 'Track 02 · Startups',
    acento: 'startup',
    descripcion:
      'Un encuentro para conectar startups, emprendedores y profesionales, compartir experiencias ' +
      'y explorar nuevas oportunidades.',
    descripcionOficial:
      'Vení a conocer a los que hacen. Charlas dinámicas y networking entre fundadores, venture capital y estudiantes.',
    sedeNota: 'Charlas e instancias de networking con fundadores, inversores, estudiantes y referentes.',
    sitioOficial: 'https://www.tandiltechweek.com/startup-day',
    inscripcion: 'https://luma.com/esg42kt8',
  },
]

/**
 * La agenda detallada todavía no fue publicada. Cuando se difunda, reemplazar
 * `disponible: false` por `true` y cargar los bloques en `bloques`.
 * Cada jornada acepta la misma forma de datos, de modo que la sección no cambia.
 */
export const AGENDA = {
  disponible: false,
  aviso: 'Los detalles de la agenda se comunicarán a través de los canales oficiales.',
  bloques: [
    {
      jornadaId: 'hacking-day',
      items: [
        {
          titulo: 'Hacking Day · Track 01 Ciberseguridad',
          descripcion:
            'Jornada de hacking en equipos para poner a prueba conocimientos, resolver desafíos ' +
            'y compartir una experiencia de aprendizaje colaborativo.',
        },
      ],
    },
    {
      jornadaId: 'startup-day',
      items: [
        {
          titulo: 'Startup Day · Track 02 Startups',
          descripcion:
            'Charlas dinámicas e instancias de networking entre fundadores, venture capital y estudiantes.',
        },
      ],
    },
  ],
}

/** Bloque temático en ticker. Palabras clave publicadas por la organización. */
export const PALABRAS_CLAVE = [
  'Hacking Day',
  'Ciberseguridad',
  'Startup Day',
  'Software & AI',
  'Agritech & Bio',
  'Venture Capital',
  'Founders & Builders',
  'Polo Científico',
]

/** Secciones de la navegación, en orden de aparición. */
export const SECCIONES = [
  { id: 'jornadas', etiqueta: 'Jornadas' },
  { id: 'ubicaciones', etiqueta: 'Ubicaciones' },
  { id: 'agenda', etiqueta: 'Agenda' },
  { id: 'organizaciones', etiqueta: 'Organizaciones' },
  { id: 'comunidad', etiqueta: 'Comunidad' },
  { id: 'participar', etiqueta: 'Participar' },
]

/**
 * Mensajes según el momento del evento. Se calculan en tiempo de ejecución
 * a partir de `JORNADAS`, nunca con una fecha escrita a mano.
 */
export const MENSAJES_FASE = {
  proximo: {
    etiqueta: 'Próximamente',
    titular: 'Tandil Tech Week 2026 está por comenzar',
  },
  'hacking-day': {
    etiqueta: 'HOY: HACKING DAY EN UNICEN',
    titular: 'Hoy en Tandil: Hacking Day',
  },
  'startup-day': {
    etiqueta: 'HOY: STARTUP DAY EN DISTRITO AVELLANEDA',
    titular: 'Hoy en Tandil: Startup Day',
  },
  finalizado: {
    etiqueta: 'Gracias por ser parte de Tandil Tech Week 2026',
    titular: 'Tandil Tech Week 2026 ya ocurrió',
  },
}