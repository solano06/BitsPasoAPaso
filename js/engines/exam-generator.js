import { solveVlsm } from './vlsm.js';
import { solveCidr } from './cidr.js';
import { solveIpv6 } from './ipv6.js';
import { solveBandwidth } from './bandwidth.js';
import { solveIeee754 } from './ieee754.js';
import { solveKarnaugh } from './karnaugh.js';
import { solveBases } from './bases.js';
import { solveTruthTable } from './truth-table.js';
import { solveHamming } from './hamming.js';
import { solveRaidChmod } from './raid-chmod.js';
import { solveCache } from './cache.js';
import { solveLineCoding, encodeAmi, encodeHdb3 } from './line-coding.js';
import { solveAlu } from './alu.js';
import { solveDijkstra } from './dijkstra.js';
import { solveIpv4Header } from './ipv4-header.js';

export const EXAM_ENGINES = {
  vlsm: solveVlsm,
  cidr: solveCidr,
  ipv6: solveIpv6,
  bandwidth: solveBandwidth,
  ieee754: solveIeee754,
  karnaugh: solveKarnaugh,
  bases: solveBases,
  truthTable: solveTruthTable,
  hamming: solveHamming,
  raidChmod: solveRaidChmod,
  cache: solveCache,
  lineCoding: solveLineCoding,
  alu: solveAlu,
  dijkstra: solveDijkstra,
  ipv4Header: solveIpv4Header
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function genVlsm(diff, lang) {
  const useMulti = diff === 'exam' || (diff === 'standard' && Math.random() < 0.5);
  if (!useMulti) {
    const prefix = diff === 'basic' ? pick([24, 25, 26, 27]) : pick([20, 21, 22, 23, 25, 26, 27, 28]);
    const a = pick([10, 172, 192]);
    const b = a === 172 ? randInt(16, 31) : a === 192 ? 168 : randInt(1, 50);
    const c = randInt(1, 200);
    const d = randInt(1, 254);
    const ip = `${a}.${b}.${c}.${d}/${prefix}`;
    const res = solveVlsm(ip, 'single', lang);
    const netMatch = res.copyText.match(/:\s*([\d.]+\/\d+)/);
    const promptText = {
      es: `Calcula la dirección de red, máscara, broadcast y rango utilizable para ${ip}.`,
      en: `Calculate the network address, subnet mask, broadcast, and usable range for ${ip}.`,
      fr: `Calculez l'adresse réseau, le masque, le broadcast et la plage utilisable pour ${ip}.`
    }[lang];
    return {
      topic: 'vlsm',
      difficulty: diff,
      promptText,
      engineInput: ip,
      engineMode: 'single',
      expectedAnswer: netMatch ? netMatch[1] : ip,
      answerHint: '192.168.x.y/n'
    };
  }

  const basePrefix = diff === 'exam' ? 22 : 24;
  const baseIp = basePrefix === 22 ? `172.16.${randInt(0, 10) * 4}.0/22` : `192.168.${randInt(1, 50)}.0/24`;
  const hosts = basePrefix === 22
    ? [randInt(130, 220), randInt(65, 110), randInt(30, 50), randInt(10, 20)]
    : [randInt(65, 110), randInt(32, 55), randInt(15, 25)];
  const q = `${baseIp} ; ${hosts.join(', ')}`;
  const res = solveVlsm(q, 'vlsm', lang);
  const firstNet = res.copyText.split('\n')[0].split('\t')[3] || '';
  const promptText = {
    es: `Diseña el particionado VLSM de la red ${baseIp} para subredes de ${hosts.join(', ')} hosts útiles.`,
    en: `Design a VLSM subnetting plan for ${baseIp} with subnets requiring ${hosts.join(', ')} usable hosts.`,
    fr: `Concevez le découpage VLSM du réseau ${baseIp} pour des sous-réseaux de ${hosts.join(', ')} hôtes utiles.`
  }[lang];
  return {
    topic: 'vlsm',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: 'vlsm',
    expectedAnswer: firstNet,
    answerHint: '192.168.x.0/25'
  };
}

function genCidr(diff, lang) {
  const useRange = diff !== 'basic' && Math.random() < 0.45;
  if (!useRange) {
    const count = pick([2, 4]);
    const prefix = pick([23, 24, 25]);
    const b = randInt(1, 50);
    const nets = [];
    if (prefix === 25) {
      const startThird = randInt(1, 100) * 2;
      for (let i = 0; i < count; i++) {
        const third = startThird + Math.floor(i / 2);
        const fourth = (i % 2) * 128;
        nets.push(`10.${b}.${third}.${fourth}/25`);
      }
    } else {
      const step = 1 << (24 - prefix);
      const baseThird = randInt(0, 20) * (count * step);
      for (let i = 0; i < count; i++) {
        nets.push(`192.168.${baseThird + i * step}.0/${prefix}`);
      }
    }
    const q = nets.join(', ');
    const res = solveCidr(q, 'summarize', lang);
    const ans = res.copyText.split('\n')[0].split(': ')[1].trim();
    const promptText = {
      es: `Sumariza las siguientes redes IPv4 en una única ruta CIDR: ${q}.`,
      en: `Summarize the following IPv4 networks into a single CIDR route: ${q}.`,
      fr: `Agrégez les réseaux IPv4 suivants en une seule route CIDR : ${q}.`
    }[lang];
    return {
      topic: 'cidr',
      difficulty: diff,
      promptText,
      engineInput: q,
      engineMode: 'summarize',
      expectedAnswer: ans,
      answerHint: '192.168.x.0/22'
    };
  }

  const startOct = randInt(1, 100);
  const len = pick([15, 31, 63]);
  const q = `192.168.${randInt(1, 30)}.${startOct} - 192.168.${randInt(1, 30)}.${Math.min(255, startOct + len)}`;
  const sameThird = q.replace(/192\.168\.\d+\./g, `192.168.${randInt(1, 30)}.`);
  const res = solveCidr(sameThird, 'range', lang);
  const ans = res.copyText.split('\n')[0].trim();
  const promptText = {
    es: `Descompón el rango IPv4 ${sameThird} en el conjunto mínimo de bloques CIDR.`,
    en: `Decompose the IPv4 range ${sameThird} into the minimal set of CIDR blocks.`,
    fr: `Décomposez la plage IPv4 ${sameThird} en un ensemble minimal de blocs CIDR.`
  }[lang];
  return {
    topic: 'cidr',
    difficulty: diff,
    promptText,
    engineInput: sameThird,
    engineMode: 'range',
    expectedAnswer: ans,
    answerHint: '192.168.x.y/n'
  };
}

function genIpv6(diff, lang) {
  const useEui = diff !== 'basic' && Math.random() < 0.5;
  if (!useEui) {
    const h1 = '2001';
    const h2 = '0db8';
    const h3 = randInt(0, 1) ? '0000' : randInt(1, 255).toString(16).padStart(4, '0');
    const h4 = '0000';
    const h5 = '0000';
    const h6 = randInt(1, 4095).toString(16).padStart(4, '0');
    const h7 = '00' + randInt(10, 99).toString(16).padStart(2, '0');
    const h8 = randInt(1, 65534).toString(16).padStart(4, '0');
    const prefix = pick([48, 56, 64]);
    const q = `${h1}:${h2}:${h3}:${h4}:${h5}:${h6}:${h7}:${h8}/${prefix}`;
    const res = solveIpv6(q, 'analyze', lang);
    const ans = res.copyText.split('\n')[0].replace('IPv6: ', '').trim();
    const promptText = {
      es: `Comprime según RFC 5952 y analiza la dirección IPv6 ${q}.`,
      en: `Compress per RFC 5952 and analyze the IPv6 address ${q}.`,
      fr: `Compressez selon la RFC 5952 et analysez l'adresse IPv6 ${q}.`
    }[lang];
    return {
      topic: 'ipv6',
      difficulty: diff,
      promptText,
      engineInput: q,
      engineMode: 'analyze',
      expectedAnswer: ans,
      answerHint: '2001:db8::.../48'
    };
  }

  const macBytes = Array.from({ length: 6 }, () => randInt(0, 255).toString(16).toUpperCase().padStart(2, '0'));
  const mac = macBytes.join(':');
  const q = `${mac} ; fe80::/64`;
  const res = solveIpv6(q, 'eui64', lang);
  const ans = res.copyText.split('\n')[0].replace('IPv6 EUI-64: ', '').trim();
  const promptText = {
    es: `Calcula la dirección IPv6 Link-Local (fe80::/64) usando EUI-64 para la MAC ${mac}.`,
    en: `Derive the Link-Local IPv6 address (fe80::/64) using EUI-64 for MAC ${mac}.`,
    fr: `Calculez l'adresse IPv6 Link-Local (fe80::/64) via EUI-64 pour la MAC ${mac}.`
  }[lang];
  return {
    topic: 'ipv6',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: 'eui64',
    expectedAnswer: ans,
    answerHint: 'fe80::...'
  };
}

function genBandwidth(diff, lang) {
  const useBdp = diff !== 'basic' && Math.random() < 0.6;
  if (!useBdp) {
    const size = pick([100, 250, 500, 1, 2, 4]);
    const unit = size >= 100 ? pick(['MB', 'MiB']) : pick(['GB', 'GiB']);
    const speed = pick([50, 100, 300, 500, 1000]);
    const q = `${size} ${unit} ; ${speed} Mbps`;
    const res = solveBandwidth(q, 'transfer', lang);
    const ans = res.copyText.split(': ')[1].split(' (')[0].trim();
    const promptText = {
      es: `Calcula el tiempo de transferencia de un archivo de ${size} ${unit} por un enlace de ${speed} Mbps.`,
      en: `Compute the transfer time for a ${size} ${unit} file over a ${speed} Mbps link.`,
      fr: `Calculez le temps de transfert d'un fichier de ${size} ${unit} sur un lien à ${speed} Mbps.`
    }[lang];
    return {
      topic: 'bandwidth',
      difficulty: diff,
      promptText,
      engineInput: q,
      engineMode: 'transfer',
      expectedAnswer: ans,
      answerHint: '12.34 s'
    };
  }

  const r = pick([50, 100, 200, 500]);
  const rtt = pick([20, 40, 50, 80]);
  const win = pick([32, 64, 128, 256]);
  const q = `${r} ; ${rtt} ; ${win}`;
  const res = solveBandwidth(q, 'bdp', lang);
  const ans = res.copyText.split('\n')[1].match(/([\d.]+ Mbps)/)?.[1] || '';
  const promptText = {
    es: `Un enlace de ${r} Mbps tiene un RTT de ${rtt} ms y una ventana TCP de ${win} KiB. Calcula el BDP y el throughput máximo.`,
    en: `A ${r} Mbps link has an RTT of ${rtt} ms and a ${win} KiB TCP window. Compute BDP and maximum throughput.`,
    fr: `Un lien de ${r} Mbps a un RTT de ${rtt} ms et une fenêtre TCP de ${win} KiB. Calculez le BDP et le débit maximal.`
  }[lang];
  return {
    topic: 'bandwidth',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: 'bdp',
    expectedAnswer: ans,
    answerHint: '13.11 Mbps'
  };
}

function genIeee754(diff, lang) {
  const fracs = [0.5, 0.25, 0.75, 0.125, 0.375, 0.625, 0.875];
  const intPart = randInt(1, diff === 'basic' ? 20 : 120);
  const fracPart = pick(fracs);
  const sign = Math.random() < 0.55 ? -1 : 1;
  const val = sign * (intPart + fracPart);
  const toHex = diff === 'exam' && Math.random() < 0.4;

  if (!toHex) {
    const q = String(val);
    const res = solveIeee754(q, 'dec2bin32', lang);
    const hex = res.copyText.match(/Hex:\s*(0x[0-9A-F]+)/)?.[1] || '';
    const promptText = {
      es: `Convierte el número decimal ${q} a formato IEEE-754 de 32 bits (indica signo, exponente, mantisa y hexadecimal).`,
      en: `Convert decimal ${q} to IEEE-754 32-bit floating point (sign, exponent, mantissa, and hex).`,
      fr: `Convertissez le décimal ${q} au format IEEE-754 32 bits (signe, exposant, mantisse et hexadécimal).`
    }[lang];
    return {
      topic: 'ieee754',
      difficulty: diff,
      promptText,
      engineInput: q,
      engineMode: 'dec2bin32',
      expectedAnswer: hex,
      answerHint: '0xC15A0000'
    };
  }

  const tmp = solveIeee754(String(val), 'dec2bin32', lang);
  const hex = tmp.copyText.match(/Hex:\s*(0x[0-9A-F]+)/)?.[1] || '0xC15A0000';
  const promptText = {
    es: `Decodifica el valor IEEE-754 de 32 bits ${hex} a su número decimal exacto.`,
    en: `Decode the 32-bit IEEE-754 value ${hex} into its exact decimal number.`,
    fr: `Décodez la valeur IEEE-754 32 bits ${hex} vers son nombre décimal exact.`
  }[lang];
  return {
    topic: 'ieee754',
    difficulty: diff,
    promptText,
    engineInput: hex,
    engineMode: 'hex2dec32',
    expectedAnswer: String(val),
    answerHint: '-13.625'
  };
}

function genKarnaugh(diff, lang) {
  const vars = diff === 'basic' ? 3 : pick([3, 4]);
  const total = 1 << vars;
  const minOnes = Math.ceil(total * 0.35);
  const maxOnes = Math.floor(total * 0.7);
  const numOnes = randInt(minOnes, maxOnes);
  const numDontCares = diff === 'basic' ? 0 : randInt(0, 2);

  const indices = shuffle(Array.from({ length: total }, (_, i) => i));
  const ones = indices.slice(0, numOnes).sort((a, b) => a - b);
  const dcs = indices.slice(numOnes, numOnes + numDontCares).sort((a, b) => a - b);

  const q = dcs.length ? `m(${ones.join(',')}) d(${dcs.join(',')})` : `m(${ones.join(',')})`;
  const res = solveKarnaugh(q, `${vars}:table`, lang);
  const sop = res.copyText.match(/SOP:\s*F\([^)]+\)\s*=\s*(.+)/)?.[1] || '';

  const promptText = {
    es: `Simplifica por Mapa de Karnaugh (${vars} variables) la función F = ${q} en forma mínima SOP.`,
    en: `Simplify the ${vars}-variable Karnaugh Map F = ${q} into minimal SOP form.`,
    fr: `Simplifiez par Tableau de Karnaugh (${vars} variables) la fonction F = ${q} en forme SOP minimale.`
  }[lang];
  return {
    topic: 'karnaugh',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: `${vars}:table`,
    expectedAnswer: sop,
    answerHint: "A'·B + C"
  };
}

