const TEXT = {
  es: {
    errFormat: 'Introduce al menos una red IPv4/CIDR (ej. 192.168.0.0/24, 192.168.1.0/24) o un rango (ej. 192.168.1.10 - 192.168.1.70).',
    errIp: 'Dirección IPv4 inválida: {ip}',
    errRangeOrder: 'La IP inicial debe ser menor o igual que la IP final.',
    summaryRoute: 'Ruta Resumen (Supernet)',
    maskLabel: 'Máscara',
    exactBadge: 'Sumarización EXACTA (contigua)',
    overBadge: 'SOBRE-SUMARIZACIÓN (absorbe {extra} direcciones extra)',
    exactBlocksLabel: 'Bloques CIDR mínimos exactos equivalentes',
    commonBits: 'Prefijo común ({n} bits)',
    diffBits: 'Bits divergentes ({n} bits)',
    step1Sum: 'Paso 1: Conversión a binario de 32 bits alineado',
    step1SumDesc: 'Alineamos todas las redes normalizadas bit a bit para localizar dónde empiezan a diferir.',
    step2Sum: 'Paso 2: Prefijo común más largo y máscara resultante',
    step2SumDesc: 'Los primeros {n} bits son idénticos en todas las redes; el resto se ponen a 0.',
    step3Sum: 'Paso 3: Verificación de contigüidad (exacta vs. sobre-sumarizada)',
    step3SumDesc: 'Comparamos las {covered} direcciones cubiertas por las redes originales frente a las {superTotal} direcciones del bloque resumen.',
    rangeBlocks: 'Bloques CIDR mínimos',
    rangeCount: '{count} bloques para cubrir {total} direcciones',
    step1Range: 'Paso 1: Conversión de extremos IPv4 a enteros de 32 bits',
    step1RangeDesc: 'Calculamos el rango [{start} .. {end}] con {total} direcciones totales.',
    step2Range: 'Paso 2: Descomposición voraz en potencias de 2 alineadas',
    step2RangeDesc: 'En cada cursor elegimos el mayor bloque 2^k alineado (cursor % 2^k == 0) que no supere el final.'
  },
  en: {
    errFormat: 'Enter at least one IPv4/CIDR network (e.g. 192.168.0.0/24, 192.168.1.0/24) or an IP range (e.g. 192.168.1.10 - 192.168.1.70).',
    errIp: 'Invalid IPv4 address: {ip}',
    errRangeOrder: 'Start IP must be less than or equal to End IP.',
    summaryRoute: 'Summary Route (Supernet)',
    maskLabel: 'Subnet Mask',
    exactBadge: 'EXACT summarization (contiguous)',
    overBadge: 'OVER-SUMMARIZED (absorbs {extra} extra addresses)',
    exactBlocksLabel: 'Minimal exact equivalent CIDR blocks',
    commonBits: 'Common prefix ({n} bits)',
    diffBits: 'Diverging bits ({n} bits)',
    step1Sum: 'Step 1: Aligned 32-bit binary representation',
    step1SumDesc: 'Align all normalized networks bit by bit to find where they start diverging.',
    step2Sum: 'Step 2: Longest common prefix & resulting mask',
    step2SumDesc: 'The first {n} bits match across all networks; remaining host bits are set to 0.',
    step3Sum: 'Step 3: Contiguity check (exact vs. over-summarized)',
    step3SumDesc: 'Compare the {covered} unique addresses from input networks against {superTotal} addresses in the supernet.',
    rangeBlocks: 'Minimal CIDR blocks',
    rangeCount: '{count} blocks covering {total} addresses',
    step1Range: 'Step 1: Convert IPv4 endpoints to 32-bit integers',
    step1RangeDesc: 'Range [{start} .. {end}] spans {total} total addresses.',
    step2Range: 'Step 2: Greedy aligned power-of-2 decomposition',
    step2RangeDesc: 'At each cursor pick the largest aligned 2^k block (cursor % 2^k == 0) that does not exceed end.'
  },
  fr: {
    errFormat: 'Saisissez au moins un réseau IPv4/CIDR (ex. 192.168.0.0/24, 192.168.1.0/24) ou une plage (ex. 192.168.1.10 - 192.168.1.70).',
    errIp: 'Adresse IPv4 invalide : {ip}',
    errRangeOrder: 'L’IP de début doit être inférieure ou égale à l’IP de fin.',
    summaryRoute: 'Route agrégée (Supernet)',
    maskLabel: 'Masque',
    exactBadge: 'Agrégation EXACTE (contiguë)',
    overBadge: 'SUR-AGRÉGATION (absorbe {extra} adresses supplémentaires)',
    exactBlocksLabel: 'Blocs CIDR minimaux exacts équivalents',
    commonBits: 'Préfixe commun ({n} bits)',
    diffBits: 'Bits divergents ({n} bits)',
    step1Sum: 'Étape 1 : Représentation binaire 32 bits alignée',
    step1SumDesc: 'Alignement bit à bit des réseaux normalisés pour repérer le premier bit divergent.',
    step2Sum: 'Étape 2 : Plus long préfixe commun et masque',
    step2SumDesc: 'Les {n} premiers bits sont identiques ; les bits restants sont mis à 0.',
    step3Sum: 'Étape 3 : Vérification de contiguïté (exacte vs sur-agrégée)',
    step3SumDesc: 'Comparaison des {covered} adresses couvertes aux {superTotal} adresses du super-réseau.',
    rangeBlocks: 'Blocs CIDR minimaux',
    rangeCount: '{count} blocs pour {total} adresses',
    step1Range: 'Étape 1 : Conversion des bornes IPv4 en entiers 32 bits',
    step1RangeDesc: 'La plage [{start} .. {end}] contient {total} adresses.',
    step2Range: 'Étape 2 : Décomposition gloutonne en puissances de 2 alignées',
    step2RangeDesc: 'À chaque curseur, on choisit le plus grand bloc 2^k aligné ne dépassant pas la fin.'
  }
};

