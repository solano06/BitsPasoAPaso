import { getRoutePath } from '../i18n.js';

const TEXT = {
  es: {
    errExpr: 'Error de sintaxis en la fórmula booleana: {msg}',
    errEquiv: 'Para comprobar equivalencia separa las dos fórmulas con ";" (ej. A -> B ; !A + B).',
    classification: 'Clasificación lógica',
    tautology: 'TAUTOLOGÍA (siempre verdadera)',
    contradiction: 'CONTRADICCIÓN (siempre falsa)',
    contingency: 'CONTINGENCIA (verdadera y falsa según entradas)',
    equivalent: 'EQUIVALENTES (idénticas en las {n} filas)',
    notEquivalent: 'NO EQUIVALENTES ({diff} filas contraejemplo)',
    dnfLabel: 'FND / Mintérminos (Σm)',
    cnfLabel: 'FNC / Maxtérminos (ΠM)',
    openKarnaugh: 'Abrir en Mapa de Karnaugh',
    step1: 'Paso 1: Variables detectadas y subexpresiones',
    step1Desc: 'Detectamos las variables en orden alfabético y descomponemos los operadores según precedencia.',
    step2: 'Paso 2: Tabla de verdad completa con columnas intermedias',
    step2Desc: 'Evaluamos cada combinación binaria de 0 a {max} sin usar eval().',
    step3: 'Paso 3: Clasificación, FND (Σm) y FNC (ΠM)',
    step3Desc: 'Extraemos los mintérminos (salidas 1) y maxtérminos (salidas 0).'
  },
  en: {
    errExpr: 'Boolean formula syntax error: {msg}',
    errEquiv: 'To check equivalence separate two formulas with ";" (e.g. A -> B ; !A + B).',
    classification: 'Logical Classification',
    tautology: 'TAUTOLOGY (always true)',
    contradiction: 'CONTRADICTION (always false)',
    contingency: 'CONTINGENCY (depends on inputs)',
    equivalent: 'EQUIVALENT (identical on all {n} rows)',
    notEquivalent: 'NOT EQUIVALENT ({diff} counterexample rows)',
    dnfLabel: 'DNF / Minterms (Σm)',
    cnfLabel: 'CNF / Maxterms (ΠM)',
    openKarnaugh: 'Open in Karnaugh Map',
    step1: 'Step 1: Detected variables & subexpressions',
    step1Desc: 'Detect variables alphabetically and parse operators by precedence.',
    step2: 'Step 2: Full truth table with intermediate columns',
    step2Desc: 'Evaluate every binary combination from 0 to {max} without eval().',
    step3: 'Step 3: Classification, DNF (Σm) & CNF (ΠM)',
    step3Desc: 'Extract minterms (1-outputs) and maxterms (0-outputs).'
  },
  fr: {
    errExpr: 'Erreur de syntaxe booléenne : {msg}',
    errEquiv: 'Pour vérifier l’équivalence séparez deux formules par ";" (ex. A -> B ; !A + B).',
    classification: 'Classification logique',
    tautology: 'TAUTOLOGIE (toujours vraie)',
    contradiction: 'CONTRADICTION (toujours fausse)',
    contingency: 'CONTINGENCE (dépend des entrées)',
    equivalent: 'ÉQUIVALENTES (identiques sur les {n} lignes)',
    notEquivalent: 'NON ÉQUIVALENTES ({diff} contre-exemples)',
    dnfLabel: 'FND / Mintermes (Σm)',
    cnfLabel: 'FNC / Maxtermes (ΠM)',
    openKarnaugh: 'Ouvrir dans le Tableau de Karnaugh',
    step1: 'Étape 1 : Variables détectées et sous-expressions',
    step1Desc: 'Détection des variables par ordre alphabétique et analyse selon la précédence.',
    step2: 'Étape 2 : Table de vérité avec colonnes intermédiaires',
    step2Desc: 'Évaluation de chaque combinaison de 0 à {max} sans eval().',
    step3: 'Étape 3 : Classification, FND (Σm) et FNC (ΠM)',
    step3Desc: 'Extraction des mintermes (sorties 1) et maxtermes (sorties 0).'
  }
};

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (expr.slice(i, i + 3) === '<->') {
      tokens.push({ type: 'IFF' });
      i += 3;
    } else if (expr.slice(i, i + 2) === '->') {
      tokens.push({ type: 'IMP' });
      i += 2;
    } else if (ch === '↔') {
      tokens.push({ type: 'IFF' });
      i++;
    } else if (ch === '→') {
      tokens.push({ type: 'IMP' });
      i++;
    } else if (/^[A-E P-T]$/i.test(ch)) {
      tokens.push({ type: 'VAR', val: ch.toUpperCase() });
      i++;
    } else if (ch === '0' || ch === '1') {
      tokens.push({ type: 'CONST', val: Number(ch) });
      i++;
    } else if (ch === '(') {
      tokens.push({ type: 'LPAREN' });
      i++;
    } else if (ch === ')') {
      tokens.push({ type: 'RPAREN' });
      i++;
    } else if (ch === '+' || ch === '|' || ch === '∨') {
      tokens.push({ type: 'OR' });
      i++;
    } else if (ch === '^' || ch === '⊕') {
      tokens.push({ type: 'XOR' });
      i++;
    } else if (ch === '*' || ch === '·' || ch === '&' || ch === '∧') {
      tokens.push({ type: 'AND' });
      i++;
    } else if (ch === '⊼') {
      tokens.push({ type: 'NAND' });
      i++;
    } else if (ch === '⊽') {
      tokens.push({ type: 'NOR' });
      i++;
    } else if (ch === '!' || ch === '¬' || ch === '~') {
      tokens.push({ type: 'NOT_PRE' });
      i++;
    } else if (ch === "'" || ch === '’') {
      tokens.push({ type: 'NOT_POST' });
      i++;
    } else {
      throw new Error(`Unexpected "${ch}"`);
    }
  }
  return tokens;
}

