export const PHASE2_CONTENT = {
  cidr: {
    es: {
      metaTitle: 'Calculadora CIDR y Supernetting / Sumarización de Rutas — BitsPasoAPaso',
      metaDescription: 'Sumariza rutas IPv4 en binario paso a paso, detecta sobre-sumarización y descompone rangos IP en bloques CIDR mínimos.',
      h1: 'Calculadora CIDR y Supernetting paso a paso',
      subtitle: 'Agrega rutas IPv4 encontrando el prefijo común más largo en binario o descompón un rango IP en los bloques CIDR mínimos exactos.',
      modeLabels: { summarize: 'Sumarización (Supernetting)', range: 'Rango IP → Bloques CIDR' },
      inputLabel: 'Redes IPv4/CIDR (separadas por comas) o Rango (IP_inicio - IP_fin)',
      inputPlaceholder: 'Ej: 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24',
      examples: [
        { label: 'Supernet exacta /22', mode: 'summarize', q: '192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24' },
        { label: 'Sobre-sumarización', mode: 'summarize', q: '10.10.0.0/24, 10.10.1.0/24, 10.10.3.0/24' },
        { label: 'Rango → CIDR exacto', mode: 'range', q: '192.168.1.0 - 192.168.1.255' },
        { label: 'Rango parcial .10 - .70', mode: 'range', q: '192.168.1.10 - 192.168.1.70' }
      ],
      guide: [
        'La sumarización de rutas (supernetting) agrupa múltiples prefijos contiguos en una sola entrada de tabla de enrutamiento buscando los bits más significativos idénticos de izquierda a derecha.',
        'Una sumarización es exacta solo cuando las redes originales son contiguas y su suma total de direcciones coincide con 2^(32 - prefijo_común).'
      ],
      refTable: {
        headers: ['Redes /24 agrupadas', 'Prefijo resumen', 'Máscara', 'Condición'],
        rows: [
          ['2 redes (/24)', '/23', '255.255.254.0', 'Inicio par (.0, .2, .4...)'],
          ['4 redes (/24)', '/22', '255.255.252.0', 'Múltiplo de 4 (.0, .4, .8...)'],
          ['8 redes (/24)', '/21', '255.255.248.0', 'Múltiplo de 8 (.0, .8, .16...)'],
          ['16 redes (/24)', '/20', '255.255.240.0', 'Múltiplo de 16']
        ]
      },
      tips: [
        'Para que 4 redes /24 se sumaricen exactamente en un /22, el tercer octeto inicial debe ser múltiplo de 4.',
        'Si faltan subredes intermedias, la ruta resumen provocará sobre-sumarización y podría atraer tráfico no deseado.',
        'En descomposición de rangos, cada bloque CIDR debe empezar en un múltiplo exacto de su tamaño 2^h.'
      ],
      faqs: [
        { q: '¿Qué es el supernetting?', a: 'Es el proceso inverso al subnetting: combinar varias redes pequeñas en un bloque CIDR más grande para reducir las tablas de rutas.' },
        { q: '¿Cuándo es exacta una sumarización?', a: 'Cuando la cantidad de direcciones únicas de las redes de entrada iguala exactamente el tamaño 2^(32-n) de la ruta resumen.' },
        { q: '¿Cómo se descompone un rango IP arbitrario?', a: 'Mediante un algoritmo voraz que en cada paso elige el mayor bloque 2^k alineado que cabe sin superar la IP final.' },
        { q: '¿Por qué es importante en BGP y OSPF?', a: 'Reduce el consumo de memoria y CPU en los routers al anunciar cientos de subredes bajo un único prefijo agregado.' }
      ],
      related: ['vlsm', 'ipv6', 'bandwidth']
    },
    en: {
      metaTitle: 'CIDR & Supernetting / Route Summarization Calculator — BitsPasoAPaso',
      metaDescription: 'Summarize IPv4 routes in binary step by step, detect over-summarization, and decompose IP ranges into minimal CIDR blocks.',
      h1: 'CIDR & Supernetting Calculator Step by Step',
      subtitle: 'Aggregate IPv4 routes via longest common binary prefix or split any IP range into minimal exact CIDR blocks.',
      modeLabels: { summarize: 'Route Summarization', range: 'IP Range → CIDR Blocks' },
      inputLabel: 'IPv4/CIDR networks (comma-separated) or Range (start_IP - end_IP)',
      inputPlaceholder: 'e.g. 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24',
      examples: [
        { label: 'Exact /22 supernet', mode: 'summarize', q: '192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24' },
        { label: 'Over-summarization', mode: 'summarize', q: '10.10.0.0/24, 10.10.1.0/24, 10.10.3.0/24' },
        { label: 'Range → /24', mode: 'range', q: '192.168.1.0 - 192.168.1.255' },
        { label: 'Partial range .10 - .70', mode: 'range', q: '192.168.1.10 - 192.168.1.70' }
      ],
      guide: [
        'Route summarization (supernetting) merges multiple prefixes into one routing entry by finding the longest identical leftmost bit prefix.',
        'A summary route is exact only when input networks are contiguous and their total unique addresses equal 2^(32 - common_prefix).'
      ],
      refTable: {
        headers: ['Grouped /24s', 'Summary Prefix', 'Mask', 'Alignment'],
        rows: [
          ['2 × /24', '/23', '255.255.254.0', 'Even start (.0, .2, .4...)'],
          ['4 × /24', '/22', '255.255.252.0', 'Multiple of 4 (.0, .4, .8...)'],
          ['8 × /24', '/21', '255.255.248.0', 'Multiple of 8 (.0, .8, .16...)'],
          ['16 × /24', '/20', '255.255.240.0', 'Multiple of 16']
        ]
      },
      tips: [
        'To summarize four /24s cleanly into a /22, the starting third octet must be divisible by 4.',
        'Missing intermediate subnets cause over-summarization, absorbing extra unowned IP space.',
        'In range decomposition, each CIDR block must start on an exact multiple of 2^h.'
      ],
      faqs: [
        { q: 'What is supernetting?', a: 'The inverse of subnetting: combining smaller contiguous networks into a single larger CIDR block.' },
        { q: 'When is summarization exact?', a: 'When the union of input addresses equals 2^(32-n) with no gaps.' },
        { q: 'How are arbitrary IP ranges converted to CIDR?', a: 'By greedily picking the largest aligned 2^k block at each cursor that fits within the end IP.' },
        { q: 'Why summarize routes in BGP/OSPF?', a: 'It shrinks routing tables and limits topology churn propagation.' }
      ],
      related: ['vlsm', 'ipv6', 'bandwidth']
    },
    fr: {
      metaTitle: 'Calculateur CIDR et Supernetting / Agrégation de Routes — BitsPasoAPaso',
      metaDescription: 'Agrégez des routes IPv4 en binaire étape par étape, détectez la sur-agrégation et décomposez des plages IP en blocs CIDR.',
      h1: 'Calculateur CIDR et Supernetting étape par étape',
      subtitle: 'Agrégez des préfixes IPv4 par plus long préfixe commun ou décomposez une plage IP en blocs CIDR minimaux.',
      modeLabels: { summarize: 'Agrégation (Supernetting)', range: 'Plage IP → Blocs CIDR' },
      inputLabel: 'Réseaux IPv4/CIDR (séparés par virgules) ou Plage (IP_début - IP_fin)',
      inputPlaceholder: 'Ex : 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24',
      examples: [
        { label: 'Supernet exact /22', mode: 'summarize', q: '192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24' },
        { label: 'Sur-agrégation', mode: 'summarize', q: '10.10.0.0/24, 10.10.1.0/24, 10.10.3.0/24' },
        { label: 'Plage → /24', mode: 'range', q: '192.168.1.0 - 192.168.1.255' },
        { label: 'Plage .10 - .70', mode: 'range', q: '192.168.1.10 - 192.168.1.70' }
      ],
      guide: [
        'L’agrégation de routes (supernetting) regroupe plusieurs préfixes en trouvant le plus long préfixe binaire commun.',
        'Une agrégation est exacte uniquement si les réseaux sont contigus et couvrent exactement 2^(32 - préfixe) adresses.'
      ],
      refTable: {
        headers: ['Réseaux /24', 'Préfixe agrégé', 'Masque', 'Alignement'],
        rows: [
          ['2 × /24', '/23', '255.255.254.0', 'Début pair (.0, .2...)'],
          ['4 × /24', '/22', '255.255.252.0', 'Multiple de 4 (.0, .4...)'],
          ['8 × /24', '/21', '255.255.248.0', 'Multiple de 8'],
          ['16 × /24', '/20', '255.255.240.0', 'Multiple de 16']
        ]
      },
      tips: [
        'Pour agréger 4 réseaux /24 en /22, le troisième octet initial doit être multiple de 4.',
        'Des trous entre sous-réseaux entraînent une sur-agrégation absorbant des adresses tierces.',
        'Chaque bloc CIDR d’une plage doit être aligné sur un multiple de 2^h.'
      ],
      faqs: [
        { q: 'Qu’est-ce que le supernetting ?', a: 'L’opération inverse du subnetting : fusionner des réseaux contigus en un bloc CIDR unique.' },
        { q: 'Quand l’agrégation est-elle exacte ?', a: 'Lorsque l’union des adresses d’entrée égale exactement 2^(32-n).' },
        { q: 'Comment décomposer une plage IP ?', a: 'Par choix glouton du plus grand bloc 2^k aligné à chaque position.' },
        { q: 'Pourquoi agréger en BGP/OSPF ?', a: 'Pour réduire la taille des tables de routage.' }
      ],
      related: ['vlsm', 'ipv6', 'bandwidth']
    }
  },
  ipv6: {
    es: {
      metaTitle: 'Calculadora y Subredes IPv6 (RFC 5952 y EUI-64) — BitsPasoAPaso',
      metaDescription: 'Comprime direcciones IPv6 según RFC 5952, calcula subredes /64 con aritmética exacta de 128 bits y genera Interface IDs EUI-64 desde MAC.',
      h1: 'Calculadora y Subredes IPv6 paso a paso',
      subtitle: 'Expande y comprime IPv6 según RFC 5952, calcula subredes /64 con BigInt de 128 bits y deriva direcciones EUI-64 desde MAC.',
      modeLabels: { analyze: 'Análisis y Subredes IPv6', eui64: 'EUI-64 desde MAC' },
      inputLabel: 'Dirección IPv6/prefijo (y ; /destino opcional) o MAC (y ; prefijo opcional)',
      inputPlaceholder: 'Ej: 2001:0db8:0000:0000:0000:ff00:0042:8329/48',
      examples: [
        { label: 'Compresión RFC 5952 (/48)', mode: 'analyze', q: '2001:0db8:0000:0000:0000:ff00:0042:8329/48' },
        { label: 'Subredes /48 → /52', mode: 'analyze', q: '2001:db8:acad::/48 ; /52' },
        { label: 'EUI-64 Link-Local', mode: 'eui64', q: '00:1A:2B:3C:4D:5E ; fe80::/64' },
        { label: 'EUI-64 Global', mode: 'eui64', q: 'AA:BB:CC:11:22:33 ; 2001:db8:1::/64' }
      ],
      guide: [
        'IPv6 utiliza direcciones de 128 bits (8 hextetos de 16 bits). La norma RFC 5952 establece la compresión canónica: eliminar ceros a la izquierda y reemplazar la secuencia más larga de 0000 consecutivos (al menos 2) por :: una sola vez.',
        'El método EUI-64 construye los 64 bits de Interface ID partiendo una MAC de 48 bits, insertando FF:FE en el centro e invirtiendo el 7.º bit (bit U/L).'
      ],
      refTable: {
        headers: ['Prefijo IPv6', 'Tipo de dirección', 'Uso habitual'],
        rows: [
          ['2000::/3', 'Global Unicast', 'Internet público IPv6'],
          ['fe80::/10', 'Link-Local', 'Enlace local (NDP, gateway)'],
          ['fc00::/7', 'Unique Local (ULA)', 'Redes privadas internas'],
          ['ff00::/8', 'Multicast', 'Grupos multicast'],
          ['2001:db8::/32', 'Documentación', 'Ejemplos y manuales']
        ]
      },
      tips: [
        'El símbolo :: solo puede aparecer una vez en una dirección IPv6 válida.',
        'Un prefijo /48 ofrece 16 bits de Subnet ID, es decir 65.536 subredes /64.',
        'En EUI-64, recuerda siempre hacer XOR 0x02 al primer byte de la MAC (invertir el 7.º bit).'
      ],
      faqs: [
        { q: '¿Por qué solo se usa una vez :: en IPv6?', a: 'Porque si apareciera dos veces sería imposible saber cuántos grupos de ceros representa cada uno.' },
        { q: '¿Qué exige el estándar RFC 5952?', a: 'Minúsculas, supresión de ceros iniciales, compresión de la racha más larga (≥2) y prioridad a la izquierda en caso de empate.' },
        { q: '¿Por qué se invierte el 7.º bit en EUI-64?', a: 'El bit U/L indica si el identificador es universal (0 en MAC IEEE) o administrado localmente (1 en EUI-64 modificado).' },
        { q: '¿Por qué las LAN IPv6 suelen ser /64?', a: 'Porque SLAAC y EUI-64 requieren exactamente 64 bits para el Interface ID.' }
      ],
      related: ['cidr', 'vlsm', 'bandwidth']
    },
    en: {
      metaTitle: 'IPv6 Subnet & EUI-64 Calculator (RFC 5952) — BitsPasoAPaso',
      metaDescription: 'Compress IPv6 per RFC 5952, calculate /64 subnets with exact 128-bit BigInt math, and derive EUI-64 Interface IDs from MAC addresses.',
      h1: 'IPv6 Subnet & EUI-64 Calculator Step by Step',
      subtitle: 'Expand and compress IPv6 per RFC 5952, compute /64 subnets with 128-bit BigInt, and generate EUI-64 addresses from MAC.',
      modeLabels: { analyze: 'IPv6 Analysis & Subnets', eui64: 'EUI-64 from MAC' },
      inputLabel: 'IPv6/prefix (and optional ; /target) or MAC (and optional ; prefix)',
      inputPlaceholder: 'e.g. 2001:0db8:0000:0000:0000:ff00:0042:8329/48',
      examples: [
        { label: 'RFC 5952 Compress (/48)', mode: 'analyze', q: '2001:0db8:0000:0000:0000:ff00:0042:8329/48' },
        { label: 'Subnets /48 → /52', mode: 'analyze', q: '2001:db8:acad::/48 ; /52' },
        { label: 'EUI-64 Link-Local', mode: 'eui64', q: '00:1A:2B:3C:4D:5E ; fe80::/64' },
        { label: 'EUI-64 Global', mode: 'eui64', q: 'AA:BB:CC:11:22:33 ; 2001:db8:1::/64' }
      ],
      guide: [
        'IPv6 uses 128-bit addresses (eight 16-bit hextets). RFC 5952 defines canonical compression: strip leading zeros, use lowercase, and replace the longest run of ≥2 zero hextets with :: once.',
        'EUI-64 derives a 64-bit Interface ID by splitting a 48-bit MAC, inserting FF:FE in the middle, and flipping the 7th bit (U/L bit).'
      ],
      refTable: {
        headers: ['IPv6 Prefix', 'Scope', 'Typical Use'],
        rows: [
          ['2000::/3', 'Global Unicast', 'Public IPv6 Internet'],
          ['fe80::/10', 'Link-Local', 'Single link (NDP, gateway)'],
          ['fc00::/7', 'Unique Local (ULA)', 'Private internal networks'],
          ['ff00::/8', 'Multicast', 'Multicast groups'],
          ['2001:db8::/32', 'Documentation', 'Examples & docs']
        ]
      },
      tips: [
        ':: can appear at most once in any valid IPv6 address.',
        'A /48 allocation provides 16 Subnet ID bits, yielding 65,536 /64 subnets.',
        'For EUI-64, always XOR the first MAC byte with 0x02.'
      ],
      faqs: [
        { q: 'Why can :: only appear once?', a: 'Multiple :: tokens would make the number of omitted zero hextets ambiguous.' },
        { q: 'What does RFC 5952 require?', a: 'Lowercase hex, no leading zeros, compress longest run of ≥2 zero hextets, leftmost on tie.' },
        { q: 'Why flip the 7th bit in EUI-64?', a: 'The U/L bit toggles universal vs. locally administered scope per IEEE EUI-64.' },
        { q: 'Why are IPv6 LANs /64?', a: 'SLAAC and EUI-64 require a 64-bit Interface ID.' }
      ],
      related: ['cidr', 'vlsm', 'bandwidth']
    },
    fr: {
      metaTitle: 'Calculateur IPv6 et EUI-64 (RFC 5952) étape par étape — BitsPasoAPaso',
      metaDescription: 'Compressez en IPv6 selon RFC 5952, calculez les sous-réseaux /64 en 128 bits exacts et générez des adresses EUI-64.',
      h1: 'Calculateur IPv6 et EUI-64 étape par étape',
      subtitle: 'Compression RFC 5952, découpage en sous-réseaux /64 sur 128 bits BigInt et dérivation EUI-64 depuis une adresse MAC.',
      modeLabels: { analyze: 'Analyse et Sous-réseaux IPv6', eui64: 'EUI-64 depuis MAC' },
      inputLabel: 'Adresse IPv6/préfixe (et ; /cible) ou MAC (et ; préfixe)',
      inputPlaceholder: 'Ex : 2001:0db8:0000:0000:0000:ff00:0042:8329/48',
      examples: [
        { label: 'Compression RFC 5952 (/48)', mode: 'analyze', q: '2001:0db8:0000:0000:0000:ff00:0042:8329/48' },
        { label: 'Sous-réseaux /48 → /52', mode: 'analyze', q: '2001:db8:acad::/48 ; /52' },
        { label: 'EUI-64 Link-Local', mode: 'eui64', q: '00:1A:2B:3C:4D:5E ; fe80::/64' },
        { label: 'EUI-64 Global', mode: 'eui64', q: 'AA:BB:CC:11:22:33 ; 2001:db8:1::/64' }
      ],
      guide: [
        'IPv6 utilise des adresses 128 bits (8 hextets). La RFC 5952 impose la compression canonique : minuscules, suppression des zéros initiaux et :: sur la plus longue suite de 0000 (≥ 2).',
        'EUI-64 construit l’Interface ID 64 bits en insérant FF:FE au milieu de la MAC et en inversant le 7e bit.'
      ],
      refTable: {
        headers: ['Préfixe IPv6', 'Type', 'Usage'],
        rows: [
          ['2000::/3', 'Global Unicast', 'Internet public IPv6'],
          ['fe80::/10', 'Link-Local', 'Lien local (NDP, passerelle)'],
          ['fc00::/7', 'Unique Local (ULA)', 'Réseaux privés'],
          ['ff00::/8', 'Multicast', 'Groupes multicast'],
          ['2001:db8::/32', 'Documentation', 'Exemples et manuels']
        ]
      },
      tips: [
        ':: ne peut apparaître qu’une seule fois par adresse IPv6.',
        'Un /48 offre 16 bits de Subnet ID, soit 65 536 sous-réseaux /64.',
        'En EUI-64, appliquez XOR 0x02 sur le premier octet de la MAC.'
      ],
      faqs: [
        { q: 'Pourquoi un seul :: est-il autorisé ?', a: 'Deux :: rendraient le nombre de zéros omis ambigu.' },
        { q: 'Que spécifie la RFC 5952 ?', a: 'Minuscules, suppression des zéros initiaux et :: sur la plus longue séquence (≥2).' },
        { q: 'Pourquoi inverser le 7e bit en EUI-64 ?', a: 'Le bit U/L indique une administration universelle ou locale.' },
        { q: 'Pourquoi les LAN IPv6 sont-ils en /64 ?', a: 'SLAAC et EUI-64 exigent 64 bits pour l’Interface ID.' }
      ],
      related: ['cidr', 'vlsm', 'bandwidth']
    }
  },
  truthTable: {
    es: {
      metaTitle: 'Generador de Tablas de Verdad y Equivalencia Lógica — BitsPasoAPaso',
      metaDescription: 'Evalúa fórmulas lógicas paso a paso con columnas intermedias, detecta tautologías, extrae FND/FNC y comprueba equivalencias.',
      h1: 'Generador de Tablas de Verdad y Equivalencia Lógica',
      subtitle: 'Evalúa expresiones booleanas con columnas intermedias, clasifica tautologías/contradicciones, extrae FND/FNC y abre directamente en Karnaugh.',
      modeLabels: { eval: 'Evaluar Expresión', equiv: 'Comprobar Equivalencia (F1 ≡ F2)' },
      inputLabel: 'Fórmula lógica (o F1 ; F2 para equivalencia)',
      inputPlaceholder: 'Ej: A -> B ; !A + B  o  (A ∧ B) → C',
      examples: [
        { label: 'Equiv: A -> B ; !A + B', mode: 'equiv', q: 'A -> B ; !A + B' },
        { label: 'Tautología: A + !A', mode: 'eval', q: 'A + !A' },
        { label: 'Contradicción: A * !A', mode: 'eval', q: 'A * !A' },
        { label: '3 vars: (A ∧ B) ⊕ C', mode: 'eval', q: '(A ∧ B) ⊕ C' }
      ],
      guide: [
        'Una tabla de verdad enumera todas las 2^n combinaciones posibles de n variables proposicionales y evalúa cada subexpresión respetando la precedencia: Negación > AND > XOR > OR > Implicación > Bicondicional.',
        'Una fórmula es tautología si siempre vale 1, contradicción si siempre vale 0 y contingencia en caso contrario.'
      ],
      refTable: {
        headers: ['Operador', 'Símbolos aceptados', 'Significado'],
        rows: [
          ['NOT', "!, ', ¬, ~", 'Negación lógica'],
          ['AND', '·, *, &, ∧, AB', 'Conjunción'],
          ['OR', '+, |, ∨', 'Disyunción'],
          ['XOR', '⊕, ^', 'O exclusivo'],
          ['IMP / IFF', '->, →, <->, ↔', 'Implicación y bicondicional']
        ]
      },
      tips: [
        'La implicación A → B es lógicamente equivalente a ¬A ∨ B (solo es falsa cuando A=1 y B=0).',
        'Puedes pulsar el botón "Abrir en Mapa de Karnaugh" para simplificar fórmulas de 2 a 4 variables.',
        'Usa la botonera rápida para insertar símbolos lógicos ¬, ∧, ∨, →, ↔ sin buscarlos en el teclado.'
      ],
      faqs: [
        { q: '¿Cuántas variables soporta el generador?', a: 'Soporta de 1 a 5 variables (hasta 32 filas) con evaluación instantánea.' },
        { q: '¿Usa eval() para evaluar las fórmulas?', a: 'No. Emplea un parser de descenso recursivo seguro en JavaScript puro.' },
        { q: '¿Cómo compruebo si dos fórmulas son equivalentes?', a: 'Elige "Comprobar Equivalencia" o sepáralas con punto y coma (;). Si difieren en alguna fila, se resalta en rojo.' },
        { q: '¿Qué es FND y FNC?', a: 'Forma Normal Disyuntiva (suma de mintérminos Σm) y Forma Normal Conjuntiva (producto de maxtérminos ΠM).' }
      ],
      related: ['karnaugh', 'bases', 'ieee754']
    },
    en: {
      metaTitle: 'Truth Table Generator & Logic Equivalence Checker — BitsPasoAPaso',
      metaDescription: 'Evaluate Boolean formulas step by step with intermediate columns, detect tautologies, extract DNF/CNF, and check equivalences.',
      h1: 'Truth Table Generator & Logic Equivalence Checker',
      subtitle: 'Evaluate formulas with intermediate columns, classify tautologies/contradictions, extract DNF/CNF, and export to Karnaugh Map.',
      modeLabels: { eval: 'Evaluate Expression', equiv: 'Check Equivalence (F1 ≡ F2)' },
      inputLabel: 'Logic formula (or F1 ; F2 for equivalence)',
      inputPlaceholder: 'e.g. A -> B ; !A + B  or  (A ∧ B) → C',
      examples: [
        { label: 'Equiv: A -> B ; !A + B', mode: 'equiv', q: 'A -> B ; !A + B' },
        { label: 'Tautology: A + !A', mode: 'eval', q: 'A + !A' },
        { label: 'Contradiction: A * !A', mode: 'eval', q: 'A * !A' },
        { label: '3 vars: (A ∧ B) ⊕ C', mode: 'eval', q: '(A ∧ B) ⊕ C' }
      ],
      guide: [
        'A truth table lists all 2^n input combinations and evaluates subexpressions by precedence: NOT > AND > XOR > OR > Implication > Biconditional.',
        'A formula is a tautology if always 1, a contradiction if always 0, and a contingency otherwise.'
      ],
      refTable: {
        headers: ['Operator', 'Accepted Symbols', 'Meaning'],
        rows: [
          ['NOT', "!, ', ¬, ~", 'Logical negation'],
          ['AND', '·, *, &, ∧, AB', 'Conjunction'],
          ['OR', '+, |, ∨', 'Disjunction'],
          ['XOR', '⊕, ^', 'Exclusive OR'],
          ['IMP / IFF', '->, →, <->, ↔', 'Implication & biconditional']
        ]
      },
      tips: [
        'Implication A → B is equivalent to !A + B (only false when A=1 and B=0).',
        'Use "Open in Karnaugh Map" for 2–4 variable formulas to get minimal SOP/POS.',
        'Use the quick symbol keypad to insert ¬, ∧, ∨, →, ↔ with one tap.'
      ],
      faqs: [
        { q: 'How many variables are supported?', a: 'From 1 to 5 variables (up to 32 rows) evaluated instantaneously.' },
        { q: 'Does it use eval()?', a: 'No, it uses a safe recursive-descent parser in pure JavaScript.' },
        { q: 'How do I check equivalence?', a: 'Separate two formulas with ";" — any counterexample row is highlighted in red.' },
        { q: 'What are DNF and CNF?', a: 'Disjunctive Normal Form (Σm minterms) and Conjunctive Normal Form (ΠM maxterms).' }
      ],
      related: ['karnaugh', 'bases', 'ieee754']
    },
    fr: {
      metaTitle: 'Générateur de Tables de Vérité et Équivalence Logique — BitsPasoAPaso',
      metaDescription: 'Évaluez des formules logiques étape par étape, détectez les tautologies, extrayez FND/FNC et vérifiez l’équivalence.',
      h1: 'Générateur de Tables de Vérité et Équivalence',
      subtitle: 'Colonnes intermédiaires, détection de tautologies/contradictions, extraction FND/FNC et ouverture directe dans Karnaugh.',
      modeLabels: { eval: 'Évaluer une Expression', equiv: 'Vérifier Équivalence (F1 ≡ F2)' },
      inputLabel: 'Formule logique (ou F1 ; F2 pour équivalence)',
      inputPlaceholder: 'Ex : A -> B ; !A + B  ou  (A ∧ B) → C',
      examples: [
        { label: 'Équiv : A -> B ; !A + B', mode: 'equiv', q: 'A -> B ; !A + B' },
        { label: 'Tautologie : A + !A', mode: 'eval', q: 'A + !A' },
        { label: 'Contradiction : A * !A', mode: 'eval', q: 'A * !A' },
        { label: '3 vars : (A ∧ B) ⊕ C', mode: 'eval', q: '(A ∧ B) ⊕ C' }
      ],
      guide: [
        'Une table de vérité énumère les 2^n combinaisons et évalue chaque sous-expression selon la précédence : NON > ET > XOR > OU > Implication > Équivalence.',
        'Une formule est une tautologie si elle vaut toujours 1, une contradiction si elle vaut toujours 0.'
      ],
      refTable: {
        headers: ['Opérateur', 'Symboles acceptés', 'Sens'],
        rows: [
          ['NON', "!, ', ¬, ~", 'Négation logique'],
          ['ET', '·, *, &, ∧, AB', 'Conjonction'],
          ['OU', '+, |, ∨', 'Disjonction'],
          ['XOR', '⊕, ^', 'OU exclusif'],
          ['IMP / IFF', '->, →, <->, ↔', 'Implication et biconditionnel']
        ]
      },
      tips: [
        'L’implication A → B équivaut à ¬A ∨ B.',
        'Cliquez sur « Ouvrir dans le Tableau de Karnaugh » pour simplifier de 2 à 4 variables.',
        'Utilisez le clavier de symboles pour saisir ¬, ∧, ∨, →, ↔.'
      ],
      faqs: [
        { q: 'Combien de variables sont supportées ?', a: 'De 1 à 5 variables (jusqu’à 32 lignes).' },
        { q: 'Utilisez-vous eval() ?', a: 'Non, un analyseur récursif pur JavaScript.' },
        { q: 'Comment vérifier l’équivalence ?', a: 'Séparez deux formules par « ; » ; les contre-exemples sont surlignés en rouge.' },
        { q: 'Que sont FND et FNC ?', a: 'Forme Normale Disjonctive (Σm) et Conjonctive (ΠM).' }
      ],
      related: ['karnaugh', 'bases', 'ieee754']
    }
  },
  bandwidth: {
    es: {
      metaTitle: 'Calculadora de Ancho de Banda, BDP y Throughput TCP — BitsPasoAPaso',
      metaDescription: 'Calcula tiempos de transferencia (SI vs IEC), Bandwidth-Delay Product (BDP), límite por ventana TCP y cota de Mathis paso a paso.',
      h1: 'Calculadora de Ancho de Banda, BDP y TCP paso a paso',
      subtitle: 'Calcula tiempos de descarga con unidades SI/IEC, Producto Ancho de Banda-Retardo (BDP), saturación de ventana deslizante y fórmula de Mathis.',
      modeLabels: { transfer: 'Tiempo de Transferencia', bdp: 'BDP y Rendimiento TCP' },
      inputLabel: 'Transferencia: tamaño ; velocidad [; %] — o BDP: R_Mbps ; RTT_ms ; W_KiB [; MSS ; p%]',
      inputPlaceholder: 'Ej: 100 ; 40 ; 64  o  100 MiB ; 100 Mbps',
      examples: [
        { label: 'BDP: 100 Mbps, 40 ms, 64 KiB', mode: 'bdp', q: '100 ; 40 ; 64' },
        { label: 'BDP + pérdida: 100 ; 40 ; 64 ; 1460 ; 0.1', mode: 'bdp', q: '100 ; 40 ; 64 ; 1460 ; 0.1' },
        { label: 'Archivo: 1 GiB @ 100 Mbps', mode: 'transfer', q: '1 GiB ; 100 Mbps' },
        { label: 'Archivo + 10% overhead: 500 MB ; 50 Mbps ; 10%', mode: 'transfer', q: '500 MB ; 50 Mbps ; 10%' }
      ],
      guide: [
        'Las capacidades de almacenamiento usan prefijos binarios IEC (1 KiB = 1024 B, 1 MiB = 1024² B) o decimales SI (1 MB = 10⁶ B), mientras que las velocidades de red usan siempre base decimal (1 Mbps = 10⁶ bps).',
        'El Bandwidth-Delay Product (BDP = R × RTT) indica cuántos bits deben estar en vuelo simultáneamente para saturar un enlace. Si la ventana TCP W es menor que el BDP, el throughput queda limitado a W / RTT.'
      ],
      refTable: {
        headers: ['Enlace', 'RTT típico', 'BDP (bytes)', 'Ventana mínima'],
        rows: [
          ['100 Mbps (LAN)', '1 ms', '12.500 B', '~12.2 KiB'],
          ['100 Mbps (WAN)', '40 ms', '500.000 B', '~488.3 KiB'],
          ['1 Gbps (WAN)', '40 ms', '5.000.000 B', '~4.77 MiB'],
          ['10 Gbps (Transatlántico)', '80 ms', '100.000.000 B', '~95.37 MiB']
        ]
      },
      tips: [
        'Nunca confundas MB (megabytes, 8×10⁶ bits) con Mbps (megabits por segundo, 10⁶ bps).',
        'Una ventana TCP clásica de 64 KiB con RTT de 40 ms limita cualquier enlace a ~13.11 Mbps.',
        'La cota de Mathis muestra cómo incluso un 0.1% de pérdida de paquetes desploma el rendimiento TCP.'
      ],
      faqs: [
        { q: '¿Qué es el BDP?', a: 'El producto del ancho de banda por el tiempo de ida y vuelta (R × RTT): la capacidad del "tubo" de red.' },
        { q: '¿Por qué 64 KiB limita la velocidad?', a: 'Porque el emisor solo puede enviar 64 KiB (524.288 bits) antes de detenerse a esperar un ACK tras 40 ms.' },
        { q: '¿Qué diferencia hay entre MB y MiB?', a: '1 MB = 1.000.000 bytes (SI); 1 MiB = 1.048.576 bytes (IEC, 2^20).' },
        { q: '¿Para qué sirve la cota de Mathis?', a: 'Estima el throughput máximo alcanzable por TCP en presencia de una tasa de pérdida de paquetes p.' }
      ],
      related: ['vlsm', 'cidr', 'hamming']
    },
    en: {
      metaTitle: 'Bandwidth, BDP & TCP Throughput Calculator — BitsPasoAPaso',
      metaDescription: 'Compute file transfer times (SI vs IEC), Bandwidth-Delay Product (BDP), TCP window limit, and Mathis bound step by step.',
      h1: 'Bandwidth, BDP & TCP Throughput Calculator',
      subtitle: 'Calculate transfer times (SI/IEC), Bandwidth-Delay Product (BDP), sliding window saturation, and Mathis packet-loss bound.',
      modeLabels: { transfer: 'Transfer Time', bdp: 'BDP & TCP Throughput' },
      inputLabel: 'Transfer: size unit ; speed [; %] — or BDP: R_Mbps ; RTT_ms ; W_KiB [; MSS ; loss%]',
      inputPlaceholder: 'e.g. 100 ; 40 ; 64  or  100 MiB ; 100 Mbps',
      examples: [
        { label: 'BDP: 100 Mbps, 40 ms, 64 KiB', mode: 'bdp', q: '100 ; 40 ; 64' },
        { label: 'BDP + loss: 100 ; 40 ; 64 ; 1460 ; 0.1', mode: 'bdp', q: '100 ; 40 ; 64 ; 1460 ; 0.1' },
        { label: 'File: 1 GiB @ 100 Mbps', mode: 'transfer', q: '1 GiB ; 100 Mbps' },
        { label: 'File + 10% overhead: 500 MB ; 50 Mbps ; 10%', mode: 'transfer', q: '500 MB ; 50 Mbps ; 10%' }
      ],
      guide: [
        'Storage uses binary IEC (1 MiB = 1024² B) or decimal SI (1 MB = 10⁶ B), whereas network speeds always use decimal bits/sec (1 Mbps = 10⁶ bps).',
        'BDP (R × RTT) is the in-flight data required to fill the pipe. If TCP window W < BDP, throughput is capped at W / RTT.'
      ],
      refTable: {
        headers: ['Link', 'Typical RTT', 'BDP (bytes)', 'Min Window'],
        rows: [
          ['100 Mbps (LAN)', '1 ms', '12,500 B', '~12.2 KiB'],
          ['100 Mbps (WAN)', '40 ms', '500,000 B', '~488.3 KiB'],
          ['1 Gbps (WAN)', '40 ms', '5,000,000 B', '~4.77 MiB'],
          ['10 Gbps (Long-haul)', '80 ms', '100,000,000 B', '~95.37 MiB']
        ]
      },
      tips: [
        'Always distinguish MB (bytes) from Mbps (bits per second).',
        'A 64 KiB TCP window over 40 ms RTT caps throughput at ~13.11 Mbps regardless of link speed.',
        'Even 0.1% packet loss drastically reduces TCP throughput per the Mathis bound.'
      ],
      faqs: [
        { q: 'What is BDP?', a: 'Bandwidth-Delay Product (R × RTT): the amount of unacknowledged data needed in flight to saturate a link.' },
        { q: 'Why does a 64 KiB window limit speed?', a: 'The sender must pause after sending 64 KiB until an ACK arrives 1 RTT later.' },
        { q: 'What is the difference between MB and MiB?', a: '1 MB = 1,000,000 bytes (SI); 1 MiB = 1,048,576 bytes (IEC).' },
        { q: 'What is the Mathis formula?', a: 'An upper bound for TCP throughput given MSS, RTT, and packet loss rate p.' }
      ],
      related: ['vlsm', 'cidr', 'hamming']
    },
    fr: {
      metaTitle: 'Calculateur Bande Passante, BDP et Débit TCP — BitsPasoAPaso',
      metaDescription: 'Calculez temps de transfert (SI/IEC), produit BDP, fenêtre glissante TCP et borne de Mathis étape par étape.',
      h1: 'Calculateur Bande Passante, BDP et Débit TCP',
      subtitle: 'Temps de transfert (SI/IEC), produit Bande Passante-Délai (BDP), saturation de fenêtre TCP et borne de Mathis.',
      modeLabels: { transfer: 'Temps de Transfert', bdp: 'BDP et Débit TCP' },
      inputLabel: 'Transfert : taille ; débit [; %] — ou BDP : R_Mbps ; RTT_ms ; W_KiB [; MSS ; perte%]',
      inputPlaceholder: 'Ex : 100 ; 40 ; 64  ou  100 MiB ; 100 Mbps',
      examples: [
        { label: 'BDP : 100 Mbps, 40 ms, 64 KiB', mode: 'bdp', q: '100 ; 40 ; 64' },
        { label: 'BDP + perte : 100 ; 40 ; 64 ; 1460 ; 0.1', mode: 'bdp', q: '100 ; 40 ; 64 ; 1460 ; 0.1' },
        { label: 'Fichier : 1 GiB @ 100 Mbps', mode: 'transfer', q: '1 GiB ; 100 Mbps' },
        { label: 'Fichier + 10% : 500 MB ; 50 Mbps ; 10%', mode: 'transfer', q: '500 MB ; 50 Mbps ; 10%' }
      ],
      guide: [
        'Le stockage utilise des préfixes binaires IEC (1 MiB = 1024² o) ou décimaux SI (1 Mo = 10⁶ o), alors que les débits réseau sont toujours décimaux (1 Mbps = 10⁶ bps).',
        'Le BDP (R × RTT) mesure les données en vol nécessaires pour saturer le lien. Si W < BDP, le débit est plafonné à W / RTT.'
      ],
      refTable: {
        headers: ['Lien', 'RTT typique', 'BDP (octets)', 'Fenêtre min.'],
        rows: [
          ['100 Mbps (LAN)', '1 ms', '12 500 o', '~12.2 KiB'],
          ['100 Mbps (WAN)', '40 ms', '500 000 o', '~488.3 KiB'],
          ['1 Gbps (WAN)', '40 ms', '5 000 000 o', '~4.77 MiB'],
          ['10 Gbps', '80 ms', '100 000 000 o', '~95.37 MiB']
        ]
      },
      tips: [
        'Ne confondez jamais Mo (octets) et Mbps (mégabits par seconde).',
        'Une fenêtre de 64 KiB avec un RTT de 40 ms plafonne le débit TCP à ~13.11 Mbps.',
        'Même 0.1% de perte de paquets réduit fortement le débit selon Mathis.'
      ],
      faqs: [
        { q: 'Qu’est-ce que le BDP ?', a: 'Le produit Bande Passante × RTT : la capacité du « tuyau » réseau.' },
        { q: 'Pourquoi 64 KiB limite-t-il le débit ?', a: 'L’émetteur doit attendre un ACK après avoir envoyé 64 KiB.' },
        { q: 'Différence entre MB et MiB ?', a: '1 MB = 10⁶ octets (SI) ; 1 MiB = 2^20 octets (IEC).' },
        { q: 'À quoi sert la borne de Mathis ?', a: 'À estimer le débit maximal TCP selon le taux de perte p.' }
      ],
      related: ['vlsm', 'cidr', 'hamming']
    }
  },
  raidChmod: {
    es: {
      metaTitle: 'Calculadora RAID (0/1/5/6/10) y Permisos Linux chmod / umask — BitsPasoAPaso',
      metaDescription: 'Calcula capacidad útil, paridad y tolerancia a fallos RAID, y usa la matriz interactiva chmod (octal/simbólico) y umask paso a paso.',
      h1: 'Calculadora RAID y Permisos Linux chmod / umask',
      subtitle: 'Calcula capacidad útil y tolerancia de arreglos RAID (0, 1, 5, 6, 10) o configura permisos chmod y umask sin teclado con matriz 3×3.',
      modeLabels: { raid: 'Calculadora RAID', chmod: 'Permisos chmod / umask' },
      inputLabel: 'RAID: Nivel ; discos ; tamaño (ej. RAID 5 ; 4 ; 4 TB) — o chmod: octal/simbólico [; umask]',
      inputPlaceholder: 'Ej: RAID 5 ; 4 ; 4 TB  o  755 ; umask 022',
      examples: [
        { label: 'RAID 5: 4 × 4 TB', mode: 'raid', q: 'RAID 5 ; 4 ; 4 TB' },
        { label: 'RAID 10: 6 × 2 TB', mode: 'raid', q: 'RAID 10 ; 6 ; 2 TB' },
        { label: 'chmod 755 ; umask 022', mode: 'chmod', q: '755 ; umask 022' },
        { label: 'chmod rwxr-x--- ; umask 027', mode: 'chmod', q: 'rwxr-x--- ; umask 027' }
      ],
      guide: [
        'Los niveles RAID equilibran rendimiento, capacidad útil y tolerancia a fallos: RAID 0 ofrece 100% de capacidad sin redundancia; RAID 5 dedica 1 disco a paridad distribuida; RAID 6 dedica 2 discos y RAID 10 combina espejo y striping.',
        'En Linux, cada permiso r (4), w (2), x (1) forma una terna binaria de 3 bits para Propietario, Grupo y Otros. El umask resta bits de 666 (archivos) y 777 (directorios) mediante AND NOT.'
      ],
      refTable: {
        headers: ['Nivel RAID', 'Mín. discos', 'Capacidad útil', 'Tolerancia'],
        rows: [
          ['RAID 0', '2', 'N × C (100%)', '0 discos'],
          ['RAID 1', '2', '1 × C (50% con 2)', 'N - 1 discos'],
          ['RAID 5', '3', '(N - 1) × C', '1 disco'],
          ['RAID 6', '4', '(N - 2) × C', '2 discos'],
          ['RAID 10', '4 (par)', '(N / 2) × C (50%)', '1 por espejo']
        ]
      },
      tips: [
        'RAID nunca sustituye a una copia de seguridad externa (backup).',
        'En chmod, recuerda la suma 4 (lectura) + 2 (escritura) + 1 (ejecución) = 7 (rwx).',
        'Un umask 022 deja archivos en 644 (rw-r--r--) y directorios en 755 (rwxr-xr-x).'
      ],
      faqs: [
        { q: '¿Cuántos discos aguanta perder un RAID 5?', a: 'Exactamente 1 disco. Si falla un segundo disco durante la reconstrucción, se pierde el arreglo.' },
        { q: '¿Por qué RAID 10 exige un número par de discos?', a: 'Porque agrupa los discos en parejas espejo (RAID 1) sobre las que aplica striping (RAID 0).' },
        { q: '¿Cómo funciona la matriz interactiva chmod?', a: 'Haz clic en las casillas de Propietario, Grupo u Otros para alternar permisos y ver al instante el octal y el comando.' },
        { q: '¿Cómo se calcula umask 022 sobre archivos?', a: 'Mediante 666 AND NOT 022 = 644 (rw-r--r--); sobre directorios, 777 AND NOT 022 = 755.' }
      ],
      related: ['bases', 'hamming', 'bandwidth']
    },
    en: {
      metaTitle: 'RAID (0/1/5/6/10) & Linux chmod / umask Calculator — BitsPasoAPaso',
      metaDescription: 'Calculate RAID usable capacity, parity, and fault tolerance, plus interactive 3×3 Linux chmod (octal/symbolic) and umask calculator.',
      h1: 'RAID & Linux chmod / umask Calculator Step by Step',
      subtitle: 'Compute RAID (0, 1, 5, 6, 10) usable capacity & fault tolerance, or toggle Linux chmod permissions and umask interactively.',
      modeLabels: { raid: 'RAID Calculator', chmod: 'chmod / umask Matrix' },
      inputLabel: 'RAID: Level ; disks ; size (e.g. RAID 5 ; 4 ; 4 TB) — or chmod: octal/symbolic [; umask]',
      inputPlaceholder: 'e.g. RAID 5 ; 4 ; 4 TB  or  755 ; umask 022',
      examples: [
        { label: 'RAID 5: 4 × 4 TB', mode: 'raid', q: 'RAID 5 ; 4 ; 4 TB' },
        { label: 'RAID 10: 6 × 2 TB', mode: 'raid', q: 'RAID 10 ; 6 ; 2 TB' },
        { label: 'chmod 755 ; umask 022', mode: 'chmod', q: '755 ; umask 022' },
        { label: 'chmod rwxr-x--- ; umask 027', mode: 'chmod', q: 'rwxr-x--- ; umask 027' }
      ],
      guide: [
        'RAID levels balance performance, usable capacity, and redundancy: RAID 0 gives 100% capacity with zero redundancy; RAID 5 reserves 1 disk for parity; RAID 6 reserves 2; RAID 10 stripes across mirrors.',
        'In Linux, r (4), w (2), x (1) form 3-bit triads for Owner, Group, and Others. umask clears bits from 666 (files) and 777 (directories) via AND NOT.'
      ],
      refTable: {
        headers: ['RAID Level', 'Min Disks', 'Usable Capacity', 'Fault Tolerance'],
        rows: [
          ['RAID 0', '2', 'N × C (100%)', '0 disks'],
          ['RAID 1', '2', '1 × C', 'N - 1 disks'],
          ['RAID 5', '3', '(N - 1) × C', '1 disk'],
          ['RAID 6', '4', '(N - 2) × C', '2 disks'],
          ['RAID 10', '4 (even)', '(N / 2) × C (50%)', '1 per mirror']
        ]
      },
      tips: [
        'RAID is high availability, never a substitute for offline backups.',
        'Remember 4 (read) + 2 (write) + 1 (execute) = 7 (rwx).',
        'umask 022 produces 644 for files and 755 for directories.'
      ],
      faqs: [
        { q: 'How many disk failures can RAID 5 survive?', a: 'Exactly 1 disk failure.' },
        { q: 'Why does RAID 10 require an even number of disks?', a: 'Because disks are paired into mirrors before striping.' },
        { q: 'Is the chmod matrix interactive?', a: 'Yes, click any checkbox in the 3×3 matrix to update octal, symbolic, and binary values instantly.' },
        { q: 'How does umask 022 work?', a: '666 & ~022 = 644 for files; 777 & ~022 = 755 for directories.' }
      ],
      related: ['bases', 'hamming', 'bandwidth']
    },
    fr: {
      metaTitle: 'Calculateur RAID (0/1/5/6/10) et Permissions Linux chmod / umask — BitsPasoAPaso',
      metaDescription: 'Calculez capacité utile RAID et tolérance aux pannes, plus matrice interactive chmod (octal/symbolique) et umask.',
      h1: 'Calculateur RAID et Permissions Linux chmod / umask',
      subtitle: 'Capacité utile et redondance RAID (0, 1, 5, 6, 10) ou matrice interactive chmod et umask étape par étape.',
      modeLabels: { raid: 'Calculateur RAID', chmod: 'Matrice chmod / umask' },
      inputLabel: 'RAID : Niveau ; disques ; taille (ex. RAID 5 ; 4 ; 4 TB) — ou chmod : octal/symbolique [; umask]',
      inputPlaceholder: 'Ex : RAID 5 ; 4 ; 4 TB  ou  755 ; umask 022',
      examples: [
        { label: 'RAID 5 : 4 × 4 TB', mode: 'raid', q: 'RAID 5 ; 4 ; 4 TB' },
        { label: 'RAID 10 : 6 × 2 TB', mode: 'raid', q: 'RAID 10 ; 6 ; 2 TB' },
        { label: 'chmod 755 ; umask 022', mode: 'chmod', q: '755 ; umask 022' },
        { label: 'chmod rwxr-x--- ; umask 027', mode: 'chmod', q: 'rwxr-x--- ; umask 027' }
      ],
      guide: [
        'Les niveaux RAID arbitrent entre performance, capacité utile et tolérance aux pannes : RAID 5 dédie 1 disque à la parité, RAID 6 en dédie 2 et RAID 10 combine miroir et striping.',
        'Sous Linux, r (4), w (2), x (1) forment des triades de 3 bits. umask retire des droits à 666 (fichiers) et 777 (répertoires) via ET NON.'
      ],
      refTable: {
        headers: ['Niveau RAID', 'Disques min.', 'Capacité utile', 'Tolérance'],
        rows: [
          ['RAID 0', '2', 'N × C (100%)', '0 disque'],
          ['RAID 1', '2', '1 × C', 'N - 1 disques'],
          ['RAID 5', '3', '(N - 1) × C', '1 disque'],
          ['RAID 6', '4', '(N - 2) × C', '2 disques'],
          ['RAID 10', '4 (pair)', '(N / 2) × C (50%)', '1 par miroir']
        ]
      },
      tips: [
        'Le RAID ne remplace jamais une sauvegarde externe.',
        '4 (lecture) + 2 (écriture) + 1 (exécution) = 7 (rwx).',
        'umask 022 donne 644 pour les fichiers et 755 pour les répertoires.'
      ],
      faqs: [
        { q: 'Combien de pannes supporte RAID 5 ?', a: 'Exactement 1 disque.' },
        { q: 'Pourquoi RAID 10 exige-t-il un nombre pair ?', a: 'Les disques sont regroupés par paires en miroir avant le striping.' },
        { q: 'La matrice chmod est-elle interactive ?', a: 'Oui, cliquez sur les cases pour mettre à jour octal et symbolique en direct.' },
        { q: 'Comment fonctionne umask 022 ?', a: '666 & ~022 = 644 (fichiers) et 777 & ~022 = 755 (répertoires).' }
      ],
      related: ['bases', 'hamming', 'bandwidth']
    }
  }
};
