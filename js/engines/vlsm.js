function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255
  ].join('.');
}

function intToBinOctets(n) {
  return [
    ((n >>> 24) & 255).toString(2).padStart(8, '0'),
    ((n >>> 16) & 255).toString(2).padStart(8, '0'),
    ((n >>> 8) & 255).toString(2).padStart(8, '0'),
    (n & 255).toString(2).padStart(8, '0')
  ];
}

function prefixToMask(prefix) {
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

function getIpClass(firstOctet) {
  if (firstOctet < 128) return 'A';
  if (firstOctet < 192) return 'B';
  if (firstOctet < 224) return 'C';
  if (firstOctet < 240) return 'D (Multicast)';
  return 'E (Experimental)';
}

function isPrivateIp(ipInt) {
  const a = (ipInt >>> 24) & 255;
  const b = (ipInt >>> 16) & 255;
  if (a === 10) return 'RFC 1918 (10.0.0.0/8)';
  if (a === 172 && b >= 16 && b <= 31) return 'RFC 1918 (172.16.0.0/12)';
  if (a === 192 && b === 168) return 'RFC 1918 (192.168.0.0/16)';
  return null;
}

function renderColoredBits(ipInt, prefix) {
  const octets = intToBinOctets(ipInt);
  let bitIdx = 0;
  return octets
    .map((oct) => {
      const spans = oct
        .split('')
        .map((b) => {
          const isNet = bitIdx < prefix;
          bitIdx++;
          const cls = isNet
            ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/10'
            : 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10';
          return `<span class="inline-block px-0.5 rounded ${cls}">${b}</span>`;
        })
        .join('');
      return `<span class="inline-flex gap-px">${spans}</span>`;
    })
    .join('<span class="mx-1 text-slate-400">.</span>');
}

const TEXT = {
  es: {
    errFormat: 'Formato inválido. Usa IP/CIDR (ej. 192.168.10.45/26) o Red/CIDR ; hosts (ej. 192.168.1.0/24 ; 100, 50, 25).',
    errIp: 'Dirección IPv4 inválida.',
    errPrefix: 'El prefijo CIDR debe estar entre /0 y /32.',
    errHosts: 'Introduce al menos un requisito de hosts válido (entero > 0).',
    errOverflow: 'Desbordamiento: la subred "{name}" ({req} hosts, necesita /{prefix}) excede el bloque padre {parent}.',
    netAddr: 'Dirección de Red',
    mask: 'Máscara de Subred',
    wildcard: 'Máscara Wildcard',
    bcast: 'Dirección Broadcast',
    range: 'Rango Utilizable',
    usableHosts: 'Hosts Útiles',
    totalAddrs: 'Direcciones Totales',
    ipClass: 'Clase / Tipo',
    privateLabel: 'Privada',
    publicLabel: 'Pública',
    netBits: 'Bits de red',
    hostBits: 'Bits de host',
    step1Single: 'Paso 1: Representación binaria alineada bit a bit',
    step1SingleDesc: 'Separamos los 32 bits en /{p} bits de red (cian) y {h} bits de host (esmeralda).',
    step2Single: 'Paso 2: Dirección de Red (IP AND Máscara)',
    step2SingleDesc: 'Aplicamos el operador lógico AND bit a bit entre la IP y la máscara de subred.',
    step3Single: 'Paso 3: Máscara Wildcard y Broadcast (Red OR Wildcard)',
    step3SingleDesc: 'La máscara wildcard invierte los bits de la máscara. Al hacer OR con la red, todos los bits de host pasan a 1.',
    step4Single: 'Paso 4: Rango utilizable, hosts totales y clasificación',
    step4SingleDesc: 'Calculamos 2^{h} - 2 direcciones utilizables (primera = Red + 1, última = Broadcast - 1).',
    vlsmTitle: 'Planificación VLSM para {parent}',
    vlsmSub: '{count} subredes asignadas · {used} / {total} direcciones usadas ({pct}%)',
    colName: 'Subred',
    colReq: 'Solicitados',
    colUsable: 'Útiles',
    colNet: 'Red / CIDR',
    colMask: 'Máscara',
    colRange: 'Rango útil',
    colBcast: 'Broadcast',
    vlsmStep1: 'Paso 1: Ordenación de requisitos de mayor a menor',
    vlsmStep1Desc: 'Ordenar descendentemente evita la fragmentación y garantiza alineación en potencias de 2.',
    vlsmStep2: 'Paso 2: Cálculo de prefijo y salto de bloque por subred',
    vlsmStep2Desc: 'Para cada subred buscamos el menor h tal que 2^h - 2 >= hosts solicitados; nuevo prefijo = 32 - h.',
    vlsmStep3: 'Paso 3: Verificación de capacidad del bloque padre',
    vlsmStep3Desc: 'Se utilizaron {used} de {total} direcciones disponibles ({pct}% de ocupación).'
  },
  en: {
    errFormat: 'Invalid format. Use IP/CIDR (e.g. 192.168.10.45/26) or Network/CIDR ; hosts (e.g. 192.168.1.0/24 ; 100, 50, 25).',
    errIp: 'Invalid IPv4 address.',
    errPrefix: 'CIDR prefix must be between /0 and /32.',
    errHosts: 'Enter at least one valid host requirement (integer > 0).',
    errOverflow: 'Overflow: subnet "{name}" ({req} hosts, needs /{prefix}) exceeds parent block {parent}.',
    netAddr: 'Network Address',
    mask: 'Subnet Mask',
    wildcard: 'Wildcard Mask',
    bcast: 'Broadcast Address',
    range: 'Usable Range',
    usableHosts: 'Usable Hosts',
    totalAddrs: 'Total Addresses',
    ipClass: 'Class / Scope',
    privateLabel: 'Private',
    publicLabel: 'Public',
    netBits: 'Network bits',
    hostBits: 'Host bits',
    step1Single: 'Step 1: Bit-aligned binary representation',
    step1SingleDesc: 'We split the 32 bits into /{p} network bits (cyan) and {h} host bits (emerald).',
    step2Single: 'Step 2: Network Address (IP AND Mask)',
    step2SingleDesc: 'Apply bitwise AND between the IP address and the subnet mask.',
    step3Single: 'Step 3: Wildcard Mask & Broadcast (Network OR Wildcard)',
    step3SingleDesc: 'The wildcard mask is the bitwise inverse of the subnet mask. ORing with Network sets all host bits to 1.',
    step4Single: 'Step 4: Usable range, host count, and classification',
    step4SingleDesc: 'Compute 2^{h} - 2 usable addresses (first = Network + 1, last = Broadcast - 1).',
    vlsmTitle: 'VLSM Plan for {parent}',
    vlsmSub: '{count} subnets allocated · {used} / {total} addresses used ({pct}%)',
    colName: 'Subnet',
    colReq: 'Requested',
    colUsable: 'Usable',
    colNet: 'Network / CIDR',
    colMask: 'Mask',
    colRange: 'Usable Range',
    colBcast: 'Broadcast',
    vlsmStep1: 'Step 1: Sort requirements descending',
    vlsmStep1Desc: 'Sorting largest-first prevents fragmentation and preserves power-of-2 block alignment.',
    vlsmStep2: 'Step 2: Prefix and block size calculation per subnet',
    vlsmStep2Desc: 'Find smallest h such that 2^h - 2 >= requested hosts; new prefix = 32 - h.',
    vlsmStep3: 'Step 3: Parent block capacity verification',
    vlsmStep3Desc: 'Allocated {used} out of {total} available addresses ({pct}% utilization).'
  },
  fr: {
    errFormat: 'Format invalide. Utilisez IP/CIDR (ex. 192.168.10.45/26) ou Réseau/CIDR ; hôtes (ex. 192.168.1.0/24 ; 100, 50, 25).',
    errIp: 'Adresse IPv4 invalide.',
    errPrefix: 'Le préfixe CIDR doit être compris entre /0 et /32.',
    errHosts: 'Saisissez au moins un besoin d’hôtes valide (entier > 0).',
    errOverflow: 'Dépassement : le sous-réseau « {name} » ({req} hôtes, /{prefix}) dépasse le bloc parent {parent}.',
    netAddr: 'Adresse Réseau',
    mask: 'Masque de Sous-réseau',
    wildcard: 'Masque Wildcard',
    bcast: 'Adresse Broadcast',
    range: 'Plage Utilisable',
    usableHosts: 'Hôtes Utiles',
    totalAddrs: 'Adresses Totales',
    ipClass: 'Classe / Portée',
    privateLabel: 'Privée',
    publicLabel: 'Publique',
    netBits: 'Bits réseau',
    hostBits: 'Bits hôte',
    step1Single: 'Étape 1 : Représentation binaire alignée bit à bit',
    step1SingleDesc: 'Les 32 bits se divisent en /{p} bits réseau (cyan) et {h} bits hôte (émeraude).',
    step2Single: 'Étape 2 : Adresse Réseau (IP ET Masque)',
    step2SingleDesc: 'On applique un ET logique bit à bit entre l’adresse IP et le masque.',
    step3Single: 'Étape 3 : Masque Wildcard et Broadcast (Réseau OU Wildcard)',
    step3SingleDesc: 'Le masque wildcard inverse les bits du masque. Le OU logique avec le réseau met tous les bits hôte à 1.',
    step4Single: 'Étape 4 : Plage utilisable, nombre d’hôtes et classification',
    step4SingleDesc: 'Calcul de 2^{h} - 2 adresses utilisables (première = Réseau + 1, dernière = Broadcast - 1).',
    vlsmTitle: 'Planification VLSM pour {parent}',
    vlsmSub: '{count} sous-réseaux alloués · {used} / {total} adresses utilisées ({pct}%)',
    colName: 'Sous-réseau',
    colReq: 'Demandés',
    colUsable: 'Utiles',
    colNet: 'Réseau / CIDR',
    colMask: 'Masque',
    colRange: 'Plage utile',
    colBcast: 'Broadcast',
    vlsmStep1: 'Étape 1 : Tri des besoins par ordre décroissant',
    vlsmStep1Desc: 'Trier du plus grand au plus petit évite la fragmentation et garantit l’alignement binaire.',
    vlsmStep2: 'Étape 2 : Calcul du préfixe et du saut de bloc',
    vlsmStep2Desc: 'On cherche le plus petit h tel que 2^h - 2 >= hôtes demandés ; préfixe = 32 - h.',
    vlsmStep3: 'Étape 3 : Vérification de la capacité du bloc parent',
    vlsmStep3Desc: '{used} adresses utilisées sur {total} disponibles ({pct}% d’occupation).'
  }
};

function solveSingle(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const parts = raw.trim().split('/');
  if (parts.length !== 2) return { ok: false, error: t.errFormat };

  const ipInt = ipToInt(parts[0]);
  if (ipInt === null) return { ok: false, error: t.errIp };

  if (!/^\d+$/.test(parts[1].trim())) return { ok: false, error: t.errPrefix };
  const prefix = Number(parts[1].trim());
  if (prefix < 0 || prefix > 32) return { ok: false, error: t.errPrefix };

  const hostBits = 32 - prefix;
  const maskInt = prefixToMask(prefix);
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const totalAddrs = 2 ** hostBits;
  let usableHosts = 0;
  let rangeStr = '';
  if (prefix === 32) {
    usableHosts = 1;
    rangeStr = intToIp(networkInt);
  } else if (prefix === 31) {
    usableHosts = 2;
    rangeStr = `${intToIp(networkInt)} – ${intToIp(broadcastInt)}`;
  } else {
    usableHosts = Math.max(0, totalAddrs - 2);
    rangeStr = `${intToIp((networkInt + 1) >>> 0)} – ${intToIp((broadcastInt - 1) >>> 0)}`;
  }

  const firstOctet = (ipInt >>> 24) & 255;
  const ipClass = getIpClass(firstOctet);
  const priv = isPrivateIp(ipInt);
  const scopeStr = priv ? `${t.privateLabel} · ${priv}` : t.publicLabel;

  const netStr = intToIp(networkInt);
  const maskStr = intToIp(maskInt);
  const wildStr = intToIp(wildcardInt);
  const bcastStr = intToIp(broadcastInt);

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.netAddr}</div>
        <div class="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-lg">${netStr}/${prefix}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.mask}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100 text-lg">${maskStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.bcast}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">${bcastStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.range}</div>
        <div class="font-mono font-semibold text-sm text-slate-900 dark:text-slate-100">${rangeStr}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.usableHosts}</div>
        <div class="font-mono font-bold text-slate-900 dark:text-slate-100">${usableHosts.toLocaleString()} <span class="text-xs font-normal text-slate-500">(${totalAddrs.toLocaleString()} ${t.totalAddrs.toLowerCase()})</span></div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.ipClass}</div>
        <div class="font-semibold text-sm text-slate-900 dark:text-slate-100">${ipClass} · ${scopeStr}</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="min-w-0 max-w-full overflow-x-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-4 text-xs mb-3">
        <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500"></span>${t.netBits} (/${prefix})</span>
        <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500"></span>${t.hostBits} (${hostBits})</span>
      </div>
      <div class="font-mono text-xs sm:text-sm space-y-2 whitespace-nowrap">
        <div class="flex items-center gap-3"><span class="w-24 text-slate-500">IP (${intToIp(ipInt)})</span>${renderColoredBits(ipInt, prefix)}</div>
        <div class="flex items-center gap-3"><span class="w-24 text-slate-500">Mask (/${prefix})</span>${renderColoredBits(maskInt, prefix)}</div>
        <div class="flex items-center gap-3"><span class="w-24 text-cyan-600 dark:text-cyan-400 font-semibold">Net</span>${renderColoredBits(networkInt, prefix)}</div>
        <div class="flex items-center gap-3"><span class="w-24 text-emerald-600 dark:text-emerald-400 font-semibold">Bcast</span>${renderColoredBits(broadcastInt, prefix)}</div>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1Single,
      explanation: t.step1SingleDesc.replace('{p}', prefix).replace('{h}', hostBits),
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs sm:text-sm whitespace-nowrap space-y-1">
        <div>IP   : ${intToBinOctets(ipInt).join('.')}  (${intToIp(ipInt)})</div>
        <div>Mask : ${intToBinOctets(maskInt).join('.')}  (${maskStr})</div>
      </div>`
    },
    {
      title: t.step2Single,
      explanation: t.step2SingleDesc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs sm:text-sm whitespace-nowrap space-y-1">
        <div>  ${intToBinOctets(ipInt).join('.')}</div>
        <div>&amp; ${intToBinOctets(maskInt).join('.')}</div>
        <div class="border-t border-slate-300 dark:border-slate-700 pt-1 font-bold text-cyan-600 dark:text-cyan-400">= ${intToBinOctets(networkInt).join('.')}  →  ${netStr}/${prefix}</div>
      </div>`
    },
    {
      title: t.step3Single,
      explanation: t.step3SingleDesc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs sm:text-sm whitespace-nowrap space-y-1">
        <div>Wildcard = 255.255.255.255 - ${maskStr} = ${wildStr}</div>
        <div>  ${intToBinOctets(networkInt).join('.')}</div>
        <div>| ${intToBinOctets(wildcardInt).join('.')}</div>
        <div class="border-t border-slate-300 dark:border-slate-700 pt-1 font-bold text-emerald-600 dark:text-emerald-400">= ${intToBinOctets(broadcastInt).join('.')}  →  ${bcastStr}</div>
      </div>`
    },
    {
      title: t.step4Single,
      explanation: t.step4SingleDesc.replace('{h}', hostBits),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm space-y-1">
        <div>${t.usableHosts}: ${prefix >= 31 ? usableHosts : `2^${hostBits} - 2 = ${usableHosts.toLocaleString()}`}</div>
        <div>${t.range}: ${rangeStr}</div>
        <div>${t.ipClass}: ${ipClass} (${scopeStr})</div>
      </div>`
    }
  ];

  const copyText = `${t.netAddr}: ${netStr}/${prefix}\n${t.mask}: ${maskStr}\n${t.wildcard}: ${wildStr}\n${t.bcast}: ${bcastStr}\n${t.range}: ${rangeStr}\n${t.usableHosts}: ${usableHosts}`;

  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}