function genBases(diff, lang) {
  const bits = diff === 'basic' ? 8 : pick([8, 16]);
  const minNeg = bits === 8 ? -120 : -3000;
  const val = -randInt(10, Math.abs(minNeg));
  const q = String(val);
  const res = solveBases(q, String(bits), lang);
  const bin = res.copyText.match(/Binary \(C2\):\s*([01]+)/)?.[1] || '';
  const promptText = {
    es: `Convierte ${q} a Complemento a 2 de ${bits} bits (indica binario y hexadecimal).`,
    en: `Convert ${q} to ${bits}-bit Two's Complement (binary and hexadecimal).`,
    fr: `Convertissez ${q} en Complément à 2 sur ${bits} bits (binaire et hexadécimal).`
  }[lang];
  return {
    topic: 'bases',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: String(bits),
    expectedAnswer: bin,
    answerHint: '11010110'
  };
}

function genTruthTable(diff, lang) {
  const templates = [
    { q: 'A -> B ; !A + B', mode: 'equiv', ans: 'true', es: 'Comprueba si A → B y ¬A ∨ B son lógicamente equivalentes.', en: 'Check whether A → B and ¬A ∨ B are logically equivalent.', fr: 'Vérifiez si A → B et ¬A ∨ B sont logiquement équivalentes.' },
    { q: '!(A + B) ; !A * !B', mode: 'equiv', ans: 'true', es: 'Comprueba la ley de De Morgan: ¬(A ∨ B) ≡ ¬A ∧ ¬B.', en: 'Verify De Morgan’s law: ¬(A ∨ B) ≡ ¬A ∧ ¬B.', fr: 'Vérifiez la loi de De Morgan : ¬(A ∨ B) ≡ ¬A ∧ ¬B.' },
    { q: '(A -> B) ; (B -> A)', mode: 'equiv', ans: 'false', es: 'Comprueba si A → B y B → A son equivalentes.', en: 'Check whether A → B and B → A are equivalent.', fr: 'Vérifiez si A → B et B → A sont équivalentes.' },
    { q: '(A ∧ B) -> A', mode: 'eval', ans: 'TAUTOLOG', es: 'Clasifica la fórmula (A ∧ B) → A (tautología, contradicción o contingencia) y obtén su tabla de verdad.', en: 'Classify (A ∧ B) → A (tautology, contradiction, or contingency) and build its truth table.', fr: 'Classifiez (A ∧ B) → A (tautologie, contradiction ou contingence).' },
    { q: '(A ⊕ B) ∧ (A ↔ B)', mode: 'eval', ans: 'CONTRADIC', es: 'Clasifica la fórmula (A ⊕ B) ∧ (A ↔ B) y calcula su tabla de verdad.', en: 'Classify (A ⊕ B) ∧ (A ↔ B) and compute its truth table.', fr: 'Classifiez (A ⊕ B) ∧ (A ↔ B) et calculez sa table de vérité.' },
    { q: '(A ∧ B) ⊕ C', mode: 'eval', ans: 'CONTINGEN', es: 'Evalúa la tabla de verdad de (A ∧ B) ⊕ C y extrae sus mintérminos Σm.', en: 'Evaluate the truth table of (A ∧ B) ⊕ C and extract minterms Σm.', fr: 'Évaluez la table de vérité de (A ∧ B) ⊕ C et extrayez Σm.' },
    { q: 'A -> (B -> A)', mode: 'eval', ans: 'TAUTOLOG', es: 'Clasifica la fórmula A → (B → A) mediante su tabla de verdad.', en: 'Classify A → (B → A) using its truth table.', fr: 'Classifiez A → (B → A) par sa table de vérité.' }
  ];
  const item = pick(templates);
  return {
    topic: 'truthTable',
    difficulty: diff,
    promptText: item[lang],
    engineInput: item.q,
    engineMode: item.mode,
    expectedAnswer: item.ans,
    answerHint: item.mode === 'equiv' ? 'true / false' : 'Tautología'
  };
}