function ipToInt(ipStr) {
  const parts = ipStr.trim().split('.');
  if (parts.length !== 4) return null;
  let res = 0;
  for (let i = 0; i < 4; i++) {
    if (!/^\d+$/.test(parts[i])) return null;
    const n = Number(parts[i]);
    if (n < 0 || n > 255) return null;
    res = ((res << 8) | n) >>> 0;
  }
  return res;
}

function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

function prefixToMask(p) {
  return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
}

function rangeToCidrs(startInt, endInt) {
  const blocks = [];
  let cur = startInt >>> 0;
  const end = endInt >>> 0;
  while (cur <= end) {
    let maxSize = 1;
    // Trailing zeros alignment
    let step = 0;
    while (step < 32 && (cur === 0 || (cur & (1 << step)) === 0)) {
      const candidate = 2 ** (step + 1);
      if (cur + candidate - 1 > end) break;
      maxSize = candidate;
      step++;
    }
    const prefix = 32 - Math.round(Math.log2(maxSize));
    blocks.push({ net: cur, prefix, size: maxSize });
    if (cur + maxSize > 0xffffffff) break;
    cur = (cur + maxSize) >>> 0;
  }
  return blocks;
}

function mergeIntervalsToCidrs(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of sorted) {
    if (!merged.length || s > merged[merged.length - 1][1] + 1) {
      merged.push([s, e]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    }
  }
  const exact = [];
  let uniqueCount = 0;
  for (const [s, e] of merged) {
    uniqueCount += e - s + 1;
    exact.push(...rangeToCidrs(s, e));
  }
  return { exact, uniqueCount };
}

