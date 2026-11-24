export function buildCidrRows(lang) {
  const uses = {
    es: {
      0: 'Ruta por defecto (0.0.0.0/0)',
      8: 'Clase A / RFC 1918 (10.0.0.0/8)',
      12: 'RFC 1918 (172.16.0.0/12)',
      16: 'Clase B / RFC 1918 (192.168.0.0/16)',
      22: 'Supernet de 4 redes /24',
      24: 'LAN estándar (Clase C)',
      25: 'Mitad de una /24',
      26: 'Subred mediana (62 hosts)',
      27: 'Subred pequeña (30 hosts)',
      28: 'Subred reducida (14 hosts)',
      29: 'Enlace / DMZ pequeña (6 hosts)',
      30: 'Enlace punto a punto clásico (2 hosts)',
      31: 'Enlace P2P RFC 3021 (2 direcciones)',
      32: 'Host único / Loopback / Ruta estática'
    },
    en: {
      0: 'Default route (0.0.0.0/0)',
      8: 'Class A / RFC 1918 (10.0.0.0/8)',
      12: 'RFC 1918 (172.16.0.0/12)',
      16: 'Class B / RFC 1918 (192.168.0.0/16)',
      22: 'Supernet of 4 × /24',
      24: 'Standard LAN (Class C)',
      25: 'Half of a /24',
      26: 'Medium subnet (62 hosts)',
      27: 'Small subnet (30 hosts)',
      28: 'Compact subnet (14 hosts)',
      29: 'Small DMZ / link (6 hosts)',
      30: 'Classic P2P link (2 hosts)',
      31: 'P2P link RFC 3021 (2 addresses)',
      32: 'Single host / Loopback / Host route'
    },
    fr: {
      0: 'Route par défaut (0.0.0.0/0)',
      8: 'Classe A / RFC 1918 (10.0.0.0/8)',
      12: 'RFC 1918 (172.16.0.0/12)',
      16: 'Classe B / RFC 1918 (192.168.0.0/16)',
      22: 'Supernet de 4 × /24',
      24: 'LAN standard (Classe C)',
      25: 'Moitié d’un /24',
      26: 'Sous-réseau moyen (62 hôtes)',
      27: 'Petit sous-réseau (30 hôtes)',
      28: 'Sous-réseau réduit (14 hôtes)',
      29: 'Petite DMZ (6 hôtes)',
      30: 'Lien point-à-point classique (2 hôtes)',
      31: 'Lien P2P RFC 3021 (2 adresses)',
      32: 'Hôte unique / Loopback'
    }
  }[lang] || {};

  const intToIp = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  const rows = [];
  for (let p = 0; p <= 32; p++) {
    const h = 32 - p;
    const maskInt = p === 0 ? 0 : (0xffffffff << h) >>> 0;
    const wildInt = (~maskInt) >>> 0;
    const total = 2 ** h;
    let usableNum = Math.max(0, total - 2);
    let usableStr = usableNum.toLocaleString('en-US');
    if (p === 31) {
      usableNum = 2;
      usableStr = '2 (RFC 3021 P2P)';
    } else if (p === 32) {
      usableNum = 1;
      usableStr = '1 (Host)';
    }
    rows.push({
      prefix: p,
      mask: intToIp(maskInt),
      wildcard: intToIp(wildInt),
      hostBits: h,
      total,
      totalStr: total.toLocaleString('en-US'),
      usableNum,
      usableStr,
      use: uses[p] || '—'
    });
  }
  return rows;
}