function genHamming(diff, lang) {
  const kind = pick(['encode', 'check', 'crc']);
  if (kind === 'encode') {
    const len = diff === 'basic' ? 4 : pick([5, 7]);
    const bits = Array.from({ length: len }, () => randInt(0, 1)).join('');
    const res = solveHamming(bits, 'hamming_even', lang);
    const word = res.copyText.split(': ')[1].trim();
    const promptText = {
      es: `Codifica la trama ${bits} con Código Hamming (paridad par).`,
      en: `Encode the data frame ${bits} using Hamming Code (even parity).`,
      fr: `Codez la trame ${bits} avec le Code de Hamming (parité paire).`
    }[lang];
    return {
      topic: 'hamming',
      difficulty: diff,
      promptText,
      engineInput: bits,
      engineMode: 'hamming_even',
      expectedAnswer: word,
      answerHint: '1011001...'
    };
  }

  if (kind === 'check') {
    const len = pick([4, 7]);
    const bits = Array.from({ length: len }, () => randInt(0, 1)).join('');
    const enc = solveHamming(bits, 'hamming_even', lang);
    const cleanWord = enc.copyText.split(': ')[1].trim();
    const errPos = randInt(1, cleanWord.length);
    const arr = cleanWord.split('');
    arr[errPos - 1] = arr[errPos - 1] === '0' ? '1' : '0';
    const corrupted = arr.join('');
    const promptText = {
      es: `Se ha recibido la palabra Hamming (paridad par) ${corrupted}. Calcula el síndrome y corrige el bit erróneo.`,
      en: `Received Hamming word (even parity) ${corrupted}. Compute the syndrome and fix the flipped bit.`,
      fr: `Mot Hamming reçu (parité paire) ${corrupted}. Calculez le syndrome et corrigez le bit erroné.`
    }[lang];
    return {
      topic: 'hamming',
      difficulty: diff,
      promptText,
      engineInput: corrupted,
      engineMode: 'hamming_check',
      expectedAnswer: cleanWord,
      answerHint: cleanWord
    };
  }

  const dataLen = randInt(7, 10);
  const data = '1' + Array.from({ length: dataLen - 1 }, () => randInt(0, 1)).join('');
  const gen = pick(['1011', '10011', '1101']);
  const q = `${data} ; ${gen}`;
  const res = solveHamming(q, 'crc', lang);
  const rem = res.copyText.match(/CRC Remainder:\s*([01]+)/)?.[1] || '';
  const promptText = {
    es: `Calcula el resto CRC de la trama ${data} usando el polinomio generador ${gen}.`,
    en: `Compute the CRC remainder for data ${data} with generator polynomial ${gen}.`,
    fr: `Calculez le reste CRC de la trame ${data} avec le polynôme générateur ${gen}.`
  }[lang];
  return {
    topic: 'hamming',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: 'crc',
    expectedAnswer: rem,
    answerHint: '0110'
  };
}

