const TEXT = {
  es: {
    errRaid: 'Formato RAID inválido. Usa: RAID NIVEL ; discos ; capacidad_unidad (ej. RAID 5 ; 4 ; 4 TB).',
    errMinDisks: 'RAID {lvl} requiere al menos {min} discos{extra}.',
    evenNote: ' y un número par de discos',
    errChmod: 'Introduce un octal válido (ej. 755, 4755), simbólico (rwxr-xr-x) o umask 022.',
    usableCap: 'Capacidad útil',
    rawCap: 'Capacidad bruta',
    parityCap: 'Paridad / Espejo',
    efficiency: 'Eficiencia',
    faultTol: 'Tolerancia a fallos',
    disksUnit: 'discos',
    diskUnit: 'disco',
    dataBlock: 'Datos',
    parityBlock: 'Paridad',
    mirrorBlock: 'Espejo',
    raidStep1: 'Paso 1: Capacidad bruta y requisito mínimo de RAID {lvl}',
    raidStep1Desc: 'Multiplicamos N discos × capacidad por disco y verificamos la topología.',
    raidStep2: 'Paso 2: Cálculo de capacidad útil, paridad y tolerancia a fallos',
    raidStep2Desc: 'Aplicamos la fórmula de RAID {lvl} para separar datos útiles de redundancia.',
    octalLabel: 'Valor Octal',
    symLabel: 'Simbólico',
    binLabel: 'Binario (rwx)',
    cmdLabel: 'Comando listo',
    owner: 'Propietario (u)',
    group: 'Grupo (g)',
    others: 'Otros (o)',
    special: 'Bits especiales',
    umaskTitle: 'Cálculo de umask ({u})',
    umaskFiles: 'Archivos (666 & ~{u})',
    umaskDirs: 'Directorios (777 & ~{u})',
    chmodStep1: 'Paso 1: Descomposición binaria y suma octal (4 + 2 + 1)',
    chmodStep1Desc: 'Cada terna rwx suma Lectura (4), Escritura (2) y Ejecución (1).',
    chmodStep2: 'Paso 2: Operación umask (base AND NOT umask)',
    chmodStep2Desc: 'La máscara umask sustrae permisos de 666 (archivos) y 777 (directorios).'
  },
  en: {
    errRaid: 'Invalid RAID format. Use: RAID LEVEL ; disks ; disk_size (e.g. RAID 5 ; 4 ; 4 TB).',
    errMinDisks: 'RAID {lvl} requires at least {min} disks{extra}.',
    evenNote: ' and an even disk count',
    errChmod: 'Enter a valid octal (e.g. 755, 4755), symbolic (rwxr-xr-x), or umask 022.',
    usableCap: 'Usable Capacity',
    rawCap: 'Raw Capacity',
    parityCap: 'Parity / Mirror',
    efficiency: 'Efficiency',
    faultTol: 'Fault Tolerance',
    disksUnit: 'disks',
    diskUnit: 'disk',
    dataBlock: 'Data',
    parityBlock: 'Parity',
    mirrorBlock: 'Mirror',
    raidStep1: 'Step 1: Raw capacity & RAID {lvl} minimum disk check',
    raidStep1Desc: 'Multiply N disks × per-disk capacity and validate topology.',
    raidStep2: 'Step 2: Usable capacity, parity overhead & fault tolerance',
    raidStep2Desc: 'Apply the RAID {lvl} formula to separate usable data from redundancy.',
    octalLabel: 'Octal Value',
    symLabel: 'Symbolic',
    binLabel: 'Binary (rwx)',
    cmdLabel: 'Ready command',
    owner: 'Owner (u)',
    group: 'Group (g)',
    others: 'Others (o)',
    special: 'Special bits',
    umaskTitle: 'umask calculation ({u})',
    umaskFiles: 'Files (666 & ~{u})',
    umaskDirs: 'Directories (777 & ~{u})',
    chmodStep1: 'Step 1: Binary breakdown & octal sum (4 + 2 + 1)',
    chmodStep1Desc: 'Each rwx triad sums Read (4), Write (2), and Execute (1).',
    chmodStep2: 'Step 2: umask operation (base AND NOT umask)',
    chmodStep2Desc: 'umask strips bits from 666 (files) and 777 (directories).'
  },
  fr: {
    errRaid: 'Format RAID invalide. Utilisez : RAID NIVEAU ; disques ; taille (ex. RAID 5 ; 4 ; 4 TB).',
    errMinDisks: 'RAID {lvl} exige au moins {min} disques{extra}.',
    evenNote: ' et un nombre pair de disques',
    errChmod: 'Saisissez un octal valide (ex. 755), symbolique (rwxr-xr-x) ou umask 022.',
    usableCap: 'Capacité utile',
    rawCap: 'Capacité brute',
    parityCap: 'Parité / Miroir',
    efficiency: 'Efficacité',
    faultTol: 'Tolérance aux pannes',
    disksUnit: 'disques',
    diskUnit: 'disque',
    dataBlock: 'Données',
    parityBlock: 'Parité',
    mirrorBlock: 'Miroir',
    raidStep1: 'Étape 1 : Capacité brute et minimum de disques RAID {lvl}',
    raidStep1Desc: 'Multiplication N disques × capacité et vérification topologique.',
    raidStep2: 'Étape 2 : Capacité utile, parité et tolérance aux pannes',
    raidStep2Desc: 'Application de la formule RAID {lvl}.',
    octalLabel: 'Valeur Octale',
    symLabel: 'Symbolique',
    binLabel: 'Binaire (rwx)',
    cmdLabel: 'Commande prête',
    owner: 'Propriétaire (u)',
    group: 'Groupe (g)',
    others: 'Autres (o)',
    special: 'Bits spéciaux',
    umaskTitle: 'Calcul umask ({u})',
    umaskFiles: 'Fichiers (666 & ~{u})',
    umaskDirs: 'Répertoires (777 & ~{u})',
    chmodStep1: 'Étape 1 : Décomposition binaire et somme octale (4 + 2 + 1)',
    chmodStep1Desc: 'Chaque triade rwx additionne Lecture (4), Écriture (2) et Exécution (1).',
    chmodStep2: 'Étape 2 : Opération umask (base ET NON umask)',
    chmodStep2Desc: 'Le masque umask retire des droits à 666 (fichiers) et 777 (répertoires).'
  }
};

