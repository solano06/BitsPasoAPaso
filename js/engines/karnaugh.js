const GRAY_2 = ['0', '1'];
const GRAY_4 = ['00', '01', '11', '10'];

const LOOP_COLORS = [
  { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.18)', badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/50' },
  { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.18)', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50' },
  { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.18)', badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/50' },
  { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.18)', badge: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/50' },
  { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.18)', badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/50' },
  { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.18)', badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/50' }
];

const TEXT = {
  es: {
    errVars: 'El número de variables debe ser 2, 3 o 4.',
    errInput: 'Expresión o formato inválido. Ejemplo: A\'B + BC\' o m(0,1,2,5,6,7) d(3).',
    errRange: 'Índice fuera de rango para {n} variables (válido: 0 a {max}).',
    errExpr: 'Error de sintaxis en la expresión booleana: {msg}',
    sopLabel: 'Forma mínima SOP (Suma de Productos)',
    posLabel: 'Forma mínima POS (Producto de Sumas)',
    gatesLabel: 'Puertas lógicas',
    hoverHint: 'Pasa el ratón o toca un término para resaltar su lazo en el mapa',
    truthTitle: 'Tabla de Verdad interactiva',
    mapTitle: 'Mapa de Karnaugh (Código Gray)',
    clickHint: 'Toca cualquier celda F para alternar 0 → 1 → X',
    btnAll0: 'Todo 0',
    btnAll1: 'Todo 1',
    btnClearX: 'Limpiar X',
    btnInvert: 'Invertir',
    derivedRef: 'Referencia',
    step1: 'Paso 1: Tabla de verdad completa y mintérminos',
    step1Desc: 'Identificamos las salidas a 1 (mintérminos) y los estados indiferentes X (don’t care).',
    step2: 'Paso 2: Traslado al Mapa de Karnaugh en código Gray (00, 01, 11, 10)',
    step2Desc: 'Las celdas adyacentes (incluidos bordes opuestos y esquinas) difieren en exactamente 1 bit.',
    step3: 'Paso 3: Lazos de agrupación (2^k) y variables eliminadas',
    step3Desc: 'Cada lazo de tamaño 2^k elimina k variables que cambian dentro del grupo.',
    step4: 'Paso 4: Expresiones mínimas SOP, POS y comparación',
    step4Desc: 'Resultado simplificado mediante Quine-McCluskey y cobertura exacta.',
    origExpr: 'Ecuación original',
    constZero: 'Función constante 0 (ningún mintérmino activo).',
    constOne: 'Función constante 1 (todo el mapa cubierto).'
  },
  en: {
    errVars: 'Number of variables must be 2, 3, or 4.',
    errInput: 'Invalid expression or format. Example: A\'B + BC\' or m(0,1,2,5,6,7) d(3).',
    errRange: 'Index out of range for {n} variables (valid: 0 to {max}).',
    errExpr: 'Boolean expression syntax error: {msg}',
    sopLabel: 'Minimal SOP (Sum of Products)',
    posLabel: 'Minimal POS (Product of Sums)',
    gatesLabel: 'Logic gates',
    hoverHint: 'Hover or tap a term to highlight its loop on the map',
    truthTitle: 'Interactive Truth Table',
    mapTitle: 'Karnaugh Map (Gray Code)',
    clickHint: 'Tap any F cell to cycle 0 → 1 → X',
    btnAll0: 'All 0',
    btnAll1: 'All 1',
    btnClearX: 'Clear X',
    btnInvert: 'Invert',
    derivedRef: 'Reference',
    step1: 'Step 1: Full truth table & minterms',
    step1Desc: 'Identify 1-outputs (minterms) and don’t care X entries.',
    step2: 'Step 2: Gray code placement (00, 01, 11, 10)',
    step2Desc: 'Adjacent cells (including wrap-around edges and corners) differ by exactly 1 bit.',
    step3: 'Step 3: Power-of-2 grouping loops & eliminated variables',
    step3Desc: 'Each 2^k loop eliminates k variables that change within the group.',
    step4: 'Step 4: Minimal SOP, POS & comparison',
    step4Desc: 'Exact simplification via Quine-McCluskey and minimum cover.',
    origExpr: 'Original equation',
    constZero: 'Constant 0 function (no active minterms).',
    constOne: 'Constant 1 function (entire map covered).'
  },
  fr: {
    errVars: 'Le nombre de variables doit être 2, 3 ou 4.',
    errInput: 'Expression ou format invalide. Exemple : A\'B + BC\' ou m(0,1,2,5,6,7) d(3).',
    errRange: 'Indice hors plage pour {n} variables (valide : 0 à {max}).',
    errExpr: 'Erreur de syntaxe booléenne : {msg}',
    sopLabel: 'Forme minimale SOP (Somme de Produits)',
    posLabel: 'Forme minimale POS (Produit de Sommes)',
    gatesLabel: 'Portes logiques',
    hoverHint: 'Survolez ou touchez un terme pour mettre en évidence sa boucle',
    truthTitle: 'Table de Vérité interactive',
    mapTitle: 'Tableau de Karnaugh (Code Gray)',
    clickHint: 'Touchez une case F pour alterner 0 → 1 → X',
    btnAll0: 'Tout 0',
    btnAll1: 'Tout 1',
    btnClearX: 'Effacer X',
    btnInvert: 'Inverser',
    derivedRef: 'Référence',
    step1: 'Étape 1 : Table de vérité complète et mintermes',
    step1Desc: 'Identification des sorties à 1 (mintermes) et états indifférents X.',
    step2: 'Étape 2 : Placement en code Gray (00, 01, 11, 10)',
    step2Desc: 'Deux cases adjacentes (bords opposés et coins inclus) ne diffèrent que d’un bit.',
    step3: 'Étape 3 : Boucles (2^k) et variables éliminées',
    step3Desc: 'Chaque boucle de taille 2^k élimine k variables qui varient dans le groupe.',
    step4: 'Étape 4 : Expressions minimales SOP, POS et comparaison',
    step4Desc: 'Simplification exacte par Quine-McCluskey et couverture minimale.',
    origExpr: 'Équation d’origine',
    constZero: 'Fonction constante 0 (aucun minterme actif).',
    constOne: 'Fonction constante 1 (tout le tableau couvert).'
  }
};

