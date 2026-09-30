# Destrava Leve 28D

Protótipo de alta fidelidade de funil de quiz e página de vendas para o programa **Destrava Leve 28D**, desenvolvido com foco em experiência mobile-first, transições fluidas e alto desempenho.

---

## 🚀 Tecnologias

- **Framework:** [React 19](https://react.dev/) + [Vinext](https://github.com/vinext/vinext) (`1.0.0-beta.5`)
- **Bundler:** [Vite 8](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css`
- **Componentes:** [Shadcn UI](https://ui.shadcn.com/) / [@base-ui/react](https://base-ui.com/)
- **Animações e Áudio:** Web Animations API (WAAPI) e Web Audio API sintético
- **Linter & Formatter:** [Oxlint](https://oxc.rs/) & [Oxfmt](https://oxc.rs/)

---

## 📱 Funcionalidades

- **Funil de 39 Telas:** Sequência linear com 27 perguntas (seleção única, múltipla e escala), acolhimento, explicação de mecanismo, resultado com score educativo e timeline de 28 dias.
- **Transições Fluidas:** Controle centralizado via `useFunnelMotion` (WAAPI) com suporte a `prefers-reduced-motion` e toggle manual de velocidade.
- **Gamificação e Recompensa:** Roleta interativa com giro via WAAPI, ponteiro fixo, áudio sintetizado em tempo real e explosão de confetes em `<canvas>` efêmero.
- **Página de Vendas (PV):** Estrutura completa de conversão com cronômetro de escassez, comparativo de benefícios, módulos do programa, garantia e FAQ.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- Node.js `>= 22.13.0`
- NPM

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd destrava-leve
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000/
```

> **Dica de pré-visualização:** Para ir diretamente a qualquer uma das 39 telas durante o desenvolvimento, use a query string `?screen=N` (onde `N` varia de 1 a 39). Exemplo: `http://localhost:3000/?screen=37` para a roleta.

---

## 📁 Estrutura do Projeto

```
├── app/
│   ├── page.tsx               # Orquestrador do funil (39 telas) e estado da aplicação
│   ├── use-funnel-motion.ts   # Hook centralizador de transições WAAPI
│   ├── confetti-burst.tsx     # Efeito de confetes no canvas para a roleta
│   ├── layout.tsx             # Layout raiz com fontes e metadados
│   └── globals.css            # Variáveis CSS, layout mobile-first e estilos visuais
├── components/ui/             # Primitives Shadcn / Base UI
├── public/                    # Assets estáticos otimizados (WebP e SVG)
├── AGENTS.md                  # Regras de escopo, segurança e diretrizes operacionais
├── PROJECT_CONTEXT.md         # Mapeamento técnico detalhado de todas as telas e decisões
└── HISTORY.md                 # Histórico completo de versões e correções
```

---

## 📄 Licença e Uso

Este projeto é um protótipo de funil interativo. O quiz possui propósito puramente educativo e de bem-estar, não constituindo avaliação médica ou diagnóstico.
