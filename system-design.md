# Prompt de Design System — "Neon Noir / Lime on Graphite"
> "Aplique o design system descrito em `system-design.md` a este projeto. Use **exatamente** os tokens de cor (`--bg #08090b`, `--panel #0f1013`, `--panel-2 #14161b`, `--border #1e2028`, `--border-strong #2a2d38`, `--accent #c8ff3a`, `--ink #f0ede8`, `--ink-dim #7b7a74`, `--ink-faint #3e3d3a`), a escala de radii (6/8/10/14/16/99px), a fonte Plus Jakarta Sans, labels UPPERCASE 11px 600 tracking 0.1em, caret-color accent em inputs, foco de input com border accent + box-shadow `0 0 0 3px rgba(200,255,58,0.08)`, glow radial de topo `rgba(200,255,58,0.06)` em telas de destaque, transições de 120-150ms em hovers, modais com backdrop `rgba(0,0,0,0.72)` + `backdrop-filter: blur(6px)` + `border-radius: 16px` + shadow `0 30px 80px rgba(0,0,0,0.6)`, bordas 1px em todo lugar, nenhum gradiente decorativo, nenhum segundo accent, hierarquia em 3 camadas (bg → panel → panel-2), e checklist da §16. Não invente cores, radii, sombras ou ícones coloridos fora do que está descrito."

## 0. Identidade em uma frase

Interface **dark-graphite monocromática** com **um único accent lime-neon** (`#c8ff3a`), tipografia **geométrica humanista** (`Plus Jakarta Sans`), bordas **finíssimas (1px)** sobre superfícies quase pretas, **glow radial sutil** no topo da viewport, cantos **levemente arredondados (10px)**, labels **em CAIXA ALTA com tracking alto**, e microinterações **curtas (120-200ms)** com spring suave. Zero gradiente decorativo. Zero sombra pesada (exceto em modais). Sensação: terminal/IDE moderno encontra caderno de produtividade premium.

---

## 1. Tokens de cor (copie como `:root` / theme)

```css
:root {
  /* Superfícies — hierarquia do mais escuro para o mais claro */
  --bg:            #08090b;   /* fundo raiz da aplicação */
  --panel:         #0f1013;   /* primeiro nível de superfície (cards grandes, headers, sidebars) */
  --panel-2:       #14161b;   /* segundo nível — cards DENTRO de panel, modais, hover alternativo */

  /* Bordas — sempre 1px sólida; nunca usar 2px+ exceto em checkboxes */
  --border:        #1e2028;   /* padrão, quase imperceptível */
  --border-strong: #2a2d38;   /* ênfase, hover de cards, avatares, botões secundários */

  /* Accent único — NÃO adicionar segundo accent decorativo */
  --accent:        #c8ff3a;   /* lime-neon, uso reservado: CTA primário, foco, estado "sucesso/ativo" */
  --accent-hover:  #d4ff5a;   /* apenas em hover de botão accent */
  --accent-ink:    #080a04;   /* texto sobre accent (quase preto, nunca #000 puro) */

  /* Texto — hierarquia em 3 níveis + um quarto "faint" */
  --ink:           #f0ede8;   /* primário: títulos, valores, input digitado */
  --ink-dim:       #7b7a74;   /* secundário: labels, subtítulos, texto auxiliar */
  --ink-faint:     #3e3d3a;   /* terciário: placeholders, timestamps, ícones inativos */

  /* Estados semânticos — usar com MUITA parcimônia */
  --warn:          #f5c842;   /* amber, apenas para "em progresso" / atenção */
  --danger:        #ff7a6b;   /* coral suave, apenas para erro/destrutivo */

  /* Formas */
  --radius:        10px;      /* default de quase tudo: inputs, botões, cards */
  --radius-sm:     6px;       /* checkboxes, badges pequenos, ícones clicáveis */
  --radius-md:     8px;       /* botões secundários compactos, chips de erro */
  --radius-lg:     14px;      /* colunas/panels grandes */
  --radius-xl:     16px;      /* modais, drawers */
  --radius-pill:   99px;      /* badges de contagem, pills de filtro */

  /* Tipografia */
  --font: 'Plus Jakarta Sans', system-ui, sans-serif;
}
```

