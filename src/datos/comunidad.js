/**
 * Tech Hub Wall: comunidad y feedback.
 *
 * Las fichas semilla son preguntas reales que la gente se hace sobre el evento y
 * están respondidas con información oficial confirmada. No hay comentarios ni
 * nombres inventados: las fichas propias que escribe cada visitante se guardan en
 * `localStorage` y se combinan con estas.
 */

export const CATEGORIAS = [
  { id: 'dudas-hacking-day', etiqueta: 'Dudas Hacking Day', jornada: 'hacking-day' },
  { id: 'proyectos-startup', etiqueta: 'Proyectos Startup', jornada: 'startup-day' },
  { id: 'conexiones-networking', etiqueta: 'Conexiones & Networking', jornada: null },
  { id: 'feedback-general', etiqueta: 'Feedback General', jornada: null },
]

const categoriasPorId = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c]))

/** Fichas base verificables. `origen` distingue tema oficial de aporte propio. */
export const FICHAS_SEMILLA = [
  {
    id: 'semilla-01',
    categoria: 'dudas-hacking-day',
    titulo: '¿Qué es el Hacking Day?',
    texto:
      'Una jornada de hacking en equipos para explorar la ciberseguridad, resolver desafíos técnicos ' +
      'y compartir conocimientos en comunidad. Se puede ir con amigos a formar equipo.',
    autorespuesta: '14 de octubre · Campus Universitario UNICEN',
    etiquetas: ['Ciberseguridad', 'Equipos'],
    origen: 'oficial',
  },
  {
    id: 'semilla-02',
    categoria: 'dudas-hacking-day',
    titulo: '¿La inscripción tiene costo?',
    texto:
      'La inscripción al Hacking Day es gratuita y sujeta a aprobación. Se abre el 17 de septiembre de ' +
      '2026 a las 19:00 (GMT-3).',
    autorespuesta: 'Inscripción gratuita · sujeta a aprobación',
    etiquetas: ['Inscripción'],
    origen: 'oficial',
  },
  {
    id: 'semilla-03',
    categoria: 'proyectos-startup',
    titulo: '¿Cómo es el Startup Day?',
    texto:
      'Charlas dinámicas e instancias de networking entre fundadores, venture capital y estudiantes. ' +
      'La propuesta es conocer a los que hacen y explorar nuevas oportunidades de colaboración.',
    autorespuesta: '15 de octubre · Distrito Avellaneda',
    etiquetas: ['Startups', 'Charlas'],
    origen: 'oficial',
  },
  {
    id: 'semilla-04',
    categoria: 'proyectos-startup',
    titulo: '¿Quiénes organizan?',
    texto:
      'Organizan Picante, Relaw, Paisanos, HackTandil, Geonosis y Fardo. Acompañan Grupo Rotonda y ' +
      'Payoneer.',
    autorespuesta: 'Seis organizaciones organizan',
    etiquetas: ['Ecosistema'],
    origen: 'oficial',
  },
  {
    id: 'semilla-05',
    categoria: 'conexiones-networking',
    titulo: '¿Puedo ir a las dos jornadas?',
    texto:
      'Sí, son dos días con formatos distintos. Cada jornada tiene su propia inscripción, así que se ' +
      'puede anotar a una o a las dos según disponibilidad.',
    autorespuesta: 'Dos días · dos jornadas',
    etiquetas: ['Agenda'],
    origen: 'oficial',
  },
  {
    id: 'semilla-06',
    categoria: 'feedback-general',
    titulo: '¿Cuándo se publica la agenda completa?',
    texto:
      'Los detalles de la agenda se comunican a través de los canales oficiales del evento. La ' +
      'recomendación es seguir @tandiltechweek para los anuncios.',
    autorespuesta: 'Se anuncia por canales oficiales',
    etiquetas: ['Agenda'],
    origen: 'oficial',
  },
]

export const CATEGORIA_POR_ID = categoriasPorId
export const FILTRO_TODAS = 'todas'
