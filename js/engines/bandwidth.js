const TEXT = {
  es: {
    errTransfer: 'Formato inválido. Usa: tamaño unidad ; velocidad unidad [; % overhead] (ej. 100 MiB ; 100 Mbps).',
    errBdp: 'Formato BDP inválido. Usa: R_Mbps ; RTT_ms ; Ventana_KiB [; MSS_bytes ; perdida_%] (ej. 100 ; 40 ; 64).',
    timeLabel: 'Tiempo de transferencia',
    effectiveBits: 'Volumen total en bits',
    rateLabel: 'Velocidad efectiva',
    bdpLabel: 'Producto BDP (R × RTT)',
    maxWinLabel: 'Throughput máx. por ventana',
    effLabel: 'Eficiencia / Saturación',
    mathisLabel: 'Cota de Mathis (pérdida p)',
    inFlight: 'Datos en vuelo (W)',
    idleWait: 'Espera ACK (ocioso)',
    step1Tx: 'Paso 1: Conversión exacta a bits (SI base 1000 vs. IEC base 1024)',
    step1TxDesc: 'Convertimos el tamaño del archivo a bytes y multiplicamos por 8 bits (aplicando sobrecarga si existe).',
    step2Tx: 'Paso 2: Cálculo del tiempo T = Bits / Velocidad',
    step2TxDesc: 'Dividimos los bits totales entre la velocidad del enlace en bps.',
    step1Bdp: 'Paso 1: Cálculo del Bandwidth-Delay Product (BDP)',
    step1BdpDesc: 'BDP = R × RTT representa los bits necesarios en vuelo para mantener el enlace al 100%.',
    step2Bdp: 'Paso 2: Límite por ventana deslizante TCP y eficiencia',
    step2BdpDesc: 'El throughput máximo sin esperar ACKs es W / RTT, acotado por R.',
    step3Bdp: 'Paso 3: Tiempos de propagación/transmisión y cota de Mathis',
    step3BdpDesc: 't_prop = RTT / 2, t_tx = MSS / R y relación a = t_prop / t_tx.'
  },
  en: {
    errTransfer: 'Invalid format. Use: size unit ; speed unit [; % overhead] (e.g. 100 MiB ; 100 Mbps).',
    errBdp: 'Invalid BDP format. Use: R_Mbps ; RTT_ms ; Window_KiB [; MSS_bytes ; loss_%] (e.g. 100 ; 40 ; 64).',
    timeLabel: 'Transfer Time',
    effectiveBits: 'Total volume in bits',
    rateLabel: 'Effective Rate',
    bdpLabel: 'BDP (R × RTT)',
    maxWinLabel: 'Max Window Throughput',
    effLabel: 'Link Efficiency',
    mathisLabel: 'Mathis Bound (loss p)',
    inFlight: 'In-flight data (W)',
    idleWait: 'ACK wait (idle)',
    step1Tx: 'Step 1: Exact conversion to bits (SI base 1000 vs. IEC base 1024)',
    step1TxDesc: 'Convert file size to bytes and multiply by 8 bits (including overhead if specified).',
    step2Tx: 'Step 2: Transfer time T = Bits / Rate',
    step2TxDesc: 'Divide total bits by link speed in bps.',
    step1Bdp: 'Step 1: Bandwidth-Delay Product (BDP)',
    step1BdpDesc: 'BDP = R × RTT is the in-flight data needed to saturate the link at 100%.',
    step2Bdp: 'Step 2: TCP sliding window limit & efficiency',
    step2BdpDesc: 'Maximum throughput limited by window W is min(R, W / RTT).',
    step3Bdp: 'Step 3: Propagation/transmission time & Mathis bound',
    step3BdpDesc: 't_prop = RTT / 2, t_tx = MSS / R, and ratio a = t_prop / t_tx.'
  },
  fr: {
    errTransfer: 'Format invalide. Utilisez : taille unité ; débit unité [; % surcoût] (ex. 100 MiB ; 100 Mbps).',
    errBdp: 'Format BDP invalide. Utilisez : R_Mbps ; RTT_ms ; Fenêtre_KiB [; MSS ; perte_%] (ex. 100 ; 40 ; 64).',
    timeLabel: 'Temps de transfert',
    effectiveBits: 'Volume total en bits',
    rateLabel: 'Débit effectif',
    bdpLabel: 'Produit BDP (R × RTT)',
    maxWinLabel: 'Débit max. par fenêtre',
    effLabel: 'Efficacité du lien',
    mathisLabel: 'Borne de Mathis (perte p)',
    inFlight: 'Données en vol (W)',
    idleWait: 'Attente ACK (inactif)',
    step1Tx: 'Étape 1 : Conversion exacte en bits (SI base 1000 vs IEC base 1024)',
    step1TxDesc: 'Conversion en octets puis multiplication par 8 bits (avec surcoût éventuel).',
    step2Tx: 'Étape 2 : Calcul du temps T = Bits / Débit',
    step2TxDesc: 'Division des bits totaux par le débit du lien en bps.',
    step1Bdp: 'Étape 1 : Produit Bande Passante-Délai (BDP)',
    step1BdpDesc: 'BDP = R × RTT représente les données en vol nécessaires pour saturer le lien.',
    step2Bdp: 'Étape 2 : Limite par fenêtre glissante TCP et efficacité',
    step2BdpDesc: 'Le débit maximal est min(R, W / RTT).',
    step3Bdp: 'Étape 3 : Temps de propagation/transmission et borne de Mathis',
    step3BdpDesc: 't_prop = RTT / 2, t_tx = MSS / R et rapport a = t_prop / t_tx.'
  }
};