function renderBitsColored(ipInt, commonLen) {
  const bin = ipInt.toString(2).padStart(32, '0');
  const octets = bin.match(/.{8}/g);
  let idx = 0;
  return octets
    .map((oct) => {
      const spans = oct
        .split('')
        .map((b) => {
          const isCommon = idx < commonLen;
          idx++;
          const cls = isCommon
            ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/15'
            : 'text-amber-700 dark:text-amber-300 bg-amber-500/15';
          return `<span class="inline-block px-0.5 rounded ${cls}">${b}</span>`;
        })
        .join('');
      return `<span class="inline-flex gap-px">${spans}</span>`;
    })
    .join('<span class="mx-1 text-slate-400">.</span>');
}

function solveSummarize(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const items = raw.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
  if (items.length === 0) return { ok: false, error: t.errFormat };

  const nets = [];
  for (const item of items) {
    const [ipPart, prefPart] = item.split('/');
    const ipInt = ipToInt(ipPart || '');
    if (ipInt === null) return { ok: false, error: t.errIp.replace('{ip}', item) };
    const prefix = prefPart !== undefined ? Number(prefPart.trim()) : 32;
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
      return { ok: false, error: t.errIp.replace('{ip}', item) };
    }
    const mask = prefixToMask(prefix);
    const net = (ipInt & mask) >>> 0;
    const size = 2 ** (32 - prefix);
    const end = (net + size - 1) >>> 0;
    nets.push({ raw: item, net, prefix, end, size });
  }

  let commonLen = 32;
  const firstBin = nets[0].net.toString(2).padStart(32, '0');
  for (let i = 1; i < nets.length; i++) {
    commonLen = Math.min(commonLen, nets[i].prefix, nets[0].prefix);
    const bin = nets[i].net.toString(2).padStart(32, '0');
    for (let b = 0; b < commonLen; b++) {
      if (bin[b] !== firstBin[b]) {
        commonLen = b;
        break;
      }
    }
  }
  if (nets.length === 1) commonLen = nets[0].prefix;

  const superMask = prefixToMask(commonLen);
  const superNet = (nets[0].net & superMask) >>> 0;
  const superTotal = 2 ** (32 - commonLen);
  const superStr = `${intToIp(superNet)}/${commonLen}`;
  const superMaskStr = intToIp(superMask);

  const { exact, uniqueCount } = mergeIntervalsToCidrs(nets.map((n) => [n.net, n.end]));
  const isExact = uniqueCount === superTotal;
  const extra = superTotal - uniqueCount;

  const badgeHtml = isExact
    ? `<span class="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">${t.exactBadge}</span>`
    : `<span class="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">${t.overBadge.replace('{extra}', extra.toLocaleString())}</span>`;

  const exactListStr = exact.map((b) => `${intToIp(b.net)}/${b.prefix}`).join(', ');

  const summaryHtml = `
    <div class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div class="text-xs text-slate-500 dark:text-slate-400">${t.summaryRoute}</div>
          <div class="font-mono font-extrabold text-2xl text-cyan-600 dark:text-cyan-400">${superStr}</div>
          <div class="font-mono text-xs text-slate-500 dark:text-slate-400">${t.maskLabel}: ${superMaskStr}</div>
        </div>
        ${badgeHtml}
      </div>
      ${
        !isExact
          ? `<div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div class="text-xs text-slate-500 dark:text-slate-400">${t.exactBlocksLabel}</div>
              <div class="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 break-all">${exactListStr}</div>
            </div>`
          : ''
      }
    </div>
  `;

  const visualHtml = `
    <div class="min-w-0 max-w-full overflow-x-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-4 text-xs mb-3">
        <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500"></span>${t.commonBits.replace('{n}', commonLen)}</span>
        <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-500/30 border border-amber-500"></span>${t.diffBits.replace('{n}', 32 - commonLen)}</span>
      </div>
      <div class="font-mono text-xs sm:text-sm space-y-1.5 whitespace-nowrap">
        ${nets.map((n) => `<div class="flex items-center gap-3"><span class="w-36 text-slate-500">${intToIp(n.net)}/${n.prefix}</span>${renderBitsColored(n.net, commonLen)}</div>`).join('')}
        <div class="border-t border-slate-300 dark:border-slate-700 pt-1.5 flex items-center gap-3 font-bold">
          <span class="w-36 text-cyan-600 dark:text-cyan-400">${superStr}</span>${renderBitsColored(superNet, commonLen)}
        </div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1Sum,
      explanation: t.step1SumDesc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs space-y-1 whitespace-nowrap">
        ${nets.map((n) => `<div>${intToIp(n.net)}/${n.prefix} → ${n.net.toString(2).padStart(32, '0').match(/.{8}/g).join('.')}</div>`).join('')}
      </div>`
    },
    {
      title: t.step2Sum,
      explanation: t.step2SumDesc.replace('{n}', commonLen),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1">
        <div>${t.summaryRoute}: <span class="font-bold text-cyan-600 dark:text-cyan-400">${superStr}</span></div>
        <div>${t.maskLabel}: ${superMaskStr}</div>
      </div>`
    },
    {
      title: t.step3Sum,
      explanation: t.step3SumDesc.replace('{covered}', uniqueCount.toLocaleString()).replace('{superTotal}', superTotal.toLocaleString()),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${isExact ? t.exactBadge : `${t.exactBlocksLabel}: ${exactListStr}`}</div>`
    }
  ];

  const copyText = `${t.summaryRoute}: ${superStr}\n${t.maskLabel}: ${superMaskStr}\nExact: ${isExact}\nBlocks: ${exactListStr}`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}