function genRaidChmod(diff, lang) {
  const useRaid = Math.random() < 0.55;
  if (useRaid) {
    const level = pick([0, 1, 5, 6, 10]);
    const minD = { 0: 2, 1: 2, 5: 3, 6: 4, 10: 4 }[level];
    let n = randInt(minD, minD + 3);
    if (level === 10 && n % 2 !== 0) n++;
    const cap = pick([2, 4, 8, 10]);
    const q = `RAID ${level} ; ${n} ; ${cap} TB`;
    const res = solveRaidChmod(q, 'raid', lang);
    const usable = res.copyText.split('\n')[1].split(': ')[1].trim();
    const promptText = {
      es: `Calcula la capacidad útil, paridad/espejo y tolerancia a fallos de un arreglo RAID ${level} con ${n} discos de ${cap} TB.`,
      en: `Calculate usable capacity, parity/mirror overhead, and fault tolerance for RAID ${level} with ${n} × ${cap} TB disks.`,
      fr: `Calculez la capacité utile, la parité/miroir et la tolérance aux pannes d'un RAID ${level} avec ${n} disques de ${cap} To.`
    }[lang];
    return {
      topic: 'raidChmod',
      difficulty: diff,
      promptText,
      engineInput: q,
      engineMode: 'raid',
      expectedAnswer: usable,
      answerHint: '12 TB'
    };
  }

  const oct = pick(['755', '644', '750', '700', '640', '775']);
  const umask = pick(['022', '027', '077']);
  const q = `${oct} ; umask ${umask}`;
  const res = solveRaidChmod(q, 'chmod', lang);
  const sym = res.copyText.match(/\(([rwx-]+)\)/)?.[1] || '';
  const promptText = {
    es: `Convierte chmod ${oct} a formato simbólico y binario, y calcula los permisos por defecto con umask ${umask}.`,
    en: `Convert chmod ${oct} to symbolic and binary form, and compute default permissions under umask ${umask}.`,
    fr: `Convertissez chmod ${oct} en format symbolique et binaire, puis calculez les droits par défaut avec umask ${umask}.`
  }[lang];
  return {
    topic: 'raidChmod',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: 'chmod',
    expectedAnswer: sym,
    answerHint: 'rwxr-xr-x'
  };
}

