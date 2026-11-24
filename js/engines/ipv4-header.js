const TEXT = {
  es: {
    errHex: 'Cabecera IPv4 hexadecimal inválida (mínimo 20 bytes / 40 caracteres hex, Version=4, IHL>=5).',
    errBuild: 'Formato constructor inválido. Usa: IP_orig ; IP_dest ; TTL ; Proto ; Longitud (ej. 192.168.0.1 ; 192.168.0.199 ; 64 ; 17 ; 115).',
    validBadge: 'Checksum VÁLIDO (0xFFFF → ~0x0000)',
    corruptBadge: 'Checksum CORRUPTO (esperado: {exp})',
    computedLabel: 'Checksum calculado',
    receivedLabel: 'Checksum recibido',
    protoLabel: 'Protocolo',
    srcDstLabel: 'Origen → Destino',
    step1: 'Paso 1: División en palabras de 16 bits',
    step1Desc: 'Agrupamos los {bytes} bytes (IHL={ihl}) en palabras de 16 bits.',
    step2: 'Paso 2: Suma en complemento a 1 y plegado de acarreos (end-around carry)',
    step2Desc: 'Sumamos todas las palabras (con checksum=0x0000 para calcular, o incluido para verificar) y sumamos el acarreo superior.',
    step3: 'Paso 3: Complemento a 1 final y validación',
    step3Desc: 'Aplicamos NOT bit a bit (~suma_16) para obtener el checksum RFC 791.'
  },
  en: {
    errHex: 'Invalid hex IPv4 header (minimum 20 bytes / 40 hex chars, Version=4, IHL>=5).',
    errBuild: 'Invalid builder format. Use: Src_IP ; Dst_IP ; TTL ; Proto ; Length (e.g. 192.168.0.1 ; 192.168.0.199 ; 64 ; 17 ; 115).',
    validBadge: 'VALID Checksum (0xFFFF → ~0x0000)',
    corruptBadge: 'CORRUPTED Checksum (expected: {exp})',
    computedLabel: 'Computed Checksum',
    receivedLabel: 'Received Checksum',
    protoLabel: 'Protocol',
    srcDstLabel: 'Source → Destination',
    step1: 'Step 1: Split into 16-bit words',
    step1Desc: 'Group the {bytes} header bytes (IHL={ihl}) into 16-bit words.',
    step2: "Step 2: 1's complement sum & end-around carry folding",
    step2Desc: 'Sum all 16-bit words and fold upper carry bits back into the lower 16 bits.',
    step3: "Step 3: Final 1's complement & validation",
    step3Desc: 'Bitwise NOT (~sum_16) yields the RFC 791 header checksum.'
  },
  fr: {
    errHex: 'En-tête IPv4 hexadécimal invalide (min 20 octets / 40 hex, Version=4, IHL>=5).',
    errBuild: 'Format invalide. Utilisez : IP_src ; IP_dst ; TTL ; Proto ; Longueur.',
    validBadge: 'Checksum VALIDE (0xFFFF → ~0x0000)',
    corruptBadge: 'Checksum CORROMPU (attendu : {exp})',
    computedLabel: 'Checksum calculé',
    receivedLabel: 'Checksum reçu',
    protoLabel: 'Protocole',
    srcDstLabel: 'Source → Destination',
    step1: 'Étape 1 : Découpage en mots de 16 bits',
    step1Desc: 'Groupement des {bytes} octets (IHL={ihl}) en mots de 16 bits.',
    step2: 'Étape 2 : Somme en complément à 1 et retenue circulaire',
    step2Desc: 'Somme des mots de 16 bits et réinjection de la retenue.',
    step3: 'Étape 3 : Complément à 1 final et validation',
    step3Desc: 'Inversion bit à bit (~somme_16) pour obtenir le checksum RFC 791.'
  }
};

const PROTOS = { 1: 'ICMP', 2: 'IGMP', 6: 'TCP', 17: 'UDP', 47: 'GRE', 50: 'ESP', 89: 'OSPF' };

