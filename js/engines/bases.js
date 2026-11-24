const TEXT = {
  es: {
    errInput: 'Introduce un entero decimal (ej. -42, 214) o con prefijo 0b (binario), 0o (octal), 0x (hexadecimal).',
    errWidth: 'El ancho de bits debe ser 8, 16 o 32.',
    overflowWarn: 'Overflow en Complemento a 2 ({bits} bits): {val} está fuera del rango [{min}, {max}].',
    decSigned: 'Decimal con signo (C2)',
    decUnsigned: 'Decimal sin signo',
    binLabel: 'Binario ({bits} bits)',
    hexLabel: 'Hexadecimal',
    octLabel: 'Octal',
    c1Label: 'Complemento a 1',
    c2Label: 'Complemento a 2',
    bcdLabel: 'BCD (empaquetado)',
    grayLabel: 'Código Gray',
    step1: 'Paso 1: Interpretación de entrada y rango en {bits} bits',
    step1Desc: 'Rango con signo: [{min}, {max}]. Rango sin signo: [0, {umax}].',
    step2: 'Paso 2: Divisiones sucesivas por la base (2, 8, 16)',
    step2Desc: 'Dividimos repetidamente el valor absoluto entre la base y leemos los restos en orden inverso.',
    step3: 'Paso 3: Agrupación en nibbles (4 bits) para Hexadecimal',
    step3Desc: 'Agrupamos los bits de 4 en 4 desde la derecha para traducir directamente a base 16.',
    step4: 'Paso 4: Complemento a 1 y Complemento a 2 (Invertir + 1)',
    step4Desc: 'Para negativos: tomamos |X| en binario, invertimos cada bit (C1) y sumamos 1 (C2).',
    step5: 'Paso 5: Codificación BCD y Código Gray',
    step5Desc: 'BCD codifica cada dígito decimal en 4 bits; Gray aplica XOR entre cada bit y su bit anterior.'
  },
  en: {
    errInput: 'Enter a decimal integer (e.g. -42, 214) or prefixed 0b (binary), 0o (octal), 0x (hexadecimal).',
    errWidth: 'Bit width must be 8, 16, or 32.',
    overflowWarn: "Overflow in Two's Complement ({bits}-bit): {val} is outside [{min}, {max}].",
    decSigned: "Signed Decimal (2's Comp)",
    decUnsigned: 'Unsigned Decimal',
    binLabel: 'Binary ({bits}-bit)',
    hexLabel: 'Hexadecimal',
    octLabel: 'Octal',
    c1Label: "One's Complement",
    c2Label: "Two's Complement",
    bcdLabel: 'BCD (packed)',
    grayLabel: 'Gray Code',
    step1: 'Step 1: Input parsing & {bits}-bit range check',
    step1Desc: 'Signed range: [{min}, {max}]. Unsigned range: [0, {umax}].',
    step2: 'Step 2: Successive divisions by base (2, 8, 16)',
    step2Desc: 'Repeatedly divide the magnitude by the target base and read remainders bottom-up.',
    step3: 'Step 3: 4-bit nibble grouping for Hexadecimal',
    step3Desc: 'Group binary bits in sets of 4 from right to left to map directly to hex digits.',
    step4: "Step 4: One's & Two's Complement (Invert + 1)",
    step4Desc: 'For negatives: take |X| in binary, invert all bits (1s comp), and add 1 (2s comp).',
    step5: 'Step 5: BCD & Gray Code encoding',
    step5Desc: 'BCD encodes each decimal digit into 4 bits; Gray XORs each bit with the preceding bit.'
  },
  fr: {
    errInput: 'Saisissez un entier décimal (ex. -42, 214) ou préfixé 0b (binaire), 0o (octal), 0x (hexadécimal).',
    errWidth: 'La largeur doit être 8, 16 ou 32 bits.',
    overflowWarn: 'Dépassement en Complément à 2 ({bits} bits) : {val} hors de [{min}, {max}].',
    decSigned: 'Décimal signé (C2)',
    decUnsigned: 'Décimal non signé',
    binLabel: 'Binaire ({bits} bits)',
    hexLabel: 'Hexadécimal',
    octLabel: 'Octal',
    c1Label: 'Complément à 1',
    c2Label: 'Complément à 2',
    bcdLabel: 'BCD (condensé)',
    grayLabel: 'Code Gray',
    step1: 'Étape 1 : Analyse de l’entrée et plage sur {bits} bits',
    step1Desc: 'Plage signée : [{min}, {max}]. Plage non signée : [0, {umax}].',
    step2: 'Étape 2 : Divisions successives par la base (2, 8, 16)',
    step2Desc: 'On divise la valeur absolue par la base et on lit les restes de bas en haut.',
    step3: 'Étape 3 : Groupement par quartets (4 bits) pour l’Hexadécimal',
    step3Desc: 'On regroupe les bits par 4 de droite à gauche pour obtenir directement l’hexadécimal.',
    step4: 'Étape 4 : Complément à 1 et Complément à 2 (Inverser + 1)',
    step4Desc: 'Pour un négatif : prendre |X| en binaire, inverser les bits (C1) et ajouter 1 (C2).',
    step5: 'Étape 5 : Encodage BCD et Code Gray',
    step5Desc: 'Le BCD code chaque chiffre décimal sur 4 bits ; Gray applique XOR avec le bit précédent.'
  }
};