export const IPV4_RESERVED_RANGES = [
  { cidr: '10.0.0.0/8', range: '10.0.0.0 – 10.255.255.255', rfc: 'RFC 1918 (Private Class A)' },
  { cidr: '172.16.0.0/12', range: '172.16.0.0 – 172.31.255.255', rfc: 'RFC 1918 (Private Class B)' },
  { cidr: '192.168.0.0/16', range: '192.168.0.0 – 192.168.255.255', rfc: 'RFC 1918 (Private Class C)' },
  { cidr: '127.0.0.0/8', range: '127.0.0.0 – 127.255.255.255', rfc: 'RFC 1122 (Loopback)' },
  { cidr: '169.254.0.0/16', range: '169.254.0.0 – 169.254.255.255', rfc: 'RFC 3927 (APIPA / Link-Local)' },
  { cidr: '100.64.0.0/10', range: '100.64.0.0 – 100.127.255.255', rfc: 'RFC 6598 (CGNAT)' }
];

const CTRL_NAMES = [
  'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL',
  'BS', 'TAB', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
  'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB',
  'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US'
];

export function buildAsciiRows(lang) {
  const descCtrl = {
    es: 'Carácter de control',
    en: 'Control character',
    fr: 'Caractère de contrôle'
  }[lang];
  const descDigit = { es: 'Dígito numérico', en: 'Numeric digit', fr: 'Chiffre numérique' }[lang];
  const descUpper = { es: 'Letra mayúscula', en: 'Uppercase letter', fr: 'Lettre majuscule' }[lang];
  const descLower = { es: 'Letra minúscula', en: 'Lowercase letter', fr: 'Lettre minuscule' }[lang];
  const descSym = { es: 'Símbolo / puntuación', en: 'Symbol / punctuation', fr: 'Symbole / ponctuation' }[lang];

  const rows = [];
  for (let code = 0; code <= 127; code++) {
    let symbol = '';
    let category = 'symbol';
    let desc = descSym;

    if (code < 32) {
      symbol = CTRL_NAMES[code];
      category = 'control';
      desc = descCtrl;
    } else if (code === 32) {
      symbol = 'SPC';
      category = 'symbol';
      desc = { es: 'Espacio en blanco', en: 'Space', fr: 'Espace' }[lang];
    } else if (code === 127) {
      symbol = 'DEL';
      category = 'control';
      desc = { es: 'Suprimir (Control)', en: 'Delete (Control)', fr: 'Supprimer (Contrôle)' }[lang];
    } else {
      symbol = String.fromCharCode(code);
      if (code >= 48 && code <= 57) {
        category = 'digit';
        desc = descDigit;
      } else if (code >= 65 && code <= 90) {
        category = 'upper';
        desc = descUpper;
      } else if (code >= 97 && code <= 122) {
        category = 'lower';
        desc = descLower;
      }
    }

    rows.push({
      dec: code,
      bin: code.toString(2).padStart(8, '0'),
      oct: code.toString(8).padStart(3, '0'),
      hex: '0x' + code.toString(16).toUpperCase().padStart(2, '0'),
      symbol,
      category,
      desc
    });
  }
  return rows;
}