function ipToHex(ip) {
  const parts = ip.trim().split('.');
  if (parts.length !== 4 || parts.some((p) => !/^\d+$/.test(p) || Number(p) > 255)) return null;
  return parts.map((p) => Number(p).toString(16).padStart(2, '0')).join('');
}

function onesComplementChecksum(words) {
  let sum = 0;
  for (const w of words) sum += w;
  const rawSum = sum;
  while (sum > 0xffff) {
    sum = (sum & 0xffff) + (sum >>> 16);
  }
  return { rawSum, folded: sum, checksum: (~sum) & 0xffff };
}

export function solveIpv4Header(input, mode = 'decode', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const raw = (input || '').trim();
  let hex = '';

  if (mode === 'build' || raw.includes(';')) {
    const parts = raw.split(';').map((s) => s.trim());
    if (parts.length < 5) return { ok: false, error: t.errBuild };
    const srcHex = ipToHex(parts[0]);
    const dstHex = ipToHex(parts[1]);
    const ttl = Number(parts[2]);
    const proto = Number(parts[3]);
    const len = Number(parts[4]);
    if (!srcHex || !dstHex || !Number.isInteger(ttl) || !Number.isInteger(proto) || !Number.isInteger(len)) {
      return { ok: false, error: t.errBuild };
    }
    const baseHex =
      '4500' +
      len.toString(16).padStart(4, '0') +
      '0000' +
      '4000' +
      ttl.toString(16).padStart(2, '0') +
      proto.toString(16).padStart(2, '0') +
      '0000' +
      srcHex +
      dstHex;
    const words = baseHex.match(/.{4}/g).map((h) => parseInt(h, 16));
    const { checksum } = onesComplementChecksum(words);
    hex = baseHex.slice(0, 20) + checksum.toString(16).padStart(4, '0') + baseHex.slice(24);
  } else {
    hex = raw.replace(/[\s:.-]/g, '').toLowerCase();
  }

  if (!/^[0-9a-f]+$/.test(hex) || hex.length < 40 || hex.length % 2 !== 0) {
    return { ok: false, error: t.errHex };
  }

  const version = parseInt(hex[0], 16);
  const ihl = parseInt(hex[1], 16);
  const hdrBytes = ihl * 4;
  if (version !== 4 || ihl < 5 || hex.length < hdrBytes * 2) {
    return { ok: false, error: t.errHex };
  }

  const hdrHex = hex.slice(0, hdrBytes * 2);
  const words = hdrHex.match(/.{4}/g).map((h) => parseInt(h, 16));
  const receivedChecksum = words[5];

  const wordsZero = [...words];
  wordsZero[5] = 0;
  const calc = onesComplementChecksum(wordsZero);
  const verify = onesComplementChecksum(words);

  const isValid = verify.folded === 0xffff || receivedChecksum === calc.checksum;
  const computedHex = '0x' + calc.checksum.toString(16).toUpperCase().padStart(4, '0');
  const receivedHex = '0x' + receivedChecksum.toString(16).toUpperCase().padStart(4, '0');

  const dscpEcn = parseInt(hdrHex.slice(2, 4), 16);
  const totalLen = words[1];
  const idHex = '0x' + words[2].toString(16).toUpperCase().padStart(4, '0');
  const flagsOff = words[3];
  const df = (flagsOff & 0x4000) !== 0;
  const mf = (flagsOff & 0x2000) !== 0;
  const fragOff = flagsOff & 0x1fff;
  const ttl = words[4] >> 8;
  const protoNum = words[4] & 0xff;
  const protoName = PROTOS[protoNum] ? `${protoNum} (${PROTOS[protoNum]})` : String(protoNum);

  const ipFmt = (w1, w2) => `${w1 >> 8}.${w1 & 255}.${w2 >> 8}.${w2 & 255}`;
  const srcIp = ipFmt(words[6], words[7]);
  const dstIp = ipFmt(words[8], words[9]);

  const summaryHtml = `
    <div class="space-y-3">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div class="text-xs text-slate-500">${t.computedLabel}</div>
          <div class="font-mono font-extrabold text-xl text-cyan-600 dark:text-cyan-400">${computedHex}</div>
        </div>
        <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div class="text-xs text-slate-500">${t.receivedLabel}</div>
          <div class="font-mono font-bold text-lg">${receivedHex}</div>
        </div>
        <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div class="text-xs text-slate-500">TTL · ${t.protoLabel}</div>
          <div class="font-mono font-bold text-base">${ttl} · ${protoName}</div>
        </div>
        <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div class="text-xs text-slate-500">${t.srcDstLabel}</div>
          <div class="font-mono font-bold text-xs sm:text-sm">${srcIp} → ${dstIp}</div>
        </div>
      </div>
      <div class="inline-block px-3 py-1 rounded-full text-xs font-bold border ${isValid ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300'}">
        ${isValid ? t.validBadge : t.corruptBadge.replace('{exp}', computedHex)}
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="space-y-4">
      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
        <div class="grid grid-cols-32 gap-px text-[10px] font-mono text-center min-w-[540px]">
          <div class="col-span-4 p-2 rounded bg-cyan-500/15 border border-cyan-500/30 font-bold">Ver: ${version}</div>
          <div class="col-span-4 p-2 rounded bg-cyan-500/15 border border-cyan-500/30 font-bold">IHL: ${ihl} (${hdrBytes}B)</div>
          <div class="col-span-8 p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">DSCP/ECN: 0x${dscpEcn.toString(16).padStart(2, '0')}</div>
          <div class="col-span-16 p-2 rounded bg-emerald-500/15 border border-emerald-500/30 font-bold">Total Length: ${totalLen}</div>

          <div class="col-span-16 p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">ID: ${idHex}</div>
          <div class="col-span-3 p-2 rounded bg-amber-500/15 border border-amber-500/30">DF=${df ? 1 : 0} MF=${mf ? 1 : 0}</div>
          <div class="col-span-13 p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">Offset: ${fragOff}</div>

          <div class="col-span-8 p-2 rounded bg-violet-500/15 border border-violet-500/30 font-bold">TTL: ${ttl}</div>
          <div class="col-span-8 p-2 rounded bg-violet-500/15 border border-violet-500/30 font-bold">Proto: ${protoName}</div>
          <div class="col-span-16 p-2 rounded bg-cyan-500/15 border border-cyan-500/30 font-bold">Checksum: ${receivedHex}</div>

          <div class="col-span-32 p-2 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold">Source IP: ${srcIp}</div>
          <div class="col-span-32 p-2 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold">Destination IP: ${dstIp}</div>
        </div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1,
      explanation: t.step1Desc.replace('{bytes}', hdrBytes).replace('{ihl}', ihl),
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs whitespace-nowrap">${wordsZero.map((w) => w.toString(16).toUpperCase().padStart(4, '0')).join(' + ')}</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">Raw Sum = 0x${calc.rawSum.toString(16).toUpperCase()} → Folded = 0x${calc.folded.toString(16).toUpperCase().padStart(4, '0')}</div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">~0x${calc.folded.toString(16).toUpperCase().padStart(4, '0')} = <span class="font-bold text-cyan-600 dark:text-cyan-400">${computedHex}</span></div>`
    }
  ];

  const copyText = `IPv4 Header: Version=${version}, IHL=${ihl} (${hdrBytes}B), TTL=${ttl}, Protocol=${protoName}, Src=${srcIp}, Dst=${dstIp}, Checksum=${computedHex}, Valid=${isValid}`;
  const csvText = `Field,Value\nVersion,${version}\nIHL,${ihl}\nTotalLength,${totalLen}\nTTL,${ttl}\nProtocol,${protoName}\nSrc,${srcIp}\nDst,${dstIp}\nChecksum,${computedHex}\nValid,${isValid}`;
  const latexText = `\\text{Checksum} = \\sim\\texttt{0x${calc.folded.toString(16).toUpperCase()}} = \\texttt{${computedHex}}`;

  return { ok: true, summaryHtml, visualHtml, steps, copyText, csvText, latexText };
}
