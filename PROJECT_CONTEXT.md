# Destrava Leve — contexto de projeto

Atualizado em 12/09/2026 (America/Sao_Paulo). Documento de transferência para outro agente.

## 1. Objetivo e produto

O projeto recria, para o Brasil, a arquitetura audiovisual e de conversão observada no funil público Aura/FunnelFox, com identidade `Destrava Leve`. A decisão de produto atual é uma oferta única de R$ 37, sem assinatura. O escopo implementado é o funil principal: anúncio/entrada → quiz → resultado → captura de dados → roleta → página de vendas (PV). Upsells, downsell, back redirect e checkout real ficaram fora.

Promessa atualmente exibida: uma rotina guiada de aproximadamente 7 minutos por dia, durante 28 dias, com liberação da fáscia, movimentos suaves e relaxamento, para ajudar a aliviar a sensação de peso e voltar a sentir o corpo leve. A promessa deve continuar como bem-estar; não afirmar cura, drenagem garantida, diagnóstico de fáscia/linfa/vago ou redução clínica.

## 2. Arquitetura técnica

É uma única rota client-side com estado React. `screen` é um índice de 0 a 38; não existem rotas de URL por etapa. A query `?screen=N` é aceita apenas para pré-visualização, convertendo `N` (1–39) para `screen=N-1`.

Estado em `Home`:

- `screen`: etapa atual.
- `answers`: `Record<string, string | string[]>`, apenas em memória.
- `loader`: progresso da tela de processamento.
- `email`, `name`, `marketing`, `checkout`: dados e modal demonstrativo.
- `wheel`: `idle | spinning | won`.
- `offerSeconds`: contador visual de 900 s na PV.

O fluxo é linear. Resposta única salva e avança automaticamente; multisseleção exige ao menos uma opção e o botão Continuar. Opções “Nenhuma dessas opções” são exclusivas. Ao clicar novamente em uma opção já marcada, a tela avança. A navegação é bloqueada durante a transição para evitar cliques duplicados.

`useFunnelMotion` centraliza a entrada/saída com Web Animations API. O cabeçalho (`.funnel-header`) fica fora do `main` animado. A entrada completa usa aproximadamente 420 ms e deslocamento horizontal de 70 px; a saída usa aproximadamente 140 ms e deslocamento de 32 px. A preferência reduzida usa fade curto sem deslocamento. `flushSync` garante que a próxima tela seja montada imediatamente ao terminar a saída. `main` tem `key={screen}` para que a animação ocorra somente na troca de tela, não ao mudar respostas ou digitar.

## 3. Sequência implementada (índice interno → etapa)

| `screen` | Etapa | Tipo / observação |
|---:|---|---|
| 0 | Entrada e idade | 25–34, 35–44, 45–54, 55+; avanço imediato |
| 1 | Acolhimento/prova social | intersticial; 28 dias, 7 minutos |
| 2 | Estresse/ansiedade | única; imagem de estresse |
| 3 | Mandíbula/ranger dentes | única; imagem de mandíbula |
| 4 | Dor/rigidez lombar, cóccix/quadril | única |
| 5 | Pernas pesadas, doloridas ou inchadas | única; imagem de pernas |
| 6 | Barriga inchada/estufada | única |
| 7 | Frequência urinária | única |
| 8 | “O que você sente merece atenção” | intersticial emocional |
| 9 | Corpo interfere no humor | escala 1–5 |
| 10 | Acordar cansada | única; imagem de cansaço |
| 11 | Impacto em relações/trabalho/qualidade de vida | única |
| 12 | Desconexão do corpo/desejo | única |
| 13 | Irritação/afastamento/fechamento | única |
| 14 | Pessoas não entenderem | única |
| 15 | Energia ao longo do dia | única |
| 16 | Duração dos incômodos | única |
| 17 | Café/cafeína | única |
| 18 | Situações de sono | múltipla |
| 19 | Rotina/atividade | única |
| 20 | Hábitos a mudar | múltipla |
| 21 | Mudanças físicas/diagnósticos percebidos | múltipla |
| 22 | Situações que dificultaram a rotina | múltipla |
| 23 | Prioridades de bem-estar | múltipla |
| 24 | Mudança que faria mais diferença | única; alimenta `resultGoal` |
| 25 | Conhecimento sobre fáscia/linfa/nervo vago | única |
| 26 | Proposta Destrava Leve | mecanismo; cartões Liberação/Movimento/Relaxamento |
| 27 | Como conheceu o Destrava Leve | única |
| 28 | Ponto de partida | score educativo, resumo literal e 28 dias |
| 29 | Gráfico semanal | barras/linha via Web Animations API |
| 30 | Tempo diário disponível | única |
| 31 | Linha do tempo | dias 1/7/14/28 |
| 32 | Confiança para começar | única |
| 33 | Organização das respostas | loader 8→24→43→67→86→100; avança para 34 |
| 34 | Captura de e-mail | validação local de formato |
| 35 | Preferência de novidades | escolha não altera o caminho |
| 36 | Captura de primeiro nome | obrigatório para continuar |
| 37 | Roleta | giro, ponteiro fixo, som Web Audio, vitória de 75% |
| 38 | PV/oferta completa | R$ 37, pagamento único, modal demonstração |

