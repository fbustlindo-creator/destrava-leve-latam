export const FUNNEL_ROUTES = [
  '',               // 0: Entrada y edad (/)
  'acolhimento',    // 1: Bienvenida 3D + Barra de 8s (/acolhimento)
  'pergunta-1',     // 2: Estrés y ansiedad (/pergunta-1)
  'pergunta-2',     // 3: Mandíbula y rechinar de dientes (/pergunta-2)
  'pergunta-3',     // 4: Dolor/rigidez lumbar, cóccix, cadera (/pergunta-3)
  'pergunta-4',     // 5: Piernas pesadas, adoloridas o hinchadas (/pergunta-4)
  'pergunta-5',     // 6: Abdomen hinchado o inflamado (/pergunta-5)
  'pergunta-6',     // 7: Frecuencia urinaria (/pergunta-6)
  'atencao',        // 8: Lo que sientes merece atención (/atencao)
  'pergunta-7',     // 9: Humor y cuerpo (/pergunta-7)
  'pergunta-8',     // 10: Despertar cansada (/pergunta-8)
  'pergunta-9',     // 11: Impacto en relaciones/trabajo (/pergunta-9)
  'pergunta-10',    // 12: Desconexión del cuerpo/deseo (/pergunta-10)
  'pergunta-11',    // 13: Irritación y aislamiento (/pergunta-11)
  'pergunta-12',    // 14: Personas que no comprenden (/pergunta-12)
  'pergunta-13',    // 15: Energía a lo largo del día (/pergunta-13)
  'pergunta-14',    // 16: Duración de las molestias (/pergunta-14)
  'pergunta-15',    // 17: Café y cafeína (/pergunta-15)
  'pergunta-16',    // 18: Situaciones de sueño (/pergunta-16)
  'pergunta-17',    // 19: Rutina y actividad (/pergunta-17)
  'pergunta-18',    // 20: Hábitos a cambiar (/pergunta-18)
  'pergunta-19',    // 21: Cambios físicos/diagnósticos (/pergunta-19)
  'pergunta-20',    // 22: Situaciones difíciles recientes (/pergunta-20)
  'pergunta-21',    // 23: Prioridades de bienestar (/pergunta-21)
  'pergunta-22',    // 24: Cambio que marcaría más diferencia (/pergunta-22)
  'pergunta-23',    // 25: Conocimiento fascia/linfa/vago (/pergunta-23)
  'mecanismo',      // 26: Mecanismo 3 pilares (/mecanismo)
  'pergunta-24',    // 27: Cómo conociste Destrava Leve (/pergunta-24)
  'resultado',      // 28: Punto de partida y puntuación (/resultado)
  'grafico',        // 29: Gráfico evolutivo de 4 semanas (/grafico)
  'pergunta-25',    // 30: Tiempo diario disponible (/pergunta-25)
  'linha-do-tempo', // 31: Línea de tiempo 28 días (/linha-do-tempo)
  'pergunta-26',    // 32: Confianza para comenzar (/pergunta-26)
  'processando',    // 33: Loader calculando perfil (/processando)
  'email',          // 34: Captura de correo (/email)
  'novidades',      // 35: Preferencia de novedades (/novidades)
  'nome',           // 36: Captura de primer nombre (/nome)
  'roleta',         // 37: Ruleta táctil 75% OFF (/roleta)
  'oferta',         // 38: Página de ventas completa (/oferta)
] as const;

export type FunnelSlug = typeof FUNNEL_ROUTES[number];

export function getScreenBySlug(slug?: string): number {
  if (!slug) return 0;
  const clean = slug.toLowerCase().replace(/^\//, '').replace(/\/$/, '');
  if (clean === 'novidades') return 36;
  const index = (FUNNEL_ROUTES as readonly string[]).indexOf(clean);
  return index >= 0 ? index : 0;
}

export function getPathByScreen(screen: number): string {
  const safe = Math.max(0, Math.min(FUNNEL_ROUTES.length - 1, screen));
  const slug = FUNNEL_ROUTES[safe];
  return slug ? `/${slug}` : '/';
}
