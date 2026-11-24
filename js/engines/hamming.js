const TEXT = {
  es: {
    errBin: 'Introduce una trama binaria válida (solo 0 y 1, mínimo 2 bits).',
    errCrc: 'Para CRC usa el formato: trama_binaria ; polinomio_generador (ej. 1101011011 ; 10011).',
    errGen: 'El polinomio generador debe tener al menos 2 bits y empezar por 1.',
    encodedWord: 'Palabra Hamming codificada',
    parityBits: 'Bits de paridad (r)',
    syndrome: 'Síndrome',
    noError: '0 (Sin error de 1 bit)',
    errorAt: 'Error en posición {pos} (corregido)',
    dataExtracted: 'Datos extraídos',
    clickBitHint: 'Haz clic en cualquier bit para simular un error y calcular el síndrome',
    hStep1: 'Paso 1: Cálculo de bits de paridad necesarios (2^r ≥ m + r + 1)',
    hStep1Desc: 'Con m = {m} bits de datos necesitamos r = {r} bits de paridad en posiciones 1, 2, 4, 8...',
    hStep2: 'Paso 2: Matriz de cobertura de cada bit de paridad P_k',
    hStep2Desc: 'Cada P_k cubre las posiciones cuyo índice binario tiene un 1 en el bit de peso k.',
    hStep3: 'Paso 3: Palabra codificada final',
    hStep3Desc: 'Insertamos cada bit de paridad calculado en su posición potencia de 2.',
    cStep1: 'Paso 1: Recálculo de paridades y formación del síndrome',
    cStep1Desc: 'Evaluamos cada grupo P_k sobre la palabra recibida ({parity}).',
    cStep2: 'Paso 2: Localización y corrección de error',
    cStep2Desc: 'El síndrome leído de mayor a menor peso (S_r ... S_1) indica la posición 1-indexada del bit erróneo.',
    crcRemainder: 'Resto CRC',
    crcFrame: 'Trama transmitida',
    crcVerify: 'Verificación (Trama ÷ Gen)',
    crcStep1: 'Paso 1: Desplazamiento (añadir k - 1 ceros)',
    crcStep1Desc: 'El generador tiene {k} bits (grado {deg}), por lo que añadimos {deg} ceros al final de los datos.',
    crcStep2: 'Paso 2: División binaria módulo 2 (XOR paso a paso)',
    crcStep2Desc: 'Alineamos el generador con cada 1 restante y aplicamos XOR bit a bit sin acarreo.',
    crcStep3: 'Paso 3: Trama final transmitida y comprobación de resto 0',
    crcStep3Desc: 'Concatenamos el resto CRC a los datos originales; al dividir en destino el resto debe ser 0.'
  },
  en: {
    errBin: 'Enter a valid binary frame (only 0 and 1, at least 2 bits).',
    errCrc: 'For CRC use format: binary_data ; generator_poly (e.g. 1101011011 ; 10011).',
    errGen: 'Generator polynomial must be at least 2 bits long and start with 1.',
    encodedWord: 'Encoded Hamming word',
    parityBits: 'Parity bits (r)',
    syndrome: 'Syndrome',
    noError: '0 (No 1-bit error)',
    errorAt: 'Error at position {pos} (corrected)',
    dataExtracted: 'Extracted data',
    clickBitHint: 'Click any bit to simulate a 1-bit flip and compute the syndrome',
    hStep1: 'Step 1: Required parity bits (2^r ≥ m + r + 1)',
    hStep1Desc: 'For m = {m} data bits we need r = {r} parity bits at positions 1, 2, 4, 8...',
    hStep2: 'Step 2: Coverage table for each parity bit P_k',
    hStep2Desc: 'Each P_k covers positions whose binary index has a 1 at bit weight k.',
    hStep3: 'Step 3: Final encoded Hamming word',
    hStep3Desc: 'Place each computed parity bit at its power-of-2 position.',
    cStep1: 'Step 1: Parity recomputation & syndrome',
    cStep1Desc: 'Evaluate each P_k group on the received word ({parity}).',
    cStep2: 'Step 2: Error localization & correction',
    cStep2Desc: 'The syndrome (S_r ... S_1) gives the 1-based position of the flipped bit.',
    crcRemainder: 'CRC Remainder',
    crcFrame: 'Transmitted Frame',
    crcVerify: 'Verification (Frame ÷ Gen)',
    crcStep1: 'Step 1: Zero-padding (append k - 1 zeros)',
    crcStep1Desc: 'Generator length is {k} bits (degree {deg}), so we append {deg} zeros to the data.',
    crcStep2: 'Step 2: Modulo-2 binary division (step-by-step XOR)',
    crcStep2Desc: 'Align the generator under each leading 1 and apply carry-less bitwise XOR.',
    crcStep3: 'Step 3: Transmitted frame & remainder-0 verification',
    crcStep3Desc: 'Append the CRC remainder to the original data; dividing at the receiver yields 0.'
  },
  fr: {
    errBin: 'Saisissez une trame binaire valide (0 et 1 uniquement, au moins 2 bits).',
    errCrc: 'Pour le CRC utilisez : trame_binaire ; polynome_generateur (ex. 1101011011 ; 10011).',
    errGen: 'Le polynôme générateur doit comporter au moins 2 bits et commencer par 1.',
    encodedWord: 'Mot de Hamming codé',
    parityBits: 'Bits de parité (r)',
    syndrome: 'Syndrome',
    noError: '0 (Aucune erreur sur 1 bit)',
    errorAt: 'Erreur en position {pos} (corrigée)',
    dataExtracted: 'Données extraites',
    clickBitHint: 'Cliquez sur un bit pour simuler une erreur et calculer le syndrome',
    hStep1: 'Étape 1 : Nombre de bits de parité (2^r ≥ m + r + 1)',
    hStep1Desc: 'Pour m = {m} bits de données, il faut r = {r} bits de parité aux positions 1, 2, 4, 8...',
    hStep2: 'Étape 2 : Matrice de couverture de chaque bit P_k',
    hStep2Desc: 'Chaque P_k couvre les positions dont l’indice binaire possède un 1 au poids k.',
    hStep3: 'Étape 3 : Mot de Hamming final',
    hStep3Desc: 'Insertion des bits de parité aux positions puissances de 2.',
    cStep1: 'Étape 1 : Recalcul des parités et syndrome',
    cStep1Desc: 'Évaluation de chaque groupe P_k sur le mot reçu ({parity}).',
    cStep2: 'Étape 2 : Localisation et correction d’erreur',
    cStep2Desc: 'Le syndrome (S_r ... S_1) indique la position (à partir de 1) du bit erroné.',
    crcRemainder: 'Reste CRC',
    crcFrame: 'Trame transmise',
    crcVerify: 'Vérification (Trame ÷ Gén)',
    crcStep1: 'Étape 1 : Décalage (ajout de k - 1 zéros)',
    crcStep1Desc: 'Le générateur a {k} bits (degré {deg}) ; on ajoute donc {deg} zéros aux données.',
    crcStep2: 'Étape 2 : Division binaire modulo 2 (XOR étape par étape)',
    crcStep2Desc: 'Alignement du générateur sous chaque 1 dominant et XOR sans retenue.',
    crcStep3: 'Étape 3 : Trame transmise et vérification reste nul',
    crcStep3Desc: 'On ajoute le reste CRC aux données ; la division à la réception donne un reste de 0.'
  }
};

