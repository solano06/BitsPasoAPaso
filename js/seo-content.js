import { PHASE2_CONTENT } from './seo-content-phase2.js';
import { PHASE3_CONTENT } from './seo-content-phase3.js';

export const TOOL_CONTENT = {
  ...PHASE2_CONTENT,
  ...PHASE3_CONTENT,
  vlsm: {
    es: {
      metaTitle: 'Calculadora de Subredes IPv4 y VLSM paso a paso — BitsPasoAPaso',
      metaDescription: 'Calcula subredes IPv4 CIDR y particionado VLSM paso a paso: dirección de red, máscara, wildcard, broadcast, rango utilizable y bits alineados.',
      h1: 'Calculadora de Subredes IPv4 y VLSM paso a paso',
      subtitle: 'Analiza direcciones CIDR o divide una red padre en subredes de tamaño variable (VLSM) con tablas exportables y bits alineados.',
      modeLabels: { single: 'Subred IPv4 / CIDR', vlsm: 'VLSM multi-subred' },
      inputLabelSingle: 'Dirección IPv4 / Prefijo CIDR',
      inputPlaceholderSingle: 'Ej: 192.168.10.45/26',
      inputLabelVlsm: 'Red base / CIDR ; Hosts requeridos (separados por comas)',
      inputPlaceholderVlsm: 'Ej: 192.168.1.0/24 ; 100, 50, 25, 10, 2',
      examples: [
        { label: '192.168.10.45/26 (CIDR)', mode: 'single', q: '192.168.10.45/26' },
        { label: '10.0.14.200/21 (Clase A)', mode: 'single', q: '10.0.14.200/21' },
        { label: '192.168.1.0/24 ; 100,50,25,10,2', mode: 'vlsm', q: '192.168.1.0/24 ; 100, 50, 25, 10, 2' },
        { label: '172.16.0.0/22 ; LAN:300, WiFi:120, DMZ:30', mode: 'vlsm', q: '172.16.0.0/22 ; LAN:300, WiFi:120, DMZ:30' }
      ],
      guide: [
        'El direccionamiento CIDR (Classless Inter-Domain Routing) divide los 32 bits de una dirección IPv4 en /n bits de red y h = 32 - n bits de host. La dirección de red se obtiene aplicando un AND bit a bit entre la IP y la máscara; el broadcast resulta de hacer OR entre la red y la máscara wildcard (inversa de la máscara).',
        'En VLSM (Variable Length Subnet Mask) se ordenan siempre los requisitos de hosts de mayor a menor para evitar solapamientos y fragmentación. Para cada subred se busca el menor entero h tal que 2^h - 2 >= hosts_pedidos, fijando el nuevo prefijo en /(32 - h).'
      ],
      refTable: {
        headers: ['Prefijo', 'Máscara decimal', 'Wildcard', 'Hosts útiles (2^h - 2)'],
        rows: [
          ['/24', '255.255.255.0', '0.0.0.255', '254'],
          ['/25', '255.255.255.128', '0.0.0.127', '126'],
          ['/26', '255.255.255.192', '0.0.0.63', '62'],
          ['/27', '255.255.255.224', '0.0.0.31', '30'],
          ['/28', '255.255.255.240', '0.0.0.15', '14'],
          ['/30', '255.255.255.252', '0.0.0.3', '2']
        ]
      },
      tips: [
        'Ordena siempre las subredes de mayor a menor número de hosts antes de empezar a asignar bloques en VLSM.',
        'Recuerda restar 2 direcciones (red y broadcast) al calcular hosts útiles, salvo en enlaces punto a punto /31 (RFC 3021).',
        'El salto de bloque en el octeto crítico es igual a 256 menos el valor decimal de ese octeto en la máscara.'
      ],
      faqs: [
        { q: '¿Por qué en VLSM hay que ordenar de mayor a menor?', a: 'Porque los bloques de tamaño potencia de 2 deben alinearse a múltiplos exactos de su tamaño. Asignar primero los grandes garantiza alineación natural sin solapamientos.' },
        { q: '¿Qué es la máscara wildcard?', a: 'Es el complemento bit a bit de la máscara de subred (255.255.255.255 - máscara). Se usa en ACLs de routers y protocolos como OSPF.' },
        { q: '¿Cómo sé si una IP es privada según RFC 1918?', a: 'Son privadas las direcciones dentro de 10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16.' },
        { q: '¿Qué pasa si la suma de subredes supera la red padre?', a: 'La calculadora detecta el desbordamiento de direcciones y te indica exactamente en qué subred se supera el límite del bloque padre.' }
      ],
      related: ['cidr', 'ipv6', 'bandwidth']
    },
    en: {
      metaTitle: 'IPv4 & VLSM Subnet Calculator Step by Step — BitsPasoAPaso',
      metaDescription: 'Compute IPv4 CIDR subnets and VLSM partitioning step by step: network address, mask, wildcard, broadcast, usable host range, and aligned binary bits.',
      h1: 'IPv4 & VLSM Subnet Calculator Step by Step',
      subtitle: 'Analyze single CIDR addresses or partition a parent network using VLSM with exportable tables and aligned binary views.',
      modeLabels: { single: 'Single IPv4 / CIDR', vlsm: 'Multi-subnet VLSM' },
      inputLabelSingle: 'IPv4 Address / CIDR Prefix',
      inputPlaceholderSingle: 'e.g. 192.168.10.45/26',
      inputLabelVlsm: 'Base Network / CIDR ; Required Hosts (comma-separated)',
      inputPlaceholderVlsm: 'e.g. 192.168.1.0/24 ; 100, 50, 25, 10, 2',
      examples: [
        { label: '192.168.10.45/26 (CIDR)', mode: 'single', q: '192.168.10.45/26' },
        { label: '10.0.14.200/21 (Class A)', mode: 'single', q: '10.0.14.200/21' },
        { label: '192.168.1.0/24 ; 100,50,25,10,2', mode: 'vlsm', q: '192.168.1.0/24 ; 100, 50, 25, 10, 2' },
        { label: '172.16.0.0/22 ; LAN:300, WiFi:120, DMZ:30', mode: 'vlsm', q: '172.16.0.0/22 ; LAN:300, WiFi:120, DMZ:30' }
      ],
      guide: [
        'CIDR (Classless Inter-Domain Routing) splits 32 IPv4 bits into /n network bits and h = 32 - n host bits. The network address comes from bitwise AND between the IP and mask; the broadcast comes from bitwise OR with the wildcard mask.',
        'In VLSM (Variable Length Subnet Mask), host requirements are always sorted descending to preserve natural power-of-2 block alignment. For each subnet, find the smallest h such that 2^h - 2 >= requested_hosts, giving prefix /(32 - h).'
      ],
      refTable: {
        headers: ['Prefix', 'Decimal Mask', 'Wildcard', 'Usable Hosts (2^h - 2)'],
        rows: [
          ['/24', '255.255.255.0', '0.0.0.255', '254'],
          ['/25', '255.255.255.128', '0.0.0.127', '126'],
          ['/26', '255.255.255.192', '0.0.0.63', '62'],
          ['/27', '255.255.255.224', '0.0.0.31', '30'],
          ['/28', '255.255.255.240', '0.0.0.15', '14'],
          ['/30', '255.255.255.252', '0.0.0.3', '2']
        ]
      },
      tips: [
        'Always sort VLSM subnets from largest to smallest host requirement before assigning blocks.',
        'Subtract 2 addresses (network and broadcast) for usable hosts, except on /31 point-to-point links (RFC 3021).',
        'The block size in the interesting octet equals 256 minus that octet in the subnet mask.'
      ],
      faqs: [
        { q: 'Why must VLSM subnets be sorted descending?', a: 'Power-of-2 blocks must align on multiples of their block size. Allocating largest subnets first prevents fragmentation and overlaps.' },
        { q: 'What is a wildcard mask?', a: 'It is the bitwise inverse of the subnet mask (255.255.255.255 - mask), commonly used in ACLs and OSPF.' },
        { q: 'How do I identify an RFC 1918 private IP?', a: 'Private IPv4 ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.' },
        { q: 'What happens if subnets exceed the parent block?', a: 'The engine detects the overflow and reports which subnet exceeds the available parent IP space.' }
      ],
      related: ['cidr', 'ipv6', 'bandwidth']
    },
    fr: {
      metaTitle: 'Calculateur de Sous-réseaux IPv4 et VLSM étape par étape — BitsPasoAPaso',
      metaDescription: 'Calculez les sous-réseaux IPv4 CIDR et le découpage VLSM étape par étape : adresse réseau, masque, wildcard, broadcast et plage utilisable.',
      h1: 'Calculateur de Sous-réseaux IPv4 et VLSM étape par étape',
      subtitle: 'Analysez une adresse CIDR ou découpez un réseau parent en VLSM avec tableaux exportables et bits alignés.',
      modeLabels: { single: 'Sous-réseau IPv4 / CIDR', vlsm: 'VLSM multi-sous-réseaux' },
      inputLabelSingle: 'Adresse IPv4 / Préfixe CIDR',
      inputPlaceholderSingle: 'Ex : 192.168.10.45/26',
      inputLabelVlsm: 'Réseau de base / CIDR ; Hôtes requis (séparés par des virgules)',
      inputPlaceholderVlsm: 'Ex : 192.168.1.0/24 ; 100, 50, 25, 10, 2',
      examples: [
        { label: '192.168.10.45/26 (CIDR)', mode: 'single', q: '192.168.10.45/26' },
        { label: '10.0.14.200/21 (Classe A)', mode: 'single', q: '10.0.14.200/21' },
        { label: '192.168.1.0/24 ; 100,50,25,10,2', mode: 'vlsm', q: '192.168.1.0/24 ; 100, 50, 25, 10, 2' },
        { label: '172.16.0.0/22 ; LAN:300, WiFi:120, DMZ:30', mode: 'vlsm', q: '172.16.0.0/22 ; LAN:300, WiFi:120, DMZ:30' }
      ],
      guide: [
        'Le routage CIDR sépare les 32 bits IPv4 en /n bits réseau et h = 32 - n bits hôte. L’adresse réseau provient du ET logique entre l’IP et le masque ; le broadcast vient du OU logique avec le masque wildcard.',
        'En VLSM, les besoins en hôtes sont toujours triés par ordre décroissant pour conserver l’alignement binaire des blocs. On choisit le plus petit h tel que 2^h - 2 >= hôtes_requis, donnant /(32 - h).'
      ],
      refTable: {
        headers: ['Préfixe', 'Masque décimal', 'Wildcard', 'Hôtes utiles (2^h - 2)'],
        rows: [
          ['/24', '255.255.255.0', '0.0.0.255', '254'],
          ['/25', '255.255.255.128', '0.0.0.127', '126'],
          ['/26', '255.255.255.192', '0.0.0.63', '62'],
          ['/27', '255.255.255.224', '0.0.0.31', '30'],
          ['/28', '255.255.255.240', '0.0.0.15', '14'],
          ['/30', '255.255.255.252', '0.0.0.3', '2']
        ]
      },
      tips: [
        'Triez toujours les sous-réseaux du plus grand au plus petit besoin d’hôtes en VLSM.',
        'Soustrayez 2 adresses (réseau et broadcast) pour les hôtes utiles, sauf pour les liens /31.',
        'Le pas de bloc dans l’octet critique vaut 256 moins la valeur décimale de cet octet du masque.'
      ],
      faqs: [
        { q: 'Pourquoi trier par ordre décroissant en VLSM ?', a: 'Les blocs puissances de 2 doivent être alignés sur des multiples de leur taille. Allouer les plus grands en premier évite tout chevauchement.' },
        { q: 'Qu’est-ce que le masque wildcard ?', a: 'C’est l’inverse bit à bit du masque de sous-réseau (255.255.255.255 - masque), utilisé dans les ACL et OSPF.' },
        { q: 'Comment reconnaître une IP privée RFC 1918 ?', a: 'Les plages privées sont 10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16.' },
        { q: 'Que se passe-t-il si les sous-réseaux dépassent le bloc parent ?', a: 'Le calculateur signale le dépassement et indique exactement quel sous-réseau excède la capacité.' }
      ],
      related: ['cidr', 'ipv6', 'bandwidth']
    }
  },
  ieee754: {
    es: {
      metaTitle: 'Conversor IEEE-754 de 32 y 64 bits paso a paso — BitsPasoAPaso',
      metaDescription: 'Convierte números decimales a formato IEEE-754 de 32 bits (Simple) y 64 bits (Doble) paso a paso. Bits interactivos de signo, exponente y mantisa.',
      h1: 'Conversor IEEE-754 de 32 y 64 bits paso a paso',
      subtitle: 'Visualiza signo, exponente sesgado y mantisa con bits interactivos clicables, casos especiales (NaN, Infinity, subnormales) y error de redondeo exacto.',
      modeLabels: { dec2bin32: 'Decimal → 32-bit (Float)', dec2bin64: 'Decimal → 64-bit (Double)', hex2dec32: 'Hex/Bin → 32-bit', hex2dec64: 'Hex/Bin → 64-bit' },
      inputLabel: 'Valor decimal o Hex/Binario (ej. -13.625 o 0xC15A0000)',
      inputPlaceholder: 'Ej: -13.625',
      examples: [
        { label: '-13.625 (32-bit)', mode: 'dec2bin32', q: '-13.625' },
        { label: '0.1 (Error redondeo 32-bit)', mode: 'dec2bin32', q: '0.1' },
        { label: '0xC15A0000 (Hex → Dec)', mode: 'hex2dec32', q: '0xC15A0000' },
        { label: '3.141592653589793 (64-bit)', mode: 'dec2bin64', q: '3.141592653589793' }
      ],
      guide: [
        'El estándar IEEE-754 representa números reales en binario mediante tres campos: Signo (1 bit), Exponente sesgado (8 bits con sesgo 127 en 32 bits; 11 bits con sesgo 1023 en 64 bits) y Mantisa o significando fraccionario (23 o 52 bits).',
        'Los números normalizados tienen un 1 implícito delante de la coma (1.M × 2^e). Cuando el exponente almacenado es todo ceros se representan el cero o números subnormales; cuando es todo unos, Infinito o NaN.'
      ],
      refTable: {
        headers: ['Formato', 'Signo', 'Exponente (Sesgo)', 'Mantisa', 'Total'],
        rows: [
          ['Simple (float32)', '1 bit', '8 bits (127)', '23 bits', '32 bits'],
          ['Doble (float64)', '1 bit', '11 bits (1023)', '52 bits', '64 bits']
        ]
      },
      tips: [
        'Convierte por separado la parte entera (divisiones por 2) y la fraccionaria (multiplicaciones por 2).',
        'No olvides sumar el sesgo (+127 en 32 bits, +1023 en 64 bits) al exponente real antes de pasarlo a binario.',
        'Si el número es menor que 2^-126 (en 32 bits), entra en rango subnormal y pierde el 1 implícito.'
      ],
      faqs: [
        { q: '¿Por qué 0.1 no es exacto en IEEE-754?', a: 'Porque 1/10 en base 2 es un binario periódico infinito (0.0001100110011...), por lo que debe redondearse al bit 23 o 52.' },
        { q: '¿Cómo se representa el -0?', a: 'Con bit de signo 1 y todos los bits de exponente y mantisa a 0 (0x80000000 en 32 bits).' },
        { q: '¿Puedo modificar bits individuales?', a: 'Sí, haz clic sobre cualquier bit de Signo, Exponente o Mantisa en la tira interactiva para invertirlo y ver el nuevo valor decimal.' },
        { q: '¿Qué diferencia hay entre NaN e Infinity?', a: 'Ambos tienen el exponente todo a 1s, pero Infinity tiene la mantisa a 0 y NaN tiene la mantisa distinta de 0.' }
      ],
      related: ['bases', 'karnaugh', 'truthTable']
    },
    en: {
      metaTitle: 'IEEE-754 32-bit & 64-bit Converter Step by Step — BitsPasoAPaso',
      metaDescription: 'Convert decimal numbers to IEEE-754 single (32-bit) and double (64-bit) precision step by step. Interactive sign, exponent, and mantissa bits.',
      h1: 'IEEE-754 32-bit & 64-bit Converter Step by Step',
      subtitle: 'Inspect sign, biased exponent, and mantissa with clickable interactive bits, special cases (NaN, Infinity, subnormals), and exact rounding error.',
      modeLabels: { dec2bin32: 'Decimal → 32-bit (Float)', dec2bin64: 'Decimal → 64-bit (Double)', hex2dec32: 'Hex/Bin → 32-bit', hex2dec64: 'Hex/Bin → 64-bit' },
      inputLabel: 'Decimal value or Hex/Binary (e.g. -13.625 or 0xC15A0000)',
      inputPlaceholder: 'e.g. -13.625',
      examples: [
        { label: '-13.625 (32-bit)', mode: 'dec2bin32', q: '-13.625' },
        { label: '0.1 (32-bit rounding)', mode: 'dec2bin32', q: '0.1' },
        { label: '0xC15A0000 (Hex → Dec)', mode: 'hex2dec32', q: '0xC15A0000' },
        { label: '3.141592653589793 (64-bit)', mode: 'dec2bin64', q: '3.141592653589793' }
      ],
      guide: [
        'IEEE-754 encodes real numbers in binary using three fields: Sign (1 bit), Biased Exponent (8 bits with bias 127 for 32-bit; 11 bits with bias 1023 for 64-bit), and Mantissa/Significand (23 or 52 bits).',
        'Normalized numbers have an implicit leading 1 (1.M × 2^e). An all-zero exponent represents zero or subnormal numbers; an all-ones exponent represents Infinity or NaN.'
      ],
      refTable: {
        headers: ['Format', 'Sign', 'Exponent (Bias)', 'Mantissa', 'Total'],
        rows: [
          ['Single (float32)', '1 bit', '8 bits (127)', '23 bits', '32 bits'],
          ['Double (float64)', '1 bit', '11 bits (1023)', '52 bits', '64 bits']
        ]
      },
      tips: [
        'Convert the integer part (divide by 2) and fractional part (multiply by 2) separately.',
        'Always add the bias (+127 for 32-bit, +1023 for 64-bit) to the unbiased exponent.',
        'Values smaller than 2^-126 (in 32-bit) become subnormal and drop the implicit leading 1.'
      ],
      faqs: [
        { q: 'Why is 0.1 not exact in IEEE-754?', a: 'Because 1/10 is a repeating fraction in base 2 (0.0001100110011...), so it must be rounded at bit 23 or 52.' },
        { q: 'How is -0 represented?', a: 'Sign bit 1 with all exponent and mantissa bits set to 0 (0x80000000 in 32-bit).' },
        { q: 'Can I flip individual bits?', a: 'Yes, click any Sign, Exponent, or Mantissa bit in the interactive strip to toggle it and recalculate.' },
        { q: 'What separates NaN from Infinity?', a: 'Both have all-ones exponents, but Infinity has a zero mantissa while NaN has a non-zero mantissa.' }
      ],
      related: ['bases', 'karnaugh', 'truthTable']
    },
    fr: {
      metaTitle: 'Convertisseur IEEE-754 32 et 64 bits étape par étape — BitsPasoAPaso',
      metaDescription: 'Convertissez en virgule flottante IEEE-754 32 bits et 64 bits étape par étape avec bits interactifs de signe, exposant et mantisse.',
      h1: 'Convertisseur IEEE-754 32 et 64 bits étape par étape',
      subtitle: 'Visualisez signe, exposant biaisé et mantisse avec bits cliquables, cas spéciaux (NaN, Infini, dénormalisés) et erreur d’arrondi exacte.',
      modeLabels: { dec2bin32: 'Décimal → 32 bits (Float)', dec2bin64: 'Décimal → 64 bits (Double)', hex2dec32: 'Hex/Bin → 32 bits', hex2dec64: 'Hex/Bin → 64 bits' },
      inputLabel: 'Valeur décimale ou Hex/Binaire (ex. -13.625 ou 0xC15A0000)',
      inputPlaceholder: 'Ex : -13.625',
      examples: [
        { label: '-13.625 (32 bits)', mode: 'dec2bin32', q: '-13.625' },
        { label: '0.1 (Arrondi 32 bits)', mode: 'dec2bin32', q: '0.1' },
        { label: '0xC15A0000 (Hex → Déc)', mode: 'hex2dec32', q: '0xC15A0000' },
        { label: '3.141592653589793 (64 bits)', mode: 'dec2bin64', q: '3.141592653589793' }
      ],
      guide: [
        'La norme IEEE-754 code les réels en binaire selon trois champs : Signe (1 bit), Exposant biaisé (8 bits, biais 127 en 32 bits ; 11 bits, biais 1023 en 64 bits) et Mantisse (23 ou 52 bits).',
        'Les nombres normalisés possèdent un 1 implicite (1.M × 2^e). Un exposant nul code zéro ou les dénormalisés ; un exposant tout à 1 code l’Infini ou NaN.'
      ],
      refTable: {
        headers: ['Format', 'Signe', 'Exposant (Biais)', 'Mantisse', 'Total'],
        rows: [
          ['Simple (float32)', '1 bit', '8 bits (127)', '23 bits', '32 bits'],
          ['Double (float64)', '1 bit', '11 bits (1023)', '52 bits', '64 bits']
        ]
      },
      tips: [
        'Convertissez séparément la partie entière (divisions par 2) et fractionnaire (multiplications par 2).',
        'Ajoutez toujours le biais (+127 en 32 bits, +1023 en 64 bits) à l’exposant réel.',
        'Sous 2^-126 (en 32 bits), le nombre devient dénormalisé et perd le 1 implicite.'
      ],
      faqs: [
        { q: 'Pourquoi 0.1 n’est-il pas exact en IEEE-754 ?', a: 'Car 1/10 est périodique infini en base 2 (0.0001100110011...), ce qui impose un arrondi au bit 23 ou 52.' },
        { q: 'Comment représente-t-on -0 ?', a: 'Bit de signe à 1 avec exposant et mantisse à 0 (0x80000000 en 32 bits).' },
        { q: 'Puis-je inverser des bits individuellement ?', a: 'Oui, cliquez sur n’importe quel bit dans la barre interactive pour recalculer aussitôt.' },
        { q: 'Quelle différence entre NaN et Infini ?', a: 'Tous deux ont un exposant tout à 1, mais l’Infini a une mantisse nulle et NaN une mantisse non nulle.' }
      ],
      related: ['bases', 'karnaugh', 'truthTable']
    }
  },
  karnaugh: {
    es: {
      metaTitle: 'Simplificador de Mapas de Karnaugh (2, 3 y 4 variables) — BitsPasoAPaso',
      metaDescription: 'Resuelve y simplifica Mapas de Karnaugh de 2, 3 y 4 variables paso a paso. Cuadrícula interactiva en código Gray, SOP, POS y lazos visuales.',
      h1: 'Simplificador de Mapas de Karnaugh paso a paso',
      subtitle: 'Toca la Tabla de Verdad o el Mapa en código Gray (0 → 1 → X) sin teclado, o introduce una ecuación booleana para simplificar en SOP y POS con lazos interactivos.',
      modeLabels: { '2': '2 variables (A, B)', '3': '3 variables (A, B, C)', '4': '4 variables (A, B, C, D)' },
      submodeLabels: { table: 'Tabla / Mapa → Ecuación', expr: 'Ecuación → Tabla y Mapa' },
      inputLabel: 'Ecuación booleana (ej. A\'B + BC\') o mintérminos (ej. m(0,1,2,5,6,7) d(3))',
      inputPlaceholder: 'Ej: A\'B\' + A\'B + AB  o  m(0,1,2,5,6,7) d(3)',
      examples: [
        { label: '3 vars: m(0,1,2,5,6,7)', mode: '3', q: 'm(0,1,2,5,6,7)' },
        { label: "Ecuación: A'B' + A'B + AB", mode: '2:expr', q: "A'B' + A'B + AB" },
        { label: '4 vars con X: m(1,3,7,11,15) d(0,2,5)', mode: '4', q: 'm(1,3,7,11,15) d(0,2,5)' },
        { label: "Ecuación 3v: !A·B + B·C' + A⊕C", mode: '3:expr', q: "!A·B + B·C' + A⊕C" }
      ],
      guide: [
        'Un Mapa de Karnaugh ordena las filas y columnas siguiendo el código Gray (00, 01, 11, 10) para que dos celdas adyacentes —incluidos los bordes opuestos y las esquinas— difieran en exactamente una variable.',
        'Para minimizar en Suma de Productos (SOP) se agrupan los 1s (aprovechando las X solo si amplían el grupo) en rectángulos de tamaño potencia de 2 (1, 2, 4, 8, 16). Este motor aplica Quine-McCluskey con cobertura mínima exacta.'
      ],
      refTable: {
        headers: ['Tamaño del lazo', 'Variables eliminadas', 'Literales en 4 vars'],
        rows: [
          ['1 celda (2^0)', '0 variables', '4 literales (ej. A·B·C·D)'],
          ['2 celdas (2^1)', '1 variable', '3 literales'],
          ['4 celdas (2^2)', '2 variables', '2 literales'],
          ['8 celdas (2^3)', '3 variables', '1 literal'],
          ['16 celdas (2^4)', '4 variables', 'Constante 1']
        ]
      },
      tips: [
        'Los bordes izquierdo/derecho y superior/inferior son adyacentes: ¡recuerda comprobar siempre las esquinas!',
        'Un término "don’t care" (X) es opcional: úsalo para hacer un grupo más grande, pero nunca formes un grupo que solo contenga X.',
        'Si todas las celdas son 0, la función es 0; si todas son 1 (o 1 y X), la función es 1.'
      ],
      faqs: [
        { q: '¿Por qué se usa código Gray (00, 01, 11, 10)?', a: 'Porque garantiza que al pasar de una celda a la siguiente solo cambie 1 bit, permitiendo eliminar esa variable al agrupar.' },
        { q: '¿Qué diferencia hay entre SOP y POS?', a: 'SOP (Suma de Productos) agrupa los 1s como suma de términos AND. POS (Producto de Sumas) agrupa los 0s como producto de términos OR.' },
        { q: '¿Puedo editar el mapa haciendo clic en las celdas?', a: 'Sí, cada clic sobre una celda alterna su valor entre 0, 1 y X y actualiza los lazos y expresiones al instante.' },
        { q: '¿Cómo garantiza la solución mínima?', a: 'Calculando todos los implicantes primos mediante Quine-McCluskey y resolviendo la cobertura exacta (implicantes esenciales + mínimo conjunto restante).' }
      ],
      related: ['truthTable', 'bases', 'ieee754']
    },
    en: {
      metaTitle: 'Karnaugh Map Solver (2, 3 & 4 Variables) Step by Step — BitsPasoAPaso',
      metaDescription: 'Simplify 2, 3, and 4-variable Karnaugh maps step by step. Interactive Gray-code grid, visual grouping loops, SOP & POS minimal expressions.',
      h1: 'Karnaugh Map Solver Step by Step',
      subtitle: 'Tap the Truth Table or Gray-code Map (0 → 1 → X) with zero typing, or enter a Boolean equation to simplify into SOP and POS with interactive loops.',
      modeLabels: { '2': '2 variables (A, B)', '3': '3 variables (A, B, C)', '4': '4 variables (A, B, C, D)' },
      submodeLabels: { table: 'Table / Map → Equation', expr: 'Equation → Table & Map' },
      inputLabel: 'Boolean equation (e.g. A\'B + BC\') or minterms (e.g. m(0,1,2,5,6,7) d(3))',
      inputPlaceholder: 'e.g. A\'B\' + A\'B + AB  or  m(0,1,2,5,6,7) d(3)',
      examples: [
        { label: '3 vars: m(0,1,2,5,6,7)', mode: '3', q: 'm(0,1,2,5,6,7)' },
        { label: "Equation: A'B' + A'B + AB", mode: '2:expr', q: "A'B' + A'B + AB" },
        { label: '4 vars w/ X: m(1,3,7,11,15) d(0,2,5)', mode: '4', q: 'm(1,3,7,11,15) d(0,2,5)' },
        { label: "Equation 3v: !A·B + B·C' + A⊕C", mode: '3:expr', q: "!A·B + B·C' + A⊕C" }
      ],
      guide: [
        'A Karnaugh map orders rows and columns in Gray code (00, 01, 11, 10) so adjacent cells—including wrap-around edges and corners—differ in only one variable.',
        'To minimize Sum of Products (SOP), group 1s (and optional X don’t cares) into power-of-2 rectangles (1, 2, 4, 8, 16). This solver runs Quine-McCluskey with exact minimum coverage.'
      ],
      refTable: {
        headers: ['Group Size', 'Eliminated Vars', 'Literals in 4-var'],
        rows: [
          ['1 cell (2^0)', '0 variables', '4 literals (e.g. A·B·C·D)'],
          ['2 cells (2^1)', '1 variable', '3 literals'],
          ['4 cells (2^2)', '2 variables', '2 literals'],
          ['8 cells (2^3)', '3 variables', '1 literal'],
          ['16 cells (2^4)', '4 variables', 'Constant 1']
        ]
      },
      tips: [
        'Opposite edges and all four corners wrap around and are adjacent.',
        'Don’t cares (X) are optional: use them to enlarge groups, never create a group of X cells alone.',
        'If there are no 1s, the output is constant 0; if all cells are 1 or X (with at least one 1, or all 1s), check constant 1.'
      ],
      faqs: [
        { q: 'Why is Gray code (00, 01, 11, 10) used?', a: 'It ensures adjacent cells differ by only 1 bit, which cancels out that variable when grouped.' },
        { q: 'What is the difference between SOP and POS?', a: 'SOP (Sum of Products) groups 1s into ORed AND-terms. POS (Product of Sums) groups 0s into ANDed OR-terms.' },
        { q: 'Can I edit the map by clicking cells?', a: 'Yes, clicking any cell cycles between 0, 1, and X and updates loops and expressions immediately.' },
        { q: 'How is minimality guaranteed?', a: 'By generating all prime implicants via Quine-McCluskey and finding the exact minimum cover.' }
      ],
      related: ['truthTable', 'bases', 'ieee754']
    },
    fr: {
      metaTitle: 'Simplificateur de Tableau de Karnaugh (2, 3 et 4 variables) — BitsPasoAPaso',
      metaDescription: 'Simplifiez des tableaux de Karnaugh à 2, 3 et 4 variables étape par étape. Grille interactive en code Gray, boucles visuelles, SOP et POS.',
      h1: 'Simplificateur de Tableau de Karnaugh étape par étape',
      subtitle: 'Touchez la Table de Vérité ou le Tableau en code Gray (0 → 1 → X) sans clavier, ou saisissez une équation booléenne pour simplifier en SOP et POS.',
      modeLabels: { '2': '2 variables (A, B)', '3': '3 variables (A, B, C)', '4': '4 variables (A, B, C, D)' },
      submodeLabels: { table: 'Table / Tableau → Équation', expr: 'Équation → Table & Tableau' },
      inputLabel: 'Équation booléenne (ex. A\'B + BC\') ou mintermes (ex. m(0,1,2,5,6,7) d(3))',
      inputPlaceholder: 'Ex : A\'B\' + A\'B + AB  ou  m(0,1,2,5,6,7) d(3)',
      examples: [
        { label: '3 vars : m(0,1,2,5,6,7)', mode: '3', q: 'm(0,1,2,5,6,7)' },
        { label: "Équation : A'B' + A'B + AB", mode: '2:expr', q: "A'B' + A'B + AB" },
        { label: '4 vars avec X : m(1,3,7,11,15) d(0,2,5)', mode: '4', q: 'm(1,3,7,11,15) d(0,2,5)' },
        { label: "Équation 3v : !A·B + B·C' + A⊕C", mode: '3:expr', q: "!A·B + B·C' + A⊕C" }
      ],
      guide: [
        'Un tableau de Karnaugh ordonne lignes et colonnes en code Gray (00, 01, 11, 10) afin que deux cases adjacentes — bords opposés et coins inclus — ne diffèrent que d’une seule variable.',
        'Pour minimiser en somme de produits (SOP), on regroupe les 1 (avec les X si utile) en rectangles de taille puissance de 2. Ce moteur applique Quine-McCluskey avec couverture minimale exacte.'
      ],
      refTable: {
        headers: ['Taille du groupe', 'Variables éliminées', 'Littéraux (4 vars)'],
        rows: [
          ['1 case (2^0)', '0 variable', '4 littéraux'],
          ['2 cases (2^1)', '1 variable', '3 littéraux'],
          ['4 cases (2^2)', '2 variables', '2 littéraux'],
          ['8 cases (2^3)', '3 variables', '1 littéral'],
          ['16 cases (2^4)', '4 variables', 'Constante 1']
        ]
      },
      tips: [
        'Les bords gauche/droite et haut/bas se rejoignent : pensez toujours aux coins !',
        'Un état indifférent (X) est facultatif : utilisez-le pour agrandir un groupe, jamais pour former un groupe composé uniquement de X.',
        'Sans aucun 1, la fonction vaut 0 ; si toutes les cases valent 1 (ou 1 et X), la fonction vaut 1.'
      ],
      faqs: [
        { q: 'Pourquoi utiliser le code Gray (00, 01, 11, 10) ?', a: 'Il garantit qu’un seul bit change entre deux cases voisines, ce qui permet d’éliminer cette variable.' },
        { q: 'Quelle différence entre SOP et POS ?', a: 'SOP regroupe les 1 (somme de produits) ; POS regroupe les 0 (produit de sommes).' },
        { q: 'Puis-je modifier le tableau en cliquant ?', a: 'Oui, chaque clic fait tourner la case entre 0, 1 et X et met à jour les boucles immédiatement.' },
        { q: 'Comment la minimalité est-elle garantie ?', a: 'Par génération des implicants premiers (Quine-McCluskey) et recherche de la couverture exacte.' }
      ],
      related: ['truthTable', 'bases', 'ieee754']
    }
  },
  bases: {
    es: {
      metaTitle: 'Conversor de Bases, Complemento a 2 y BCD paso a paso — BitsPasoAPaso',
      metaDescription: 'Convierte enteros entre Decimal, Binario, Octal, Hexadecimal, Complemento a 1, Complemento a 2 (8/16/32 bits), BCD y Gray paso a paso.',
      h1: 'Conversor de Bases, Complemento a 2 y BCD paso a paso',
      subtitle: 'Divisiones sucesivas, agrupación de nibbles, inversión + 1 con detección de overflow en 8, 16 y 32 bits, código BCD y Gray.',
      modeLabels: { '8': '8 bits', '16': '16 bits', '32': '32 bits' },
      inputLabel: 'Número y base de origen (ej. -42, 0b11010110, 0xD6, 0o326)',
      inputPlaceholder: 'Ej: -42 o 0xD6',
      examples: [
        { label: '-42 (8 bits C2)', mode: '8', q: '-42' },
        { label: '214 (8 bits)', mode: '8', q: '214' },
        { label: '0xCAFE (16 bits)', mode: '16', q: '0xCAFE' },
        { label: '0b1111111110101100 (16 bits)', mode: '16', q: '0b1111111110101100' }
      ],
      guide: [
        'El Complemento a 2 es el estándar para representar enteros con signo en procesadores modernos. Para un ancho de n bits, el rango con signo abarca desde -2^(n-1) hasta 2^(n-1) - 1.',
        'Para obtener el Complemento a 2 de un número negativo -X: se escribe |X| en binario de n bits, se invierten todos los bits (Complemento a 1) y se suma 1. En BCD cada dígito decimal se codifica por separado en 4 bits.'
      ],
      refTable: {
        headers: ['Ancho (n)', 'Rango Sin Signo', 'Rango Complemento a 2'],
        rows: [
          ['8 bits', '0 a 255', '-128 a +127'],
          ['16 bits', '0 a 65.535', '-32.768 a +32.767'],
          ['32 bits', '0 a 4.294.967.295', '-2.147.483.648 a +2.147.483.647']
        ]
      },
      tips: [
        'En Complemento a 2, el bit más significativo (MSB) indica el signo: 0 para positivo o cero, 1 para negativo.',
        'Para pasar rápido de binario a hexadecimal, agrupa de 4 en 4 bits desde la derecha.',
        'Para pasar de binario a código Gray, conserva el primer bit y haz XOR entre cada bit y el anterior.'
      ],
      faqs: [
        { q: '¿Qué es el overflow en Complemento a 2?', a: 'Ocurre cuando el número está fuera del rango representable [-2^(n-1), 2^(n-1)-1], por ejemplo +128 o -129 en 8 bits.' },
        { q: '¿Cómo indico la base de entrada?', a: 'Usa prefijos 0b (binario), 0o (octal), 0x (hexadecimal) o escribe directamente un entero decimal (positivo o negativo).' },
        { q: '¿Qué diferencia hay entre binario puro y BCD?', a: 'En BCD cada dígito decimal (0-9) ocupa 4 bits independientes; por ejemplo, 42 en BCD es 0100 0010, mientras que en binario puro es 00101010.' },
        { q: '¿Por qué el Complemento a 2 solo tiene un cero?', a: 'Al sumar 1 tras invertir 00000000 (11111111 + 1), se desborda el bit extra y vuelve a 00000000, evitando el -0 del Complemento a 1.' }
      ],
      related: ['ieee754', 'karnaugh', 'raidChmod']
    },
    en: {
      metaTitle: "Binary, Two's Complement & BCD Converter Step by Step — BitsPasoAPaso",
      metaDescription: "Convert integers between Decimal, Binary, Octal, Hexadecimal, 1's/2's Complement (8/16/32-bit), BCD, and Gray code step by step.",
      h1: "Binary, Two's Complement & BCD Converter Step by Step",
      subtitle: 'Successive divisions, nibble grouping, bit inversion + 1 with overflow detection for 8, 16, and 32 bits, BCD, and Gray code.',
      modeLabels: { '8': '8-bit', '16': '16-bit', '32': '32-bit' },
      inputLabel: 'Number & input base (e.g. -42, 0b11010110, 0xD6, 0o326)',
      inputPlaceholder: 'e.g. -42 or 0xD6',
      examples: [
        { label: "-42 (8-bit 2's Comp)", mode: '8', q: '-42' },
        { label: '214 (8-bit)', mode: '8', q: '214' },
        { label: '0xCAFE (16-bit)', mode: '16', q: '0xCAFE' },
        { label: '0b1111111110101100 (16-bit)', mode: '16', q: '0b1111111110101100' }
      ],
      guide: [
        "Two's complement is the universal standard for signed integers in modern CPUs. For n bits, the signed range spans [-2^(n-1), 2^(n-1) - 1].",
        "To encode a negative integer -X in Two's complement: write |X| in n-bit binary, invert all bits (One's complement), and add 1. In BCD, each decimal digit is encoded independently in 4 bits."
      ],
      refTable: {
        headers: ['Width (n)', 'Unsigned Range', "Two's Complement Range"],
        rows: [
          ['8-bit', '0 to 255', '-128 to +127'],
          ['16-bit', '0 to 65,535', '-32,768 to +32,767'],
          ['32-bit', '0 to 4,294,967,295', '-2,147,483,648 to +2,147,483,647']
        ]
      },
      tips: [
        "In Two's complement, the Most Significant Bit (MSB) acts as the sign bit: 0 for non-negative, 1 for negative.",
        'Group binary bits in sets of 4 from right to left to convert directly to hexadecimal.',
        'To convert binary to Gray code, keep the MSB and XOR each subsequent bit with the previous binary bit.'
      ],
      faqs: [
        { q: "What causes overflow in Two's complement?", a: 'When the value falls outside [-2^(n-1), 2^(n-1)-1], such as +128 or -129 in 8 bits.' },
        { q: 'How do I specify the input base?', a: 'Use prefixes 0b (binary), 0o (octal), 0x (hexadecimal), or type a signed decimal integer directly.' },
        { q: 'How does BCD differ from pure binary?', a: 'BCD encodes each decimal digit (0-9) as a 4-bit nibble: 42 in BCD is 0100 0010, whereas pure binary is 00101010.' },
        { q: "Why does Two's complement have only one zero?", a: 'Inverting 00000000 gives 11111111; adding 1 wraps around to 00000000, eliminating negative zero.' }
      ],
      related: ['ieee754', 'karnaugh', 'raidChmod']
    },
    fr: {
      metaTitle: 'Convertisseur Binaire, Complément à 2 et BCD étape par étape — BitsPasoAPaso',
      metaDescription: 'Convertissez entre Décimal, Binaire, Octal, Hexadécimal, Complément à 1 et 2 (8/16/32 bits), BCD et code Gray étape par étape.',
      h1: 'Convertisseur Binaire, Complément à 2 et BCD étape par étape',
      subtitle: 'Divisions successives, groupement par quartets, inversion + 1 avec détection de dépassement (8, 16, 32 bits), BCD et Gray.',
      modeLabels: { '8': '8 bits', '16': '16 bits', '32': '32 bits' },
      inputLabel: 'Nombre et base source (ex. -42, 0b11010110, 0xD6, 0o326)',
      inputPlaceholder: 'Ex : -42 ou 0xD6',
      examples: [
        { label: '-42 (8 bits C2)', mode: '8', q: '-42' },
        { label: '214 (8 bits)', mode: '8', q: '214' },
        { label: '0xCAFE (16 bits)', mode: '16', q: '0xCAFE' },
        { label: '0b1111111110101100 (16 bits)', mode: '16', q: '0b1111111110101100' }
      ],
      guide: [
        'Le complément à 2 est la norme pour les entiers signés dans les processeurs. Sur n bits, l’intervalle signé couvre [-2^(n-1), 2^(n-1) - 1].',
        'Pour coder -X en complément à 2 : écrire |X| sur n bits, inverser tous les bits (complément à 1) et ajouter 1. En BCD, chaque chiffre décimal est codé sur 4 bits.'
      ],
      refTable: {
        headers: ['Largeur (n)', 'Non signé', 'Complément à 2'],
        rows: [
          ['8 bits', '0 à 255', '-128 à +127'],
          ['16 bits', '0 à 65 535', '-32 768 à +32 767'],
          ['32 bits', '0 à 4 294 967 295', '-2 147 483 648 à +2 147 483 647']
        ]
      },
      tips: [
        'En complément à 2, le bit de poids fort (MSB) indique le signe (0 positif, 1 négatif).',
        'Regroupez les bits par 4 de droite à gauche pour passer instantanément en hexadécimal.',
        'Pour obtenir le code Gray, conservez le MSB puis appliquez un XOR entre chaque bit et le précédent.'
      ],
      faqs: [
        { q: 'Quand y a-t-il dépassement en complément à 2 ?', a: 'Lorsque la valeur sort de [-2^(n-1), 2^(n-1)-1], par exemple +128 ou -129 sur 8 bits.' },
        { q: 'Comment indiquer la base d’entrée ?', a: 'Utilisez 0b (binaire), 0o (octal), 0x (hexadécimal) ou saisissez directement un entier décimal.' },
        { q: 'Quelle différence entre binaire pur et BCD ?', a: 'Le BCD code chaque chiffre décimal sur 4 bits (42 → 0100 0010), tandis que le binaire pur donne 00101010.' },
        { q: 'Pourquoi n’y a-t-il qu’un seul zéro en complément à 2 ?', a: 'Inverser 00000000 donne 11111111 ; ajouter 1 déborde et ramène à 00000000.' }
      ],
      related: ['ieee754', 'karnaugh', 'raidChmod']
    }
  },
  hamming: {
    es: {
      metaTitle: 'Calculadora de Código Hamming y CRC paso a paso — BitsPasoAPaso',
      metaDescription: 'Codifica, detecta y corrige errores de 1 bit con Código Hamming (paridad par/impar) y resuelve divisiones binarias XOR CRC paso a paso.',
      h1: 'Calculadora de Código Hamming y CRC paso a paso',
      subtitle: 'Calcula bits de paridad P_k, tabla de cobertura, síndrome corrector de 1 bit y división polinómica XOR módulo 2 para CRC.',
      modeLabels: {
        hamming_even: 'Hamming (Paridad Par)',
        hamming_odd: 'Hamming (Paridad Impar)',
        hamming_check: 'Verificar/Corregir Hamming',
        crc: 'CRC (División XOR)'
      },
      inputLabel: 'Trama binaria (y polinomio o palabra recibida si aplica)',
      inputPlaceholder: 'Ej: 1011001 (Hamming) o 1101011011 ; 10011 (CRC)',
      examples: [
        { label: 'Hamming Par: 1011001', mode: 'hamming_even', q: '1011001' },
        { label: 'Corregir bit 6: 10101101110', mode: 'hamming_check', q: '10101101110' },
        { label: 'CRC-4: 1101011011 ; 10011', mode: 'crc', q: '1101011011 ; 10011' },
        { label: 'CRC-8: 11010011101100 ; 1011', mode: 'crc', q: '11010011101100 ; 1011' }
      ],
      guide: [
        'El Código Hamming añade r bits de paridad en las posiciones potencia de 2 (1, 2, 4, 8...) de modo que 2^r >= m + r + 1. Al recibir la palabra, se recalcula cada paridad para formar el síndrome binario; si es distinto de 0, indica la posición exacta del bit erróneo.',
        'El CRC (Cyclic Redundancy Check) añade k - 1 ceros al mensaje (siendo k la longitud del polinomio generador) y realiza una división binaria sin acarreo (XOR). El resto obtenido se concatena al mensaje original para que el receptor obtenga resto 0.'
      ],
      refTable: {
        headers: ['Bits datos (m)', 'Bits paridad (r)', 'Total (m + r)', 'Posiciones P_k'],
        rows: [
          ['4 bits', '3 bits', '7 bits (7,4)', '1, 2, 4'],
          ['7 bits', '4 bits', '11 bits (11,7)', '1, 2, 4, 8'],
          ['8 bits', '4 bits', '12 bits (12,8)', '1, 2, 4, 8'],
          ['11 bits', '4 bits', '15 bits (15,11)', '1, 2, 4, 8']
        ]
      },
      tips: [
        'En Hamming, el bit P_k cubre todas las posiciones cuya representación binaria tiene un 1 en el bit de peso k.',
        'Si el síndrome en Hamming es 0110 (6 en decimal), el bit erróneo está en la posición 6 (contando desde 1).',
        'En CRC, la resta binaria es idéntica a la suma módulo 2: una simple operación XOR bit a bit sin llevadas.'
      ],
      faqs: [
        { q: '¿Cuántos errores corrige el código Hamming estándar?', a: 'Detecta hasta 2 errores y corrige automáticamente cualquier error de 1 bit.' },
        { q: '¿Cómo se elige el número de ceros añadidos en CRC?', a: 'Se añaden tantos ceros como el grado del polinomio generador (longitud del generador menos 1).' },
        { q: '¿Puedo simular un error en Hamming?', a: 'Sí, en el resultado de Hamming puedes hacer clic en cualquier bit para invertirlo y observar el cálculo del síndrome corrector.' },
        { q: '¿Qué significa que el CRC dé resto 0 al verificar?', a: 'Significa que la trama recibida es un múltiplo exacto del polinomio generador y no se han detectado errores de transmisión.' }
      ],
      related: ['bandwidth', 'vlsm', 'raidChmod']
    },
    en: {
      metaTitle: 'Hamming Code & CRC Calculator Step by Step — BitsPasoAPaso',
      metaDescription: 'Encode, detect, and correct 1-bit errors with Hamming Code (even/odd parity) and compute step-by-step modulo-2 XOR CRC division.',
      h1: 'Hamming Code & CRC Calculator Step by Step',
      subtitle: 'Compute P_k parity bits, coverage matrix, 1-bit error-correcting syndrome, and full modulo-2 XOR division for CRC.',
      modeLabels: {
        hamming_even: 'Hamming (Even Parity)',
        hamming_odd: 'Hamming (Odd Parity)',
        hamming_check: 'Check/Correct Hamming',
        crc: 'CRC (XOR Division)'
      },
      inputLabel: 'Binary frame (and generator polynomial or received word)',
      inputPlaceholder: 'e.g. 1011001 (Hamming) or 1101011011 ; 10011 (CRC)',
      examples: [
        { label: 'Hamming Even: 1011001', mode: 'hamming_even', q: '1011001' },
        { label: 'Fix bit 6: 10101101110', mode: 'hamming_check', q: '10101101110' },
        { label: 'CRC-4: 1101011011 ; 10011', mode: 'crc', q: '1101011011 ; 10011' },
        { label: 'CRC-3: 11010011101100 ; 1011', mode: 'crc', q: '11010011101100 ; 1011' }
      ],
      guide: [
        'Hamming Code inserts r parity bits at power-of-2 positions (1, 2, 4, 8...) such that 2^r >= m + r + 1. On reception, recomputing parity produces a binary syndrome whose value points directly to any single-bit error.',
        'CRC (Cyclic Redundancy Check) appends k - 1 zeros to the data (where k is the generator length) and performs carry-less modulo-2 XOR division. The remainder is appended to the frame so the receiver obtains remainder 0.'
      ],
      refTable: {
        headers: ['Data bits (m)', 'Parity bits (r)', 'Total (m + r)', 'P_k positions'],
        rows: [
          ['4 bits', '3 bits', '7 bits (7,4)', '1, 2, 4'],
          ['7 bits', '4 bits', '11 bits (11,7)', '1, 2, 4, 8'],
          ['8 bits', '4 bits', '12 bits (12,8)', '1, 2, 4, 8'],
          ['11 bits', '4 bits', '15 bits (15,11)', '1, 2, 4, 8']
        ]
      },
      tips: [
        'In Hamming, parity bit P_k covers every position whose binary index has a 1 in bit weight k.',
        'If the Hamming syndrome is 0110 (6 in decimal), the flipped bit is at 1-based position 6.',
        'In CRC, binary subtraction without borrows is simply bitwise XOR.'
      ],
      faqs: [
        { q: 'How many errors can standard Hamming correct?', a: 'It detects up to 2-bit errors and automatically corrects any single-bit error.' },
        { q: 'How many zeros are appended in CRC?', a: 'Equal to the degree of the generator polynomial (generator bit length minus 1).' },
        { q: 'Can I simulate a bit flip in Hamming?', a: 'Yes, click any bit in the encoded Hamming output to flip it and watch the syndrome locate and fix it.' },
        { q: 'What does a 0 remainder mean when verifying CRC?', a: 'The received frame is divisible by the generator polynomial, indicating no detected transmission errors.' }
      ],
      related: ['bandwidth', 'vlsm', 'raidChmod']
    },
    fr: {
      metaTitle: 'Calculateur Code de Hamming et CRC étape par étape — BitsPasoAPaso',
      metaDescription: 'Codez, détectez et corrigez 1 bit avec le Code de Hamming (parité paire/impaire) et résolvez la division binaire XOR CRC étape par étape.',
      h1: 'Calculateur Code de Hamming et CRC étape par étape',
      subtitle: 'Calculez les bits de parité P_k, la matrice de couverture, le syndrome correcteur et la division polynomiale XOR modulo 2.',
      modeLabels: {
        hamming_even: 'Hamming (Parité Paire)',
        hamming_odd: 'Hamming (Parité Impaire)',
        hamming_check: 'Vérifier/Corriger Hamming',
        crc: 'CRC (Division XOR)'
      },
      inputLabel: 'Trame binaire (et polynôme générateur ou mot reçu)',
      inputPlaceholder: 'Ex : 1011001 (Hamming) ou 1101011011 ; 10011 (CRC)',
      examples: [
        { label: 'Hamming Pair : 1011001', mode: 'hamming_even', q: '1011001' },
        { label: 'Corriger bit 6 : 10101101110', mode: 'hamming_check', q: '10101101110' },
        { label: 'CRC-4 : 1101011011 ; 10011', mode: 'crc', q: '1101011011 ; 10011' },
        { label: 'CRC-3 : 11010011101100 ; 1011', mode: 'crc', q: '11010011101100 ; 1011' }
      ],
      guide: [
        'Le code de Hamming insère r bits de parité aux positions puissances de 2 (1, 2, 4, 8...) tels que 2^r >= m + r + 1. À la réception, le syndrome binaire indique directement la position d’une erreur sur 1 bit.',
        'Le CRC ajoute k - 1 zéros au message et effectue une division binaire sans retenue (XOR). Le reste est ajouté à la trame afin d’obtenir un reste nul à la vérification.'
      ],
      refTable: {
        headers: ['Bits données (m)', 'Bits parité (r)', 'Total (m + r)', 'Positions P_k'],
        rows: [
          ['4 bits', '3 bits', '7 bits (7,4)', '1, 2, 4'],
          ['7 bits', '4 bits', '11 bits (11,7)', '1, 2, 4, 8'],
          ['8 bits', '4 bits', '12 bits (12,8)', '1, 2, 4, 8'],
          ['11 bits', '4 bits', '15 bits (15,11)', '1, 2, 4, 8']
        ]
      },
      tips: [
        'En Hamming, P_k couvre toutes les positions dont l’indice binaire possède un 1 au poids k.',
        'Si le syndrome vaut 0110 (6 en décimal), le bit erroné se trouve en position 6.',
        'En CRC, la soustraction sans retenue correspond exactement à l’opération XOR bit à bit.'
      ],
      faqs: [
        { q: 'Combien d’erreurs le code de Hamming corrige-t-il ?', a: 'Il détecte jusqu’à 2 erreurs et corrige automatiquement toute erreur sur 1 bit.' },
        { q: 'Combien de zéros ajoute-t-on en CRC ?', a: 'Autant que le degré du polynôme générateur (longueur du générateur moins 1).' },
        { q: 'Puis-je simuler une erreur en Hamming ?', a: 'Oui, cliquez sur n’importe quel bit du mot codé pour l’inverser et observer le syndrome.' },
        { q: 'Que signifie un reste CRC nul ?', a: 'La trame reçue est divisible par le générateur : aucune erreur de transmission n’est détectée.' }
      ],
      related: ['bandwidth', 'vlsm', 'raidChmod']
    }
  }
};
