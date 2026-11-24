const TEXT = {
  es: {
    errFormat: 'Formato inválido. Usa: Bits_dir ; Caché ; Bloque ; [Vías ; Política ;] Accesos (ej. 16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010).',
    errPow2: 'El tamaño de caché y el tamaño de bloque deben ser potencias de 2 (y caché >= bloque).',
    errWays: 'El número de líneas ({lines}) debe ser mayor o igual que la asociatividad ({ways}).',
    errAddr: 'Dirección de acceso inválida: {addr}',
    totalAcc: 'Accesos',
    hits: 'Hits',
    misses: 'Misses',
    hitRate: 'Hit Rate',
    missRate: 'Miss Rate',
    cold: 'Frío (Compulsory)',
    conflict: 'Conflicto',
    capacity: 'Capacidad',
    evicted: 'Desalojado',
    colIdx: '#',
    colAddr: 'Dirección',
    colBin: 'Tag | Index | Offset',
    colSet: 'Conjunto',
    colRes: 'Resultado',
    colReason: 'Motivo / Reemplazo',
    finalState: 'Estado final de la caché',
    colWays: 'Vías (Tag)',
    step1: 'Paso 1: Geometría de la caché y reparto de bits',
    step1Desc: 'Calculamos offset = log₂(bloque), líneas = caché / bloque, conjuntos = líneas / vías, index = log₂(conjuntos) y tag restante.',
    step2: 'Paso 2: Simulación de accesos y clasificación de fallos (3 Cs)',
    step2Desc: 'Cada dirección se segmenta en Tag | Index | Offset para comprobar si hay Hit o Miss ({policy}).',
    step3: 'Paso 3: Métricas finales de rendimiento',
    step3Desc: 'Hit Rate = Hits / Total accesos · Miss Rate = 100% - Hit Rate.'
  },
  en: {
    errFormat: 'Invalid format. Use: Addr_bits ; Cache ; Block ; [Ways ; Policy ;] Accesses (e.g. 16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010).',
    errPow2: 'Cache size and block size must be powers of 2 (with cache >= block).',
    errWays: 'Number of cache lines ({lines}) must be >= associativity ({ways}).',
    errAddr: 'Invalid memory address: {addr}',
    totalAcc: 'Accesses',
    hits: 'Hits',
    misses: 'Misses',
    hitRate: 'Hit Rate',
    missRate: 'Miss Rate',
    cold: 'Cold (Compulsory)',
    conflict: 'Conflict',
    capacity: 'Capacity',
    evicted: 'Evicted',
    colIdx: '#',
    colAddr: 'Address',
    colBin: 'Tag | Index | Offset',
    colSet: 'Set',
    colRes: 'Result',
    colReason: 'Reason / Eviction',
    finalState: 'Final Cache State',
    colWays: 'Ways (Tag)',
    step1: 'Step 1: Cache geometry & address bit split',
    step1Desc: 'Compute offset = log₂(block), lines = cache / block, sets = lines / ways, index = log₂(sets), and remaining tag bits.',
    step2: 'Step 2: Access trace simulation & 3 Cs miss classification',
    step2Desc: 'Split each address into Tag | Index | Offset and simulate {policy} replacement.',
    step3: 'Step 3: Final hit/miss metrics',
    step3Desc: 'Hit Rate = Hits / Total accesses · Miss Rate = 100% - Hit Rate.'
  },
  fr: {
    errFormat: 'Format invalide. Utilisez : Bits_adr ; Cache ; Bloc ; [Voies ; Politique ;] Accès.',
    errPow2: 'La taille du cache et du bloc doivent être des puissances de 2 (cache >= bloc).',
    errWays: 'Le nombre de lignes ({lines}) doit être >= associativité ({ways}).',
    errAddr: 'Adresse mémoire invalide : {addr}',
    totalAcc: 'Accès',
    hits: 'Hits',
    misses: 'Misses',
    hitRate: 'Taux Hit',
    missRate: 'Taux Miss',
    cold: 'Froid (Obligatoire)',
    conflict: 'Conflit',
    capacity: 'Capacité',
    evicted: 'Évincé',
    colIdx: '#',
    colAddr: 'Adresse',
    colBin: 'Tag | Index | Offset',
    colSet: 'Ensemble',
    colRes: 'Résultat',
    colReason: 'Motif / Éviction',
    finalState: 'État final du cache',
    colWays: 'Voies (Tag)',
    step1: 'Étape 1 : Géométrie du cache et découpage des bits',
    step1Desc: 'offset = log₂(bloc), lignes = cache / bloc, ensembles = lignes / voies, index = log₂(ensembles).',
    step2: 'Étape 2 : Simulation des accès et classification des défauts (3 C)',
    step2Desc: 'Découpage en Tag | Index | Offset avec politique {policy}.',
    step3: 'Étape 3 : Taux de succès et d’échec',
    step3Desc: 'Hit Rate = Hits / Total accès · Miss Rate = 100% - Hit Rate.'
  }
};

