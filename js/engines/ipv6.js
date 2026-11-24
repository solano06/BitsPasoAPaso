const TEXT = {
  es: {
    errIpv6: 'Dirección IPv6 inválida. Ejemplo: 2001:0db8:0000:0000:0000:ff00:0042:8329/48',
    errMac: 'Dirección MAC inválida. Ejemplo: 00:1A:2B:3C:4D:5E',
    compressed: 'Forma comprimida (RFC 5952)',
    expanded: 'Forma expandida (128 bits)',
    addrType: 'Clasificación',
    netRange: 'Rango de red',
    subnets64: 'Subredes /64 disponibles',
    globalPrefix: 'Prefijo Global',
    subnetId: 'Subnet ID',
    ifaceId: 'Interface ID (64 bits)',
    firstSubnets: 'Primeras subredes generadas (/{target})',
    step1V6: 'Paso 1: Expansión completa de los 8 hextetos (32 dígitos hex)',
    step1V6Desc: 'Rellenamos cada hexteto con ceros a la izquierda hasta 4 dígitos y expandimos ::.',
    step2V6: 'Paso 2: Compresión canónica según RFC 5952',
    step2V6Desc: 'Eliminamos ceros a la izquierda y comprimimos la secuencia más larga de 0000 consecutivos (≥ 2) en ::.',
    step3V6: 'Paso 3: Rango de red y capacidad de subredes /64',
    step3V6Desc: 'Con prefijo /{p}, quedan {subBits} bits para Subnet ID antes del límite /64 (2^{subBits} subredes /64).',
    euiTitle: 'Dirección IPv6 EUI-64 resultante',
    euiIface: 'Interface ID (64 bits)',
    euiStep1: 'Paso 1: División de la MAC en dos bloques de 24 bits e inserción de FF:FE',
    euiStep1Desc: 'Partimos la MAC de 48 bits por la mitad e insertamos 0xFFFE en el centro para alcanzar 64 bits.',
    euiStep2: 'Paso 2: Inversión del 7.º bit (bit U/L, XOR 0x02)',
    euiStep2Desc: 'Invertimos el bit Universal/Local del primer octeto para indicar identificador modificado.',
    euiStep3: 'Paso 3: Combinación con el prefijo y compresión RFC 5952',
    euiStep3Desc: 'Unimos el prefijo de red de 64 bits con el Interface ID generado.'
  },
  en: {
    errIpv6: 'Invalid IPv6 address. Example: 2001:0db8:0000:0000:0000:ff00:0042:8329/48',
    errMac: 'Invalid MAC address. Example: 00:1A:2B:3C:4D:5E',
    compressed: 'Compressed form (RFC 5952)',
    expanded: 'Expanded form (128-bit)',
    addrType: 'Address Scope',
    netRange: 'Network Range',
    subnets64: 'Available /64 Subnets',
    globalPrefix: 'Global Prefix',
    subnetId: 'Subnet ID',
    ifaceId: 'Interface ID (64-bit)',
    firstSubnets: 'First generated subnets (/{target})',
    step1V6: 'Step 1: Full expansion to 8 hextets (32 hex digits)',
    step1V6Desc: 'Pad each hextet to 4 hex digits and expand ::.',
    step2V6: 'Step 2: Canonical RFC 5952 compression',
    step2V6Desc: 'Strip leading zeros and compress the longest leftmost run of consecutive 0000 hextets (≥ 2) to ::.',
    step3V6: 'Step 3: Network range & /64 subnet capacity',
    step3V6Desc: 'With prefix /{p}, {subBits} bits remain for Subnet ID before /64 (2^{subBits} /64 subnets).',
    euiTitle: 'Resulting EUI-64 IPv6 Address',
    euiIface: 'Interface ID (64-bit)',
    euiStep1: 'Step 1: Split MAC into two 24-bit halves & insert FF:FE',
    euiStep1Desc: 'Split the 48-bit MAC in half and insert 0xFFFE in the middle to reach 64 bits.',
    euiStep2: 'Step 2: Flip the 7th bit (U/L bit, XOR 0x02)',
    euiStep2Desc: 'Invert the Universal/Local bit of the first octet.',
    euiStep3: 'Step 3: Combine with prefix & RFC 5952 compress',
    euiStep3Desc: 'Join the 64-bit network prefix with the generated Interface ID.'
  },
  fr: {
    errIpv6: 'Adresse IPv6 invalide. Exemple : 2001:0db8:0000:0000:0000:ff00:0042:8329/48',
    errMac: 'Adresse MAC invalide. Exemple : 00:1A:2B:3C:4D:5E',
    compressed: 'Forme compressée (RFC 5952)',
    expanded: 'Forme étendue (128 bits)',
    addrType: 'Classification',
    netRange: 'Plage réseau',
    subnets64: 'Sous-réseaux /64 disponibles',
    globalPrefix: 'Préfixe Global',
    subnetId: 'Subnet ID',
    ifaceId: 'Interface ID (64 bits)',
    firstSubnets: 'Premiers sous-réseaux générés (/{target})',
    step1V6: 'Étape 1 : Expansion complète en 8 hextets (32 hex)',
    step1V6Desc: 'Complément à 4 chiffres par hextet et expansion de ::.',
    step2V6: 'Étape 2 : Compression canonique selon RFC 5952',
    step2V6Desc: 'Suppression des zéros initiaux et compression de la plus longue suite de 0000 (≥ 2) en ::.',
    step3V6: 'Étape 3 : Plage réseau et capacité /64',
    step3V6Desc: 'Avec /{p}, il reste {subBits} bits pour le Subnet ID avant /64 (2^{subBits} sous-réseaux /64).',
    euiTitle: 'Adresse IPv6 EUI-64 obtenue',
    euiIface: 'Interface ID (64 bits)',
    euiStep1: 'Étape 1 : Découpage de la MAC (2×24 bits) et insertion de FF:FE',
    euiStep1Desc: 'Séparation de l’adresse MAC en deux moitiés et insertion de 0xFFFE au centre.',
    euiStep2: 'Étape 2 : Inversion du 7e bit (bit U/L, XOR 0x02)',
    euiStep2Desc: 'Inversion du bit Universel/Local du premier octet.',
    euiStep3: 'Étape 3 : Assemblage avec le préfixe et compression RFC 5952',
    euiStep3Desc: 'Combinaison du préfixe réseau 64 bits et de l’Interface ID.'
  }
};