// --- Recursive-descent Boolean expression parser (no eval) ---
function tokenizeBoolean(expr, numVars) {
  const allowedVars = ['A', 'B', 'C', 'D'].slice(0, numVars);
  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    const upper = ch.toUpperCase();
    if (allowedVars.includes(upper)) {
      tokens.push({ type: 'VAR', val: upper });
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
    } else if (ch === '+' || ch === '|') {
      tokens.push({ type: 'OR' });
      i++;
    } else if (ch === '^' || ch === '⊕') {
      tokens.push({ type: 'XOR' });
      i++;
    } else if (ch === '*' || ch === '·' || ch === '&' || ch === '.') {
      tokens.push({ type: 'AND' });
      i++;
    } else if (ch === '!' || ch === '¬' || ch === '~') {
      tokens.push({ type: 'NOT_PRE' });
      i++;
    } else if (ch === "'" || ch === '’') {
      tokens.push({ type: 'NOT_POST' });
      i++;
    } else {
      throw new Error(`Unexpected character "${ch}"`);
    }
  }
  return tokens;
}

export function parseBooleanExpr(expr, numVars) {
  const tokens = tokenizeBoolean(expr, numVars);
  if (tokens.length === 0) throw new Error('Empty expression');
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  // Precedence: OR < XOR < AND (explicit or implicit) < NOT (prefix/postfix) < Primary
  function parseOr() {
    let left = parseXor();
    while (peek()?.type === 'OR') {
      consume();
      const right = parseXor();
      const l = left;
      left = (env) => (l(env) | right(env)) & 1;
    }
    return left;
  }

  function parseXor() {
    let left = parseAnd();
    while (peek()?.type === 'XOR') {
      consume();
      const right = parseAnd();
      const l = left;
      left = (env) => (l(env) ^ right(env)) & 1;
    }
    return left;
  }

  function startsFactor(tok) {
    return tok && (tok.type === 'VAR' || tok.type === 'CONST' || tok.type === 'LPAREN' || tok.type === 'NOT_PRE');
  }

  function parseAnd() {
    let left = parseUnary();
    while (peek()?.type === 'AND' || startsFactor(peek())) {
      if (peek()?.type === 'AND') consume();
      const right = parseUnary();
      const l = left;
      left = (env) => (l(env) & right(env)) & 1;
    }
    return left;
  }

  function parseUnary() {
    if (peek()?.type === 'NOT_PRE') {
      consume();
      const inner = parseUnary();
      return (env) => inner(env) ^ 1;
    }
    let node = parsePrimary();
    while (peek()?.type === 'NOT_POST') {
      consume();
      const prev = node;
      node = (env) => prev(env) ^ 1;
    }
    return node;
  }

  function parsePrimary() {
    const tok = peek();
    if (!tok) throw new Error('Unexpected end of expression');
    if (tok.type === 'VAR') {
      consume();
      const v = tok.val;
      return (env) => env[v];
    }
    if (tok.type === 'CONST') {
      consume();
      const c = tok.val;
      return () => c;
    }
    if (tok.type === 'LPAREN') {
      consume();
      const inner = parseOr();
      if (peek()?.type !== 'RPAREN') throw new Error('Missing closing )');
      consume();
      return inner;
    }
    throw new Error(`Unexpected token ${tok.type}`);
  }

  const fn = parseOr();
  if (pos < tokens.length) throw new Error('Unexpected trailing tokens');

  const varNames = ['A', 'B', 'C', 'D'].slice(0, numVars);
  const cells = new Array(1 << numVars);
  for (let idx = 0; idx < cells.length; idx++) {
    const env = {};
    for (let b = 0; b < numVars; b++) {
      env[varNames[b]] = (idx >> (numVars - 1 - b)) & 1;
    }
    cells[idx] = fn(env) ? '1' : '0';
  }
  return cells;
}