export const BOOLEAN_GATES = [
  {
    name: 'NOT',
    expr: "Y = A' = ¬A",
    tt: '0→1, 1→0',
    note: { es: 'Inversor lógico', en: 'Logical inverter', fr: 'Inverseur logique' },
    svg: '<svg viewBox="0 0 90 44" class="w-20 h-10 stroke-current fill-none" stroke-width="2"><line x1="4" y1="22" x2="24" y2="22"/><polygon points="24,8 24,36 58,22"/><circle cx="63" cy="22" r="4"/><line x1="67" y1="22" x2="86" y2="22"/></svg>'
  },
  {
    name: 'AND',
    expr: 'Y = A·B = A ∧ B',
    tt: '00→0, 01→0, 10→0, 11→1',
    note: { es: 'Salida 1 solo si todas las entradas son 1', en: 'Output 1 only if all inputs are 1', fr: 'Sortie 1 si toutes les entrées valent 1' },
    svg: '<svg viewBox="0 0 90 44" class="w-20 h-10 stroke-current fill-none" stroke-width="2"><line x1="4" y1="14" x2="24" y2="14"/><line x1="4" y1="30" x2="24" y2="30"/><path d="M24,8 L44,8 A14,14 0 0,1 44,36 L24,36 Z"/><line x1="58" y1="22" x2="86" y2="22"/></svg>'
  },
  {
    name: 'OR',
    expr: 'Y = A + B = A ∨ B',
    tt: '00→0, 01→1, 10→1, 11→1',
    note: { es: 'Salida 1 si al menos una entrada es 1', en: 'Output 1 if at least one input is 1', fr: 'Sortie 1 si au moins une entrée vaut 1' },
    svg: '<svg viewBox="0 0 90 44" class="w-20 h-10 stroke-current fill-none" stroke-width="2"><line x1="4" y1="14" x2="27" y2="14"/><line x1="4" y1="30" x2="27" y2="30"/><path d="M22,8 Q32,22 22,36 Q48,36 62,22 Q48,8 22,8 Z"/><line x1="62" y1="22" x2="86" y2="22"/></svg>'
  },
  {
    name: 'NAND',
    expr: "Y = (A·B)' = ¬(A ∧ B)",
    tt: '00→1, 01→1, 10→1, 11→0',
    note: { es: 'Puerta universal (implementa cualquier función)', en: 'Universal gate (can build any function)', fr: 'Porte universelle' },
    svg: '<svg viewBox="0 0 90 44" class="w-20 h-10 stroke-current fill-none" stroke-width="2"><line x1="4" y1="14" x2="24" y2="14"/><line x1="4" y1="30" x2="24" y2="30"/><path d="M24,8 L42,8 A14,14 0 0,1 42,36 L24,36 Z"/><circle cx="60" cy="22" r="4"/><line x1="64" y1="22" x2="86" y2="22"/></svg>'
  },
  {
    name: 'NOR',
    expr: "Y = (A + B)' = ¬(A ∨ B)",
    tt: '00→1, 01→0, 10→0, 11→0',
    note: { es: 'Puerta universal', en: 'Universal gate', fr: 'Porte universelle' },
    svg: '<svg viewBox="0 0 90 44" class="w-20 h-10 stroke-current fill-none" stroke-width="2"><line x1="4" y1="14" x2="26" y2="14"/><line x1="4" y1="30" x2="26" y2="30"/><path d="M22,8 Q32,22 22,36 Q46,36 58,22 Q46,8 22,8 Z"/><circle cx="62" cy="22" r="4"/><line x1="66" y1="22" x2="86" y2="22"/></svg>'
  },
  {
    name: 'XOR',
    expr: 'Y = A ⊕ B',
    tt: '00→0, 01→1, 10→1, 11→0',
    note: { es: 'Salida 1 si las entradas son distintas', en: 'Output 1 when inputs differ', fr: 'Sortie 1 si les entrées diffèrent' },
    svg: '<svg viewBox="0 0 90 44" class="w-20 h-10 stroke-current fill-none" stroke-width="2"><line x1="4" y1="14" x2="22" y2="14"/><line x1="4" y1="30" x2="22" y2="30"/><path d="M18,8 Q28,22 18,36"/><path d="M25,8 Q35,22 25,36 Q50,36 64,22 Q50,8 25,8 Z"/><line x1="64" y1="22" x2="86" y2="22"/></svg>'
  },
  {
    name: 'XNOR',
    expr: "Y = (A ⊕ B)' = A ↔ B",
    tt: '00→1, 01→0, 10→0, 11→1',
    note: { es: 'Comparador de igualdad (1 si A == B)', en: 'Equality comparator (1 if A == B)', fr: 'Comparateur d’égalité (1 si A == B)' },
    svg: '<svg viewBox="0 0 90 44" class="w-20 h-10 stroke-current fill-none" stroke-width="2"><line x1="4" y1="14" x2="22" y2="14"/><line x1="4" y1="30" x2="22" y2="30"/><path d="M18,8 Q28,22 18,36"/><path d="M25,8 Q35,22 25,36 Q48,36 60,22 Q48,8 25,8 Z"/><circle cx="64" cy="22" r="4"/><line x1="68" y1="22" x2="86" y2="22"/></svg>'
  }
];