function genCache(diff, lang) {
  const addrBits = diff === 'basic' ? 12 : 16;
  const cacheSize = pick([128, 256, 512]);
  const blockSize = pick([16, 32]);
  const ways = diff === 'basic' ? 1 : pick([1, 2]);
  const mode = `${ways}_LRU`;
  const base = pick([0x0010, 0x0020, 0x0110]);
  const seq = [base, base + 4, base + 0x0100, base, base + blockSize];
  const hexSeq = seq.map((v) => '0x' + v.toString(16).toUpperCase().padStart(4, '0')).join(', ');
  const q = `${addrBits} ; ${cacheSize} B ; ${blockSize} B ; ${hexSeq}`;
  const res = solveCache(q, mode, lang);
  const hitMatch = res.copyText.match(/Hits:\s*(\d+)/);
  const promptText = {
    es: `Para una caché de ${cacheSize} B (bloques de ${blockSize} B, ${ways} vía/s LRU, direcciones de ${addrBits} bits), calcula Tag/Index/Offset y los Hits/Misses de: ${hexSeq}.`,
    en: `For a ${cacheSize} B cache (${blockSize} B blocks, ${ways}-way LRU, ${addrBits}-bit addresses), find Tag/Index/Offset and Hits/Misses for: ${hexSeq}.`,
    fr: `Pour un cache de ${cacheSize} o (blocs de ${blockSize} o, ${ways} voie(s) LRU, adresses ${addrBits} bits), calculez Tag/Index/Offset et Hits/Misses pour : ${hexSeq}.`
  }[lang];
  return {
    topic: 'cache',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: mode,
    expectedAnswer: hitMatch ? hitMatch[1] : '1',
    answerHint: '1'
  };
}