**Regras invioláveis de cor:**
1. **Nunca** use `#000` puro como fundo. Sempre `--bg` (#08090b) — tem um toque de azul-cinza que suaviza em OLED.
2. **Nunca** use `#fff` puro como texto. Sempre `--ink` (#f0ede8) — tem warmth sutil.
3. O accent lime aparece em **no máximo 1 elemento primário por tela** + foco de input + micro-indicadores (barra de força, dot de status). Se dois CTAs apareceram lado a lado, um vira secundário (transparente + border-strong).
4. Vermelho (`--danger`) **só** em mensagens de erro inline e hover do botão "apagar/deletar". Não colore textos de validação padrão.
5. Amarelo (`--warn`) **só** para estado "em progresso" / "pendente atenção". Não decore.

---

## 2. Tipografia

**Família única:** `Plus Jakarta Sans` (importar do Google Fonts, pesos `300;400;500;600;700` + `italic 400`). Sem fallback de fonte serifada. Sem segunda família "display".

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

**Escala e uso:**

| Papel | Tamanho | Peso | Tracking | Cor | Transform |
|---|---|---|---|---|---|
| Logo / marca | 44-72px | 700 | -0.04em | `--ink` + ponto em `--accent` | — |
| Título de tela | 22-28px | 600 | -0.02em | `--ink` | — |
| Título de seção | 15-16px | 600 | normal | `--ink` | — |
| Body | 14-15px | 400-500 | normal | `--ink` | — |
| Label de campo | 11px | 600 | **0.1em** | `--ink-dim` | **UPPERCASE** |
| Label de seção | 10px | 700 | **0.14em** | `--ink-faint` | **UPPERCASE** |
| Meta/dica | 11-13px | 400 | normal | `--ink-faint` | — |
| Hint de atalho | 10px | 400 | 0.05em | `--ink-faint` | — |

**Suavização global:**
```css
html, body {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

**Maneirismo:** em interfaces informais/de produto (não corporativas), **todo texto de UI vai em minúsculas** — inclusive botões primários ("entrar", "criar conta", "salvar", "nova tarefa"). Logo quebra a regra com case normal. Mensagens de erro também em minúsculas. Para dashboards corporativos, **manter** a escala mas usar case normal.

---

## 3. Layout & espaçamento

- **Container principal** sempre `min-height: 100vh`, `background: var(--bg)`, `position: relative`, `overflow: hidden` (para conter o glow).
- **Padding de tela:** 28-32px nas laterais em desktop, 16-20px em mobile.
- **Gap entre seções:** 20-28px. Entre campos de form: 12px. Entre linhas compactas: 6-10px.
- **Grid de tela tipo board/kanban:** `grid-template-columns: repeat(N, 1fr); gap: 20px;`.
- **Forms centralizados:** largura fixa (`360-380px` login/register, `500px` modais), nunca `100%`.
- **Header fixo:** `position: sticky; top: 0; z-index: 10; padding: 18px 32px; border-bottom: 1px solid var(--border); background: var(--panel);`.

---

## 4. Glow de fundo (assinatura visual)

Em **toda tela "de destaque"** (landing, login, register, tela vazia, onboarding) colocar um `<div class="bg-glow">` atrás do conteúdo:

```css
.bg-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 50% at 50% 0%,
    rgba(200, 255, 58, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
}
```

- Raio elíptico, ancorado no **topo-centro** (`50% 0%`).
- Opacidade do accent: **0.05 a 0.06** — jamais acima, vira kitsch.
- Nunca usar em telas densas de dados (tabelas, dashboards com muitos cards) — o glow apenas respira em telas vazias/focadas.
- O conteúdo sobre o glow precisa de `position: relative; z-index: 1`.

---

## 5. Botões

### 5.1 Primário (accent)
```css
background: var(--accent);
color: var(--accent-ink);
border: none;
border-radius: var(--radius);
padding: 13-14px 20-28px;
font-size: 15px;
font-weight: 700;
letter-spacing: -0.01em;
cursor: pointer;
transition: background 0.12s, opacity 0.15s, transform 0.1s;
/* hover */
&:hover   { background: var(--accent-hover); }
&:disabled{ opacity: 0.75; transform: scale(0.98); cursor: not-allowed; }
```
**Uso:** **um único** por tela — a ação-mãe.

### 5.2 Secundário (ghost com borda)
```css
background: none;
color: var(--ink);
border: 1px solid var(--border-strong);
border-radius: var(--radius);
padding: 13px 28px;
font-weight: 500;
transition: border-color 0.12s, background 0.12s;
&:hover { border-color: var(--ink-dim); background: var(--panel); }
```

### 5.3 Translúcido-accent (CTA discreto em header/toolbar)
```css
background: rgba(200, 255, 58, 0.08);
border: 1px solid rgba(200, 255, 58, 0.25);
color: var(--accent);
padding: 9px 16px;
border-radius: 8px;
font-size: 13px;
font-weight: 600;
&:hover { background: rgba(200, 255, 58, 0.15); }
```
**Uso:** "adicionar item" no topo, ações positivas secundárias.

### 5.4 Texto/link
```css
background: none; border: none; cursor: pointer;
color: var(--ink-dim);        /* ou --ink para ênfase */
font-size: 13px;
&:hover { color: var(--ink); }
```
Link "primário" (ex: "criar conta"): `color: var(--ink); font-weight: 500; text-decoration: underline; text-underline-offset: 3px;`.

### 5.5 Destrutivo
Nunca vermelho em estado de repouso. **Estado repouso:** estilo texto/link dim. **Hover:** `color: var(--danger)`. Jamais botão vermelho sólido.

### 5.6 Ícone-botão
36x36px, `background: none` ou `var(--panel)`, `border-radius: 50%` para avatar / `var(--radius-sm)` para ação, hover muda `background` para `var(--border-strong)` ou escurece levemente.

---

## 6. Inputs & formulários

**Anatomia padrão de campo:**
```
label (UPPERCASE 11px 600 tracking 0.1em --ink-dim)
  ↓ 7px
input
  ↓ 12px (próximo campo)
```

**Input de texto / email / password / textarea:**
```css
background: var(--panel);        /* ou var(--bg) se o container já é var(--panel) */
border: 1px solid var(--border);
border-radius: var(--radius);    /* 10px; em cards compactos, 8px */
padding: 12-13px 14-16px;
color: var(--ink);
font-size: 15px;
font-family: var(--font);
outline: none;
transition: border-color 0.15s, box-shadow 0.15s;
caret-color: var(--accent);      /* cursor neon — ASSINATURA */
width: 100%;

&::placeholder { color: var(--ink-faint); }
&:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(200, 255, 58, 0.08);   /* foco neon de 3px */
}
```

**Regras:**
- **Sempre** `caret-color: var(--accent)` em inputs. É o detalhe que define.
- Foco **nunca** usa `outline` nativo — sempre `box-shadow` ring de 3px com `rgba(200,255,58,0.08)`.
- Inputs dentro de `var(--panel)` usam `background: var(--bg)`; inputs soltos em fundo `var(--bg)` usam `background: var(--panel)`. Regra: input é **um nível abaixo** do container.
- Textarea: `resize: vertical; line-height: 1.6; rows=3-5`.
- Input "inline" (ex: adicionar item rápido): sem borda-padrão, **border: 1px solid var(--accent)** já no repouso, `background: var(--panel-2)`.

**Barra de força de senha (ou qualquer progresso segmentado):**
```css
.bar { display: flex; gap: 4px; height: 3px; }
.seg { flex: 1; border-radius: 2px; transition: background 0.2s; }
/* níveis: --danger (fraca), --warn (média), --accent (forte) */
/* segmento inativo: var(--border-strong) */
```

**Mensagem de erro inline:**
```css
font-size: 12px;
color: var(--danger);
background: rgba(255, 122, 107, 0.08);
border: 1px solid rgba(255, 122, 107, 0.20);
border-radius: 8px;
padding: 9px 13px;
```

**Agrupamento em seções de form:** envolver campos relacionados em `section`:
```css
background: var(--panel);
border: 1px solid var(--border);
border-radius: 12px;
padding: 16px 18px;
/* primeiro filho: label de seção 10px 700 tracking 0.14em UPPERCASE --ink-faint */
```

---

## 7. Cards

**Card compacto (lista/board):**
```css
background: var(--panel-2);
border: 1px solid var(--border);
border-radius: var(--radius);    /* 10px */
padding: 12px 14px;
display: flex; align-items: center; gap: 10px;
cursor: pointer;
transition: border-color 0.12s, background 0.12s, opacity 0.12s;

&:hover {
  border-color: var(--border-strong);
  background: #181a20;           /* um passo acima de --panel-2 */
}
&.dragging { opacity: 0.4; transform: rotate(1.5deg) scale(0.97); }
```

**Card grande / painel (coluna kanban, seção de dashboard):**
```css
background: var(--panel);
border: 1px solid var(--border);
border-radius: var(--radius-lg); /* 14px */
padding: 18px;
min-height: 200px;
transition: border-color 0.15s, box-shadow 0.15s;
/* drag-over: border-color vira accent, box-shadow: 0 0 0 1px + accent com 22 alpha */
```

---

## 8. Checkbox custom (outro detalhe-assinatura)

```css
.check {
  width: 20px; height: 20px;
  border-radius: var(--radius-sm);    /* 6px */
  border: 1.5px solid var(--border-strong);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.check.done {
  background: var(--accent);
  border-color: var(--accent);
  animation: checkPop 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
/* dentro: SVG checkmark stroke="--accent-ink" stroke-width="1.8" */
```

**Variante circular (em modais/detalhes):** `width:26px; height:26px; border-radius:50%; border:2px solid var(--border-strong);` — mesmos estados.

**Variante "placeholder" (em onboarding, campo ainda vazio):** `border: 2px dashed var(--border-strong)`.

---

## 9. Pills / chips / badges

**Pill filtro/status:**
```css
padding: 6px 14px;
border-radius: var(--radius-pill);
border: 1px solid var(--border);
background: none;
font-size: 12px; font-weight: 500;
color: var(--ink-dim);
transition: all 0.12s;
```
Ativo: `border-color` e `color` assumem a cor semântica (`--ink-dim`, `--warn`, `--accent` etc.) e `background` vira a mesma cor com alpha ~0.12.

**Badge de contagem:**
```css
background: var(--panel-2);
border: 1px solid var(--border);
border-radius: var(--radius-pill);
padding: 2px 8px;
font-size: 11px; font-weight: 600;
color: var(--ink-dim);
```

**Dot de status:** `width:8px; height:8px; border-radius:50%; background: <semantic>;` — use `--ink-dim` para neutro, `--warn` para em progresso, `--accent` para concluído/ativo.

---

## 10. Modais & overlays

**Backdrop:**
```css
position: fixed; inset: 0; z-index: 100;
background: rgba(0, 0, 0, 0.72);
backdrop-filter: blur(6px);
display: flex; align-items: center; justify-content: center;
animation: fadeIn 0.15s ease;
```

**Panel do modal:**
```css
width: 500px;                    /* ou 380-600 conforme conteúdo */
background: var(--panel-2);
border: 1px solid var(--border-strong);
border-radius: var(--radius-xl); /* 16px */
padding: 24px;
display: flex; flex-direction: column; gap: 16px;
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);   /* ÚNICA sombra pesada permitida */
animation: slideUp 0.18s cubic-bezier(0.22, 1, 0.36, 1);
```

**Header do modal:** dot de status + label em UPPERCASE + spacer + close-btn (ícone X, `color: var(--ink-dim)`, hover `var(--ink)`).

**Footer do modal:** linha com `border-top: 1px solid var(--border); padding-top: 8px;` — meta dim à esquerda, ações à direita (destrutivo como link-dim, primário como botão accent compacto de `padding: 9px 20px`).

**Dropdown/menu:**
```css
position: absolute;
background: var(--panel);
border: 1px solid var(--border-strong);
border-radius: var(--radius-lg);
min-width: 180px;
z-index: 100;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
overflow: hidden;
```
Itens: `padding: 9px 14px; font-size: 13px; color: var(--ink-dim);` hover `color: var(--ink); background: var(--panel-2);`.

---

## 11. Animações (keyframes obrigatórios)

```css
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes slideUp  { from{opacity:0; transform:translateY(20px) scale(0.97)} to{opacity:1; transform:translateY(0) scale(1)} }
@keyframes screenIn { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
@keyframes checkPop { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 70%{transform:scale(0.92)} 100%{transform:scale(1)} }
@keyframes cardCheck{ 0%{transform:translateX(0)} 25%{transform:translateX(4px)} 75%{transform:translateX(-2px)} 100%{transform:translateX(0)} }
@keyframes spin     { to{transform:rotate(360deg)} }
```

**Durações:**
- Hover de cor/borda: **120-150ms** `ease` (ou default).
- Entrada de tela: **300-400ms** `ease` (screenIn).
- Entrada de modal/popup: **150-180ms** `cubic-bezier(0.22, 1, 0.36, 1)` (spring-out).
- Feedback de ação (checkPop, cardCheck): **250-300ms**.
- Spinner: **700ms** linear infinite.

**Spinner padrão (dentro de botão accent):**
```css
width: 14px; height: 14px;
border: 2px solid rgba(8, 10, 4, 0.3);
border-top-color: var(--accent-ink);
border-radius: 50%;
animation: spin 0.7s linear infinite;
```

---

## 12. Scrollbar (detalhe silencioso)

```css
::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }
```
Não estilizar mais que isso. Não colorir com accent.

---

## 13. Ícones

- **SVG inline**, `stroke="currentColor"`, `stroke-width: 1.5-2`, `stroke-linecap: round`, `stroke-linejoin: round`.
- Tamanhos padrão: **12px** (inline/inativo), **14px** (botões), **16px** (header/close), **20-26px** (checkbox), **48px** (empty state).
- **Nunca** ícones coloridos, filled maciços ou com múltiplas cores. Sempre traço.
- Ícones inativos/meta: `opacity: 0.4`.

---

## 14. Estados vazios

```
centralizado (position: fixed ou flex center)
↓
ícone SVG 48px em var(--border-strong), stroke-dasharray="4 3" (tracejado), opacity 0.5
↓ 12px
texto 15px var(--ink-dim) font-weight 500
↓ 4px
botão secundário compacto (padding 9px 18px, border var(--border-strong))
```

---

## 15. Hierarquia visual — as três camadas

Qualquer tela do sistema deve se ler em **exatamente três camadas de profundidade**:

1. **Fundo** (`--bg`): o chão da viewport.
2. **Painel** (`--panel`): containers estruturais (header, sidebar, colunas, seções de form).
3. **Item** (`--panel-2`): cards individuais, modais, inputs dentro de panel.

Se um quarto nível for necessário (hover de card), use `#181a20` (um passo acima de `--panel-2`) — **não** crie novo token. Se precisar de mais que isso, repense o layout: você está aninhando demais.

---

## 16. Checklist de QA visual (antes de considerar uma tela pronta)

- [ ] Fundo é `--bg`, não `#000`.
- [ ] Texto primário é `--ink`, não `#fff`.
- [ ] Tem **exatamente um** botão accent na tela (ou zero).
- [ ] Todo input tem `caret-color: var(--accent)`.
- [ ] Todo input tem foco com border accent + box-shadow ring 3px `rgba(200,255,58,0.08)`.
- [ ] Todas as labels estão UPPERCASE, 11px, 600, tracking 0.1em, `--ink-dim`.
- [ ] Bordas são **1px** em todo lugar (exceto checkbox: 1.5-2px).
- [ ] Radii obedecem à escala: 6/8/10/14/16/99px. Sem valores avulsos.
- [ ] Hover dura 120-150ms, nunca instantâneo, nunca acima de 300ms.
- [ ] Se a tela é "de destaque", tem `.bg-glow` no topo com opacidade 0.05-0.06.
- [ ] Nada de gradiente decorativo em botões, headers ou cards.
- [ ] Nada de sombra pesada fora de modais/dropdowns.
- [ ] Nada de emoji ou ícone colorido.
- [ ] Cores semânticas (`--warn`, `--danger`) usadas apenas em estados, nunca em decoração.

---

## 17. O que **NÃO** fazer (armadilhas comuns)

- ❌ Segundo accent ("azul para links, lime para sucesso"). Há **um** accent, ponto.
- ❌ Botão verde/azul/vermelho cheio para ação. Destrutivo e secundário são sempre texto ou outline.
- ❌ Bordas 2px+ em cards/inputs. Dá sensação pesada e datada.
- ❌ Radii arbitrários (5px, 7px, 13px). Obedeça à escala.
- ❌ Sombras `0 4px 12px` genéricas em cards. Este sistema usa **borda**, não sombra, para elevação.
- ❌ Transições >300ms em hover. Tira a sensação de terminal-snappy.
- ❌ Placeholders em itálico. Mesma família, mesma cor (`--ink-faint`).
- ❌ Texto em `#aaa`/`#ccc` genérico. Use a escala `--ink / --ink-dim / --ink-faint`.
- ❌ Gradientes em fundo de botão, header ou card. O único gradiente do sistema é o `.bg-glow`.
- ❌ Mudar a família de fonte por seção. Plus Jakarta Sans em 100% da UI.

---

## 18. Como adaptar para domínios diferentes

- **Dashboard de dados / analytics:** manter tokens, aumentar densidade (gaps 12-16px, padding de card 14px), usar `--warn` e `--danger` para thresholds numéricos, **remover** o `.bg-glow`.
- **Landing page marketing:** aumentar logo para 72-96px, intensificar o glow para `rgba(200,255,58,0.08)`, adicionar screenshots com `border: 1px solid var(--border-strong)` e `border-radius: var(--radius-lg)`, nunca com sombra.
- **Editor / IDE-like:** diminuir fontes em 1-2px, trocar radii default para 8px (mais squared), usar `--panel-2` como fundo editor e `--bg` como chrome.
- **E-commerce / catálogo:** cards de produto como "card grande" (§7), preço em `--ink` 600 peso, preço riscado em `--ink-faint` line-through, CTA "comprar" como botão accent primário — **um só** por card.
- **Mobile:** reduzir padding lateral para 16-20px, aumentar alvos clicáveis para 44px mín., manter todos os radii, manter caret-color accent.

---

## 19. Snippet inicial (copiar/colar em projeto novo)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

```css
/* cole aqui o :root da §1 + keyframes da §11 + scrollbar da §12 */

*, *::before, *::after { box-sizing: border-box; }
html, body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  margin: 0; padding: 0; min-height: 100%;
}
input, textarea, button, select { font-family: var(--font); }
```