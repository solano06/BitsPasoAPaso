const TEXT = {
  es: {
    errInput: 'Introduce un número decimal válido (ej. -13.625, NaN, Infinity) o un valor hexadecimal/binario (ej. 0xC15A0000).',
    errBits: 'Para modo Hex/Binario introduce 8/16 dígitos hex (0x...) o 32/64 bits binarios.',
    sign: 'Signo',
    exponent: 'Exponente',
    mantissa: 'Mantisa',
    hexLabel: 'Hexadecimal',
    decExact: 'Valor IEEE-754 exacto',
    roundingErr: 'Error de redondeo',
    specialZero: 'Cero con signo',
    specialInf: 'Infinito',
    specialNaN: 'NaN (Not a Number)',
    subnormal: 'Número subnormal (sin 1 implícito)',
    normal: 'Número normalizado',
    step1: 'Paso 1: Determinación del bit de signo',
    step1Desc: '0 indica positivo (+), 1 indica negativo (-).',
    step2: 'Paso 2: Conversión a binario (parte entera y fraccionaria)',
    step2Desc: 'La parte entera se convierte dividiendo por 2; la fraccionaria multiplicando por 2.',
    step3: 'Paso 3: Normalización científica binaria (1.xxxx × 2^e)',
    step3Desc: 'Desplazamos la coma binaria hasta dejar un único 1 a la izquierda (salvo en cero o subnormales).',
    step4: 'Paso 4: Cálculo del exponente sesgado',
    step4Desc: 'Sumamos el sesgo ({bias}) al exponente real para almacenarlo como entero sin signo.',
    step5: 'Paso 5: Ensamblaje de los {bits} bits, Hex y error de redondeo',
    step5Desc: 'Unimos Signo + Exponente + Mantisa. Haz clic en cualquier bit superior para invertirlo.',
    interactiveHint: 'Haz clic en cualquier bit para invertirlo y recalcular al instante'
  },
  en: {
    errInput: 'Enter a valid decimal number (e.g. -13.625, NaN, Infinity) or hex/binary value (e.g. 0xC15A0000).',
    errBits: 'For Hex/Binary mode enter 8/16 hex digits (0x...) or 32/64 binary bits.',
    sign: 'Sign',
    exponent: 'Exponent',
    mantissa: 'Mantissa',
    hexLabel: 'Hexadecimal',
    decExact: 'Exact IEEE-754 value',
    roundingErr: 'Rounding error',
    specialZero: 'Signed zero',
    specialInf: 'Infinity',
    specialNaN: 'NaN (Not a Number)',
    subnormal: 'Subnormal number (no implicit 1)',
    normal: 'Normalized number',
    step1: 'Step 1: Sign bit determination',
    step1Desc: '0 means positive (+), 1 means negative (-).',
    step2: 'Step 2: Binary conversion (integer & fractional parts)',
    step2Desc: 'Convert integer part by dividing by 2; fractional part by multiplying by 2.',
    step3: 'Step 3: Binary scientific normalization (1.xxxx × 2^e)',
    step3Desc: 'Shift the binary point so a single 1 remains on the left (except zero or subnormals).',
    step4: 'Step 4: Biased exponent calculation',
    step4Desc: 'Add the bias ({bias}) to the unbiased exponent to store it as an unsigned integer.',
    step5: 'Step 5: {bits}-bit assembly, Hex, and rounding error',
    step5Desc: 'Concatenate Sign + Exponent + Mantissa. Click any bit above to flip it.',
    interactiveHint: 'Click any bit to flip it and recalculate instantly'
  },
  fr: {
    errInput: 'Saisissez un nombre décimal valide (ex. -13.625, NaN, Infinity) ou hex/binaire (ex. 0xC15A0000).',
    errBits: 'En mode Hex/Binaire, saisissez 8/16 chiffres hex (0x...) ou 32/64 bits binaires.',
    sign: 'Signe',
    exponent: 'Exposant',
    mantissa: 'Mantisse',
    hexLabel: 'Hexadécimal',
    decExact: 'Valeur IEEE-754 exacte',
    roundingErr: "Erreur d'arrondi",
    specialZero: 'Zéro signé',
    specialInf: 'Infini',
    specialNaN: 'NaN (Not a Number)',
    subnormal: 'Nombre dénormalisé (sans 1 implicite)',
    normal: 'Nombre normalisé',
    step1: 'Étape 1 : Détermination du bit de signe',
    step1Desc: '0 indique positif (+), 1 indique négatif (-).',
    step2: 'Étape 2 : Conversion binaire (partie entière et fractionnaire)',
    step2Desc: 'La partie entière se divise par 2 ; la partie fractionnaire se multiplie par 2.',
    step3: 'Étape 3 : Normalisation scientifique binaire (1.xxxx × 2^e)',
    step3Desc: 'On décale la virgule binaire pour garder un seul 1 à gauche (hors zéro et dénormalisés).',
    step4: 'Étape 4 : Calcul de l’exposant biaisé',
    step4Desc: 'On ajoute le biais ({bias}) à l’exposant réel pour le stocker en entier non signé.',
    step5: 'Étape 5 : Assemblage des {bits} bits, Hex et erreur d’arrondi',
    step5Desc: 'On assemble Signe + Exposant + Mantisse. Cliquez sur un bit ci-dessus pour l’inverser.',
    interactiveHint: 'Cliquez sur n’importe quel bit pour l’inverser et recalculer'
  }
};