São 27 perguntas e 12 telas não-pergunta (intersticiais, resultado, gráfico/timeline, dados, roleta e PV), totalizando 39 telas internas.

## 4. Visual e audiovisual

- Fundo branco contínuo; o funil não usa coluna cinza divisória.
- Container central estreito, mobile-first; `max-width: 511px`, laterais responsivas de 7vw (21 px em telas muito estreitas).
- Azul principal `#294f81`/`#1d416f`, texto `#111820`, cinza suave `#eef0f3`, coral `#f45b68`, laranja `#ff9c21`, verde `#47a66f`.
- Logo textual `destravaleve+`; cabeçalho com voltar, progresso por cinco segmentos e controle de movimento.
- Respostas são cartões touch-friendly; seleção única avança, múltipla apresenta Continuar.
- Imagens de sintomas usam WebP e `object-fit: cover` com proporção 16:9 no mobile para impedir cortes extremos.
- Gráfico em `screen=29`: barras, linha SVG, pontos, grade e brilho são animados; conferir `chartRef` e não adicionar animação CSS concorrente.
- Roleta em `screen=37`: seis fatias de 10/30/20/75/15/50%, ponteiro separado e fixo, giro Web Animations API, som sintético em cada divisão e acorde de vitória.
- Comemoração atual: `ConfettiBurst` usa canvas, 64 partículas coloridas, origem no centro da roleta, duração nominal 1,45 s e limpeza automática. Não existem mais elementos `.confetti i` nem halo/glow permanente.
- Som só é inicializado após clique do usuário, por política de autoplay. O controle de movimento não é controle de som.

## 5. Assets locais

Todos ficam em `public/` e são referenciados por caminho absoluto do Site:

| Arquivo | Uso |
|---|---|
| `mascote-fluxo-transparente.webp` | personagem anatômico da entrada, mecanismo e resultado |
| `mascote-fluxo.webp` | versão alternativa antiga |
| `mascote-emocional.webp` | intersticial emocional |
| `grupo-mulheres.webp` | acolhimento/prova social |
| `estado-estresse.webp` | pergunta de estresse e PV |
| `estado-mandibula.webp` | pergunta de mandíbula |
| `estado-pernas.webp` | pergunta/PV de pernas |
| `estado-cansaco.webp` | pergunta de cansaço |
| `comparativo-leveza.webp` | comparação da PV |
| `kit-destrava-leve.webp` | seção de conteúdo da PV |
| `favicon.svg` | favicon |

Os WebP substituíram PNGs pesados em 05/09. A maior imagem atual é `mascote-fluxo-transparente.webp` (~168 KB).

## 6. Página de vendas atual