function genLineCoding(diff, lang) {
  const useHdb3 = diff !== 'basic';
  const bits = useHdb3
    ? pick(['10000101', '11000010', '10000110000', '10100001'])
    : pick(['10110010', '11010101', '01101001']);
  const mode = useHdb3 ? 'hdb3' : 'ami';
  const levels = useHdb3 ? encodeHdb3(bits).levels : encodeAmi(bits);
  const fmt = levels.map((v) => (v > 0 ? '+' : v < 0 ? '-' : '0')).join('');
  const promptText = {
    es: `Codifica la trama binaria ${bits} en ${useHdb3 ? 'HDB3 (ITU-T G.703)' : 'AMI (Bipolar)'} indicando la secuencia de niveles (+ / 0 / -).`,
    en: `Encode the binary frame ${bits} using ${useHdb3 ? 'HDB3 (ITU-T G.703)' : 'AMI (Bipolar)'} and give the level sequence (+ / 0 / -).`,
    fr: `Codez la trame binaire ${bits} en ${useHdb3 ? 'HDB3 (ITU-T G.703)' : 'AMI (Bipolaire)'} en indiquant la suite de niveaux (+ / 0 / -).`
  }[lang];
  return {
    topic: 'lineCoding',
    difficulty: diff,
    promptText,
    engineInput: bits,
    engineMode: mode,
    expectedAnswer: fmt,
    answerHint: '+000+0-'
  };
}

