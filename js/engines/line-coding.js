const TEXT = {
  es: {
    errBits: 'Introduce una trama binaria válida de 4 a 32 bits (solo 0 y 1).',
    levelsLabel: 'Niveles (+ / 0 / -)',
    schemeLabel: 'Esquema',
    hdb3Subs: 'Sustituciones HDB3',
    noHdb3: 'Sin bloques de 4 ceros consecutivos (idéntico a AMI).',
    step1: 'Paso 1: Reglas del esquema y estado inicial',
    step1Desc: 'NRZ-L: 0→+V, 1→-V. NRZI: 1 invierte al inicio (inicio -V). Manchester 802.3: 0→(+V,-V), 1→(-V,+V). AMI/HDB3: último pulso previo -V y paridad par.',
    step2: 'Paso 2: Análisis bit a bit y sustituciones HDB3',
    step2Desc: 'En HDB3 cada 0000 se sustituye por 000V (pulsos impares desde última V) o B00V (pulsos pares).',
    step3: 'Paso 3: Propiedades de transmisión (DC, sincronización y ancho de banda)',
    step3Desc: 'Comparativa eléctrica del esquema seleccionado.'
  },
  en: {
    errBits: 'Enter a valid binary frame of 4 to 32 bits (0 and 1 only).',
    levelsLabel: 'Levels (+ / 0 / -)',
    schemeLabel: 'Scheme',
    hdb3Subs: 'HDB3 Substitutions',
    noHdb3: 'No 4-zero runs (identical to AMI).',
    step1: 'Step 1: Scheme rules & initial state',
    step1Desc: 'NRZ-L: 0→+V, 1→-V. NRZI: 1 toggles at bit start (initial -V). Manchester 802.3: 0→(+V,-V), 1→(-V,+V). AMI/HDB3: initial last pulse -V, even parity.',
    step2: 'Step 2: Bit-by-bit levels & HDB3 substitutions',
    step2Desc: 'In HDB3 each 0000 becomes 000V (odd pulses since last V) or B00V (even pulses).',
    step3: 'Step 3: Electrical properties (DC, clock sync & bandwidth)',
    step3Desc: 'Summary of transmission characteristics.'
  },
  fr: {
    errBits: 'Saisissez une trame binaire valide de 4 à 32 bits (0 et 1 uniquement).',
    levelsLabel: 'Niveaux (+ / 0 / -)',
    schemeLabel: 'Schéma',
    hdb3Subs: 'Substitutions HDB3',
    noHdb3: 'Aucun bloc de 4 zéros (identique à AMI).',
    step1: 'Étape 1 : Règles du code et état initial',
    step1Desc: 'NRZ-L : 0→+V, 1→-V. NRZI : 1 inverse en début de bit. Manchester 802.3 : 0→(+V,-V), 1→(-V,+V). AMI/HDB3 : dernier pulse -V, parité paire.',
    step2: 'Étape 2 : Analyse bit à bit et substitutions HDB3',
    step2Desc: 'En HDB3 chaque 0000 devient 000V (impair) ou B00V (pair).',
    step3: 'Étape 3 : Propriétés électriques (DC, horloge et bande passante)',
    step3Desc: 'Résumé des caractéristiques de transmission.'
  }
};

export function encodeNrzL(bits) {
  return [...bits].map((b) => (b === '0' ? 1 : -1));
}

export function encodeNrzI(bits) {
  let lvl = -1;
  return [...bits].map((b) => {
    if (b === '1') lvl = -lvl;
    return lvl;
  });
}

export function encodeManchester(bits) {
  const half = [];
  for (const b of bits) {
    if (b === '0') half.push(1, -1);
    else half.push(-1, 1);
  }
  return half;
}

export function encodeDiffManchester(bits) {
  let lvl = -1;
  const half = [];
  for (const b of bits) {
    if (b === '0') lvl = -lvl;
    half.push(lvl);
    lvl = -lvl;
    half.push(lvl);
  }
  return half;
}

export function encodeAmi(bits) {
  let nextPulse = 1;
  return [...bits].map((b) => {
    if (b === '0') return 0;
    const p = nextPulse;
    nextPulse = -nextPulse;
    return p;
  });
}

export function encodeHdb3(bits) {
  const levels = [];
  const labels = new Array(bits.length).fill('');
  const substitutions = [];
  let lastPulse = -1;
  let pulsesSinceV = 0;
  let i = 0;

  while (i < bits.length) {
    if (bits.slice(i, i + 4) === '0000') {
      if (pulsesSinceV % 2 === 1) {
        // 000V: V has same polarity as lastPulse
        const vPol = lastPulse;
        levels.push(0, 0, 0, vPol);
        labels[i + 3] = vPol > 0 ? 'V+' : 'V-';
        substitutions.push(`pos ${i + 1}..${i + 4}: 000V (${labels[i + 3]})`);
      } else {
        // B00V: B alternates from lastPulse, V matches B
        const bPol = -lastPulse;
        const vPol = bPol;
        levels.push(bPol, 0, 0, vPol);
        labels[i] = bPol > 0 ? 'B+' : 'B-';
        labels[i + 3] = vPol > 0 ? 'V+' : 'V-';
        lastPulse = vPol;
        substitutions.push(`pos ${i + 1}..${i + 4}: B00V (${labels[i]}..${labels[i + 3]})`);
      }
      pulsesSinceV = 0;
      i += 4;
    } else if (bits[i] === '0') {
      levels.push(0);
      i++;
    } else {
      const p = -lastPulse;
      levels.push(p);
      lastPulse = p;
      pulsesSinceV++;
      i++;
    }
  }

  return { levels, labels, substitutions };
}

