# Histórico de trabalho — Destrava Leve

Período documentado: 05/09/2026–12/09/2026. Fontes: commits locais, arquivos de pesquisa e histórico disponível da conversa. Itens de Aura/K-Slim são referências de terceiros, não código reutilizado sem validação.

## Linha do tempo da conversa e do produto

### 1. Modelagem inicial da oferta

O usuário pediu para encapar o mecanismo do funil Aura para um low-ticket brasileiro de R$ 37, com pagamento único, mantendo perguntas, ritmo e promessa central, mas com marca e capa Destrava Leve. O escopo inicial foi somente o funil principal até a PV; upsells, downsell e back redirect foram explicitamente adiados.

Decisões resultantes: nome `Destrava Leve`, programa de 28 dias, rotina-base de 7 minutos e oferta sem assinatura. A marca Aura foi tratada como identidade do concorrente, não como mecanismo de oferta.

### 2. Pesquisa e captura de referência

Foi observado o funil público `https://plan.aura.care/lymphatic-reset-8/` e a variação Vagus, além da Biblioteca de Anúncios Meta. Foram registradas 39 telas Aura, 56 criativos estáticos e mapas de copy, visual, rotas, tracking e integrações FunnelFox. A passagem idade → prova social → estresse foi testada. Nenhuma compra ou dado financeiro foi enviado.

Evidências locais: `notes/aura-screenshots/`, `notes/AURA_INVENTARIO_VISUAL_39_TELAS.md`, `notes/funnel_map.md`, `notes/technical_map.md`, `notes/ads_library.md`, `reports/RAIO_X_COMPLETO_AURA.md`.

### 3. Construção do protótipo

O funil foi reconstruído em React/Vinext como uma rota com 39 telas, estado em memória e componentes Shadcn/Base UI. Perguntas foram traduzidas/adaptadas para pt-BR e o mecanismo visual foi mantido como bem-estar, sem diagnóstico. Foram adicionados assets WebP e uma PV de pagamento único.

## Histórico de commits

| Commit | Data | Alteração |
|---|---|---|
| `9c27997` | 05/09 | Preview inicial de cinco telas |
| `2370a92` | 05/09 | Rebuild do quiz Destrava Leve |
| `7edff08` | 05/09 | Expansão para o funil completo |
| `d0b02c4` | 05/09 | Ajuste do mecanismo e nome obrigatório |
| `5bf0009` | 05/09 | Otimização de performance/transições e troca PNG→WebP |
| `57c52e5` | 05/09 | Visuais do quiz e expansão da PV |
| `8621b9e` | 05/09 | Enquadramento mobile das imagens e transições |
| `3aeea44` | 05/09 | Gráfico semanal e roleta tátil |
| `e9ca683` | 05/09 | Refinamento mobile e animações de recompensa |
| `6e0b823` | 12/09 | Fundo branco contínuo, sem divisória cinza |
| `9c24751` | 12/09 | Primeira tentativa de transições fluidas |
| `3b34dac` | 12/09 | Correção do ciclo de motion e preferência reduzida |
| `49d90fa` | 12/09 | Confete curto na roleta e remoção do preço |

## Problemas encontrados e soluções

### Imagens cortadas no mobile

Problema: imagens de sintomas e personagens eram cortadas ou ficavam com espaços inadequados. Solução: assets em WebP, reserva de dimensões e regra mobile com `aspect-ratio:16/9` nas fotos de sintomas; personagens usam `object-fit:contain`. Ainda requer revisão em todos os tamanhos.

### Fundo dividido

Problema: a prévia mostrava uma faixa/coluna cinza em relação à referência Aura. Solução: `html`, `body`, `.page-shell` e `.screen` passaram a usar fundo branco contínuo e sem sombra divisória (commit `6e0b823`).

### Nome opcional indevido

Problema: a tela de nome oferecia caminho para continuar sem informar nome. Solução: campo obrigatório; o botão só habilita com primeiro nome não vazio. O nome é usado na mensagem da roleta/PV.

### Funil “travado”

Problema: clicar numa idade/alternativa parecia trocar instantaneamente ou reiniciar componentes. Causa principal identificada: o navegador tinha `prefers-reduced-motion: reduce`, e uma regra CSS anulava transformações; adicionalmente componentes internos eram recriados dentro de `Home`. Solução em `use-funnel-motion.ts`: componente de motion único, `main` keyed por tela, `flushSync`, bloqueio de navegação, entrada/saída WAAPI e override local `destrava-motion`. Teste publicado mediu deslocamentos intermediários e cabeçalho estável.

### Seleção múltipla reiniciando a tela

Problema: alterar checkbox remountava o conteúdo e podia reiniciar entrada. Solução: renderização estável, `key={screen}` somente na troca de tela e bloqueio de `toggleMulti` enquanto há transição. Respostas permanecem ao voltar.