export const BOOLEAN_LAWS = [
  { name: { es: 'Identidad', en: 'Identity', fr: 'Identité' }, eng: 'A + 0 = A  |  A·1 = A', logic: 'A ∨ 0 = A  |  A ∧ 1 = A', equiv: null },
  { name: { es: 'Dominación (Nulo)', en: 'Domination (Null)', fr: 'Élément absorbant' }, eng: 'A + 1 = 1  |  A·0 = 0', logic: 'A ∨ 1 = 1  |  A ∧ 0 = 0', equiv: null },
  { name: { es: 'Idempotencia', en: 'Idempotence', fr: 'Idempotence' }, eng: 'A + A = A  |  A·A = A', logic: 'A ∨ A = A  |  A ∧ A = A', equiv: null },
  { name: { es: 'Complemento', en: 'Complement', fr: 'Complément' }, eng: "A + A' = 1  |  A·A' = 0", logic: 'A ∨ ¬A = 1  |  A ∧ ¬A = 0', equiv: null },
  { name: { es: 'Doble Negación', en: 'Double Negation', fr: 'Double négation' }, eng: "(A')' = A", logic: '¬(¬A) = A', equiv: null },
  { name: { es: 'Conmutativa', en: 'Commutative', fr: 'Commutativité' }, eng: 'A + B = B + A  |  A·B = B·A', logic: 'A ∨ B = B ∨ A  |  A ∧ B = B ∧ A', equiv: null },
  { name: { es: 'Asociativa', en: 'Associative', fr: 'Associativité' }, eng: '(A + B) + C = A + (B + C)', logic: '(A ∨ B) ∨ C = A ∨ (B ∨ C)', equiv: null },
  { name: { es: 'Distributiva', en: 'Distributive', fr: 'Distributivité' }, eng: 'A·(B + C) = A·B + A·C', logic: 'A ∧ (B ∨ C) = (A ∧ B) ∨ (A ∧ C)', equiv: 'A * (B + C) ; (A * B) + (A * C)' },
  { name: { es: 'Absorción', en: 'Absorption', fr: 'Absorption' }, eng: 'A + A·B = A  |  A·(A + B) = A', logic: 'A ∨ (A ∧ B) = A', equiv: 'A + (A * B) ; A' },
  { name: { es: 'Consenso', en: 'Consensus', fr: 'Consensus' }, eng: "A·B + A'·C + B·C = A·B + A'·C", logic: '(A ∧ B) ∨ (¬A ∧ C) ∨ (B ∧ C) = (A ∧ B) ∨ (¬A ∧ C)', equiv: '(A * B) + (!A * C) + (B * C) ; (A * B) + (!A * C)' },
  { name: { es: '1.ª Ley de De Morgan', en: "De Morgan's 1st Law", fr: '1re Loi de De Morgan' }, eng: "(A + B)' = A'·B'", logic: '¬(A ∨ B) = ¬A ∧ ¬B', equiv: '!(A + B) ; !A * !B' },
  { name: { es: '2.ª Ley de De Morgan', en: "De Morgan's 2nd Law", fr: '2e Loi de De Morgan' }, eng: "(A·B)' = A' + B'", logic: '¬(A ∧ B) = ¬A ∨ ¬B', equiv: '!(A * B) ; !A + !B' }
];