A PV em `screen=38` inclui: faixa de condição e timer, métricas de 7 minutos, meta e plano de 28 dias, comparação visual, sensações “pesado/travado” versus “leve/livre”, preço R$ 37 pagamento único, CTA repetido, método em três etapas, itens incluídos, caminho em quatro semanas, garantia textual de 7 dias, FAQ e CTA final. O botão abre `Dialog` com aviso de que nenhum pagamento foi feito.

Pontos comerciais pendentes antes de venda real: conteúdo final que sustenta a promessa, fornecedor/responsável, suporte, método de entrega e prazo de acesso, política real de reembolso, checkout/Pix/cartão e revisão jurídica/regulatória. O texto atual de garantia é protótipo e não deve ser tratado como política final.

## 7. Site e publicação

- Sites project: `appgprj_6a9b86c6890081918ac1ba7e0479a51b`.
- `.openai/hosting.json`: projeto acima; `d1` e `r2` nulos.
- Audiência atual: privada/owner-only; não mudar sem pedido explícito.
- Produção: https://destrava-leve-previa.sousa2412.chatgpt.site
- Última versão: 13, commit `49d90fa59a46d85fcf8301e0d44652b4e3778468`.
- Último build TypeScript: `tsc --noEmit --incremental false` sem erros; Vinext build concluído.

Para publicar, o agente deve obter credencial curta via connector Sites, fazer push do commit exato, empacotar o build `dist` com `dist/server/index.js` e `dist/.openai/hosting.json`, salvar versão, fazer deploy privado e consultar status até `succeeded`. Nunca colocar token em arquivo, URL ou documentação.

## 8. Pesquisa e referência

Os arquivos de pesquisa ficam no diretório pai:

- `notes/AURA_INVENTARIO_VISUAL_39_TELAS.md`: inventário das 39 telas Aura; viewport aproximado 511×791; estrutura e regras visuais.
- `notes/funnel_map.md`: mapa público Aura, perguntas, mecanismos, CRO, divergências e limites.
- `notes/technical_map.md`: FunnelFox v53, Svelte provável, APIs públicas, Stripe/PayPal e tracking observado sem compra.
- `notes/ads_library.md`: 56 anúncios de imagem, famílias C1–C6/V1–V6, destinos, headlines, CTAs e limites de inferência.
- `reports/RAIO_X_COMPLETO_AURA.md`: relatório reverso mais amplo.
- `reports/DESTRAVA_LEVE_ROTEIRO_MESTRE_V1.md`: roteiro em português, regras de personalização, PV e decisões éticas/comerciais.
- `notes/aura-screenshots/`: capturas individuais 01–39; `notes/AURA_PRINTS_*.jpg` e ZIP são folhas de contato.
- `notes/destrava-qa-v6/` e `notes/destrava-qa-v8/`: capturas de QA local de imagens, gráfico e roleta.
- `scripts/qa-destrava-playwright.cjs`: roteiro histórico de QA do gráfico e roleta; usa viewport 637×982, `reducedMotion:'no-preference'`, verifica barras, giro, ponteiro e ao menos oito tons.

Na Aura, a entrada observada tinha resposta de idade automática e transições curtas; a estrutura era mobile-first, fundo branco, cartões grandes e intersticiais com 3D. A pesquisa não verificou compra, payloads privados, cookies/storage ou Purchase real.

## 9. Próximos passos recomendados

1. Fazer revisão visual real em mobile (390×844 e 375×812) de todas as 39 telas, especialmente imagens e rolagem da PV.
2. Confirmar o giro em dispositivos sem Web Audio e com `prefers-reduced-motion`.
3. Substituir placeholders comerciais por conteúdo/termos reais antes de qualquer tráfego.
4. Definir checkout real e instrumentação de eventos sem enviar respostas íntimas a pixels.
5. Revisar dependências: a instalação inicial registrou 11 vulnerabilidades (1 baixa, 2 moderadas, 8 altas); não aplicar update forçado sem avaliar compatibilidade.
6. Se o usuário pedir nova alteração, reproduzir e testar no Site publicado; não declarar “funciona” apenas por screenshot estático.