function isPow2(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

function solveHammingEncode(dataStr, oddParity, lang) {
  const t = TEXT[lang] || TEXT.es;
  const clean = dataStr.trim().replace(/\s+/g, '');
  if (!/^[01]{2,64}$/.test(clean)) return { ok: false, error: t.errBin };

  const m = clean.length;
  let r = 0;
  while (2 ** r < m + r + 1) r++;

  const total = m + r;
  const word = new Array(total + 1).fill(0);
  let dataIdx = 0;

  for (let pos = 1; pos <= total; pos++) {
    if (!isPow2(pos)) {
      word[pos] = Number(clean[dataIdx++]);
    }
  }

  const coverage = [];
  for (let k = 0; k < r; k++) {
    const pPos = 1 << k;
    let ones = 0;
    const covered = [];
    for (let pos = 1; pos <= total; pos++) {
      if ((pos & pPos) !== 0) {
        covered.push(pos);
        if (pos !== pPos && word[pos] === 1) ones++;
      }
    }
    const pBit = oddParity ? (ones % 2 === 0 ? 1 : 0) : ones % 2;
    word[pPos] = pBit;
    coverage.push({ pPos, pBit, covered });
  }

  const encodedStr = word.slice(1).join('');

  const bitButtons = word
    .slice(1)
    .map((b, idx) => {
      const pos = idx + 1;
      const isP = isPow2(pos);
      const cls = isP
        ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40';
      return `<button type="button" data-hamming-flip="${pos}" data-hamming-word="${encodedStr}" class="bit-toggle-btn inline-flex flex-col items-center px-2 py-1 rounded border font-mono ${cls}">
        <span class="text-sm font-bold">${b}</span>
        <span class="text-[9px] opacity-75">${isP ? `P${pos}` : `D${pos}`}</span>
      </button>`;
    })
    .join('');

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="sm:col-span-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.encodedWord} (${total}, ${m})</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-lg break-all">${encodedStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.parityBits}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-lg">r = ${r}</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
      <div class="text-xs text-slate-500 dark:text-slate-400 mb-3">${t.clickBitHint}</div>
      <div class="min-w-0 max-w-full overflow-x-auto pb-1">
        <div class="inline-flex items-center gap-1 whitespace-nowrap">${bitButtons}</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.hStep1,
      explanation: t.hStep1Desc.replace('{m}', m).replace('{r}', r),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">m = ${m} → 2^${r} = ${2 ** r} ≥ ${m} + ${r} + 1 (${m + r + 1})</div>`
    },
    {
      title: t.hStep2,
      explanation: t.hStep2Desc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs space-y-1 whitespace-nowrap">
        ${coverage.map((c) => `<div>P${c.pPos} (pos ${c.covered.join(', ')}) → <span class="font-bold text-cyan-600 dark:text-cyan-400">P${c.pPos} = ${c.pBit}</span></div>`).join('')}
      </div>`
    },
    {
      title: t.hStep3,
      explanation: t.hStep3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 break-all">${encodedStr}</div>`
    }
  ];

  return { ok: true, summaryHtml, visualHtml, steps, copyText: `${t.encodedWord}: ${encodedStr}` };
}