function buildWaveformSvg(bits, name, halfLevels, labels = []) {
  const n = bits.length;
  const bitW = 42;
  const padL = 36;
  const padT = 24;
  const rowH = 56;
  const w = padL + n * bitW + 16;
  const h = padT + rowH + 18;
  const yTop = padT + 8;
  const yMid = padT + rowH / 2;
  const yBot = padT + rowH - 8;
  const levelToY = (lvl) => (lvl > 0 ? yTop : lvl < 0 ? yBot : yMid);

  const stepW = bitW / (halfLevels.length / n);
  let pathD = '';
  let prevY = null;

  halfLevels.forEach((lvl, idx) => {
    const x1 = padL + idx * stepW;
    const x2 = x1 + stepW;
    const y = levelToY(lvl);
    if (idx === 0) {
      pathD += `M ${x1} ${y} L ${x2} ${y}`;
    } else {
      if (prevY !== y) pathD += ` L ${x1} ${y}`;
      pathD += ` L ${x2} ${y}`;
    }
    prevY = y;
  });

  const gridLines = Array.from({ length: n + 1 }, (_, i) => {
    const x = padL + i * bitW;
    const bitText = i < n ? `<text x="${x + bitW / 2}" y="15" text-anchor="middle" class="fill-slate-700 dark:fill-slate-200 font-mono text-[12px] font-bold">${bits[i]}</text>` : '';
    const lblText = i < n && labels[i] ? `<text x="${x + bitW / 2}" y="${h - 2}" text-anchor="middle" class="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-bold">${labels[i]}</text>` : '';
    return `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + rowH}" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3 3" />${bitText}${lblText}`;
  }).join('');

  return `
    <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <div class="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">${name}</div>
      <div class="min-w-0 max-w-full overflow-x-auto">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="text-slate-500">
          <text x="6" y="${yTop + 4}" class="fill-slate-400 font-mono text-[10px]">+V</text>
          <text x="10" y="${yMid + 3}" class="fill-slate-400 font-mono text-[10px]">0</text>
          <text x="8" y="${yBot + 3}" class="fill-slate-400 font-mono text-[10px]">-V</text>
          <line x1="${padL}" y1="${yMid}" x2="${padL + n * bitW}" y2="${yMid}" stroke="currentColor" stroke-opacity="0.25" />
          ${gridLines}
          <path d="${pathD}" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  `;
}

export function solveLineCoding(input, mode = 'all', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const bits = (input || '').trim().replace(/\s+/g, '');
  if (!/^[01]{4,32}$/.test(bits)) return { ok: false, error: t.errBits };

  const nrzl = encodeNrzL(bits);
  const nrzi = encodeNrzI(bits);
  const manch = encodeManchester(bits);
  const diffManch = encodeDiffManchester(bits);
  const ami = encodeAmi(bits);
  const hdb3 = encodeHdb3(bits);

  const schemes = [
    { key: 'nrzl', name: 'NRZ-L', levels: nrzl, labels: [] },
    { key: 'nrzi', name: 'NRZI', levels: nrzi, labels: [] },
    { key: 'manchester', name: 'Manchester (IEEE 802.3)', levels: manch, labels: [] },
    { key: 'diff_manchester', name: 'Manchester Diferencial', levels: diffManch, labels: [] },
    { key: 'ami', name: 'AMI (Bipolar)', levels: ami, labels: [] },
    { key: 'hdb3', name: 'HDB3 (ITU-T G.703)', levels: hdb3.levels, labels: hdb3.labels }
  ];

  const active = mode === 'all' ? schemes : schemes.filter((s) => s.key === mode);
  const selected = active.length ? active : schemes;

  const fmtSign = (arr) => arr.map((v) => (v > 0 ? '+' : v < 0 ? '-' : '0')).join(' ');
  const primary = selected.find((s) => s.key === 'hdb3') || selected[0];

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${primary.name} · ${t.levelsLabel}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-base break-all">${fmtSign(primary.levels)}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.hdb3Subs}</div>
        <div class="font-mono text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">${hdb3.substitutions.length ? hdb3.substitutions.join(' · ') : t.noHdb3}</div>
      </div>
    </div>
  `;

  const visualHtml = `<div class="space-y-3">${selected.map((s) => buildWaveformSvg(bits, s.name, s.levels, s.labels)).join('')}</div>`;

  const steps = [
    {
      title: t.step1,
      explanation: t.step1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">Input: ${bits} (${bits.length} bits)</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs space-y-1">
        ${selected.map((s) => `<div><span class="font-bold">${s.name}:</span> ${fmtSign(s.levels)}</div>`).join('')}
        ${hdb3.substitutions.length ? `<div class="text-amber-600 dark:text-amber-400">HDB3: ${hdb3.substitutions.join(' | ')}</div>` : ''}
      </div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs">Manchester: 0 DC, 2× BW · AMI/HDB3: 0 DC, 1× BW</div>`
    }
  ];

  const copyText = selected.map((s) => `${s.name}: ${fmtSign(s.levels)}`).join('\n');
  const csvText = ['Scheme,Levels', ...selected.map((s) => `"${s.name}","${fmtSign(s.levels)}"`)].join('\n');
  const latexText = selected.map((s) => `\\text{${s.name}}: \\texttt{${fmtSign(s.levels)}}`).join(' \\\\ ');

  return { ok: true, summaryHtml, visualHtml, steps, copyText, csvText, latexText };
}