function parseFormula(expr) {
  const tokens = tokenize(expr);
  if (!tokens.length) throw new Error('Empty formula');
  let pos = 0;
  const subExprs = [];
  const subSet = new Set();
  const varsSet = new Set();

  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  const recordSub = (label, fn) => {
    if (!subSet.has(label)) {
      subSet.add(label);
      subExprs.push({ label, fn });
    }
    return { label, fn };
  };

  function parseIff() {
    let left = parseImp();
    while (peek()?.type === 'IFF') {
      consume();
      const right = parseImp();
      const l = left.fn;
      const r = right.fn;
      left = recordSub(`(${left.label} ↔ ${right.label})`, (e) => (l(e) === r(e) ? 1 : 0));
    }
    return left;
  }

  function parseImp() {
    let left = parseOr();
    while (peek()?.type === 'IMP') {
      consume();
      const right = parseOr();
      const l = left.fn;
      const r = right.fn;
      left = recordSub(`(${left.label} → ${right.label})`, (e) => (l(e) === 1 && r(e) === 0 ? 0 : 1));
    }
    return left;
  }

  function parseOr() {
    let left = parseXor();
    while (peek()?.type === 'OR' || peek()?.type === 'NOR') {
      const op = consume().type;
      const right = parseXor();
      const l = left.fn;
      const r = right.fn;
      if (op === 'NOR') {
        left = recordSub(`(${left.label} ⊽ ${right.label})`, (e) => ((l(e) | r(e)) ^ 1) & 1);
      } else {
        left = recordSub(`(${left.label} + ${right.label})`, (e) => (l(e) | r(e)) & 1);
      }
    }
    return left;
  }

  function parseXor() {
    let left = parseAnd();
    while (peek()?.type === 'XOR') {
      consume();
      const right = parseAnd();
      const l = left.fn;
      const r = right.fn;
      left = recordSub(`(${left.label} ⊕ ${right.label})`, (e) => (l(e) ^ r(e)) & 1);
    }
    return left;
  }

  const startsFactor = (t) => t && (t.type === 'VAR' || t.type === 'CONST' || t.type === 'LPAREN' || t.type === 'NOT_PRE');

  function parseAnd() {
    let left = parseUnary();
    while (peek()?.type === 'AND' || peek()?.type === 'NAND' || startsFactor(peek())) {
      const op = peek()?.type === 'NAND' ? consume().type : (peek()?.type === 'AND' ? consume().type : 'AND');
      const right = parseUnary();
      const l = left.fn;
      const r = right.fn;
      if (op === 'NAND') {
        left = recordSub(`(${left.label} ⊼ ${right.label})`, (e) => ((l(e) & r(e)) ^ 1) & 1);
      } else {
        left = recordSub(`(${left.label} · ${right.label})`, (e) => (l(e) & r(e)) & 1);
      }
    }
    return left;
  }

  function parseUnary() {
    if (peek()?.type === 'NOT_PRE') {
      consume();
      const inner = parseUnary();
      const fn = inner.fn;
      return recordSub(`¬${inner.label}`, (e) => fn(e) ^ 1);
    }
    let node = parsePrimary();
    while (peek()?.type === 'NOT_POST') {
      consume();
      const fn = node.fn;
      node = recordSub(`${node.label}'`, (e) => fn(e) ^ 1);
    }
    return node;
  }

  function parsePrimary() {
    const tok = peek();
    if (!tok) throw new Error('Unexpected end');
    if (tok.type === 'VAR') {
      consume();
      varsSet.add(tok.val);
      return { label: tok.val, fn: (e) => e[tok.val] };
    }
    if (tok.type === 'CONST') {
      consume();
      const c = tok.val;
      return { label: String(c), fn: () => c };
    }
    if (tok.type === 'LPAREN') {
      consume();
      const inner = parseIff();
      if (peek()?.type !== 'RPAREN') throw new Error('Missing )');
      consume();
      return inner;
    }
    throw new Error(`Unexpected ${tok.type}`);
  }

  const root = parseIff();
  if (pos < tokens.length) throw new Error('Trailing tokens');

  return {
    vars: Array.from(varsSet).sort(),
    subExprs,
    root
  };
}