function genAlu(diff, lang) {
  const cases = [
    { a: 100, b: 50, op: 'ADD' },
    { a: 200, b: 100, op: 'ADD' },
    { a: 45, b: 60, op: 'SUB' },
    { a: 90, b: 55, op: 'ADD' },
    { a: 180, b: 90, op: 'ADD' }
  ];
  const c = diff === 'basic' ? cases[0] : pick(cases);
  const q = `${c.a} ; ${c.b}`;
  const mode = `8_${c.op}`;
  const res = solveAlu(q, mode, lang);
  const hex = res.copyText.match(/(0x[0-9A-F]+)/)?.[1] || '';
  const promptText = {
    es: `En una ALU de 8 bits, calcula ${c.a} ${c.op === 'SUB' ? '-' : '+'} ${c.b} e indica el resultado en hexadecimal y los flags Z, N, C, V.`,
    en: `On an 8-bit ALU, compute ${c.a} ${c.op === 'SUB' ? '-' : '+'} ${c.b} and give the hex result plus Z, N, C, V flags.`,
    fr: `Sur une ALU 8 bits, calculez ${c.a} ${c.op === 'SUB' ? '-' : '+'} ${c.b} et donnez le résultat hex et les drapeaux Z, N, C, V.`
  }[lang];
  return {
    topic: 'alu',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: mode,
    expectedAnswer: hex,
    answerHint: '0x96'
  };
}