function calcRaidMetrics(level, n, cap) {
  const raw = n * cap;
  if (level === 0) return { usable: raw, parity: 0, tol: 0, readFactor: `${n}×`, writeFactor: `${n}×` };
  if (level === 1) return { usable: cap, parity: raw - cap, tol: n - 1, readFactor: `${n}×`, writeFactor: '1×' };
  if (level === 5) return { usable: (n - 1) * cap, parity: cap, tol: 1, readFactor: `${n - 1}×`, writeFactor: 'Parity' };
  if (level === 6) return { usable: (n - 2) * cap, parity: 2 * cap, tol: 2, readFactor: `${n - 2}×`, writeFactor: '2× Parity' };
  if (level === 10) return { usable: (n / 2) * cap, parity: (n / 2) * cap, tol: 1, readFactor: `${n}×`, writeFactor: `${n / 2}×` };
  return null;
}

function solveRaid(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const parts = raw.split(';').map((s) => s.trim());
  if (parts.length < 3) return { ok: false, error: t.errRaid };

  const lvlMatch = parts[0].match(/(0|10|1|5|6)/);
  if (!lvlMatch) return { ok: false, error: t.errRaid };
  const level = Number(lvlMatch[1]);
  const n = Number(parts[1]);
  const capMatch = parts[2].match(/^([\d.]+)\s*([a-zA-Z]*)$/);
  if (!Number.isInteger(n) || n < 1 || !capMatch) return { ok: false, error: t.errRaid };

  const cap = Number(capMatch[1]);
  const unit = (capMatch[2] || 'TB').toUpperCase();

  const minReq = { 0: 2, 1: 2, 5: 3, 6: 4, 10: 4 }[level];
  if (n < minReq || (level === 10 && n % 2 !== 0)) {
    return {
      ok: false,
      error: t.errMinDisks
        .replace('{lvl}', level)
        .replace('{min}', minReq)
        .replace('{extra}', level === 10 ? t.evenNote : '')
    };
  }

  const m = calcRaidMetrics(level, n, cap);
  const eff = ((m.usable / (n * cap)) * 100).toFixed(1);

  const disksVisual = Array.from({ length: n }, (_, i) => {
    const isParity = (level === 5 && i === n - 1) || (level === 6 && i >= n - 2);
    const isMirror = (level === 1 && i > 0) || (level === 10 && i % 2 === 1);
    const cls = isParity
      ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
      : isMirror
        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
        : 'bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300';
    const role = isParity ? t.parityBlock : isMirror ? t.mirrorBlock : t.dataBlock;
    return `<div class="px-3 py-2 rounded-lg border font-mono text-xs text-center ${cls}">
      <div class="font-bold">Disk ${i + 1}</div>
      <div class="text-[10px]">${role} (${cap} ${unit})</div>
    </div>`;
  }).join('');

  const validLevels = [0, 1, 5, 6, 10].filter((l) => n >= ({ 0: 2, 1: 2, 5: 3, 6: 4, 10: 4 }[l]) && (l !== 10 || n % 2 === 0));
  const compRows = validLevels
    .map((l) => {
      const cm = calcRaidMetrics(l, n, cap);
      const ceff = ((cm.usable / (n * cap)) * 100).toFixed(0);
      return `<tr class="border-t border-slate-200 dark:border-slate-800 ${l === level ? 'bg-cyan-500/10 font-bold' : ''}">
        <td class="px-3 py-1.5 font-mono">RAID ${l}</td>
        <td class="px-3 py-1.5 font-mono">${cm.usable} ${unit}</td>
        <td class="px-3 py-1.5 font-mono">${ceff}%</td>
        <td class="px-3 py-1.5 font-mono">${cm.tol} ${cm.tol === 1 ? t.diskUnit : t.disksUnit}</td>
      </tr>`;
    })
    .join('');

  const summaryHtml = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.usableCap}</div>
        <div class="font-mono font-extrabold text-xl text-cyan-600 dark:text-cyan-400">${m.usable} ${unit}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.parityCap}</div>
        <div class="font-mono font-bold text-amber-600 dark:text-amber-400 text-lg">${m.parity} ${unit}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.efficiency}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">${eff}%</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.faultTol}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-lg">${m.tol} ${m.tol === 1 ? t.diskUnit : t.disksUnit}</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="space-y-4">
      <div class="min-w-0 max-w-full overflow-x-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
        <div class="inline-flex gap-2 whitespace-nowrap">${disksVisual}</div>
      </div>
      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table class="w-full text-xs sm:text-sm whitespace-nowrap">
          <thead class="bg-slate-100 dark:bg-slate-800">
            <tr><th class="px-3 py-2 text-left">RAID</th><th class="px-3 py-2 text-left">${t.usableCap}</th><th class="px-3 py-2 text-left">${t.efficiency}</th><th class="px-3 py-2 text-left">${t.faultTol}</th></tr>
          </thead>
          <tbody>${compRows}</tbody>
        </table>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.raidStep1.replace('{lvl}', level),
      explanation: t.raidStep1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${t.rawCap} = ${n} × ${cap} ${unit} = ${n * cap} ${unit}</div>`
    },
    {
      title: t.raidStep2.replace('{lvl}', level),
      explanation: t.raidStep2Desc.replace('{lvl}', level),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${t.usableCap}: ${m.usable} ${unit} (${eff}%) · ${t.parityCap}: ${m.parity} ${unit} · ${t.faultTol}: ${m.tol}</div>`
    }
  ];

  const copyText = `RAID ${level} (${n}x ${cap} ${unit})\n${t.usableCap}: ${m.usable} ${unit}\n${t.parityCap}: ${m.parity} ${unit}\n${t.efficiency}: ${eff}%\n${t.faultTol}: ${m.tol}`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}

