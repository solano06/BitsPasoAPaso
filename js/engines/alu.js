const TEXT = {
  es: {
    errInput: 'Formato inválido. Usa: A ; B (ej. 100 ; 50 o 0x64 ; 0x32).',
    resultBin: 'Resultado Binario',
    resultHex: 'Hexadecimal',
    unsignedDec: 'Sin signo',
    signedDec: 'Con signo (C2)',
    carriesRow: 'Acarreos (C_in)',
    flagsTitle: 'Flags de estado',
    flagActive: 'Activo (1)',
    flagOff: 'Inactivo (0)',
    overflowNote: 'V = C_{n-1} ⊕ C_n = {cn1} ⊕ {cn} = {v}',
    step1: 'Paso 1: Conversión de operandos a {w} bits',
    step1Desc: 'Representamos A y B en binario de {w} bits{subNote}.',
    subNote: ' (para resta A - B convertimos B a Complemento a 2)',
    step2: 'Paso 2: Operación bit a bit y acarreos',
    step2Desc: 'Calculamos columna a columna desde el LSB hasta el MSB.',
    step3: 'Paso 3: Evaluación de flags Z, N, C, V',
    step3Desc: 'Z=(res==0), N=MSB, C=acarreo saliente C_n, V=C_{n-1} ⊕ C_n.'
  },
  en: {
    errInput: 'Invalid format. Use: A ; B (e.g. 100 ; 50 or 0x64 ; 0x32).',
    resultBin: 'Binary Result',
    resultHex: 'Hexadecimal',
    unsignedDec: 'Unsigned',
    signedDec: 'Signed (2C)',
    carriesRow: 'Carries (C_in)',
    flagsTitle: 'Status Flags',
    flagActive: 'Set (1)',
    flagOff: 'Clear (0)',
    overflowNote: 'V = C_{n-1} ⊕ C_n = {cn1} ⊕ {cn} = {v}',
    step1: 'Step 1: Convert operands to {w}-bit binary',
    step1Desc: 'Represent A and B in {w}-bit binary{subNote}.',
    subNote: ' (for A - B we convert B to Two’s Complement)',
    step2: 'Step 2: Bit-by-bit operation & carries',
    step2Desc: 'Compute column by column from LSB to MSB.',
    step3: 'Step 3: Evaluate Z, N, C, V flags',
    step3Desc: 'Z=(res==0), N=MSB, C=carry-out C_n, V=C_{n-1} ⊕ C_n.'
  },
  fr: {
    errInput: 'Format invalide. Utilisez : A ; B (ex. 100 ; 50 ou 0x64 ; 0x32).',
    resultBin: 'Résultat Binaire',
    resultHex: 'Hexadécimal',
    unsignedDec: 'Non signé',
    signedDec: 'Signé (C2)',
    carriesRow: 'Retenues (C_in)',
    flagsTitle: 'Drapeaux d’état',
    flagActive: 'Actif (1)',
    flagOff: 'Inactif (0)',
    overflowNote: 'V = C_{n-1} ⊕ C_n = {cn1} ⊕ {cn} = {v}',
    step1: 'Étape 1 : Conversion des opérandes sur {w} bits',
    step1Desc: 'Représentation de A et B sur {w} bits{subNote}.',
    subNote: ' (pour A - B, conversion de B en Complément à 2)',
    step2: 'Étape 2 : Opération bit à bit et retenues',
    step2Desc: 'Calcul colonne par colonne du LSB au MSB.',
    step3: 'Étape 3 : Évaluation des drapeaux Z, N, C, V',
    step3Desc: 'Z=(res==0), N=MSB, C=retenue sortante C_n, V=C_{n-1} ⊕ C_n.'
  }
};

function parseVal(raw) {
  const s = raw.trim().replace(/\s+/g, '');
  if (/^[+-]?0b[01]+$/i.test(s)) {
    const neg = s.startsWith('-');
    const v = parseInt(s.replace(/^[+-]?0b/i, ''), 2);
    return neg ? -v : v;
  }
  if (/^[+-]?0x[0-9a-f]+$/i.test(s)) {
    const neg = s.startsWith('-');
    const v = parseInt(s.replace(/^[+-]?0x/i, ''), 16);
    return neg ? -v : v;
  }
  if (/^[+-]?\d+$/.test(s)) return Number(s);
  return null;
}