function floatToBits(num, is64) {
  const buf = new ArrayBuffer(is64 ? 8 : 4);
  const view = new DataView(buf);
  if (is64) {
    view.setFloat64(0, num, false);
    return view.getBigUint64(0, false);
  }
  view.setFloat32(0, num, false);
  return BigInt(view.getUint32(0, false));
}

function bitsToFloat(bitsBig, is64) {
  const buf = new ArrayBuffer(is64 ? 8 : 4);
  const view = new DataView(buf);
  if (is64) {
    view.setBigUint64(0, bitsBig, false);
    return view.getFloat64(0, false);
  }
  view.setUint32(0, Number(bitsBig & 0xffffffffn), false);
  return view.getFloat32(0, false);
}

function parseHexOrBinToBigInt(raw, totalBits) {
  const clean = raw.trim().replace(/\s+/g, '').replace(/_/g, '');
  if (/^0x[0-9a-fA-F]+$/i.test(clean)) {
    const hex = clean.slice(2);
    if (hex.length > totalBits / 4) return null;
    return BigInt('0x' + hex);
  }
  if (/^[01]+$/.test(clean) && (clean.length === 32 || clean.length === 64)) {
    if (clean.length !== totalBits) return null;
    return BigInt('0b' + clean);
  }
  if (/^[0-9a-fA-F]+$/.test(clean) && (clean.length === 8 || clean.length === 16)) {
    if (clean.length * 4 !== totalBits) return null;
    return BigInt('0x' + clean);
  }
  return null;
}

function formatFloatBinarySteps(absVal) {
  if (!Number.isFinite(absVal) || absVal === 0) {
    return { intBin: '0', fracBin: '0', stepsInt: [], stepsFrac: [] };
  }
  const intPart = Math.floor(absVal);
  let fracPart = absVal - intPart;

  const stepsInt = [];
  let n = intPart;
  let intBin = '';
  if (n === 0) {
    intBin = '0';
  } else {
    while (n > 0) {
      const rem = n % 2;
      const q = Math.floor(n / 2);
      stepsInt.push(`${n} ÷ 2 = ${q} (r=${rem})`);
      intBin = String(rem) + intBin;
      n = q;
      if (stepsInt.length > 24) break;
    }
  }

  const stepsFrac = [];
  let fracBin = '';
  let f = fracPart;
  for (let i = 0; i < 28 && f > 0; i++) {
    const prod = f * 2;
    const bit = prod >= 1 ? 1 : 0;
    stepsFrac.push(`${f.toPrecision(6)} × 2 = ${prod.toPrecision(6)} → ${bit}`);
    fracBin += String(bit);
    f = prod - bit;
  }

  return {
    intBin: intBin || '0',
    fracBin: fracBin || '0',
    stepsInt,
    stepsFrac
  };
}