function genDijkstra(diff, lang) {
  const w1 = randInt(2, 6);
  const w2 = randInt(1, 4);
  const w3 = randInt(1, 3);
  const w4 = randInt(3, 7);
  const w5 = randInt(2, 5);
  const q = `A-B:${w1}, A-C:${w2}, B-C:${w3}, B-D:${w4}, C-D:${w4 + 2}, C-E:${w4 + w5 + 2}, D-E:${w5} ; A ; E`;
  const res = solveDijkstra(q, 'undirected', lang);
  const cost = res.copyText.match(/Cost\s+([\d.]+)/)?.[1] || '';
  const promptText = {
    es: `Aplica Dijkstra desde A hasta E sobre el grafo no dirigido: ${q.split(';')[0].trim()}.`,
    en: `Run Dijkstra from A to E on the undirected graph: ${q.split(';')[0].trim()}.`,
    fr: `Appliquez Dijkstra de A vers E sur le graphe non orienté : ${q.split(';')[0].trim()}.`
  }[lang];
  return {
    topic: 'dijkstra',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: 'undirected',
    expectedAnswer: cost,
    answerHint: '10'
  };
}

function genIpv4Header(diff, lang) {
  const ttl = pick([64, 128, 32]);
  const proto = pick([6, 17, 1]);
  const len = pick([60, 84, 115, 140]);
  const dstLast = randInt(10, 220);
  const q = `192.168.0.1 ; 192.168.0.${dstLast} ; ${ttl} ; ${proto} ; ${len}`;
  const res = solveIpv4Header(q, 'build', lang);
  const csum = res.copyText.match(/Checksum=(0x[0-9A-F]+)/)?.[1] || '';
  const promptText = {
    es: `Construye la cabecera IPv4 (192.168.0.1 → 192.168.0.${dstLast}, TTL=${ttl}, Proto=${proto}, Longitud=${len}) y calcula su checksum de 16 bits.`,
    en: `Build the IPv4 header (192.168.0.1 → 192.168.0.${dstLast}, TTL=${ttl}, Proto=${proto}, Length=${len}) and compute its 16-bit checksum.`,
    fr: `Construisez l'en-tête IPv4 (192.168.0.1 → 192.168.0.${dstLast}, TTL=${ttl}, Proto=${proto}, Longueur=${len}) et calculez son checksum 16 bits.`
  }[lang];
  return {
    topic: 'ipv4Header',
    difficulty: diff,
    promptText,
    engineInput: q,
    engineMode: 'build',
    expectedAnswer: csum,
    answerHint: '0xB861'
  };
}

const GENERATORS = {
  vlsm: genVlsm,
  cidr: genCidr,
  ipv6: genIpv6,
  bandwidth: genBandwidth,
  ieee754: genIeee754,
  karnaugh: genKarnaugh,
  bases: genBases,
  truthTable: genTruthTable,
  hamming: genHamming,
  raidChmod: genRaidChmod,
  cache: genCache,
  lineCoding: genLineCoding,
  alu: genAlu,
  dijkstra: genDijkstra,
  ipv4Header: genIpv4Header
};

export function generateExam(selectedTopics, difficulty = 'standard', lang = 'es', count = 10) {
  const validTopics = selectedTopics.filter((t) => Boolean(GENERATORS[t]));
  if (validTopics.length === 0) return [];

  const pool = shuffle(validTopics);
  const exercises = [];
  const seen = new Set();
  let attempts = 0;

  while (exercises.length < count && attempts < count * 20) {
    const topic = pool[attempts % pool.length];
    attempts++;
    const ex = GENERATORS[topic](difficulty, lang);
    const sig = `${topic}::${ex.engineInput}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    exercises.push({
      id: exercises.length + 1,
      ...ex
    });
  }

  return exercises;
}

export function solveExamExercise(ex, lang = 'es') {
  const engine = EXAM_ENGINES[ex.topic];
  if (!engine) return { ok: false, error: 'Unknown topic' };
  return engine(ex.engineInput, ex.engineMode, lang);
}

export function normalizeAnswer(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/·/g, '')
    .replace(/\*/g, '')
    .replace(/^0x/, '');
}

export function checkUserAnswer(userRaw, expected) {
  const u = String(userRaw || '').trim();
  if (!u) return 'blank';
  const nu = normalizeAnswer(u);
  const ne = normalizeAnswer(expected);
  if (!nu || !ne) return 'incorrect';
  if (nu === ne) return 'correct';
  if (ne.length >= 6 && nu.includes(ne)) return 'correct';
  return 'incorrect';
}