function solveHammingCheck(receivedStr, oddParity, lang) {
  const t = TEXT[lang] || TEXT.es;
  const clean = receivedStr.trim().replace(/\s+/g, '');
  if (!/^[01]{3,80}$/.test(clean)) return { ok: false, error: t.errBin };

  const total = clean.length;
  const word = [0, ...clean.split('').map(Number)];

  let syndrome = 0;
  const checks = [];
  for (let pPos = 1; pPos <= total; pPos <<= 1) {
    let ones = 0;
    const covered = [];
    for (let pos = 1; pos <= total; pos++) {
      if ((pos & pPos) !== 0) {
        covered.push(pos);
        if (word[pos] === 1) ones++;
      }
    }
    const sBit = oddParity ? (ones % 2 === 1 ? 0 : 1) : ones % 2;
    if (sBit === 1) syndrome += pPos;
    checks.push({ pPos, sBit, ones, covered });
  }

  const corrected = [...word];
  if (syndrome > 0 && syndrome <= total) {
    corrected[syndrome] = corrected[syndrome] ^ 1;
  }

  const correctedStr = corrected.slice(1).join('');
  const dataExtracted = [];
  for (let pos = 1; pos <= total; pos++) {
    if (!isPow2(pos)) dataExtracted.push(corrected[pos]);
  }
  const dataStr = dataExtracted.join('');

  const bitButtons = corrected
    .slice(1)
    .map((b, idx) => {
      const pos = idx + 1;
      const isErr = pos === syndrome;
      const isP = isPow2(pos);
      const cls = isErr
        ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500 ring-2 ring-rose-500/50'
        : isP
          ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40';
      return `<button type="button" data-hamming-flip="${pos}" data-hamming-word="${clean}" class="bit-toggle-btn inline-flex flex-col items-center px-2 py-1 rounded border font-mono ${cls}">
        <span class="text-sm font-bold">${b}</span>
        <span class="text-[9px] opacity-75">${isP ? `P${pos}` : `D${pos}`}</span>
      </button>`;
    })
    .join('');

  const syndromeBin = checks
    .slice()
    .reverse()
    .map((c) => c.sBit)
    .join('');

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.syndrome}</div>
        <div class="font-mono font-bold ${syndrome ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'} text-base">${syndrome ? t.errorAt.replace('{pos}', syndrome) : t.noError}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.encodedWord}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-base break-all">${correctedStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.dataExtracted}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-base break-all">${dataStr}</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
      <div class="text-xs text-slate-500 dark:text-slate-400 mb-3">${t.clickBitHint}</div>
      <div class="min-w-0 max-w-full overflow-x-auto pb-1">
        <div class="inline-flex items-center gap-1 whitespace-nowrap">${bitButtons}</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.cStep1,
      explanation: t.cStep1Desc.replace('{parity}', oddParity ? 'Odd' : 'Even'),
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs space-y-1 whitespace-nowrap">
        ${checks.map((c) => `<div>S${c.pPos} (pos ${c.covered.join(', ')}) → 1s=${c.ones} → <span class="font-bold">${c.sBit}</span></div>`).join('')}
      </div>`
    },
    {
      title: t.cStep2,
      explanation: t.cStep2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1">
        <div>${t.syndrome}: ${syndromeBin}₂ = ${syndrome}</div>
        <div>${t.encodedWord}: <span class="font-bold text-emerald-600 dark:text-emerald-400">${correctedStr}</span></div>
        <div>${t.dataExtracted}: ${dataStr}</div>
      </div>`
    }
  ];

  return { ok: true, summaryHtml, visualHtml, steps, copyText: `${t.syndrome}: ${syndrome}\n${t.encodedWord}: ${correctedStr}\n${t.dataExtracted}: ${dataStr}` };
}