function parseInputNumber(raw) {
  const clean = raw.trim().replace(/\s+/g, '').replace(/_/g, '');
  if (/^[+-]?0b[01]+$/i.test(clean)) {
    const neg = clean.startsWith('-');
    const digits = clean.replace(/^[+-]?0b/i, '');
    const v = BigInt('0b' + digits);
    return { val: neg ? -v : v, base: 2 };
  }
  if (/^[+-]?0o[0-7]+$/i.test(clean)) {
    const neg = clean.startsWith('-');
    const digits = clean.replace(/^[+-]?0o/i, '');
    const v = BigInt('0o' + digits);
    return { val: neg ? -v : v, base: 8 };
  }
  if (/^[+-]?0x[0-9a-f]+$/i.test(clean)) {
    const neg = clean.startsWith('-');
    const digits = clean.replace(/^[+-]?0x/i, '');
    const v = BigInt('0x' + digits);
    return { val: neg ? -v : v, base: 16 };
  }
  if (/^[+-]?\d+$/.test(clean)) {
    return { val: BigInt(clean), base: 10 };
  }
  return null;
}

function invertBits(binStr) {
  return binStr
    .split('')
    .map((b) => (b === '0' ? '1' : '0'))
    .join('');
}

function divisionSteps(absVal, base) {
  if (absVal === 0n) return ['0 ÷ ' + base + ' = 0 (r=0)'];
  const steps = [];
  let n = absVal;
  const b = BigInt(base);
  while (n > 0n && steps.length < 16) {
    const q = n / b;
    const r = n % b;
    steps.push(`${n} ÷ ${base} = ${q} (r=${r.toString(base).toUpperCase()})`);
    n = q;
  }
  return steps;
}