function parseKarnaughInput(raw, numVars, submode) {
  const maxIdx = (1 << numVars) - 1;
  const cells = new Array(1 << numVars).fill('0');
  const trimmed = (raw || '').trim();

  if (trimmed.startsWith('grid:')) {
    const seq = trimmed.slice(5).trim();
    if (seq.length !== 1 << numVars) return null;
    for (let i = 0; i < seq.length; i++) {
      const ch = seq[i].toUpperCase();
      if (ch !== '0' && ch !== '1' && ch !== 'X') return null;
      cells[i] = ch;
    }
    return { cells, fromExpr: null };
  }

  if (trimmed === '' || trimmed === '-') {
    return { cells, fromExpr: null };
  }

  const looksLikeMinterm = /m\s*\(/i.test(trimmed) || /d\s*\(/i.test(trimmed) || /^[\d\s,;]+$/.test(trimmed);

  if (submode === 'expr' || (!looksLikeMinterm && /[a-dA-D'’!¬~+·*^⊕()]/.test(trimmed))) {
    try {
      const exprCells = parseBooleanExpr(trimmed, numVars);
      return { cells: exprCells, fromExpr: trimmed };
    } catch (e) {
      return { exprError: e.message };
    }
  }

  let mList = [];
  let dList = [];

  if (/m\s*\(/i.test(trimmed) || /d\s*\(/i.test(trimmed)) {
    const mMatch = trimmed.match(/m\s*\(([^)]*)\)/i);
    const dMatch = trimmed.match(/d\s*\(([^)]*)\)/i);
    if (mMatch && mMatch[1].trim()) {
      mList = mMatch[1].split(/[\s,]+/).filter(Boolean).map(Number);
    }
    if (dMatch && dMatch[1].trim()) {
      dList = dMatch[1].split(/[\s,]+/).filter(Boolean).map(Number);
    }
  } else {
    const parts = trimmed.split(';');
    if (parts[0].trim()) {
      mList = parts[0].split(/[\s,]+/).filter(Boolean).map(Number);
    }
    if (parts[1] && parts[1].trim()) {
      dList = parts[1].split(/[\s,]+/).filter(Boolean).map(Number);
    }
  }

  for (const idx of [...mList, ...dList]) {
    if (!Number.isInteger(idx) || idx < 0 || idx > maxIdx) {
      return { outOfRange: idx };
    }
  }

  for (const d of dList) cells[d] = 'X';
  for (const m of mList) cells[m] = '1';
  return { cells, fromExpr: null };
}

function countOnes(pattern) {
  let c = 0;
  for (const ch of pattern) if (ch === '1') c++;
  return c;
}

function combinePatterns(p1, p2) {
  let diff = 0;
  let res = '';
  for (let i = 0; i < p1.length; i++) {
    if (p1[i] === p2[i]) {
      res += p1[i];
    } else {
      if (p1[i] === '-' || p2[i] === '-') return null;
      diff++;
      if (diff > 1) return null;
      res += '-';
    }
  }
  return diff === 1 ? res : null;
}

function patternCovers(pattern, idx, numVars) {
  const bin = idx.toString(2).padStart(numVars, '0');
  for (let i = 0; i < numVars; i++) {
    if (pattern[i] !== '-' && pattern[i] !== bin[i]) return false;
  }
  return true;
}

function qmMinimize(ones, dontCares, numVars) {
  if (ones.length === 0) return { constant: '0', implicants: [] };
  const total = 1 << numVars;
  if (ones.length + dontCares.length === total) {
    return { constant: '1', implicants: ['-'.repeat(numVars)] };
  }

  let current = new Map();
  for (const idx of [...ones, ...dontCares]) {
    const pat = idx.toString(2).padStart(numVars, '0');
    current.set(pat, new Set([idx]));
  }

  const primes = new Map();
  while (current.size > 0) {
    const groups = Array.from({ length: numVars + 1 }, () => []);
    for (const [pat, cov] of current.entries()) {
      groups[countOnes(pat)].push([pat, cov]);
    }

    const used = new Set();
    const next = new Map();

    for (let g = 0; g < numVars; g++) {
      for (const [p1, c1] of groups[g]) {
        for (const [p2, c2] of groups[g + 1]) {
          const comb = combinePatterns(p1, p2);
          if (comb) {
            used.add(p1);
            used.add(p2);
            if (!next.has(comb)) next.set(comb, new Set());
            const target = next.get(comb);
            for (const x of c1) target.add(x);
            for (const x of c2) target.add(x);
          }
        }
      }
    }

    for (const [pat, cov] of current.entries()) {
      if (!used.has(pat)) {
        primes.set(pat, cov);
      }
    }
    current = next;
  }

  const primeList = Array.from(primes.keys())
    .map((pat) => {
      const coveredOnes = ones.filter((m) => patternCovers(pat, m, numVars));
      return { pat, coveredOnes };
    })
    .filter((p) => p.coveredOnes.length > 0);

  const selected = [];
  const remainingOnes = new Set(ones);

  let changed = true;
  while (changed) {
    changed = false;
    for (const m of Array.from(remainingOnes)) {
      const covering = primeList.filter((p) => p.coveredOnes.includes(m));
      if (covering.length === 1) {
        const chosen = covering[0];
        if (!selected.includes(chosen.pat)) {
          selected.push(chosen.pat);
          for (const x of chosen.coveredOnes) remainingOnes.delete(x);
          changed = true;
        }
      }
    }
  }

  if (remainingOnes.size > 0) {
    const remArr = Array.from(remainingOnes);
    const candidates = primeList.filter((p) => p.coveredOnes.some((m) => remainingOnes.has(m)));
    let bestCover = null;

    const search = (uncoveredMask, startIdx, chosen) => {
      if (bestCover && chosen.length >= bestCover.length) return;
      if (uncoveredMask === 0) {
        bestCover = [...chosen];
        return;
      }
      const firstBit = uncoveredMask & -uncoveredMask;
      const mIdx = Math.log2(firstBit);
      const targetM = remArr[mIdx];

      for (let i = startIdx; i < candidates.length; i++) {
        const cand = candidates[i];
        if (!cand.coveredOnes.includes(targetM)) continue;
        let nextMask = uncoveredMask;
        for (let b = 0; b < remArr.length; b++) {
          if (cand.coveredOnes.includes(remArr[b])) {
            nextMask &= ~(1 << b);
          }
        }
        chosen.push(cand.pat);
        search(nextMask, i + 1, chosen);
        chosen.pop();
      }
    };

    const fullMask = (1 << remArr.length) - 1;
    search(fullMask, 0, []);
    if (bestCover) {
      for (const pat of bestCover) {
        if (!selected.includes(pat)) selected.push(pat);
      }
    }
  }

  return { constant: null, implicants: selected };
}

function patternToTerm(pat, varNames, isPos) {
  const literals = [];
  for (let i = 0; i < pat.length; i++) {
    if (pat[i] === '-') continue;
    const v = varNames[i];
    if (isPos) {
      literals.push(pat[i] === '0' ? v : `${v}'`);
    } else {
      literals.push(pat[i] === '1' ? v : `${v}'`);
    }
  }
  if (literals.length === 0) return '1';
  if (isPos) {
    return literals.length > 1 ? `(${literals.join(' + ')})` : literals[0];
  }
  return literals.join('·');
}

function buildGridSvgLoops(implicants, numVars) {
  const rowCodes = numVars === 2 ? GRAY_2 : numVars === 3 ? GRAY_2 : GRAY_4;
  const colCodes = numVars === 2 ? GRAY_2 : GRAY_4;
  const rows = rowCodes.length;
  const cols = colCodes.length;
  const cellW = 58;
  const cellH = 46;

  const rects = [];
  implicants.forEach((pat, idx) => {
    const color = LOOP_COLORS[idx % LOOP_COLORS.length];
    const rowSet = [];
    const colSet = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const mIdx = parseInt(rowCodes[r] + colCodes[c], 2);
        if (patternCovers(pat, mIdx, numVars)) {
          if (!rowSet.includes(r)) rowSet.push(r);
          if (!colSet.includes(c)) colSet.push(c);
        }
      }
    }

    const splitContiguous = (arr, max) => {
      if (arr.length === max) return [[0, max - 1]];
      const sorted = [...arr].sort((a, b) => a - b);
      const segs = [];
      let start = sorted[0];
      let prev = sorted[0];
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === prev + 1) {
          prev = sorted[i];
        } else {
          segs.push([start, prev]);
          start = sorted[i];
          prev = sorted[i];
        }
      }
      segs.push([start, prev]);
      return segs;
    };

    const rSegs = splitContiguous(rowSet, rows);
    const cSegs = splitContiguous(colSet, cols);
    const pad = 4 + (idx % 3) * 2.5;

    for (const [r0, r1] of rSegs) {
      for (const [c0, c1] of cSegs) {
        const x = c0 * cellW + pad;
        const y = r0 * cellH + pad;
        const w = (c1 - c0 + 1) * cellW - pad * 2;
        const h = (r1 - r0 + 1) * cellH - pad * 2;
        rects.push(
          `<rect data-loop-idx="${idx}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${color.fill}" stroke="${color.stroke}" stroke-width="2" class="transition-all duration-150" />`
        );
      }
    }
  });

  return {
    width: cols * cellW,
    height: rows * cellH,
    cellW,
    cellH,
    svg: `<svg class="pointer-events-none absolute inset-0" width="${cols * cellW}" height="${rows * cellH}" viewBox="0 0 ${cols * cellW} ${rows * cellH}">${rects.join('')}</svg>`
  };
}

