# Questionário clínico premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernizar o questionário com visual clínico premium e corrigir o fluxo de etapas sem alterar dados, cálculos ou integração.

**Architecture:** Uma função pura descreverá a navegação de cada etapa e `main.js` passará o total de etapas explicitamente ao DOM. A estrutura e os estilos serão refinados com CSS próprio em `src/styles.css`, enquanto `logic.js` permanece a fonte única das perguntas e escores.

**Tech Stack:** JavaScript ES modules, Vite 5, Vitest, Tailwind via CDN e CSS nativo.

## Global Constraints

- Preservar perguntas, nomes exportados, pontuações, faixas, PDF, endpoint e payload atual.
- Não adicionar dependências, modo escuro, animação JavaScript ou bibliotecas de efeitos.
- Usar glassmorphism somente no cabeçalho, progresso e resultados; perguntas e campos devem continuar opacos e legíveis.
- Manter o tema claro clínico: branco suave, azul-marinho, azul-petróleo/verde e dourado discreto.

---

### Task 1: Estado puro da navegação e correção do fluxo

**Files:**
- Create: `src/navigation.js`
- Create: `tests/navigation.test.js`
- Modify: `src/dom.js`
- Modify: `src/main.js`

**Interfaces:**
- Produces `getStepPresentation(step, totalSteps)` returning `{ showPrevious, showNavigation, nextLabel, progress }`.
- `showStep(step, totalSteps)` consumes that presentation to hide/show panels and update controls.

- [ ] **Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest';
import { getStepPresentation } from '../src/navigation.js';

describe('navegação do questionário', () => {
  it('configura a etapa anterior ao resultado', () => {
    expect(getStepPresentation(3, 4)).toEqual({
      showPrevious: true,
      showNavigation: true,
      nextLabel: 'Ver resultados',
      progress: 67,
    });
  });

  it('oculta a navegação no resultado', () => {
    expect(getStepPresentation(4, 4)).toMatchObject({
      showPrevious: true,
      showNavigation: false,
      progress: 100,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/navigation.test.js`

Expected: FAIL because `src/navigation.js` does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
export function getStepPresentation(step, totalSteps) {
  const progress = Math.round(((step - 1) / (totalSteps - 1)) * 100);
  return {
    showPrevious: step > 1,
    showNavigation: step < totalSteps,
    nextLabel: step === totalSteps - 1 ? 'Ver resultados' : 'Continuar',
    progress,
  };
}
```

Update `showStep` to require `totalSteps`, hide every `step-*` panel before revealing the selected one, and apply the presentation object. Update both calls in `main.js` to `showStep(currentStep, totalSteps)`; remove the duplicate progress implementation in favor of `updateProgressBar`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/navigation.test.js`

Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/navigation.js src/dom.js src/main.js tests/navigation.test.js
git commit -m "fix: correct questionnaire step navigation"
```

### Task 2: Cobertura dos limites clínicos existentes

**Files:**
- Modify: `tests/logic.test.js`

**Interfaces:**
- Consumes `calculateInflammationScore(answers)` and `calculateMentalRiskScore(answers)` from `src/logic.js`.
- Produces regression coverage; no production calculation code changes.

- [ ] **Step 1: Write the failing tests**

```js
it.each([
  [9, 'Normal'], [10, 'Leve'], [49, 'Leve'], [50, 'Moderada'],
  [99, 'Moderada'], [100, 'Grave'],
])('classifica inflamação em %i como %s', (total, level) => {
  expect(calculateInflammationScore([total]).level).toBe(level);
});

it.each([
  [0, 'Ideal'], [1, 'Leve'], [9, 'Leve'], [10, 'Moderado'],
  [20, 'Moderado'], [21, 'Grave'],
])('classifica risco mental em %i como %s', (total, level) => {
  expect(calculateMentalRiskScore([total]).level).toBe(level);
});
```

- [ ] **Step 2: Run tests to verify the current suite lacks the intended boundary coverage**

Run: `npm test -- tests/logic.test.js`

Expected: the new expectations pass; inspect output to confirm every listed boundary runs.

- [ ] **Step 3: Keep calculation implementation unchanged**

Do not modify `src/logic.js`: the tests formalize the values already validated against the pós-graduação material.

- [ ] **Step 4: Run full test suite**

Run: `npm test`

Expected: PASS with the original tests plus all boundary cases.

- [ ] **Step 5: Commit**

```bash
git add tests/logic.test.js
git commit -m "test: cover clinical score boundaries"
```

### Task 3: Sistema visual clínico premium

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.js`
- Modify: `src/dom.js`
- Modify: `index.html`

**Interfaces:**
- `main.js` imports `./styles.css` once.
- Existing IDs and input names remain unchanged so PDF, validation, calculations and submission continue to work.

- [ ] **Step 1: Create a visual regression checklist before styling**

Record the current invariant controls: `questionnaireForm`, `inflammation-questions`, `mental-risk-questions`, `nextBtn`, `prevBtn`, `btn-pdf`, `submitButton`, every hidden score input, and all generated radio `name` values. These IDs/names must remain present after markup changes.

- [ ] **Step 2: Add the CSS token layer and component styles**

Create `src/styles.css` with CSS custom properties for `--ink`, `--navy`, `--teal`, `--gold`, `--surface`, `--line`, `--shadow` and `--radius`. Implement classes for the page background, translucent `premium-glass` context cards, opaque `question-card` fields, pill controls, button focus rings, result cards and reduced-motion fallback:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 3: Apply semantic premium markup without changing integration hooks**

Update `index.html` with a premium header, named step tracker, descriptive helper text and class hooks. Keep all existing form IDs, input IDs, input names and submit behavior. Update `initializeForm` in `src/dom.js` to add `question-card`, `answer-pill`, `is-inflammation` and `is-mental-risk` classes while preserving radio values and labels.

- [ ] **Step 4: Make result visual state explicit**

In `displayResults`, retain score/level text but add level-specific classes (`result-normal`, `result-leve`, `result-moderada`, `result-grave`) to result containers. Do not change classification conditions.

- [ ] **Step 5: Verify production build and interaction invariants**

Run: `npm test && npm run build`

Expected: all tests pass and Vite completes with exit code 0.

Manually verify: named tracker updates at 0/33/67/100%, answer selection is visible with keyboard focus, all four panels do not coexist, result controls are visible only at the last step, and mobile layout avoids horizontal overflow.

- [ ] **Step 6: Commit**

```bash
git add index.html src/main.js src/dom.js src/styles.css
git commit -m "feat: refresh questionnaire with clinical premium design"
```

### Task 4: Final verification and publication

**Files:**
- Modify: no production files expected

- [ ] **Step 1: Inspect the final change set**

Run: `git diff origin/main...HEAD --check && git status --short`

Expected: no whitespace errors and no uncommitted changes.

- [ ] **Step 2: Re-run verification from a clean commit**

Run: `npm test && npm run build`

Expected: all tests pass and the production bundle is generated.

- [ ] **Step 3: Publish implementation commits**

Run: `git push origin main`

Expected: GitHub accepts the implementation commits.