export function solveIeee754(input, mode = 'dec2bin32', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const raw = (input || '').trim();
  if (!raw) return { ok: false, error: t.errInput };

  const is64 = mode.endsWith('64');
  const isHexInput = mode.startsWith('hex2dec');
  const totalBits = is64 ? 64 : 32;
  const expBits = is64 ? 11 : 8;
  const mantBits = is64 ? 52 : 23;
  const bias = is64 ? 1023 : 127;

  let bitsBig = 0n;
  let originalNum = null;

  if (isHexInput) {
    const parsed = parseHexOrBinToBigInt(raw, totalBits);
    if (parsed === null) return { ok: false, error: t.errBits };
    bitsBig = parsed;
    originalNum = bitsToFloat(bitsBig, is64);
  } else {
    const norm = raw.replace(',', '.');
    if (!/^([+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?|[+-]?Infinity|NaN)$/i.test(norm)) {
      return { ok: false, error: t.errInput };
    }
    const num = Number(norm);
    if (Number.isNaN(num) && norm.toLowerCase() !== 'nan') {
      return { ok: false, error: t.errInput };
    }
    originalNum = num;
    bitsBig = floatToBits(num, is64);
  }

  const binStr = bitsBig.toString(2).padStart(totalBits, '0');
  const signBit = binStr[0];
  const expBin = binStr.slice(1, 1 + expBits);
  const mantBin = binStr.slice(1 + expBits);

  const expVal = parseInt(expBin, 2);
  const allOnesExp = (1 << expBits) - 1;
  const mantAllZero = /^0+$/.test(mantBin);

  let category = t.normal;
  let unbiasedExp = expVal - bias;
  if (expVal === 0 && mantAllZero) {
    category = t.specialZero;
  } else if (expVal === 0) {
    category = t.subnormal;
    unbiasedExp = 1 - bias;
  } else if (expVal === allOnesExp && mantAllZero) {
    category = t.specialInf;
  } else if (expVal === allOnesExp) {
    category = t.specialNaN;
  }

  const storedFloat = bitsToFloat(bitsBig, is64);
  const hexStr = '0x' + bitsBig.toString(16).toUpperCase().padStart(totalBits / 4, '0');

  let displayValue = '';
  if (Number.isNaN(storedFloat)) {
    displayValue = 'NaN';
  } else if (Object.is(storedFloat, -0)) {
    displayValue = '-0';
  } else if (!Number.isFinite(storedFloat)) {
    displayValue = storedFloat > 0 ? '+Infinity' : '-Infinity';
  } else {
    displayValue = is64 ? String(storedFloat) : storedFloat.toPrecision(9).replace(/\.?0+$/, '');
  }

  let roundingErrStr = '0';
  if (!isHexInput && Number.isFinite(originalNum) && Number.isFinite(storedFloat)) {
    const diff = Math.abs(storedFloat - originalNum);
    roundingErrStr = diff === 0 ? '0 (Exact)' : diff.toExponential(6);
  }

  const bitButtons = binStr
    .split('')
    .map((b, idx) => {
      let colorCls = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40';
      if (idx === 0) {
        colorCls = 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40';
      } else if (idx <= expBits) {
        colorCls = 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40';
      }
      const sep = idx === 0 || idx === expBits ? 'mr-1.5' : '';
      return `<button type="button" data-ieee-bit="${idx}" data-ieee-bits="${totalBits}" data-ieee-bin="${binStr}" class="bit-toggle-btn ${sep} inline-flex items-center justify-center w-6 h-7 rounded border font-mono text-xs font-bold ${colorCls}" title="Bit ${totalBits - 1 - idx}">${b}</button>`;
    })
    .join('');

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.hexLabel}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-base break-all">${hexStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.decExact}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-base break-all">${displayValue}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.exponent} (e + ${bias})</div>
        <div class="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">${expVal} (${expVal === 0 || expVal === allOnesExp ? category : `e = ${unbiasedExp}`})</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.roundingErr}</div>
        <div class="font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-sm break-all">${roundingErrStr}</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-rose-500/40 border border-rose-500"></span>${t.sign} (1)</span>
          <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-blue-500/40 border border-blue-500"></span>${t.exponent} (${expBits})</span>
          <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500"></span>${t.mantissa} (${mantBits})</span>
        </div>
        <span class="text-slate-500 dark:text-slate-400">${t.interactiveHint}</span>
      </div>
      <div class="min-w-0 max-w-full overflow-x-auto pb-1">
        <div class="inline-flex items-center gap-0.5 whitespace-nowrap">${bitButtons}</div>
      </div>
    </div>
  `;

  const absVal = Math.abs(storedFloat);
  const binParts = formatFloatBinarySteps(absVal);
  const isNeg = signBit === '1';

  const steps = [
    {
      title: t.step1,
      explanation: t.step1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${t.sign} = <span class="text-rose-600 dark:text-rose-400 font-bold">${signBit}</span> (${isNeg ? '-' : '+'})</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs space-y-1">
        <div>|x| ≈ ${binParts.intBin}.${binParts.fracBin}₂</div>
        ${binParts.stepsInt.length ? `<div class="text-slate-500 dark:text-slate-400">${binParts.stepsInt.slice(0, 6).join(' · ')}</div>` : ''}
        ${binParts.stepsFrac.length ? `<div class="text-slate-500 dark:text-slate-400">${binParts.stepsFrac.slice(0, 4).join(' · ')}</div>` : ''}
      </div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm break-all">${
        expVal === 0 || expVal === allOnesExp
          ? category
          : `(-1)^${signBit} × 1.${mantBin.slice(0, 16)}${mantBin.length > 16 ? '...' : ''}₂ × 2^(${unbiasedExp})`
      }</div>`
    },
    {
      title: t.step4.replace('{bias}', bias),
      explanation: t.step4Desc.replace('{bias}', bias),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${
        expVal === 0 || expVal === allOnesExp
          ? `${t.exponent} = ${expVal} (${expBin}₂)`
          : `${unbiasedExp} + ${bias} = ${expVal} → <span class="text-blue-600 dark:text-blue-400 font-bold">${expBin}₂</span>`
      }</div>`
    },
    {
      title: t.step5.replace('{bits}', totalBits),
      explanation: t.step5Desc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs sm:text-sm whitespace-nowrap space-y-1">
        <div><span class="text-rose-600 dark:text-rose-400 font-bold">${signBit}</span> <span class="text-blue-600 dark:text-blue-400 font-bold">${expBin}</span> <span class="text-emerald-600 dark:text-emerald-400 font-bold">${mantBin}</span></div>
        <div>${t.hexLabel}: <span class="font-bold text-cyan-600 dark:text-cyan-400">${hexStr}</span> · ${t.roundingErr}: ${roundingErrStr}</div>
      </div>`
    }
  ];

  const copyText = `IEEE-754 (${totalBits}-bit)\nHex: ${hexStr}\nBinary: ${signBit} ${expBin} ${mantBin}\nValue: ${displayValue}`;
  const latexText = `\\text{IEEE-754}_{${totalBits}}: \\; \\texttt{${hexStr}} = (-1)^{${signBit}} \\times 2^{${unbiasedExp}}`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText, latexText };
}