function triadToSym(val, specialBit, isOwnerOrGroup, isSticky) {
  const r = val & 4 ? 'r' : '-';
  const w = val & 2 ? 'w' : '-';
  let x = val & 1 ? 'x' : '-';
  if (specialBit) {
    if (isSticky) x = val & 1 ? 't' : 'T';
    else if (isOwnerOrGroup) x = val & 1 ? 's' : 'S';
  }
  return r + w + x;
}

function solveChmod(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const parts = raw.split(';').map((s) => s.trim());
  let permToken = parts[0] || '755';
  let umaskToken = parts[1] ? parts[1].replace(/umask/i, '').trim() : '022';

  if (/^umask/i.test(permToken)) {
    umaskToken = permToken.replace(/umask/i, '').trim() || '022';
    permToken = '755';
  }

  let special = 0;
  let u = 7, g = 5, o = 5;

  if (/^[0-7]{3,4}$/.test(permToken)) {
    const padded = permToken.padStart(4, '0');
    special = Number(padded[0]);
    u = Number(padded[1]);
    g = Number(padded[2]);
    o = Number(padded[3]);
  } else if (/^[rwxstST-]{9}$/.test(permToken)) {
    const parseTriad = (s) => (s[0] === 'r' ? 4 : 0) + (s[1] === 'w' ? 2 : 0) + (/[xst]/.test(s[2]) ? 1 : 0);
    u = parseTriad(permToken.slice(0, 3));
    g = parseTriad(permToken.slice(3, 6));
    o = parseTriad(permToken.slice(6, 9));
    if (/[sS]/.test(permToken[2])) special |= 4;
    if (/[sS]/.test(permToken[5])) special |= 2;
    if (/[tT]/.test(permToken[8])) special |= 1;
  } else {
    return { ok: false, error: t.errChmod };
  }

  if (!/^[0-7]{3,4}$/.test(umaskToken)) umaskToken = '022';
  const umaskNum = parseInt(umaskToken.slice(-3), 8);
  const filePerm = (0o666 & ~umaskNum) & 0o777;
  const dirPerm = (0o777 & ~umaskNum) & 0o777;

  const octalStr = special > 0 ? `${special}${u}${g}${o}` : `${u}${g}${o}`;
  const symStr = triadToSym(u, special & 4, true, false) + triadToSym(g, special & 2, true, false) + triadToSym(o, special & 1, false, true);
  const binStr = `${u.toString(2).padStart(3, '0')} ${g.toString(2).padStart(3, '0')} ${o.toString(2).padStart(3, '0')}`;

  const renderCheckRow = (label, val, shift) => {
    const bits = [4, 2, 1];
    return `<tr class="border-t border-slate-200 dark:border-slate-800">
      <td class="px-3 py-2 font-semibold text-xs sm:text-sm">${label}</td>
      ${bits
        .map((b) => {
          const on = (val & b) !== 0;
          return `<td class="px-3 py-2 text-center">
            <button type="button" data-chmod-toggle="${shift}:${b}" data-chmod-oct="${special}${u}${g}${o}" data-chmod-umask="${umaskToken}" class="w-8 h-7 rounded border font-mono text-xs font-bold ${
              on ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
            }">${on ? '✓' : '—'}</button>
          </td>`;
        })
        .join('')}
      <td class="px-3 py-2 font-mono font-bold text-center text-cyan-600 dark:text-cyan-400">${val}</td>
    </tr>`;
  };

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.octalLabel}</div>
        <div class="font-mono font-extrabold text-2xl text-cyan-600 dark:text-cyan-400">${octalStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.symLabel}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xl">${symStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.binLabel}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-base">${binStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.cmdLabel}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">chmod ${octalStr} archivo</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table class="w-full text-xs sm:text-sm whitespace-nowrap">
          <thead class="bg-slate-100 dark:bg-slate-800 font-mono">
            <tr><th class="px-3 py-2 text-left">chmod</th><th class="px-3 py-2 text-center">r (4)</th><th class="px-3 py-2 text-center">w (2)</th><th class="px-3 py-2 text-center">x (1)</th><th class="px-3 py-2 text-center">Oct</th></tr>
          </thead>
          <tbody>
            ${renderCheckRow(t.owner, u, 'u')}
            ${renderCheckRow(t.group, g, 'g')}
            ${renderCheckRow(t.others, o, 'o')}
          </tbody>
        </table>
      </div>
      <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 space-y-2">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${t.umaskTitle.replace('{u}', umaskToken)}</div>
        <div class="font-mono text-xs sm:text-sm">${t.umaskFiles.replace('{u}', umaskToken)}: <span class="font-bold text-cyan-600 dark:text-cyan-400">${filePerm.toString(8).padStart(3, '0')}</span> (${triadToSym((filePerm >> 6) & 7) + triadToSym((filePerm >> 3) & 7) + triadToSym(filePerm & 7)})</div>
        <div class="font-mono text-xs sm:text-sm">${t.umaskDirs.replace('{u}', umaskToken)}: <span class="font-bold text-emerald-600 dark:text-emerald-400">${dirPerm.toString(8).padStart(3, '0')}</span> (${triadToSym((dirPerm >> 6) & 7) + triadToSym((dirPerm >> 3) & 7) + triadToSym(dirPerm & 7)})</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.chmodStep1,
      explanation: t.chmodStep1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${octalStr} → ${binStr} → ${symStr}</div>`
    },
    {
      title: t.chmodStep2,
      explanation: t.chmodStep2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">666 &amp; ~${umaskToken} = ${filePerm.toString(8).padStart(3, '0')} · 777 &amp; ~${umaskToken} = ${dirPerm.toString(8).padStart(3, '0')}</div>`
    }
  ];

  const copyText = `chmod ${octalStr} (${symStr})\nBinary: ${binStr}\numask ${umaskToken}: files ${filePerm.toString(8).padStart(3, '0')}, dirs ${dirPerm.toString(8).padStart(3, '0')}`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}

export function solveRaidChmod(input, mode = 'raid', lang = 'es') {
  const raw = (input || '').trim();
  if (!raw) return solveChmod('755 ; umask 022', lang);
  if (mode === 'chmod' || !/raid/i.test(raw)) {
    if (/raid/i.test(raw)) return solveRaid(raw, lang);
    return solveChmod(raw, lang);
  }
  return solveRaid(raw, lang);
}