export function parseIpv6ToBigInt(addr) {
  const s = addr.trim().toLowerCase();
  if (!s) return null;
  const parts = s.split('::');
  if (parts.length > 2) return null;

  let groups = [];
  if (parts.length === 2) {
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    const missing = 8 - (left.length + right.length);
    if (missing < 1) return null;
    groups = [...left, ...new Array(missing).fill('0'), ...right];
  } else {
    groups = s.split(':');
    if (groups.length !== 8) return null;
  }

  let res = 0n;
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/.test(g)) return null;
    res = (res << 16n) | BigInt(parseInt(g, 16));
  }
  return res;
}

function bigIntToExpanded(val) {
  const hex = val.toString(16).padStart(32, '0');
  return hex.match(/.{4}/g).join(':');
}

export function compressIpv6Rfc5952(val) {
  const hex = val.toString(16).padStart(32, '0');
  const groups = hex.match(/.{4}/g).map((g) => g.replace(/^0+/, '') || '0');

  let bestStart = -1;
  let bestLen = 0;
  let curStart = -1;
  let curLen = 0;

  for (let i = 0; i < 8; i++) {
    if (groups[i] === '0') {
      if (curStart === -1) curStart = i;
      curLen++;
      if (curLen > bestLen) {
        bestLen = curLen;
        bestStart = curStart;
      }
    } else {
      curStart = -1;
      curLen = 0;
    }
  }

  if (bestLen < 2) return groups.join(':');
  const left = groups.slice(0, bestStart).join(':');
  const right = groups.slice(bestStart + bestLen).join(':');
  return `${left}::${right}`;
}