export function solveBases(input, mode = '8', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const bits = Number(mode);
  if (![8, 16, 32].includes(bits)) return { ok: false, error: t.errWidth };

  const parsed = parseInputNumber(input || '');
  if (!parsed) return { ok: false, error: t.errInput };

  const mod = 1n << BigInt(bits);
  const mask = mod - 1n;
  const minSigned = -(1n << BigInt(bits - 1));
  const maxSigned = (1n << BigInt(bits - 1)) - 1n;
  const maxUnsigned = mask;

  const val = parsed.val;
  const signedOverflow = val < minSigned || val > maxSigned;

  // Represent in n-bit pattern (two's complement wrap)
  const rawPattern = ((val % mod) + mod) % mod;
  const binStr = rawPattern.toString(2).padStart(bits, '0');
  const hexStr = '0x' + rawPattern.toString(16).toUpperCase().padStart(bits / 4, '0');
  const octStr = '0o' + rawPattern.toString(8);

  const isNegPattern = binStr[0] === '1';
  const signedVal = isNegPattern ? rawPattern - mod : rawPattern;
  const unsignedVal = rawPattern;

  const absVal = val < 0n ? -val : val;
  const absBin = (absVal & mask).toString(2).padStart(bits, '0');
  const c1Str = val < 0n ? invertBits(absBin) : invertBits(binStr);
  const c2Str = binStr;

  const nibbles = binStr.match(/.{1,4}/g) || [binStr];
  const nibbleHex = nibbles.map((nib) => `${nib}→${parseInt(nib, 2).toString(16).toUpperCase()}`).join('  ');

  const bcdStr = absVal
    .toString(10)
    .split('')
    .map((d) => Number(d).toString(2).padStart(4, '0'))
    .join(' ');

  const grayVal = rawPattern ^ (rawPattern >> 1n);
  const grayStr = grayVal.toString(2).padStart(bits, '0');

  const overflowBanner = signedOverflow
    ? `<div class="mb-3 p-3 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium">${t.overflowWarn
        .replace('{bits}', bits)
        .replace('{val}', val.toString())
        .replace('{min}', minSigned.toString())
        .replace('{max}', maxSigned.toString())}</div>`
    : '';

  const summaryHtml = `
    ${overflowBanner}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.c2Label} (${bits}-bit)</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-base break-all">${nibbles.join(' ')}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.hexLabel} / ${t.octLabel}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-base">${hexStr} <span class="text-xs font-normal text-slate-500">(${octStr})</span></div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.decSigned} / ${t.decUnsigned}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">${signedVal.toString()} <span class="text-xs font-normal text-slate-500">/ ${unsignedVal.toString()}</span></div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.c1Label}</div>
        <div class="font-mono font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all">${c1Str}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.bcdLabel}</div>
        <div class="font-mono font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all">${bcdStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.grayLabel}</div>
        <div class="font-mono font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all">${grayStr}</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1.replace('{bits}', bits),
      explanation: t.step1Desc
        .replace('{min}', minSigned.toString())
        .replace('{max}', maxSigned.toString())
        .replace('{umax}', maxUnsigned.toString()),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">Input = ${val.toString()} (base ${parsed.base}) · ${t.decSigned}: ${signedVal.toString()} · ${t.decUnsigned}: ${unsignedVal.toString()}</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs space-y-1">
        <div><span class="font-bold">Base 2:</span> ${divisionSteps(absVal, 2).slice(0, 8).join(' · ')}</div>
        <div><span class="font-bold">Base 16:</span> ${divisionSteps(absVal, 16).slice(0, 6).join(' · ')}</div>
      </div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs sm:text-sm whitespace-nowrap">${nibbleHex} → <span class="font-bold text-cyan-600 dark:text-cyan-400">${hexStr}</span></div>`
    },
    {
      title: t.step4,
      explanation: t.step4Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1 break-all">
        <div>|X| (${bits}-bit): ${absBin}</div>
        <div>C1: ${invertBits(absBin)}</div>
        <div>C2: <span class="font-bold text-emerald-600 dark:text-emerald-400">${c2Str}</span></div>
      </div>`
    },
    {
      title: t.step5,
      explanation: t.step5Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1 break-all">
        <div>BCD (|${absVal.toString()}|): ${bcdStr}</div>
        <div>Gray: ${grayStr}</div>
      </div>`
    }
  ];

  const copyText = `Bits: ${bits}\nDecimal (Signed): ${signedVal}\nDecimal (Unsigned): ${unsignedVal}\nBinary (C2): ${binStr}\nHex: ${hexStr}\nOctal: ${octStr}\nBCD: ${bcdStr}\nGray: ${grayStr}`;
  const latexText = `${signedVal.toString()}_{10} = \\texttt{${binStr}}_{2} = \\texttt{${hexStr}}_{16}`;
  return { ok: true, summaryHtml, steps, copyText, latexText };
}