function solveRange(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const parts = raw.split(/\s*[-–—]\s*/);
  if (parts.length !== 2) return { ok: false, error: t.errFormat };

  const startInt = ipToInt(parts[0]);
  const endInt = ipToInt(parts[1]);
  if (startInt === null) return { ok: false, error: t.errIp.replace('{ip}', parts[0]) };
  if (endInt === null) return { ok: false, error: t.errIp.replace('{ip}', parts[1]) };
  if (startInt > endInt) return { ok: false, error: t.errRangeOrder };

  const blocks = rangeToCidrs(startInt, endInt);
  const total = endInt - startInt + 1;
  const listStr = blocks.map((b) => `${intToIp(b.net)}/${b.prefix}`).join('\n');

  const summaryHtml = `
    <div class="space-y-3">
      <div class="text-xs text-slate-500 dark:text-slate-400">${t.rangeBlocks} · ${t.rangeCount.replace('{count}', blocks.length).replace('{total}', total.toLocaleString())}</div>
      <div class="flex flex-wrap gap-2">
        ${blocks.map((b) => `<span class="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 font-mono font-bold text-sm text-cyan-700 dark:text-cyan-300">${intToIp(b.net)}/${b.prefix} <span class="text-xs font-normal opacity-75">(${b.size})</span></span>`).join('')}
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1Range,
      explanation: t.step1RangeDesc.replace('{start}', intToIp(startInt)).replace('{end}', intToIp(endInt)).replace('{total}', total.toLocaleString()),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${intToIp(startInt)} (${startInt}) → ${intToIp(endInt)} (${endInt})</div>`
    },
    {
      title: t.step2Range,
      explanation: t.step2RangeDesc,
      codeOrMathHtml: `<div class="font-mono text-xs space-y-1">
        ${blocks.map((b) => `<div>${intToIp(b.net)}/${b.prefix} → ${b.size} IPs (${intToIp(b.net)} .. ${intToIp((b.net + b.size - 1) >>> 0)})</div>`).join('')}
      </div>`
    }
  ];

  return { ok: true, summaryHtml, steps, copyText: listStr };
}

export function solveCidr(input, mode = 'summarize', lang = 'es') {
  const raw = (input || '').trim();
  if (!raw) return { ok: false, error: (TEXT[lang] || TEXT.es).errFormat };
  if (mode === 'range' || (raw.includes('-') && !raw.includes('/'))) {
    return solveRange(raw, lang);
  }
  return solveSummarize(raw, lang);
}