export function solveKarnaugh(input, mode = '3', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const [varsPart, submodePart] = String(mode || '3').split(':');
  const numVars = Number(varsPart);
  const submode = submodePart || 'table';
  if (![2, 3, 4].includes(numVars)) return { ok: false, error: t.errVars };

  const parsed = parseKarnaughInput(input || '', numVars, submode);
  if (!parsed) return { ok: false, error: t.errInput };
  if (parsed.exprError) {
    return { ok: false, error: t.errExpr.replace('{msg}', parsed.exprError) };
  }
  if (parsed.outOfRange !== undefined) {
    return { ok: false, error: t.errRange.replace('{n}', numVars).replace('{max}', (1 << numVars) - 1) };
  }

  const { cells, fromExpr } = parsed;
  const varNames = ['A', 'B', 'C', 'D'].slice(0, numVars);
  const ones = [];
  const zeros = [];
  const dontCares = [];

  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === '1') ones.push(i);
    else if (cells[i] === 'X') dontCares.push(i);
    else zeros.push(i);
  }

  const sopRes = qmMinimize(ones, dontCares, numVars);
  const posRes = qmMinimize(zeros, dontCares, numVars);

  let sopExpr = '';
  let sopBadgesHtml = '';
  if (sopRes.constant === '0') {
    sopExpr = '0';
    sopBadgesHtml = `<span class="font-mono font-bold text-cyan-600 dark:text-cyan-400">0</span>`;
  } else if (sopRes.constant === '1') {
    sopExpr = '1';
    sopBadgesHtml = `<span class="font-mono font-bold text-cyan-600 dark:text-cyan-400">1</span>`;
  } else {
    const terms = sopRes.implicants.map((p) => patternToTerm(p, varNames, false));
    sopExpr = terms.join(' + ');
    sopBadgesHtml = terms
      .map((term, idx) => {
        const color = LOOP_COLORS[idx % LOOP_COLORS.length];
        return `<button type="button" data-loop-term="${idx}" class="px-2 py-0.5 rounded border font-mono text-sm font-bold transition hover:scale-105 ${color.badge}">${term}</button>`;
      })
      .join('<span class="mx-1 font-mono font-bold text-slate-400">+</span>');
  }

  let posExpr = '';
  if (posRes.constant === '0') posExpr = '1';
  else if (posRes.constant === '1') posExpr = '0';
  else posExpr = posRes.implicants.map((p) => patternToTerm(p, varNames, true)).join(' · ');

  const rowVars = numVars === 2 ? 'A' : numVars === 3 ? 'A' : 'AB';
  const colVars4 = numVars === 2 ? 'B' : numVars === 3 ? 'BC' : 'CD';
  const rowCodes = numVars === 2 ? GRAY_2 : numVars === 3 ? GRAY_2 : GRAY_4;
  const colCodes = numVars === 2 ? GRAY_2 : GRAY_4;

  const loopOverlay = buildGridSvgLoops(sopRes.implicants, numVars);
  const gridState = cells.join('');

  const gridRowsHtml = rowCodes
    .map((rc) => {
      const cellsHtml = colCodes
        .map((cc) => {
          const mIdx = parseInt(rc + cc, 2);
          const val = cells[mIdx];
          const valCls =
            val === '1'
              ? 'text-cyan-700 dark:text-cyan-300 font-extrabold'
              : val === 'X'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-400 dark:text-slate-500';
          return `<td class="p-0 border border-slate-300 dark:border-slate-700" style="width:${loopOverlay.cellW}px;height:${loopOverlay.cellH}px">
            <button type="button" data-kmap-idx="${mIdx}" data-kmap-vars="${numVars}" data-kmap-grid="${gridState}" class="kmap-cell-btn w-full h-full flex flex-col items-center justify-center hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
              <span class="font-mono text-base ${valCls}">${val}</span>
              <span class="text-[9px] font-mono text-slate-400">m${mIdx}</span>
            </button>
          </td>`;
        })
        .join('');
      return `<tr><th class="px-2 font-mono text-xs text-slate-600 dark:text-slate-300 text-right">${rc}</th>${cellsHtml}</tr>`;
    })
    .join('');

  const truthRowsHtml = cells
    .map((val, idx) => {
      const bits = idx.toString(2).padStart(numVars, '0').split('');
      const valCls =
        val === '1'
          ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 font-extrabold'
          : val === 'X'
            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
      return `<tr class="border-t border-slate-200/80 dark:border-slate-800">
        <td class="px-2 py-1 font-mono text-[11px] text-slate-400">${idx}</td>
        ${bits.map((b) => `<td class="px-2 py-1 font-mono text-xs text-center">${b}</td>`).join('')}
        <td class="px-2 py-1 text-center">
          <button type="button" data-kmap-idx="${idx}" data-kmap-vars="${numVars}" data-kmap-grid="${gridState}" class="kmap-cell-btn w-8 h-6 rounded border font-mono text-xs ${valCls}">${val}</button>
        </td>
      </tr>`;
    })
    .join('');

  const derivedStr = `Σm(${ones.join(',') || '∅'})${dontCares.length ? ` + Σd(${dontCares.join(',')})` : ''}`;

  const visualHtml = `
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs text-slate-500 dark:text-slate-400">${t.clickHint}</span>
        <div class="flex flex-wrap gap-1.5">
          <button type="button" data-kmap-action="all0" data-kmap-grid="${gridState}" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500">${t.btnAll0}</button>
          <button type="button" data-kmap-action="all1" data-kmap-grid="${gridState}" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500">${t.btnAll1}</button>
          <button type="button" data-kmap-action="clearX" data-kmap-grid="${gridState}" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500">${t.btnClearX}</button>
          <button type="button" data-kmap-action="invert" data-kmap-grid="${gridState}" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500">${t.btnInvert}</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div class="min-w-0">
          <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">${t.mapTitle}</div>
          <div class="min-w-0 max-w-full overflow-x-auto pb-1">
            <div class="inline-block">
              <table class="border-collapse">
                <thead>
                  <tr>
                    <th class="px-2 py-1 font-mono text-xs text-slate-500 border-b border-r border-slate-300 dark:border-slate-700">${rowVars} \\ ${colVars4}</th>
                    ${colCodes.map((cc) => `<th class="py-1 font-mono text-xs text-slate-600 dark:text-slate-300 text-center" style="width:${loopOverlay.cellW}px">${cc}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="${colCodes.length + 1}" class="p-0">
                      <div class="relative">
                        <table class="border-collapse">
                          <tbody>${gridRowsHtml}</tbody>
                        </table>
                        <div class="pointer-events-none absolute top-0 right-0" style="width:${loopOverlay.width}px;height:${loopOverlay.height}px">
                          ${loopOverlay.svg}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400 break-all">${t.derivedRef}: <span class="text-slate-800 dark:text-slate-200 font-semibold">${derivedStr}</span></div>
        </div>

        <div class="min-w-0">
          <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">${t.truthTitle}</div>
          <div class="min-w-0 max-w-full overflow-x-auto max-h-72 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/60">
            <table class="w-full text-left whitespace-nowrap">
              <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
                <tr>
                  <th class="px-2 py-1.5">m</th>
                  ${varNames.map((v) => `<th class="px-2 py-1.5 text-center">${v}</th>`).join('')}
                  <th class="px-2 py-1.5 text-center text-cyan-600 dark:text-cyan-400">F</th>
                </tr>
              </thead>
              <tbody>${truthRowsHtml}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  const summaryHtml = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.sopLabel}</div>
        <div class="mt-1.5 flex flex-wrap items-center gap-y-1">
          <span class="font-mono font-bold text-slate-800 dark:text-slate-100 mr-2">F(${varNames.join(',')}) =</span>
          ${sopBadgesHtml}
        </div>
        <div class="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">${t.hoverHint}</div>
      </div>
      <div class="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.posLabel}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg mt-1 break-all">F(${varNames.join(',')}) = ${posExpr}</div>
      </div>
    </div>
  `;

  const groupDetails =
    sopRes.constant === '0'
      ? `<div>${t.constZero}</div>`
      : sopRes.constant === '1'
        ? `<div>${t.constOne}</div>`
        : sopRes.implicants
            .map((pat, idx) => {
              const color = LOOP_COLORS[idx % LOOP_COLORS.length];
              const cov = ones.concat(dontCares).filter((m) => patternCovers(pat, m, numVars));
              const elim = [];
              for (let i = 0; i < numVars; i++) if (pat[i] === '-') elim.push(varNames[i]);
              const term = patternToTerm(pat, varNames, false);
              return `<div class="flex flex-wrap items-center gap-2"><span class="px-2 py-0.5 rounded border text-xs font-mono font-bold ${color.badge}">${term}</span><span class="text-xs text-slate-600 dark:text-slate-300">[{${cov.join(', ')}}] · Δ: ${elim.length ? elim.join(', ') : '—'}</span></div>`;
            })
            .join('');

  const truthSummary = cells
    .map((val, idx) => `${idx.toString(2).padStart(numVars, '0')} (${idx}) → ${val}`)
    .join(' · ');

  const steps = [
    {
      title: t.step1,
      explanation: t.step1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs leading-relaxed">${truthSummary}</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs">${derivedStr}</div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="space-y-1.5">${groupDetails}</div>`
    },
    {
      title: t.step4,
      explanation: t.step4Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1">
        ${fromExpr ? `<div>${t.origExpr}: <span class="text-slate-600 dark:text-slate-300">${fromExpr}</span></div>` : ''}
        <div>SOP: F = ${sopExpr}</div>
        <div>POS: F = ${posExpr}</div>
        <div>${t.gatesLabel}: ${sopExpr.replace(/·/g, ' AND ').replace(/\+/g, ' OR ')}</div>
      </div>`
    }
  ];

  const copyText = `Karnaugh (${numVars} vars)\n${derivedStr}\nSOP: F(${varNames.join(',')}) = ${sopExpr}\nPOS: F(${varNames.join(',')}) = ${posExpr}`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}