export const CHEAT_META = {
  cheatCidr: {
    es: {
      metaTitle: 'Tabla Completa de Subredes CIDR (/0 a /32) y Máscaras — BitsPasoAPaso',
      metaDescription: 'Chuleta completa de los 33 prefijos CIDR (/0 a /32): máscara decimal, wildcard, hosts útiles, rangos privados RFC 1918 y potencias de 2.',
      h1: 'Tabla Completa de Subredes CIDR (/0 a /32)',
      subtitle: 'Referencia instantánea con las 33 máscaras IPv4, wildcards, hosts útiles (incluyendo /31 RFC 3021 y /32), filtro inteligente por número de hosts y enlace directo a VLSM.',
      faqs: [
        { q: '¿Cómo encuentro el prefijo CIDR para N hosts?', a: 'Escribe el número de hosts en el buscador superior (ej. 50) y la tabla resaltará automáticamente el prefijo más ajustado (/26 con 62 hosts útiles).' },
        { q: '¿Por qué /31 tiene 2 direcciones útiles?', a: 'La RFC 3021 permite usar subredes /31 en enlaces punto a punto sin desperdiciar direcciones de red y broadcast.' },
        { q: '¿Qué es la máscara wildcard?', a: 'Es la máscara inversa (255.255.255.255 - máscara) usada en ACLs y OSPF.' },
        { q: '¿Puedo probar un prefijo directamente en la calculadora?', a: 'Sí, pulsa "Probar en VLSM" en cualquier fila para abrir el cálculo paso a paso.' }
      ]
    },
    en: {
      metaTitle: 'Complete CIDR Subnet Cheat Sheet (/0 to /32) — BitsPasoAPaso',
      metaDescription: 'Complete reference table for all 33 CIDR prefixes (/0 to /32): subnet masks, wildcards, usable hosts, RFC 1918 ranges, and powers of 2.',
      h1: 'Complete CIDR Subnet Cheat Sheet (/0 to /32)',
      subtitle: 'All 33 IPv4 masks, wildcards, usable hosts (including /31 RFC 3021 and /32), smart minimum-host filter, and one-click VLSM launcher.',
      faqs: [
        { q: 'How do I find the tightest CIDR for N hosts?', a: 'Type the host count in the filter box (e.g. 50) and the table automatically highlights /26 (62 usable hosts).' },
        { q: 'Why does /31 list 2 usable addresses?', a: 'RFC 3021 permits /31 point-to-point links without dedicated network/broadcast addresses.' },
        { q: 'What is a wildcard mask?', a: 'The bitwise inverse of the subnet mask (255.255.255.255 - mask) used in ACLs and OSPF.' },
        { q: 'Can I test a prefix in the VLSM calculator?', a: 'Yes, click "Test in VLSM" on any row to open the step-by-step breakdown.' }
      ]
    },
    fr: {
      metaTitle: 'Table Complète des Sous-réseaux CIDR (/0 à /32) — BitsPasoAPaso',
      metaDescription: 'Fiche complète des 33 préfixes CIDR (/0 à /32) : masques décimaux, wildcards, hôtes utiles, plages RFC 1918 et puissances de 2.',
      h1: 'Table Complète des Sous-réseaux CIDR (/0 à /32)',
      subtitle: 'Les 33 masques IPv4, wildcards, hôtes utiles (/31 RFC 3021 et /32 inclus), filtre par nombre d’hôtes et lien direct vers VLSM.',
      faqs: [
        { q: 'Comment trouver le préfixe pour N hôtes ?', a: 'Saisissez le nombre d’hôtes dans le filtre (ex. 50) pour surligner automatiquement le /26 (62 hôtes utiles).' },
        { q: 'Pourquoi /31 offre-t-il 2 adresses utiles ?', a: 'La RFC 3021 autorise les liens point-à-point en /31 sans adresse réseau ni broadcast.' },
        { q: 'Qu’est-ce que le masque wildcard ?', a: 'L’inverse bit à bit du masque (255.255.255.255 - masque) utilisé dans les ACL et OSPF.' },
        { q: 'Puis-je tester un préfixe dans VLSM ?', a: 'Oui, cliquez sur « Tester en VLSM » sur n’importe quelle ligne.' }
      ]
    }
  },
  cheatAscii: {
    es: {
      metaTitle: 'Tabla ASCII, Binario (8 bits), Octal y Hexadecimal (0–127) — BitsPasoAPaso',
      metaDescription: 'Tabla completa de los 128 códigos ASCII (0 a 127) con binario de 8 bits, octal, hexadecimal y conversor de texto en tiempo real.',
      h1: 'Tabla ASCII, Binario, Octal y Hexadecimal (0–127)',
      subtitle: 'Todos los 128 códigos ASCII estándar con mini-conversor de texto a binario/hex en tiempo real y filtros por categoría.',
      faqs: [
        { q: '¿Por qué el ASCII estándar llega hasta 127?', a: 'Porque utiliza 7 bits (2^7 = 128 códigos, de 0x00 a 0x7F), aunque suele almacenarse en bytes de 8 bits.' },
        { q: '¿Qué diferencia hay entre A (65) y a (97)?', a: 'Difieren exactamente en 32 (el bit 5: 01000001 vs 01100001), lo que facilita convertir mayúsculas y minúsculas.' },
        { q: '¿Qué son los códigos 0 al 31 y 127?', a: 'Son caracteres de control no imprimibles como NUL (0), TAB (9), LF (10), CR (13), ESC (27) y DEL (127).' },
        { q: '¿Cómo uso el conversor de texto?', a: 'Escribe cualquier palabra en el cuadro superior para ver al instante su secuencia decimal, binaria y hexadecimal.' }
      ]
    },
    en: {
      metaTitle: 'ASCII, 8-Bit Binary, Octal & Hex Table (0–127) — BitsPasoAPaso',
      metaDescription: 'Complete 128-character ASCII table (0 to 127) with 8-bit binary, octal, hex, category filters, and live text converter.',
      h1: 'ASCII, Binary, Octal & Hexadecimal Table (0–127)',
      subtitle: 'All 128 standard ASCII codes with a live text-to-binary/hex converter and instant category filters.',
      faqs: [
        { q: 'Why does standard ASCII stop at 127?', a: 'It uses 7 bits (2^7 = 128 codes, 0x00 to 0x7F), typically stored in 8-bit bytes.' },
        { q: 'What separates A (65) from a (97)?', a: 'Exactly 32 (bit 5: 01000001 vs 01100001), making case conversion a single bit flip.' },
        { q: 'What are codes 0–31 and 127?', a: 'Non-printable control characters such as NUL (0), TAB (9), LF (10), CR (13), ESC (27), and DEL (127).' },
        { q: 'How does the live text converter work?', a: 'Type any text above to inspect each character’s decimal, 8-bit binary, and hex values.' }
      ]
    },
    fr: {
      metaTitle: 'Table ASCII, Binaire (8 bits), Octal et Hexadécimal (0–127) — BitsPasoAPaso',
      metaDescription: 'Table complète des 128 codes ASCII (0 à 127) avec binaire 8 bits, octal, hexadécimal et convertisseur texte en direct.',
      h1: 'Table ASCII, Binaire, Octal et Hexadécimal (0–127)',
      subtitle: 'Les 128 codes ASCII standard avec convertisseur texte vers binaire/hex en direct et filtres par catégorie.',
      faqs: [
        { q: 'Pourquoi l’ASCII standard s’arrête-t-il à 127 ?', a: 'Il est codé sur 7 bits (2^7 = 128 valeurs, de 0x00 à 0x7F).' },
        { q: 'Quelle différence entre A (65) et a (97) ?', a: 'Un écart de 32 (bit 5 : 01000001 vs 01100001).' },
        { q: 'Que sont les codes 0 à 31 et 127 ?', a: 'Des caractères de contrôle non imprimables comme NUL (0), TAB (9), LF (10), CR (13), ESC (27) et DEL (127).' },
        { q: 'Comment utiliser le convertisseur texte ?', a: 'Tapez un mot ci-dessus pour obtenir aussitôt son binaire et hexadécimal.' }
      ]
    }
  },
  cheatBoolean: {
    es: {
      metaTitle: 'Leyes de Álgebra de Boole, De Morgan y Puertas Lógicas — BitsPasoAPaso',
      metaDescription: 'Chuleta completa de las 7 puertas lógicas (SVG), las 12 leyes del Álgebra de Boole, teoremas de De Morgan y comprobador en Tablas de Verdad.',
      h1: 'Leyes de Álgebra de Boole, De Morgan y Puertas Lógicas',
      subtitle: 'Las 7 puertas lógicas con símbolos ANSI/IEEE, las leyes fundamentales en doble notación y botones para comprobarlas en Tablas de Verdad.',
      faqs: [
        { q: '¿Por qué NAND y NOR son puertas universales?', a: 'Porque cualquier función booleana (incluidas NOT, AND y OR) puede construirse combinando únicamente puertas NAND o únicamente NOR.' },
        { q: '¿Qué dicen las leyes de De Morgan?', a: 'El complemento de una suma es el producto de los complementos, y el complemento de un producto es la suma de los complementos.' },
        { q: '¿Puedo verificar estas leyes paso a paso?', a: 'Sí, pulsa "Comprobar equivalencia" en las leyes principales para abrir la Tabla de Verdad ya precargada.' },
        { q: '¿Cuándo conviene usar Mapas de Karnaugh?', a: 'Para minimizar sistemáticamente funciones de 2 a 4 variables sin depender de aplicar leyes manualmente.' }
      ]
    },
    en: {
      metaTitle: 'Boolean Algebra Laws, De Morgan & Logic Gates Cheat Sheet — BitsPasoAPaso',
      metaDescription: 'Complete reference of all 7 logic gates (SVG), 12 fundamental Boolean laws, De Morgan’s theorems, and one-click Truth Table equivalence checks.',
      h1: 'Boolean Algebra Laws, De Morgan & Logic Gates',
      subtitle: 'All 7 logic gates with ANSI/IEEE SVG symbols, fundamental laws in dual notation, and direct Truth Table verification links.',
      faqs: [
        { q: 'Why are NAND and NOR universal gates?', a: 'Any Boolean function (including NOT, AND, OR) can be built using only NAND gates or only NOR gates.' },
        { q: 'What do De Morgan’s laws state?', a: 'The complement of a sum equals the product of complements, and the complement of a product equals the sum of complements.' },
        { q: 'Can I verify these laws step by step?', a: 'Yes, click "Check equivalence" to open the Truth Table generator with both sides preloaded.' },
        { q: 'When should I use Karnaugh Maps?', a: 'To systematically minimize 2–4 variable functions into minimal SOP or POS.' }
      ]
    },
    fr: {
      metaTitle: 'Lois de l’Algèbre de Boole, De Morgan et Portes Logiques — BitsPasoAPaso',
      metaDescription: 'Fiche complète des 7 portes logiques (SVG), des 12 lois fondamentales de Boole, des théorèmes de De Morgan et vérification en Table de Vérité.',
      h1: 'Lois d’Algèbre de Boole, De Morgan et Portes Logiques',
      subtitle: 'Les 7 portes logiques en SVG ANSI/IEEE, les lois fondamentales en double notation et boutons de vérification en Table de Vérité.',
      faqs: [
        { q: 'Pourquoi NAND et NOR sont-elles universelles ?', a: 'Toute fonction booléenne peut être réalisée uniquement avec des portes NAND ou uniquement avec des portes NOR.' },
        { q: 'Qu’énoncent les théorèmes de De Morgan ?', a: 'Le complément d’une somme est le produit des compléments, et inversement.' },
        { q: 'Puis-je vérifier ces lois étape par étape ?', a: 'Oui, cliquez sur « Vérifier l’équivalence » pour ouvrir la Table de Vérité préremplie.' },
        { q: 'Quand utiliser les tableaux de Karnaugh ?', a: 'Pour minimiser systématiquement des fonctions de 2 à 4 variables.' }
      ]
    }
  }
};