export function solveAlu(input, mode = '8_ADD', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const parts = (input || '').split(';').map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return { ok: false, error: t.errInput };

  const aIn = parseVal(parts[0]);
  const bIn = parseVal(parts[1]);
  if (aIn === null || bIn === null) return { ok: false, error: t.errInput };

  let [wStr, op] = String(mode || '8_ADD').split('_');
  let width = Number(wStr);
  if (parts[2] && /^(4|8|16)$/.test(parts[2])) width = Number(parts[2]);
  if (parts[3]) op = parts[3].toUpperCase();
  if (![4, 8, 16].includes(width)) width = 8;

  const mask = (1 << width) - 1;
  const aU = ((aIn % (1 << width)) + (1 << width)) & mask;
  const bU = ((bIn % (1 << width)) + (1 << width)) & mask;

  let resU = 0;
  let carryInArr = new Array(width).fill(0);
  let carryOutMsb = 0;
  let carryInMsb = 0;
  let cFlag = 0;
  let vFlag = 0;
  let effB = bU;
  let initCin = 0;

  if (op === 'ADD' || op === 'SUB') {
    if (op === 'SUB') {
      effB = (~bU) & mask;
      initCin = 1;
    }
    let c = initCin;
    for (let bit = 0; bit < width; bit++) {
      carryInArr[bit] = c;
      const ba = (aU >> bit) & 1;
      const bb = (effB >> bit) & 1;
      const sum = ba + bb + c;
      if (sum & 1) resU |= (1 << bit);
      c = sum >> 1;
      if (bit === width - 1) {
        carryInMsb = carryInArr[bit];
        carryOutMsb = c;
      }
    }
    cFlag = carryOutMsb;
    vFlag = carryInMsb ^ carryOutMsb;
  } else if (op === 'AND') {
    resU = aU & bU;
  } else if (op === 'OR') {
    resU = aU | bU;
  } else if (op === 'XOR') {
    resU = aU ^ bU;
  } else if (op === 'SHL') {
    const sh = Math.max(0, Math.min(width, bU));
    cFlag = sh > 0 ? (aU >> (width - sh)) & 1 : 0;
    resU = (aU << sh) & mask;
  } else if (op === 'SHR') {
    const sh = Math.max(0, Math.min(width, bU));
    cFlag = sh > 0 ? (aU >> (sh - 1)) & 1 : 0;
    resU = (aU >>> sh) & mask;
  } else if (op === 'ASR') {
    const sh = Math.max(0, Math.min(width, bU));
    const signBit = (aU >> (width - 1)) & 1;
    cFlag = sh > 0 ? (aU >> (sh - 1)) & 1 : 0;
    let tmp = aU;
    for (let s = 0; s < sh; s++) {
      tmp = (tmp >> 1) | (signBit << (width - 1));
    }
    resU = tmp & mask;
  }

  const zFlag = resU === 0 ? 1 : 0;
  const nFlag = (resU >> (width - 1)) & 1;

  const binA = aU.toString(2).padStart(width, '0');
  const binB = effB.toString(2).padStart(width, '0');
  const binRes = resU.toString(2).padStart(width, '0');
  const hexRes = '0x' + resU.toString(16).toUpperCase().padStart(width / 4, '0');
  const signedRes = nFlag ? resU - (1 << width) : resU;

  const flagBadge = (name, val) => `<div class="p-2.5 rounded-xl border text-center ${val ? 'bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-cyan-300' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}">
    <div class="font-mono font-extrabold text-lg">${name} = ${val}</div>
    <div class="text-[10px]">${val ? t.flagActive : t.flagOff}</div>
  </div>`;

  const summaryHtml = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.resultBin} (${width}b)</div>
        <div class="font-mono font-extrabold text-cyan-600 dark:text-cyan-400 text-base break-all">${binRes}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.resultHex}</div>
        <div class="font-mono font-extrabold text-slate-900 dark:text-slate-100 text-lg">${hexRes}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.unsignedDec}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">${resU}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.signedDec}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-lg">${signedRes}</div>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-2">
      ${flagBadge('Z', zFlag)}${flagBadge('N', nFlag)}${flagBadge('C', cFlag)}${flagBadge('V', vFlag)}
    </div>
  `;

  const carryRowRev = [...carryInArr].reverse().map((c, idx) => `<span class="${idx === 0 ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-400'}">${c}</span>`).join(' ');
  const visualHtml = `
    <div class="min-w-0 max-w-full overflow-x-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm whitespace-nowrap space-y-1">
      ${op === 'ADD' || op === 'SUB' ? `<div>C_out=${carryOutMsb}  ${t.carriesRow}: ${carryRowRev}</div>` : ''}
      <div>A (${aU}):  ${binA.split('').join(' ')}</div>
      <div>${op === 'SUB' ? '~B+1' : op} (${effB}): ${binB.split('').join(' ')}</div>
      <div class="border-t border-slate-300 dark:border-slate-700 pt-1 font-bold text-cyan-600 dark:text-cyan-400">RES:   ${binRes.split('').join(' ')} (${hexRes})</div>
    </div>
  `;

  const steps = [
    {
      title: t.step1.replace('{w}', width),
      explanation: t.step1Desc.replace('{w}', width).replace('{subNote}', op === 'SUB' ? t.subNote : ''),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">A = ${binA} (${aIn}) · B = ${bU.toString(2).padStart(width, '0')} (${bIn})</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${binRes} (${hexRes})</div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">Z=${zFlag}, N=${nFlag}, C=${cFlag}, V=${vFlag} ${op === 'ADD' || op === 'SUB' ? `(${t.overflowNote.replace('{cn1}', carryInMsb).replace('{cn}', carryOutMsb).replace('{v}', vFlag)})` : ''}</div>`
    }
  ];

  const copyText = `ALU ${width}-bit ${op}: ${hexRes} (${binRes})\nUnsigned: ${resU}, Signed: ${signedRes}\nFlags: Z=${zFlag} N=${nFlag} C=${cFlag} V=${vFlag}`;
  const csvText = `Width,Op,Bin,Hex,Unsigned,Signed,Z,N,C,V\n${width},${op},${binRes},${hexRes},${resU},${signedRes},${zFlag},${nFlag},${cFlag},${vFlag}`;
  const latexText = `\\texttt{${hexRes}} = \\texttt{${binRes}}_{2},\\; Z=${zFlag},\\; N=${nFlag},\\; C=${cFlag},\\; V=${vFlag}`;

  return { ok: true, summaryHtml, visualHtml, steps, copyText, csvText, latexText };
}