export function solveTruthTable(input, mode = 'eval', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const raw = (input || '').trim();
  if (!raw) return { ok: false, error: t.errExpr.replace('{msg}', 'empty') };

  if (mode === 'equiv' || raw.includes(';')) {
    const parts = raw.split(';').map((s) => s.trim());
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { ok: false, error: t.errEquiv };
    }
    let p1, p2;
    try {
      p1 = parseFormula(parts[0]);
      p2 = parseFormula(parts[1]);
    } catch (e) {
      return { ok: false, error: t.errExpr.replace('{msg}', e.message) };
    }

    const vars = Array.from(new Set([...p1.vars, ...p2.vars])).sort();
    if (vars.length === 0) vars.push('A');
    if (vars.length > 5) return { ok: false, error: t.errExpr.replace('{msg}', 'max 5 variables') };

    const total = 1 << vars.length;
    let diffCount = 0;
    const rowsHtml = [];

    for (let i = 0; i < total; i++) {
      const env = {};
      const bits = [];
      for (let b = 0; b < vars.length; b++) {
        const bit = (i >> (vars.length - 1 - b)) & 1;
        env[vars[b]] = bit;
        bits.push(bit);
      }
      const v1 = p1.root.fn(env);
      const v2 = p2.root.fn(env);
      const same = v1 === v2;
      if (!same) diffCount++;
      rowsHtml.push(`<tr class="border-t border-slate-200 dark:border-slate-800 ${same ? '' : 'bg-rose-500/15'}">
        ${bits.map((bit) => `<td class="px-3 py-1.5 font-mono text-center">${bit}</td>`).join('')}
        <td class="px-3 py-1.5 font-mono font-bold text-center text-cyan-600 dark:text-cyan-400">${v1}</td>
        <td class="px-3 py-1.5 font-mono font-bold text-center text-emerald-600 dark:text-emerald-400">${v2}</td>
      </tr>`);
    }

    const isEquiv = diffCount === 0;
    const summaryHtml = `
      <div class="p-4 rounded-xl border ${isEquiv ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'} font-bold text-base">
        ${isEquiv ? t.equivalent.replace('{n}', total) : t.notEquivalent.replace('{diff}', diffCount)}
      </div>
    `;

    const visualHtml = `
      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table class="w-full text-xs sm:text-sm whitespace-nowrap">
          <thead class="bg-slate-100 dark:bg-slate-800 font-mono">
            <tr>
              ${vars.map((v) => `<th class="px-3 py-2 text-center">${v}</th>`).join('')}
              <th class="px-3 py-2 text-center text-cyan-600 dark:text-cyan-400">F1 (${parts[0]})</th>
              <th class="px-3 py-2 text-center text-emerald-600 dark:text-emerald-400">F2 (${parts[1]})</th>
            </tr>
          </thead>
          <tbody>${rowsHtml.join('')}</tbody>
        </table>
      </div>
    `;

    const steps = [
      {
        title: t.step1,
        explanation: t.step1Desc,
        codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">Vars: ${vars.join(', ')} · F1 = ${parts[0]} · F2 = ${parts[1]}</div>`
      },
      {
        title: t.step2,
        explanation: t.step2Desc.replace('{max}', total - 1),
        codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${isEquiv ? t.equivalent.replace('{n}', total) : t.notEquivalent.replace('{diff}', diffCount)}</div>`
      }
    ];

    return { ok: true, summaryHtml, visualHtml, steps, copyText: `${parts[0]} ≡ ${parts[1]}: ${isEquiv}` };
  }

  let parsed;
  try {
    parsed = parseFormula(raw);
  } catch (e) {
    return { ok: false, error: t.errExpr.replace('{msg}', e.message) };
  }

  const vars = parsed.vars.length ? parsed.vars : ['A'];
  if (vars.length > 5) return { ok: false, error: t.errExpr.replace('{msg}', 'max 5 variables') };

  const total = 1 << vars.length;
  const cols = parsed.subExprs.filter((s) => s.label !== parsed.root.label);
  const minterms = [];
  const maxterms = [];
  const rowsHtml = [];

  for (let i = 0; i < total; i++) {
    const env = {};
    const bits = [];
    for (let b = 0; b < vars.length; b++) {
      const bit = (i >> (vars.length - 1 - b)) & 1;
      env[vars[b]] = bit;
      bits.push(bit);
    }
    const out = parsed.root.fn(env);
    if (out === 1) minterms.push(i);
    else maxterms.push(i);

    rowsHtml.push(`<tr class="border-t border-slate-200 dark:border-slate-800">
      <td class="px-2.5 py-1.5 font-mono text-xs text-slate-400">${i}</td>
      ${bits.map((bit) => `<td class="px-2.5 py-1.5 font-mono text-center">${bit}</td>`).join('')}
      ${cols.map((c) => `<td class="px-2.5 py-1.5 font-mono text-center text-slate-500 dark:text-slate-400">${c.fn(env)}</td>`).join('')}
      <td class="px-2.5 py-1.5 font-mono font-extrabold text-center ${out ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}">${out}</td>
    </tr>`);
  }

  let clsLabel = t.contingency;
  if (minterms.length === total) clsLabel = t.tautology;
  else if (minterms.length === 0) clsLabel = t.contradiction;

  const dnf = minterms.length
    ? minterms
        .map((m) =>
          vars
            .map((v, b) => ((m >> (vars.length - 1 - b)) & 1 ? v : `${v}'`))
            .join('·')
        )
        .join(' + ')
    : '0';

  const cnf = maxterms.length
    ? maxterms
        .map(
          (m) =>
            '(' +
            vars
              .map((v, b) => ((m >> (vars.length - 1 - b)) & 1 ? `${v}'` : v))
              .join(' + ') +
            ')'
        )
        .join('·')
    : '1';

  const kmapUrl =
    vars.length >= 2 && vars.length <= 4
      ? `${getRoutePath('karnaugh', lang)}?mode=${vars.length}&q=${encodeURIComponent(`m(${minterms.join(',')})`)}`
      : null;

  const summaryHtml = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.classification}</div>
        <div class="font-bold text-slate-900 dark:text-slate-100 mt-1">${clsLabel}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.dnfLabel}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm mt-1 break-all">Σm(${minterms.join(', ') || '∅'})</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.cnfLabel}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm mt-1 break-all">ΠM(${maxterms.join(', ') || '∅'})</div>
      </div>
    </div>
    ${
      kmapUrl
        ? `<div class="mt-3"><a href="${kmapUrl}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold">${t.openKarnaugh} →</a></div>`
        : ''
    }
  `;

  const visualHtml = `
    <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <table class="w-full text-xs sm:text-sm whitespace-nowrap">
        <thead class="bg-slate-100 dark:bg-slate-800 font-mono">
          <tr>
            <th class="px-2.5 py-2 text-left text-slate-400">#</th>
            ${vars.map((v) => `<th class="px-2.5 py-2 text-center">${v}</th>`).join('')}
            ${cols.map((c) => `<th class="px-2.5 py-2 text-center text-slate-500 dark:text-slate-400">${c.label}</th>`).join('')}
            <th class="px-2.5 py-2 text-center text-cyan-600 dark:text-cyan-400">F</th>
          </tr>
        </thead>
        <tbody>${rowsHtml.join('')}</tbody>
      </table>
    </div>
  `;

  const steps = [
    {
      title: t.step1,
      explanation: t.step1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">Vars: ${vars.join(', ')} · Sub: ${cols.map((c) => c.label).join(', ') || raw}</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc.replace('{max}', total - 1),
      codeOrMathHtml: `<div class="font-mono text-xs">${total} rows evaluated (${minterms.length} × 1, ${maxterms.length} × 0)</div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs space-y-1 break-all">
        <div>${clsLabel}</div>
        <div>FND: ${dnf}</div>
        <div>FNC: ${cnf}</div>
      </div>`
    }
  ];

  const csvText = [vars.join(',') + ',F', ...Array.from({ length: total }, (_, i) => vars.map((_, b) => (i >> (vars.length - 1 - b)) & 1).concat(minterms.includes(i) ? 1 : 0).join(','))].join('\n');
  const latexText = `\\Sigma m(${minterms.join(',')}) = ${dnf.replace(/([A-E])'/g, '\\overline{$1}').replace(/·/g, ' \\land ').replace(/\+/g, '\\lor')}`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText: `${clsLabel}\nΣm(${minterms.join(',')})\nΠM(${maxterms.join(',')})`, csvText, latexText };
}