function xorDivide(dividendStr, genStr) {
  const k = genStr.length;
  const arr = dividendStr.split('').map(Number);
  const gen = genStr.split('').map(Number);
  const trace = [dividendStr];

  for (let i = 0; i <= arr.length - k; i++) {
    if (arr[i] === 1) {
      trace.push(' '.repeat(i) + genStr);
      for (let j = 0; j < k; j++) {
        arr[i + j] = arr[i + j] ^ gen[j];
      }
      const nextLine = ' '.repeat(i + 1) + arr.slice(i + 1).join('');
      trace.push(nextLine);
    }
  }

  const remainder = arr.slice(arr.length - (k - 1)).join('');
  return { remainder, trace };
}

function solveCrc(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const parts = raw.split(';');
  if (parts.length !== 2) return { ok: false, error: t.errCrc };

  const data = parts[0].trim().replace(/\s+/g, '');
  const gen = parts[1].trim().replace(/\s+/g, '');
  if (!/^[01]{2,128}$/.test(data)) return { ok: false, error: t.errBin };
  if (!/^1[01]{1,32}$/.test(gen)) return { ok: false, error: t.errGen };

  const deg = gen.length - 1;
  const padded = data + '0'.repeat(deg);
  const { remainder, trace } = xorDivide(padded, gen);
  const transmitted = data + remainder;
  const verify = xorDivide(transmitted, gen);

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.crcRemainder}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-lg">${remainder}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.crcFrame}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base break-all">${data}<span class="underline decoration-2">${remainder}</span></div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.crcVerify}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-lg">${verify.remainder}</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.crcStep1,
      explanation: t.crcStep1Desc.replace('{k}', gen.length).replace(/\{deg\}/g, deg),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm break-all">${data} + ${'0'.repeat(deg)} = <span class="font-bold">${padded}</span></div>`
    },
    {
      title: t.crcStep2,
      explanation: t.crcStep2Desc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto"><pre class="font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">${trace.join('\n')}</pre></div>`
    },
    {
      title: t.crcStep3,
      explanation: t.crcStep3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1 break-all">
        <div>${t.crcFrame}: <span class="font-bold text-emerald-600 dark:text-emerald-400">${transmitted}</span></div>
        <div>${t.crcVerify}: ${verify.remainder}</div>
      </div>`
    }
  ];

  return { ok: true, summaryHtml, steps, copyText: `CRC Remainder: ${remainder}\nTransmitted: ${transmitted}\nVerify Remainder: ${verify.remainder}` };
}

export function solveHamming(input, mode = 'hamming_even', lang = 'es') {
  const raw = (input || '').trim();
  if (mode === 'crc' || raw.includes(';')) {
    return solveCrc(raw, lang);
  }
  if (mode === 'hamming_check') {
    return solveHammingCheck(raw, false, lang);
  }
  return solveHammingEncode(raw, mode === 'hamming_odd', lang);
}