### Gráfico sem animação observável

Problema: screenshot final parecia estático. Solução: animação WAAPI de grade, barras, linha, pontos e brilho; QA histórico comparou transform inicial/final. A medição deve sempre ser feita durante a entrada, não só depois de 100%.

### Roleta com ponteiro/blocos bugados

Problema: o disco não parecia girar corretamente em alguns estados; blocos coloridos ficavam na linha da roleta quando a animação era reduzida/desligada. Solução: ponteiro separado e fixo, giro WAAPI, som após gesto, remoção completa do confete CSS e novo `ConfettiBurst` em canvas com vida curta. A comemoração é removida após ~1,45 s.

### Preço aparecendo na roleta

Problema: usuário pediu para não mostrar preço na revelação. Solução: removido o texto `Preço de lançamento: R$ 37` do card de vitória; R$ 37 continua somente na PV (`screen=38`).

## QA executado

- TypeScript: `tsc --noEmit --incremental false` concluído sem erros na última correção.
- Vinext: build de produção concluído.
- Local: navegação idade → trust → pergunta de estresse → mandíbula; medidos `opacity` e `transform` em quadros intermediários.
- Local mobile (390 px): seleção múltipla, avanço por Continuar, volta e preservação de checkbox.
- Campo de nome: foco e digitação sem remontagem.
- Roleta local: giro concluído; card de vitória sem `R$`, zero `.confetti i`, zero halo pseudo-elemento persistente; canvas apareceu durante o burst e foi removido depois; sem erros de console.
- Publicado (versão 12): transição real medida no Site; animação completa ativada localmente no navegador por `destrava-motion=full`.
- Publicado (versão 13): roleta sem preço, canvas de confete visível durante a explosão e ausente após a limpeza; deployment status `succeeded`.

Capturas/artefatos de QA: `../notes/destrava-qa-v6/`, `../notes/destrava-qa-v8/`, `../notes/confetti-v13.tar.gz`, `../notes/motion-v12.tar.gz`.

## Publicações

| Versão | Commit | Estado | Conteúdo |
|---:|---|---|---|
| 11 | `9c24751…` | anterior | transições iniciais |
| 12 | `3b34dac…` | succeeded | motion centralizado e preferência local |
| 13 | `49d90fa…` | succeeded | roleta sem preço e burst de confete |
| 14 | `f7541e2…` | succeeded | GTM tracking infra, analytics events, depoimentos, selo garantia, gráfico térmico |
| 15 | `8f5ac94…` | succeeded | Order Bumps (100 chás e Seguro 28D) integrados com entregáveis HTML |
| 16 | `aaf9991…` | succeeded | Deploy Vercel: export estático (39 rotas), vercel.json (dist/client, cleanUrls) |
| 17 | `4bf62e3…` | succeeded | Rebranding Bump 2: Protocolo Leveza Contínua 100% White-Hat, novas capas Wiapy |
| 18 | `da59564…` | succeeded | Identidade visual oficial: logo vetorial somática, horizontal no header e favicon |
| 19 | `488cb85…` | succeeded | Ajuste visual: ampliação da logo em 30% no topo, otimização de viewBox e topbar |

Site Vercel (Produção): https://destrava-leve.vercel.app
Site ChatGPT Previa: https://destrava-leve-previa.sousa2412.chatgpt.site
Repositório GitHub: https://github.com/fbustlindo-creator/destrava-leve

## Estado aberto / riscos

- Deploy v14 pendente: build completo em `dist/`, aguardando publicação pela interface do ChatGPT.
- GTM v3 pendente: adicionar tag "Facebook - Virtual PageView" (trigger: `virtual_pageview`) para PageViews por tela no FB.
- A PV ainda é protótipo: checkout, acesso, suporte, termos e reembolso reais não foram definidos.
- O score é heurístico e educativo; não deve ser comunicado como medição clínica.
- A tela de roleta entrega 75% de forma determinística; isso é uma mecânica demonstrativa, não um sorteio real.
- O QA integral em todos os 39 passos e em todos os tamanhos móveis ainda é recomendado.
- A instalação inicial reportou 11 vulnerabilidades de dependências (1 baixa, 2 moderadas, 8 altas); nenhum update forçado foi aplicado.
- `notes/` contém arquivos locais não rastreados; preservá-los, mas não adicionar ao Git automaticamente.

## Próxima continuação recomendada

1. Abrir `PROJECT_CONTEXT.md` e reproduzir a etapa que o usuário apontar.
2. Não alterar cópia, preço ou promessa sem registrar a decisão comercial e a conformidade.
3. Validar mobile e acessibilidade antes de qualquer nova publicação.
4. Se for pedido checkout, parar de simular e definir primeiro provedor, acesso, política e eventos.
5. Atualizar este arquivo com qualquer nova causa, correção, teste e versão.

