export const FUNNEL_ROUTES = [
  '',               // 0: Entrada e idade (/)
  'acolhimento',    // 1: Acolhimento 3D + Barra de 8s (/acolhimento)
  'pergunta-1',     // 2: Estresse e ansiedade (/pergunta-1)
  'pergunta-2',     // 3: Mandíbula e ranger dentes (/pergunta-2)
  'pergunta-3',     // 4: Dor/rigidez lombar, cóccix, quadril (/pergunta-3)
  'pergunta-4',     // 5: Pernas pesadas, doloridas ou inchadas (/pergunta-4)
  'pergunta-5',     // 6: Barriga inchada ou estufada (/pergunta-5)
  'pergunta-6',     // 7: Frequência urinária (/pergunta-6)
  'atencao',        // 8: O que você sente merece atenção (/atencao)
  'pergunta-7',     // 9: Humor e corpo (/pergunta-7)
  'pergunta-8',     // 10: Acordar cansada (/pergunta-8)
  'pergunta-9',     // 11: Impacto em relações/trabalho (/pergunta-9)
  'pergunta-10',    // 12: Desconexão do corpo/desejo (/pergunta-10)
  'pergunta-11',    // 13: Irritação e fechamento (/pergunta-11)
  'pergunta-12',    // 14: Pessoas não entenderem (/pergunta-12)
  'pergunta-13',    // 15: Energia ao longo do dia (/pergunta-13)
  'pergunta-14',    // 16: Duração dos incômodos (/pergunta-14)
  'pergunta-15',    // 17: Café e cafeína (/pergunta-15)
  'pergunta-16',    // 18: Situações de sono (/pergunta-16)
  'pergunta-17',    // 19: Rotina e atividade (/pergunta-17)
  'pergunta-18',    // 20: Hábitos a mudar (/pergunta-18)
  'pergunta-19',    // 21: Mudanças físicas/diagnósticos (/pergunta-19)
  'pergunta-20',    // 22: Situações difíceis recentes (/pergunta-20)
  'pergunta-21',    // 23: Prioridades de bem-estar (/pergunta-21)
  'pergunta-22',    // 24: Mudança que faria mais diferença (/pergunta-22)
  'pergunta-23',    // 25: Conhecimento fáscia/linfa/vago (/pergunta-23)
  'mecanismo',      // 26: Mecanismo 3 pilares (/mecanismo)
  'pergunta-24',    // 27: Como conheceu o Destrava Leve (/pergunta-24)
  'resultado',      // 28: Ponto de partida e score (/resultado)
  'grafico',        // 29: Gráfico evolutivo de 4 semanas (/grafico)
  'pergunta-25',    // 30: Tempo diário disponível (/pergunta-25)
  'linha-do-tempo', // 31: Linha do tempo 28 dias (/linha-do-tempo)
  'pergunta-26',    // 32: Confiança para começar (/pergunta-26)
  'processando',    // 33: Loader calculando perfil (/processando)
  'email',          // 34: Captura de e-mail (/email)
  'novidades',      // 35: Preferência de novidades (/novidades)
  'nome',           // 36: Captura de primeiro nome (/nome)
  'roleta',         // 37: Roleta tátil 75% OFF (/roleta)
  'oferta',         // 38: Página de vendas completa (/oferta)
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