function parseSizeBytes(str) {
  const m = String(str).trim().match(/^(\d+)\s*(B|KB|KIB)?$/i);
  if (!m) return null;
  const n = Number(m[1]);
  const u = (m[2] || 'B').toUpperCase();
  const mult = u === 'KIB' ? 1024 : u === 'KB' ? 1024 : 1;
  return n * mult;
}

function isPow2(n) {
  return Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;
}

export function solveCache(input, mode = '1_LRU', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const parts = (input || '').split(';').map((s) => s.trim()).filter(Boolean);
  if (parts.length < 4) return { ok: false, error: t.errFormat };

  const addrBits = Number(parts[0]);
  if (![8, 12, 16, 24, 32].includes(addrBits)) return { ok: false, error: t.errFormat };

  const cacheBytes = parseSizeBytes(parts[1]);
  const blockBytes = parseSizeBytes(parts[2]);
  if (!cacheBytes || !blockBytes || !isPow2(cacheBytes) || !isPow2(blockBytes) || cacheBytes < blockBytes) {
    return { ok: false, error: t.errPow2 };
  }

  const numLines = cacheBytes / blockBytes;
  let ways = 1;
  let policy = 'LRU';
  let accessStr = parts[3];

  const [modeWays, modePol] = String(mode || '1_LRU').split('_');
  if (modeWays === 'full') ways = numLines;
  else if (/^\d+$/.test(modeWays)) ways = Number(modeWays);
  if (modePol === 'FIFO' || modePol === 'LRU') policy = modePol;

  if (parts.length >= 6) {
    ways = /full|total/i.test(parts[3]) ? numLines : Number(parts[3]);
    policy = /fifo/i.test(parts[4]) ? 'FIFO' : 'LRU';
    accessStr = parts[5];
  } else if (parts.length === 5) {
    if (/^\d+$/.test(parts[3]) || /full|total/i.test(parts[3])) {
      ways = /full|total/i.test(parts[3]) ? numLines : Number(parts[3]);
    }
    accessStr = parts[4];
  }

  if (!isPow2(ways) || ways > numLines) {
    return { ok: false, error: t.errWays.replace('{lines}', numLines).replace('{ways}', ways) };
  }

  const offsetBits = Math.log2(blockBytes);
  const numSets = numLines / ways;
  const indexBits = Math.log2(numSets);
  const tagBits = addrBits - indexBits - offsetBits;
  if (tagBits <= 0) return { ok: false, error: t.errFormat };

  const rawAcc = accessStr.split(/[\s,]+/).filter(Boolean);
  if (!rawAcc.length) return { ok: false, error: t.errFormat };

  const maxAddr = (1n << BigInt(addrBits)) - 1n;
  const addrs = [];
  for (const tok of rawAcc) {
    let v;
    try {
      v = /^0x/i.test(tok) ? BigInt(tok) : /^\d+$/.test(tok) ? BigInt(tok) : null;
    } catch {
      v = null;
    }
    if (v === null || v < 0n || v > maxAddr) {
      return { ok: false, error: t.errAddr.replace('{addr}', tok) };
    }
    addrs.push({ tok, val: v });
  }

  const sets = Array.from({ length: numSets }, () => []);
  const seenBlocks = new Set();
  const trace = [];
  let hits = 0;
  let misses = 0;

  const offsetMask = (1n << BigInt(offsetBits)) - 1n;
  const indexMask = (1n << BigInt(indexBits)) - 1n;

  addrs.forEach((a, idx) => {
    const offset = Number(a.val & offsetMask);
    const setIdx = indexBits > 0 ? Number((a.val >> BigInt(offsetBits)) & indexMask) : 0;
    const tag = a.val >> BigInt(offsetBits + indexBits);
    const blockId = `${tag}_${setIdx}`;
    const tagHex = '0x' + tag.toString(16).toUpperCase();

    const binFull = a.val.toString(2).padStart(addrBits, '0');
    const bTag = binFull.slice(0, tagBits);
    const bIdx = indexBits > 0 ? binFull.slice(tagBits, tagBits + indexBits) : '';
    const bOff = binFull.slice(tagBits + indexBits);

    const setArr = sets[setIdx];
    const hitPos = setArr.findIndex((entry) => entry.tag === tag);
    let isHit = false;
    let reason = '';
    let evictedTag = null;

    if (hitPos !== -1) {
      isHit = true;
      hits++;
      if (policy === 'LRU') {
        const [item] = setArr.splice(hitPos, 1);
        setArr.push(item);
      }
    } else {
      misses++;
      const totalOccupied = sets.reduce((acc, s) => acc + s.length, 0);
      if (!seenBlocks.has(blockId)) reason = t.cold;
      else if (totalOccupied >= numLines) reason = t.capacity;
      else reason = t.conflict;

      if (setArr.length >= ways) {
        const ev = setArr.shift();
        evictedTag = '0x' + ev.tag.toString(16).toUpperCase();
      }
      setArr.push({ tag, tagHex });
      seenBlocks.add(blockId);
    }

    trace.push({
      step: idx + 1,
      tok: a.tok,
      bTag,
      bIdx,
      bOff,
      setIdx,
      tagHex,
      offset,
      isHit,
      reason,
      evictedTag
    });
  });

  const hitRate = ((hits / addrs.length) * 100).toFixed(1);
  const missRate = ((misses / addrs.length) * 100).toFixed(1);

  const tagPct = (tagBits / addrBits) * 100;
  const idxPct = (indexBits / addrBits) * 100;
  const offPct = (offsetBits / addrBits) * 100;

  const summaryHtml = `
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.totalAcc}</div>
        <div class="font-mono font-bold text-lg">${addrs.length}</div>
      </div>
      <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
        <div class="text-xs text-emerald-700 dark:text-emerald-300">${t.hits}</div>
        <div class="font-mono font-extrabold text-lg text-emerald-600 dark:text-emerald-400">${hits}</div>
      </div>
      <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
        <div class="text-xs text-rose-700 dark:text-rose-300">${t.misses}</div>
        <div class="font-mono font-extrabold text-lg text-rose-600 dark:text-rose-400">${misses}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.hitRate}</div>
        <div class="font-mono font-bold text-lg text-cyan-600 dark:text-cyan-400">${hitRate}%</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.missRate}</div>
        <div class="font-mono font-bold text-lg">${missRate}%</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="space-y-4">
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-2">
        <div class="w-full h-7 rounded-lg overflow-hidden flex text-[11px] font-mono font-bold text-white">
          <div class="bg-violet-600 flex items-center justify-center px-1" style="width:${tagPct}%">Tag (${tagBits}b)</div>
          ${indexBits > 0 ? `<div class="bg-cyan-600 flex items-center justify-center px-1" style="width:${idxPct}%">Index (${indexBits}b)</div>` : ''}
          <div class="bg-emerald-600 flex items-center justify-center px-1" style="width:${offPct}%">Offset (${offsetBits}b)</div>
        </div>
      </div>

      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table class="w-full text-left text-xs sm:text-sm whitespace-nowrap">
          <thead class="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th class="px-3 py-2">${t.colIdx}</th>
              <th class="px-3 py-2">${t.colAddr}</th>
              <th class="px-3 py-2">${t.colBin}</th>
              <th class="px-3 py-2">${t.colSet}</th>
              <th class="px-3 py-2">${t.colRes}</th>
              <th class="px-3 py-2">${t.colReason}</th>
            </tr>
          </thead>
          <tbody>
            ${trace
              .map(
                (tr) => `<tr class="border-t border-slate-200 dark:border-slate-800">
                  <td class="px-3 py-1.5 font-mono text-slate-400">${tr.step}</td>
                  <td class="px-3 py-1.5 font-mono font-bold">${tr.tok}</td>
                  <td class="px-3 py-1.5 font-mono text-xs"><span class="text-violet-600 dark:text-violet-400">${tr.bTag}</span>${tr.bIdx ? ` | <span class="text-cyan-600 dark:text-cyan-400">${tr.bIdx}</span>` : ''} | <span class="text-emerald-600 dark:text-emerald-400">${tr.bOff}</span></td>
                  <td class="px-3 py-1.5 font-mono">${tr.setIdx}</td>
                  <td class="px-3 py-1.5 font-mono font-bold ${tr.isHit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">${tr.isHit ? 'HIT' : 'MISS'}</td>
                  <td class="px-3 py-1.5 text-xs">${tr.isHit ? '—' : tr.reason}${tr.evictedTag ? ` (${t.evicted}: ${tr.evictedTag})` : ''}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div class="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">${t.finalState}</div>
        <table class="w-full text-left text-xs whitespace-nowrap">
          <thead class="bg-slate-100 dark:bg-slate-800"><tr><th class="px-3 py-1.5">${t.colSet}</th><th class="px-3 py-1.5">${t.colWays}</th></tr></thead>
          <tbody>
            ${sets
              .map((s, i) => (s.length ? `<tr class="border-t border-slate-200 dark:border-slate-800"><td class="px-3 py-1.5 font-mono font-bold">Set ${i}</td><td class="px-3 py-1.5 font-mono">${s.map((e) => e.tagHex).join(' · ')}</td></tr>` : ''))
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1,
      explanation: t.step1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1">
        <div>Offset = log₂(${blockBytes}) = ${offsetBits} bits · Lines = ${cacheBytes}/${blockBytes} = ${numLines} · Sets = ${numLines}/${ways} = ${numSets}</div>
        <div>Index = log₂(${numSets}) = ${indexBits} bits · Tag = ${addrBits} - ${indexBits} - ${offsetBits} = <span class="font-bold text-violet-600 dark:text-violet-400">${tagBits} bits</span></div>
      </div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc.replace('{policy}', policy),
      codeOrMathHtml: `<div class="font-mono text-xs">${trace.map((tr) => `#${tr.step} ${tr.tok} (Set ${tr.setIdx}, Tag ${tr.tagHex}) → ${tr.isHit ? 'HIT' : 'MISS'}`).join(' · ')}</div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${t.hits}: ${hits} · ${t.misses}: ${misses} · ${t.hitRate}: ${hitRate}% · ${t.missRate}: ${missRate}%</div>`
    }
  ];

  const copyText = `Tag=${tagBits}, Index=${indexBits}, Offset=${offsetBits}\nHits: ${hits}, Misses: ${misses}, Hit Rate: ${hitRate}%`;
  const csvText = ['Step,Address,Tag,Index,Offset,Set,Result,Reason', ...trace.map((tr) => `${tr.step},${tr.tok},${tr.bTag},${tr.bIdx || '-'},${tr.bOff},${tr.setIdx},${tr.isHit ? 'HIT' : 'MISS'},${tr.reason || '-'}`)].join('\n');
  const latexText = `\\text{Tag}=${tagBits},\\; \\text{Index}=${indexBits},\\; \\text{Offset}=${offsetBits},\\; \\text{Hit Rate}=${hitRate}\\%`;

  return { ok: true, summaryHtml, visualHtml, steps, copyText, csvText, latexText };
}