function solveMultiVlsm(raw, lang) {
  const t = TEXT[lang] || TEXT.es;
  const sections = raw.split(';');
  if (sections.length < 2) return { ok: false, error: t.errFormat };

  const baseParts = sections[0].trim().split('/');
  if (baseParts.length !== 2) return { ok: false, error: t.errFormat };
  const baseIpInt = ipToInt(baseParts[0]);
  if (baseIpInt === null) return { ok: false, error: t.errIp };
  if (!/^\d+$/.test(baseParts[1].trim())) return { ok: false, error: t.errPrefix };
  const basePrefix = Number(baseParts[1].trim());
  if (basePrefix < 0 || basePrefix > 30) return { ok: false, error: t.errPrefix };

  const parentMask = prefixToMask(basePrefix);
  const parentNet = (baseIpInt & parentMask) >>> 0;
  const parentBcast = (parentNet | (~parentMask >>> 0)) >>> 0;
  const parentTotal = 2 ** (32 - basePrefix);
  const parentStr = `${intToIp(parentNet)}/${basePrefix}`;

  const reqTokens = sections.slice(1).join(',').split(',').map((s) => s.trim()).filter(Boolean);
  if (reqTokens.length === 0) return { ok: false, error: t.errHosts };

  const reqs = [];
  for (let i = 0; i < reqTokens.length; i++) {
    const tok = reqTokens[i];
    let name = `S${i + 1}`;
    let countStr = tok;
    if (tok.includes(':')) {
      const [n, c] = tok.split(':');
      name = n.trim() || name;
      countStr = c.trim();
    }
    if (!/^\d+$/.test(countStr) || Number(countStr) <= 0) {
      return { ok: false, error: t.errHosts };
    }
    reqs.push({ name, req: Number(countStr), origIdx: i });
  }

  const sorted = [...reqs].sort((a, b) => b.req - a.req || a.origIdx - b.origIdx);

  let cursor = parentNet;
  let totalUsed = 0;
  const allocated = [];

  for (const item of sorted) {
    let h = 2;
    while ((2 ** h - 2) < item.req) {
      h++;
    }
    const newPrefix = 32 - h;
    const blockSize = 2 ** h;
    const usable = blockSize - 2;

    if (cursor % blockSize !== 0) {
      cursor = (Math.ceil(cursor / blockSize) * blockSize) >>> 0;
    }

    const netInt = cursor >>> 0;
    const bcastInt = (netInt + blockSize - 1) >>> 0;

    if (bcastInt > parentBcast || netInt < parentNet || netInt + blockSize - 1 > 0xffffffff) {
      return {
        ok: false,
        error: t.errOverflow
          .replace('{name}', item.name)
          .replace('{req}', item.req)
          .replace('{prefix}', newPrefix)
          .replace('{parent}', parentStr)
      };
    }

    const maskInt = prefixToMask(newPrefix);
    allocated.push({
      name: item.name,
      req: item.req,
      usable,
      hostBits: h,
      prefix: newPrefix,
      blockSize,
      netStr: intToIp(netInt),
      maskStr: intToIp(maskInt),
      rangeStr: `${intToIp((netInt + 1) >>> 0)} – ${intToIp((bcastInt - 1) >>> 0)}`,
      bcastStr: intToIp(bcastInt)
    });

    totalUsed += blockSize;
    cursor = (bcastInt + 1) >>> 0;
  }

  const pct = ((totalUsed / parentTotal) * 100).toFixed(1);
  const colors = ['bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500'];

  const tableRows = allocated
    .map(
      (s) => `<tr class="border-b border-slate-200 dark:border-slate-700/80">
        <td class="px-3 py-2 font-semibold">${escapeHtml(s.name)}</td>
        <td class="px-3 py-2 font-mono">${s.req}</td>
        <td class="px-3 py-2 font-mono">${s.usable}</td>
        <td class="px-3 py-2 font-mono font-bold text-cyan-600 dark:text-cyan-400">${s.netStr}/${s.prefix}</td>
        <td class="px-3 py-2 font-mono">${s.maskStr}</td>
        <td class="px-3 py-2 font-mono text-xs">${s.rangeStr}</td>
        <td class="px-3 py-2 font-mono text-emerald-600 dark:text-emerald-400">${s.bcastStr}</td>
      </tr>`
    )
    .join('');

  const barSegments = allocated
    .map((s, idx) => {
      const w = Math.max(2, (s.blockSize / parentTotal) * 100).toFixed(2);
      const color = colors[idx % colors.length];
      return `<div class="${color} h-5 flex items-center justify-center text-[10px] font-mono font-bold text-white overflow-hidden px-1" style="width:${w}%" title="${escapeHtml(s.name)}: ${s.netStr}/${s.prefix}">${w > 7 ? escapeHtml(s.name) : ''}</div>`;
    })
    .join('');

  const summaryHtml = `
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <div class="text-sm font-bold text-slate-900 dark:text-slate-100">${t.vlsmTitle.replace('{parent}', parentStr)}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400">${t.vlsmSub.replace('{count}', allocated.length).replace('{used}', totalUsed.toLocaleString()).replace('{total}', parentTotal.toLocaleString()).replace('{pct}', pct)}</div>
      </div>
    </div>
    <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table class="w-full text-left text-xs sm:text-sm whitespace-nowrap">
        <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <tr>
            <th class="px-3 py-2">${t.colName}</th>
            <th class="px-3 py-2">${t.colReq}</th>
            <th class="px-3 py-2">${t.colUsable}</th>
            <th class="px-3 py-2">${t.colNet}</th>
            <th class="px-3 py-2">${t.colMask}</th>
            <th class="px-3 py-2">${t.colRange}</th>
            <th class="px-3 py-2">${t.colBcast}</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  `;

  const visualHtml = `
    <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
      <div class="w-full h-5 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 flex">${barSegments}</div>
    </div>
  `;

  const steps = [
    {
      title: t.vlsmStep1,
      explanation: t.vlsmStep1Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${sorted.map((s) => `${escapeHtml(s.name)}: ${s.req} hosts`).join('  →  ')}</div>`
    },
    {
      title: t.vlsmStep2,
      explanation: t.vlsmStep2Desc,
      codeOrMathHtml: `<div class="min-w-0 max-w-full overflow-x-auto font-mono text-xs space-y-1.5 whitespace-nowrap">
        ${allocated
          .map(
            (s) =>
              `<div><span class="font-bold">${escapeHtml(s.name)}</span> (${s.req} hosts): 2^${s.hostBits} - 2 = ${s.usable} ≥ ${s.req} → <span class="text-cyan-600 dark:text-cyan-400 font-bold">/${s.prefix}</span> (bloque ${s.blockSize}) → ${s.netStr}/${s.prefix} .. ${s.bcastStr}</div>`
          )
          .join('')}
      </div>`
    },
    {
      title: t.vlsmStep3,
      explanation: t.vlsmStep3Desc.replace('{used}', totalUsed.toLocaleString()).replace('{total}', parentTotal.toLocaleString()).replace('{pct}', pct),
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${parentStr}: ${totalUsed.toLocaleString()} / ${parentTotal.toLocaleString()} (${pct}%)</div>`
    }
  ];

  const copyText = allocated
    .map((s) => `${s.name}\t${s.req}\t${s.usable}\t${s.netStr}/${s.prefix}\t${s.maskStr}\t${s.rangeStr}\t${s.bcastStr}`)
    .join('\n');

  return { ok: true, summaryHtml, visualHtml, steps, copyText };
}

export function solveVlsm(input, mode = 'single', lang = 'es') {
  const raw = (input || '').trim();
  if (!raw) return { ok: false, error: (TEXT[lang] || TEXT.es).errFormat };
  if (mode === 'vlsm' || raw.includes(';')) {
    return solveMultiVlsm(raw, lang);
  }
  return solveSingle(raw, lang);
}