const SIZE_MULT = {
  B: 1,
  KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12,
  KIB: 1024, MIB: 1024 ** 2, GIB: 1024 ** 3, TIB: 1024 ** 4
};

const SPEED_MULT = {
  BPS: 1, KBPS: 1e3, MBPS: 1e6, GBPS: 1e9
};

function formatDuration(sec) {
  if (sec < 1) return `${(sec * 1000).toFixed(2)} ms`;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m ${s.toFixed(1)}s`;
  if (m > 0) return `${m}m ${s.toFixed(2)}s`;
  return `${s.toFixed(3)} s`;
}

function solveTransfer(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const parts = raw.split(';').map((s) => s.trim());
  if (parts.length < 2) return { ok: false, error: t.errTransfer };

  const sm = parts[0].match(/^([\d.]+)\s*([a-zA-Z]+)$/);
  const rm = parts[1].match(/^([\d.]+)\s*([a-zA-Z]+)$/);
  if (!sm || !rm) return { ok: false, error: t.errTransfer };

  const sizeVal = Number(sm[1]);
  const sizeUnit = sm[2].toUpperCase();
  const speedVal = Number(rm[1]);
  const speedUnit = rm[2].toUpperCase();
  if (!SIZE_MULT[sizeUnit] || !SPEED_MULT[speedUnit] || sizeVal <= 0 || speedVal <= 0) {
    return { ok: false, error: t.errTransfer };
  }

  const overhead = parts[2] ? parseFloat(parts[2].replace('%', '')) : 0;
  const bytes = sizeVal * SIZE_MULT[sizeUnit];
  const bits = bytes * 8 * (1 + (Number.isFinite(overhead) ? overhead / 100 : 0));
  const bps = speedVal * SPEED_MULT[speedUnit];
  const seconds = bits / bps;

  const benchmarks = [
    ['100 Mbps', 100e6],
    ['1 Gbps', 1e9],
    ['10 Gbps', 10e9],
    ['Wi-Fi 6 (~600 Mbps)', 600e6],
    ['5G (~300 Mbps)', 300e6]
  ];

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.timeLabel}</div>
        <div class="font-mono font-extrabold text-2xl text-cyan-600 dark:text-cyan-400">${formatDuration(seconds)}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.effectiveBits}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-base">${Math.round(bits).toLocaleString()} bits</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.rateLabel}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">${bps.toLocaleString()} bps</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <table class="w-full text-xs sm:text-sm whitespace-nowrap">
        <thead class="bg-slate-100 dark:bg-slate-800 font-semibold">
          <tr><th class="px-4 py-2 text-left">Link</th><th class="px-4 py-2 text-left">${t.timeLabel}</th></tr>
        </thead>
        <tbody>
          ${benchmarks.map(([lbl, r]) => `<tr class="border-t border-slate-200 dark:border-slate-800"><td class="px-4 py-2">${lbl}</td><td class="px-4 py-2 font-mono font-bold">${formatDuration(bits / r)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;

  const steps = [
    {
      title: t.step1Tx,
      explanation: t.step1TxDesc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${sizeVal} ${sizeUnit} = ${bytes.toLocaleString()} bytes × 8${overhead ? ` × ${(1 + overhead / 100).toFixed(2)}` : ''} = ${Math.round(bits).toLocaleString()} bits</div>`
    },
    {
      title: t.step2Tx,
      explanation: t.step2TxDesc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${Math.round(bits).toLocaleString()} / ${bps.toLocaleString()} = <span class="font-bold text-cyan-600 dark:text-cyan-400">${seconds.toFixed(4)} s (${formatDuration(seconds)})</span></div>`
    }
  ];

  return { ok: true, summaryHtml, visualHtml, steps, copyText: `${t.timeLabel}: ${formatDuration(seconds)} (${seconds.toFixed(4)} s)` };
}

function solveBdp(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const nums = raw.split(';').map((s) => parseFloat(s.trim()));
  if (nums.length < 3 || nums.slice(0, 3).some((n) => !Number.isFinite(n) || n <= 0)) {
    return { ok: false, error: t.errBdp };
  }

  const rMbps = nums[0];
  const rttMs = nums[1];
  const winKiB = nums[2];
  const mssBytes = Number.isFinite(nums[3]) && nums[3] > 0 ? nums[3] : 1460;
  const lossPct = Number.isFinite(nums[4]) && nums[4] > 0 ? nums[4] : 0;

  const rBps = rMbps * 1e6;
  const rttSec = rttMs / 1000;
  const bdpBits = rBps * rttSec;
  const bdpBytes = bdpBits / 8;
  const bdpKiB = bdpBytes / 1024;

  const winBits = winKiB * 1024 * 8;
  const winBps = winBits / rttSec;
  const maxBps = Math.min(rBps, winBps);
  const maxMbps = maxBps / 1e6;
  const effPct = Math.min(100, (maxBps / rBps) * 100);

  const tPropMs = rttMs / 2;
  const tTxMs = ((mssBytes * 8) / rBps) * 1000;
  const aRatio = tPropMs / tTxMs;

  let mathisMbps = null;
  if (lossPct > 0) {
    const p = lossPct / 100;
    const mathisBps = ((mssBytes * 8) / rttSec) * (1.22 / Math.sqrt(p));
    mathisMbps = mathisBps / 1e6;
  }

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.bdpLabel}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-base">${Math.round(bdpBits).toLocaleString()} bits</div>
        <div class="font-mono text-xs text-slate-500">${Math.round(bdpBytes).toLocaleString()} B (${bdpKiB.toFixed(2)} KiB)</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.maxWinLabel}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">${maxMbps.toFixed(2)} Mbps</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.effLabel}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-lg">${effPct.toFixed(1)}%</div>
      </div>
      ${
        mathisMbps !== null
          ? `<div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div class="text-xs text-slate-500 dark:text-slate-400">${t.mathisLabel}</div>
              <div class="font-mono font-bold text-amber-600 dark:text-amber-400 text-lg">${mathisMbps.toFixed(2)} Mbps</div>
            </div>`
          : `<div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div class="text-xs text-slate-500 dark:text-slate-400">a = t_prop / t_tx</div>
              <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-lg">${aRatio.toFixed(1)}</div>
            </div>`
      }
    </div>
  `;

  const visualHtml = `
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-2">
      <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>${t.inFlight}: ${effPct.toFixed(1)}%</span>
        <span>${t.idleWait}: ${(100 - effPct).toFixed(1)}%</span>
      </div>
      <div class="w-full h-5 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 flex">
        <div class="bg-cyan-500 h-full" style="width:${effPct.toFixed(1)}%"></div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1Bdp,
      explanation: t.step1BdpDesc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${rMbps} Mbps × ${rttMs} ms = ${Math.round(bdpBits).toLocaleString()} bits = ${Math.round(bdpBytes).toLocaleString()} bytes (${bdpKiB.toFixed(2)} KiB)</div>`
    },
    {
      title: t.step2Bdp,
      explanation: t.step2BdpDesc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">W/RTT = (${winKiB} KiB × 8192) / ${rttSec}s = ${(winBps / 1e6).toFixed(2)} Mbps → min(${rMbps}, ${(winBps / 1e6).toFixed(2)}) = <span class="font-bold text-emerald-600 dark:text-emerald-400">${maxMbps.toFixed(2)} Mbps</span> (${effPct.toFixed(1)}%)</div>`
    },
    {
      title: t.step3Bdp,
      explanation: t.step3BdpDesc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1">
        <div>t_prop = ${tPropMs.toFixed(2)} ms · t_tx (${mssBytes} B) = ${tTxMs.toFixed(4)} ms · a = ${aRatio.toFixed(1)}</div>
        ${mathisMbps !== null ? `<div>Mathis (${lossPct}%): ${mathisMbps.toFixed(2)} Mbps</div>` : ''}
      </div>`
    }
  ];

  const copyText = `BDP: ${Math.round(bdpBits)} bits (${Math.round(bdpBytes)} bytes)\nMax Window Throughput: ${maxMbps.toFixed(2)} Mbps (${effPct.toFixed(1)}%)`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}

export function solveBandwidth(input, mode = 'transfer', lang = 'es') {
  const raw = (input || '').trim();
  if (!raw) return { ok: false, error: (TEXT[lang] || TEXT.es).errTransfer };
  if (mode === 'bdp' || /^[\d.\s]+;[\d.\s]+;[\d.\s]+/.test(raw)) {
    return solveBdp(raw, lang);
  }
  return solveTransfer(raw, lang);
}