function classifyIpv6(val) {
  if (val === 0n) return 'Unspecified (::/128)';
  if (val === 1n) return 'Loopback (::1/128)';
  const first16 = Number(val >> 112n);
  const first32 = Number(val >> 96n);
  if (first32 === 0x20010db8) return 'Documentation (2001:db8::/32)';
  if ((first16 & 0xff00) === 0xff00) return 'Multicast (ff00::/8)';
  if ((first16 & 0xffc0) === 0xfe80) return 'Link-Local Unicast (fe80::/10)';
  if ((first16 & 0xfe00) === 0xfc00) return 'Unique Local (fc00::/7)';
  if ((first16 & 0xe000) === 0x2000) return 'Global Unicast (2000::/3)';
  return 'Reserved / Other';
}

function solveAnalyze(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const [addrSection, targetSection] = raw.split(';').map((s) => s.trim());
  const [ipPart, prefPart] = addrSection.split('/');
  const val = parseIpv6ToBigInt(ipPart || '');
  if (val === null) return { ok: false, error: t.errIpv6 };

  const prefix = prefPart !== undefined ? Number(prefPart) : 64;
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 128) {
    return { ok: false, error: t.errIpv6 };
  }

  const targetPrefix = targetSection ? Number(targetSection.replace('/', '')) : null;
  const allOnes = (1n << 128n) - 1n;
  const hostBits = 128 - prefix;
  const mask = hostBits === 128 ? 0n : allOnes ^ ((1n << BigInt(hostBits)) - 1n);
  const netVal = val & mask;
  const endVal = netVal | ((1n << BigInt(hostBits)) - 1n);

  const expanded = bigIntToExpanded(val);
  const compressed = compressIpv6Rfc5952(val);
  const netCompressed = compressIpv6Rfc5952(netVal);
  const endCompressed = compressIpv6Rfc5952(endVal);
  const scope = classifyIpv6(val);

  const subBits = Math.max(0, 64 - prefix);
  const subnets64 = prefix <= 64 ? (1n << BigInt(subBits)).toLocaleString() : '0';

  let subnetsHtml = '';
  if (targetPrefix !== null && Number.isInteger(targetPrefix) && targetPrefix > prefix && targetPrefix <= 128) {
    const step = 1n << BigInt(128 - targetPrefix);
    const totalSub = 1n << BigInt(targetPrefix - prefix);
    const showCount = totalSub < 8n ? Number(totalSub) : 8;
    const rows = [];
    for (let i = 0; i < showCount; i++) {
      const sNet = netVal + step * BigInt(i);
      rows.push(`<div class="font-mono text-xs">${i + 1}. ${compressIpv6Rfc5952(sNet)}/${targetPrefix}</div>`);
    }
    subnetsHtml = `<div class="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
      <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">${t.firstSubnets.replace('{target}', targetPrefix)}</div>
      <div class="space-y-1">${rows.join('')}</div>
    </div>`;
  }

  const globalPct = Math.min(64, prefix) / 128 * 100;
  const subPct = Math.max(0, Math.min(64, prefix <= 64 ? 64 - prefix : 0)) / 128 * 100;
  const ifacePct = 50;

  const summaryHtml = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.compressed}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-lg break-all">${compressed}/${prefix}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.addrType}</div>
        <div class="font-semibold text-slate-900 dark:text-slate-100 text-base">${scope}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.netRange}</div>
        <div class="font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all">${netCompressed} .. ${endCompressed}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.subnets64}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">${subnets64}</div>
      </div>
    </div>
    ${subnetsHtml}
  `;

  const visualHtml = `
    <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-2">
      <div class="w-full h-6 rounded-lg overflow-hidden flex text-[10px] font-mono font-bold text-white">
        <div class="bg-cyan-600 flex items-center justify-center px-1" style="width:${globalPct}%">${t.globalPrefix} (/${Math.min(64, prefix)})</div>
        ${subPct > 0 ? `<div class="bg-amber-500 flex items-center justify-center px-1" style="width:${subPct}%">${t.subnetId} (${subBits}b)</div>` : ''}
        <div class="bg-emerald-600 flex items-center justify-center px-1" style="width:${ifacePct}%">${t.ifaceId}</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1V6,
      explanation: t.step1V6Desc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs sm:text-sm whitespace-nowrap">${expanded}</div>`
    },
    {
      title: t.step2V6,
      explanation: t.step2V6Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 break-all">${compressed}</div>`
    },
    {
      title: t.step3V6,
      explanation: t.step3V6Desc.replace('{p}', prefix).replace(/\{subBits\}/g, subBits),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1 break-all">
        <div>${t.netRange}: ${netCompressed} .. ${endCompressed}</div>
        <div>${t.subnets64}: ${subnets64}</div>
      </div>`
    }
  ];

  const copyText = `IPv6: ${compressed}/${prefix}\nExpanded: ${expanded}\nScope: ${scope}\nRange: ${netCompressed} .. ${endCompressed}`;
  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}

function solveEui64(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const [macSection, prefSection] = raw.split(';').map((s) => s.trim());
  const hexDigits = (macSection || '').replace(/[:\-.]/g, '').toLowerCase();
  if (!/^[0-9a-f]{12}$/.test(hexDigits)) return { ok: false, error: t.errMac };

  const prefixInput = prefSection || 'fe80::/64';
  const [prefIp] = prefixInput.split('/');
  const prefVal = parseIpv6ToBigInt(prefIp);
  if (prefVal === null) return { ok: false, error: t.errIpv6 };

  const bytes = [];
  for (let i = 0; i < 12; i += 2) bytes.push(parseInt(hexDigits.slice(i, i + 2), 16));

  const origFirst = bytes[0];
  const flippedFirst = origFirst ^ 0x02;
  const euiBytes = [flippedFirst, bytes[1], bytes[2], 0xff, 0xfe, bytes[3], bytes[4], bytes[5]];

  let ifaceVal = 0n;
  for (const b of euiBytes) ifaceVal = (ifaceVal << 8n) | BigInt(b);

  const netMask64 = ((1n << 64n) - 1n) << 64n;
  const fullIpv6 = (prefVal & netMask64) | ifaceVal;
  const compressed = compressIpv6Rfc5952(fullIpv6);
  const ifaceStr = ifaceVal.toString(16).padStart(16, '0').match(/.{4}/g).join(':');

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.euiTitle}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-lg break-all">${compressed}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.euiIface}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">${ifaceStr}</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.euiStep1,
      explanation: t.euiStep1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${hexDigits.slice(0, 6).match(/.{2}/g).join(':')} + <span class="text-cyan-600 dark:text-cyan-400 font-bold">ff:fe</span> + ${hexDigits.slice(6).match(/.{2}/g).join(':')}</div>`
    },
    {
      title: t.euiStep2,
      explanation: t.euiStep2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">0x${origFirst.toString(16).padStart(2, '0')} (${origFirst.toString(2).padStart(8, '0')}) XOR 00000010 = 0x${flippedFirst.toString(16).padStart(2, '0')} (${flippedFirst.toString(2).padStart(8, '0')})</div>`
    },
    {
      title: t.euiStep3,
      explanation: t.euiStep3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 break-all">${compressed}</div>`
    }
  ];

  return { ok: true, summaryHtml, steps, copyText: `IPv6 EUI-64: ${compressed}\nInterface ID: ${ifaceStr}` };
}

export function solveIpv6(input, mode = 'analyze', lang = 'es') {
  const raw = (input || '').trim();
  if (!raw) return { ok: false, error: (TEXT[lang] || TEXT.es).errIpv6 };
  if (mode === 'eui64' || (/^[0-9a-fA-F]{2}([:\-.][0-9a-fA-F]{2}){5}/.test(raw) && !raw.includes('::'))) {
    return solveEui64(raw, lang);
  }
  return solveAnalyze(raw, lang);
}
