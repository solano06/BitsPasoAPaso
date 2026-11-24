export const PHASE3B_CONTENT = {
  alu: {
    es: {
      metaTitle: 'Calculadora ALU Binaria y Flags Z, N, C, V paso a paso — BitsPasoAPaso',
      metaDescription: 'Simula operaciones de ALU binaria (ADD, SUB, AND, OR, XOR, SHL, SHR, ASR) en 4, 8 y 16 bits con fila de acarreos y evaluación exacta de flags Z, N, C, V.',
      h1: 'Calculadora ALU Binaria y Flags Z, N, C, V',
      subtitle: 'Visualiza acarreos columna a columna (C_{n-1} y C_n) y distingue desbordamiento sin signo (Carry) frente a Complemento a 2 (Overflow V).',
      modeLabels: {
        '8_ADD': '8-bit ADD (+)',
        '8_SUB': '8-bit SUB (-)',
        '8_AND': '8-bit AND',
        '8_OR': '8-bit OR',
        '8_XOR': '8-bit XOR',
        '8_SHL': '8-bit SHL',
        '8_SHR': '8-bit SHR',
        '8_ASR': '8-bit ASR',
        '4_ADD': '4-bit ADD (+)',
        '16_ADD': '16-bit ADD (+)'
      },
      inputLabel: 'Operandos A ; B (decimal, 0b... o 0x...) [; ancho ; operación]',
      inputPlaceholder: 'Ej: 100 ; 50  o  200 ; 100  o  0x64 ; 0x32',
      examples: [
        { label: 'Overflow V=1, C=0: 100 + 50', mode: '8_ADD', q: '100 ; 50' },
        { label: 'Carry C=1, V=0: 200 + 100', mode: '8_ADD', q: '200 ; 100' },
        { label: 'Resta 8b: 45 - 60', mode: '8_SUB', q: '45 ; 60' },
        { label: 'ASR 8b: -20 >> 2', mode: '8_ASR', q: '-20 ; 2' }
      ],
      guide: [
        'La Unidad Aritmético-Lógica (ALU) actualiza cuatro flags de estado tras cada operación: Z (Zero, resultado igual a 0), N (Negative, bit más significativo igual a 1), C (Carry/Borrow en aritmética sin signo) y V (Overflow en Complemento a 2).',
        'El flag V se calcula exactamente como V = C_{n-1} XOR C_n, es decir, cuando el acarreo que entra al bit de signo difiere del acarreo que sale de él.'
      ],
      refTable: {
        headers: ['Flag', 'Condición', 'Significado'],
        rows: [
          ['Z (Zero)', 'Resultado == 0', 'Todos los bits son 0'],
          ['N (Negative)', 'MSB == 1', 'Negativo en Complemento a 2'],
          ['C (Carry)', 'C_n == 1 (ADD)', 'Desbordamiento sin signo'],
          ['V (Overflow)', 'C_{n-1} ⊕ C_n == 1', 'Desbordamiento con signo (C2)']
        ]
      },
      tips: [
        'Sumar dos positivos que da negativo (ej. 100 + 50 = -106 en 8 bits) activa V=1 sin activar C.',
        'En resta A - B, la ALU calcula A + (~B + 1) sumando el Complemento a 2 de B.',
        'ASR (desplazamiento aritmético a la derecha) conserva el bit de signo MSB.'
      ],
      faqs: [
        { q: '¿Cuál es la diferencia entre Carry (C) y Overflow (V)?', a: 'Carry indica desbordamiento en enteros sin signo; Overflow (V = C_{n-1} XOR C_n) indica que el resultado se salió del rango con signo en Complemento a 2.' },
        { q: '¿Qué formatos de entrada acepta la ALU?', a: 'Enteros decimales (positivos o negativos), binarios (0b...) y hexadecimales (0x...).' },
        { q: '¿Cómo funciona ASR frente a SHR?', a: 'SHR introduce ceros por la izquierda; ASR replica el bit de signo para mantener el signo al dividir por potencias de 2.' },
        { q: '¿Puedo exportar la tabla de acarreos?', a: 'Sí, pulsa "Copiar CSV" o "Copiar LaTeX" encima de los resultados.' }
      ],
      related: ['bases', 'ieee754', 'cache']
    },
    en: {
      metaTitle: 'Binary ALU & Flags (Z, N, C, V) Calculator Step by Step — BitsPasoAPaso',
      metaDescription: 'Simulate 4, 8, and 16-bit binary ALU operations (ADD, SUB, AND, OR, XOR, SHL, SHR, ASR) with carry rows and exact Z, N, C, V flags.',
      h1: 'Binary ALU & Status Flags (Z, N, C, V) Calculator',
      subtitle: 'Inspect column-by-column carries (C_{n-1} and C_n) and distinguish unsigned Carry from Two’s Complement Overflow (V).',
      modeLabels: {
        '8_ADD': '8-bit ADD (+)',
        '8_SUB': '8-bit SUB (-)',
        '8_AND': '8-bit AND',
        '8_OR': '8-bit OR',
        '8_XOR': '8-bit XOR',
        '8_SHL': '8-bit SHL',
        '8_SHR': '8-bit SHR',
        '8_ASR': '8-bit ASR',
        '4_ADD': '4-bit ADD (+)',
        '16_ADD': '16-bit ADD (+)'
      },
      inputLabel: 'Operands A ; B (decimal, 0b..., or 0x...) [; width ; op]',
      inputPlaceholder: 'e.g. 100 ; 50  or  200 ; 100  or  0x64 ; 0x32',
      examples: [
        { label: 'Overflow V=1, C=0: 100 + 50', mode: '8_ADD', q: '100 ; 50' },
        { label: 'Carry C=1, V=0: 200 + 100', mode: '8_ADD', q: '200 ; 100' },
        { label: '8-bit SUB: 45 - 60', mode: '8_SUB', q: '45 ; 60' },
        { label: '8-bit ASR: -20 >> 2', mode: '8_ASR', q: '-20 ; 2' }
      ],
      guide: [
        'The Arithmetic Logic Unit (ALU) updates four status flags: Z (Zero), N (Negative, MSB == 1), C (unsigned Carry), and V (Two’s Complement signed Overflow).',
        'Signed overflow is computed as V = C_{n-1} XOR C_n — when the carry into the sign bit differs from the carry out of it.'
      ],
      refTable: {
        headers: ['Flag', 'Condition', 'Meaning'],
        rows: [
          ['Z (Zero)', 'Result == 0', 'All bits are 0'],
          ['N (Negative)', 'MSB == 1', "Negative in Two's Complement"],
          ['C (Carry)', 'C_n == 1 (ADD)', 'Unsigned overflow'],
          ['V (Overflow)', 'C_{n-1} ⊕ C_n == 1', 'Signed 2C overflow']
        ]
      },
      tips: [
        'Adding two positives that yields a negative (100 + 50 = -106 in 8-bit) sets V=1 with C=0.',
        'For A - B, the ALU computes A + (~B + 1) using Two’s Complement.',
        'ASR preserves the MSB sign bit while shifting right.'
      ],
      faqs: [
        { q: 'Carry (C) vs Overflow (V)?', a: 'Carry detects unsigned overflow; V = C_{n-1} XOR C_n detects signed Two’s Complement overflow.' },
        { q: 'Which input formats are accepted?', a: 'Signed decimal, binary (0b...), and hexadecimal (0x...).' },
        { q: 'SHR vs ASR?', a: 'SHR shifts in zeros; ASR copies the MSB sign bit.' },
        { q: 'Can I export to LaTeX or CSV?', a: 'Yes, click "Copy CSV" or "Copy LaTeX" above the results.' }
      ],
      related: ['bases', 'ieee754', 'cache']
    },
    fr: {
      metaTitle: 'Calculateur ALU Binaire et Flags Z, N, C, V étape par étape — BitsPasoAPaso',
      metaDescription: 'Simulez l’ALU binaire 4, 8 et 16 bits (ADD, SUB, logique, décalages) avec retenues et drapeaux Z, N, C, V.',
      h1: 'Calculateur ALU Binaire et Flags Z, N, C, V',
      subtitle: 'Visualisez les retenues colonne par colonne (C_{n-1} et C_n) et distinguez Carry non signé et Overflow signé (V).',
      modeLabels: {
        '8_ADD': '8-bit ADD (+)',
        '8_SUB': '8-bit SUB (-)',
        '8_AND': '8-bit AND',
        '8_OR': '8-bit OR',
        '8_XOR': '8-bit XOR',
        '8_SHL': '8-bit SHL',
        '8_SHR': '8-bit SHR',
        '8_ASR': '8-bit ASR',
        '4_ADD': '4-bit ADD (+)',
        '16_ADD': '16-bit ADD (+)'
      },
      inputLabel: 'Opérandes A ; B (décimal, 0b... ou 0x...) [; largeur ; op]',
      inputPlaceholder: 'Ex : 100 ; 50  ou  200 ; 100  ou  0x64 ; 0x32',
      examples: [
        { label: 'Overflow V=1, C=0 : 100 + 50', mode: '8_ADD', q: '100 ; 50' },
        { label: 'Carry C=1, V=0 : 200 + 100', mode: '8_ADD', q: '200 ; 100' },
        { label: 'Soustraction 8b : 45 - 60', mode: '8_SUB', q: '45 ; 60' },
        { label: 'ASR 8b : -20 >> 2', mode: '8_ASR', q: '-20 ; 2' }
      ],
      guide: [
        'L’ALU met à jour 4 drapeaux : Z (Zéro), N (Négatif, MSB=1), C (Retenue non signée) et V (Dépassement signé en complément à 2).',
        'V vaut exactement C_{n-1} XOR C_n.'
      ],
      refTable: {
        headers: ['Flag', 'Condition', 'Signification'],
        rows: [
          ['Z (Zero)', 'Résultat == 0', 'Tous les bits sont à 0'],
          ['N (Negative)', 'MSB == 1', 'Négatif en Complément à 2'],
          ['C (Carry)', 'C_n == 1 (ADD)', 'Dépassement non signé'],
          ['V (Overflow)', 'C_{n-1} ⊕ C_n == 1', 'Dépassement signé (C2)']
        ]
      },
      tips: [
        '100 + 50 sur 8 bits active V=1 sans activer C.',
        'Pour A - B, l’ALU calcule A + (~B + 1).',
        'ASR conserve le bit de signe MSB.'
      ],
      faqs: [
        { q: 'Différence entre Carry (C) et Overflow (V) ?', a: 'C détecte le dépassement non signé ; V = C_{n-1} XOR C_n détecte le dépassement signé en C2.' },
        { q: 'Quels formats sont acceptés ?', a: 'Décimal signé, binaire (0b...) et hexadécimal (0x...).' },
        { q: 'SHR vs ASR ?', a: 'SHR insère des 0 ; ASR réplique le bit de signe.' },
        { q: 'Puis-je exporter en CSV/LaTeX ?', a: 'Oui, via les boutons au-dessus des résultats.' }
      ],
      related: ['bases', 'ieee754', 'cache']
    }
  },
  dijkstra: {
    es: {
      metaTitle: 'Algoritmo de Dijkstra paso a paso (Grafo SVG y Tabla de Iteraciones) — BitsPasoAPaso',
      metaDescription: 'Resuelve el algoritmo de Dijkstra paso a paso con grafo SVG, tabla de iteraciones (distancia, predecesor), árbol de caminos mínimos y tabla de enrutamiento.',
      h1: 'Algoritmo de Dijkstra paso a paso',
      subtitle: 'Visualiza el grafo en SVG, la tabla clásica de iteraciones de examen (N\', distancia, predecesor) y la tabla de enrutamiento final.',
      modeLabels: { undirected: 'Grafo No Dirigido', directed: 'Grafo Dirigido' },
      inputLabel: 'Aristas ponderadas ; Nodo origen [; Nodo destino opcional]',
      inputPlaceholder: 'Ej: A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2 ; A ; E',
      examples: [
        { label: 'Grafo examen A → E (5 nodos)', mode: 'undirected', q: 'A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2 ; A ; E' },
        { label: 'Red routers R1 → R6', mode: 'undirected', q: 'R1-R2:2, R1-R3:5, R2-R3:1, R2-R4:4, R3-R5:3, R4-R5:1, R4-R6:7, R5-R6:2 ; R1 ; R6' },
        { label: 'Grafo dirigido A → D', mode: 'directed', q: 'A-B:10, A-C:3, C-B:4, B-D:2, C-D:8 ; A ; D' },
        { label: 'Árbol completo desde S', mode: 'undirected', q: 'S-A:7, S-B:2, A-B:3, A-C:4, B-D:6, C-D:1 ; S' }
      ],
      guide: [
        'El algoritmo de Dijkstra (usado en protocolos de enrutamiento de estado de enlace como OSPF e IS-IS) encuentra los caminos de coste mínimo desde un nodo origen a todos los demás en grafos con pesos no negativos (w >= 0).',
        'En cada iteración selecciona el nodo no visitado con menor distancia acumulada, lo añade al conjunto N\' y relaja sus aristas salientes: si d(u) + w(u,v) < d(v), actualiza d(v) y su predecesor.'
      ],
      refTable: {
        headers: ['Concepto', 'Valor / Fórmula', 'Uso en OSPF'],
        rows: [
          ['Inicialización', 'd(origen) = 0, resto = ∞', 'Inicio del árbol SPF'],
          ['Selección', 'min d(u) con u ∉ N\'', 'Fija el siguiente nodo'],
          ['Relajación', 'd(u) + w(u,v) < d(v)', 'Mejora ruta vía u'],
          ['Restricción', 'w(u,v) ≥ 0 siempre', 'No admite pesos negativos']
        ]
      },
      tips: [
        'Si un enlace tiene peso negativo, Dijkstra no garantiza el óptimo (habría que usar Bellman-Ford).',
        'El "Next Hop" hacia cualquier destino es el primer nodo tras el origen en la ruta mínima.',
        'En grafos no dirigidos, cada enlace A-B:w permite ir tanto de A a B como de B a A.'
      ],
      faqs: [
        { q: '¿Por qué Dijkstra no admite pesos negativos?', a: 'Porque asume que añadir aristas nunca reduce el coste acumulado de un camino ya fijado.' },
        { q: '¿Qué significa la columna N\' en la tabla de iteraciones?', a: 'Representa el conjunto de nodos cuya distancia mínima desde el origen ya es definitiva.' },
        { q: '¿Cómo se lee la tabla de enrutamiento final?', a: 'Muestra para cada destino su coste total, el siguiente salto (Next Hop) desde el origen y el camino completo.' },
        { q: '¿Puedo usarlo para grafos dirigidos?', a: 'Sí, cambia el modo a "Grafo Dirigido" en la parte superior.' }
      ],
      related: ['cidr', 'vlsm', 'bandwidth']
    },
    en: {
      metaTitle: "Dijkstra's Algorithm Step by Step (SVG Graph & Iteration Table) — BitsPasoAPaso",
      metaDescription: "Solve Dijkstra's shortest path algorithm step by step with SVG graph, exam iteration table, SPF tree, and final routing table.",
      h1: "Dijkstra's Algorithm Step by Step",
      subtitle: "Visualize the graph in SVG, inspect the classic exam iteration table (N', distance, predecessor), and view the final routing table.",
      modeLabels: { undirected: 'Undirected Graph', directed: 'Directed Graph' },
      inputLabel: 'Weighted edges ; Source node [; Optional target node]',
      inputPlaceholder: 'e.g. A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2 ; A ; E',
      examples: [
        { label: 'Exam graph A → E (5 nodes)', mode: 'undirected', q: 'A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2 ; A ; E' },
        { label: 'Routers R1 → R6', mode: 'undirected', q: 'R1-R2:2, R1-R3:5, R2-R3:1, R2-R4:4, R3-R5:3, R4-R5:1, R4-R6:7, R5-R6:2 ; R1 ; R6' },
        { label: 'Directed A → D', mode: 'directed', q: 'A-B:10, A-C:3, C-B:4, B-D:2, C-D:8 ; A ; D' },
        { label: 'Full SPF tree from S', mode: 'undirected', q: 'S-A:7, S-B:2, A-B:3, A-C:4, B-D:6, C-D:1 ; S' }
      ],
      guide: [
        "Dijkstra's algorithm (used by OSPF and IS-IS) computes shortest paths from a source node to all others on graphs with non-negative weights (w >= 0).",
        "At each step it picks the unvisited node with minimum distance, adds it to N', and relaxes outgoing edges: if d(u) + w(u,v) < d(v), update d(v) and predecessor."
      ],
      refTable: {
        headers: ['Concept', 'Formula / Rule', 'OSPF Role'],
        rows: [
          ['Init', 'd(src) = 0, others = ∞', 'Start SPF tree'],
          ['Pick', "min d(u) for u ∉ N'", 'Lock next node'],
          ['Relax', 'd(u) + w(u,v) < d(v)', 'Improve path via u'],
          ['Constraint', 'w(u,v) ≥ 0 always', 'No negative weights']
        ]
      },
      tips: [
        'Negative weights break Dijkstra’s greedy invariant (use Bellman-Ford instead).',
        'Next Hop is the first node after the source along the shortest path.',
        'In undirected graphs, A-B:w adds both A→B and B→A.'
      ],
      faqs: [
        { q: 'Why are negative weights disallowed?', a: 'Dijkstra assumes path costs never decrease when extending an already finalized node.' },
        { q: "What is N' in the iteration table?", a: 'The set of visited nodes whose shortest distance from source is finalized.' },
        { q: 'How do I read the routing table?', a: 'It lists each destination, total cost, Next Hop from source, and full path.' },
        { q: 'Does it support directed graphs?', a: 'Yes, toggle "Directed Graph" at the top.' }
      ],
      related: ['cidr', 'vlsm', 'bandwidth']
    },
    fr: {
      metaTitle: 'Algorithme de Dijkstra étape par étape (Graphe SVG et Itérations) — BitsPasoAPaso',
      metaDescription: 'Résolvez Dijkstra étape par étape avec graphe SVG, table d’itérations (distance, prédécesseur) et table de routage finale.',
      h1: 'Algorithme de Dijkstra étape par étape',
      subtitle: 'Graphe SVG interactif, table classique des itérations (N\', distance, prédécesseur) et table de routage finale.',
      modeLabels: { undirected: 'Graphe Non Orienté', directed: 'Graphe Orienté' },
      inputLabel: 'Arêtes pondérées ; Nœud source [; Nœud cible optionnel]',
      inputPlaceholder: 'Ex : A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2 ; A ; E',
      examples: [
        { label: 'Graphe examen A → E', mode: 'undirected', q: 'A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2 ; A ; E' },
        { label: 'Routeurs R1 → R6', mode: 'undirected', q: 'R1-R2:2, R1-R3:5, R2-R3:1, R2-R4:4, R3-R5:3, R4-R5:1, R4-R6:7, R5-R6:2 ; R1 ; R6' },
        { label: 'Orienté A → D', mode: 'directed', q: 'A-B:10, A-C:3, C-B:4, B-D:2, C-D:8 ; A ; D' },
        { label: 'Arbre complet depuis S', mode: 'undirected', q: 'S-A:7, S-B:2, A-B:3, A-C:4, B-D:6, C-D:1 ; S' }
      ],
      guide: [
        'L’algorithme de Dijkstra (utilisé dans OSPF et IS-IS) calcule les plus courts chemins depuis une source sur des graphes à poids positifs ou nuls.',
        'À chaque itération, on fixe le nœud non visité de plus petite distance et on relâche ses arêtes sortantes.'
      ],
      refTable: {
        headers: ['Concept', 'Règle / Formule', 'Rôle OSPF'],
        rows: [
          ['Init', 'd(src) = 0, reste = ∞', 'Départ de l’arbre SPF'],
          ['Choix', "min d(u) pour u ∉ N'", 'Fixe le nœud suivant'],
          ['Relâchement', 'd(u) + w(u,v) < d(v)', 'Améliore via u'],
          ['Contrainte', 'w(u,v) ≥ 0', 'Aucun poids négatif']
        ]
      },
      tips: [
        'Les poids négatifs invalident Dijkstra (utilisez Bellman-Ford).',
        'Le Next Hop est le premier saut après la source.',
        'En non orienté, A-B:w vaut dans les deux sens.'
      ],
      faqs: [
        { q: 'Pourquoi interdire les poids négatifs ?', a: 'Dijkstra suppose qu’ajouter une arête ne diminue jamais le coût.' },
        { q: "Que représente N' ?", a: 'L’ensemble des nœuds dont la distance minimale est définitive.' },
        { q: 'Comment lire la table finale ?', a: 'Elle donne pour chaque destination le coût, le Next Hop et le chemin.' },
        { q: 'Les graphes orientés sont-ils gérés ?', a: 'Oui, via le mode « Graphe Orienté ».' }
      ],
      related: ['cidr', 'vlsm', 'bandwidth']
    }
  },
  ipv4Header: {
    es: {
      metaTitle: 'Decodificador de Cabecera IPv4 y Checksum RFC 791 — BitsPasoAPaso',
      metaDescription: 'Decodifica cabeceras IPv4 en hexadecimal, visualiza los 32 bits por fila y verifica o calcula el checksum de 16 bits en complemento a 1 paso a paso.',
      h1: 'Decodificador de Cabecera IPv4 y Checksum RFC 791',
      subtitle: 'Inspecciona cada campo de la cabecera IPv4 de 20+ bytes, verifica el checksum en complemento a 1 con end-around carry o construye una cabecera desde cero.',
      modeLabels: { decode: 'Decodificar Hex + Checksum', build: 'Construir / Calcular Checksum' },
      inputLabel: 'Cabecera Hex (mín. 40 hex) o Campos: IP_orig ; IP_dest ; TTL ; Proto ; Longitud',
      inputPlaceholder: 'Ej: 4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7',
      examples: [
        { label: 'Cabecera UDP válida (RFC)', mode: 'decode', q: '4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7' },
        { label: 'Cabecera TCP con DF=1', mode: 'decode', q: '4500 003c 1c46 4000 4006 b1e6 ac10 0a63 ac10 0a0c' },
        { label: 'Checksum corrupto', mode: 'decode', q: '4500 0073 0000 4000 4011 b860 c0a8 0001 c0a8 00c7' },
        { label: 'Construir: 192.168.0.1 → .199', mode: 'build', q: '192.168.0.1 ; 192.168.0.199 ; 64 ; 17 ; 115' }
      ],
      guide: [
        'La cabecera IPv4 estándar tiene 20 bytes (IHL = 5 palabras de 32 bits). El campo Checksum protege únicamente la cabecera (no la carga útil) mediante suma en complemento a 1 de palabras de 16 bits.',
        'Al verificar en el receptor, si se suman todas las palabras de 16 bits incluido el checksum recibido y se pliegan los acarreos (end-around carry), el resultado en complemento a 1 debe ser 0xFFFF (y su complemento 0x0000).'
      ],
      refTable: {
        headers: ['Campo', 'Bits', 'Descripción'],
        rows: [
          ['Version / IHL', '4 + 4', '4 (IPv4) / 5 (20 bytes)'],
          ['Total Length', '16', 'Longitud total del paquete'],
          ['Flags / Offset', '3 + 13', 'DF (Don’t Fragment), MF'],
          ['TTL / Protocol', '8 + 8', 'Saltos / ICMP=1, TCP=6, UDP=17'],
          ['Header Checksum', '16', 'Complemento a 1 de 16 bits']
        ]
      },
      tips: [
        'IHL indica el número de palabras de 32 bits: multiplica IHL × 4 para obtener los bytes de cabecera.',
        'Al calcular el checksum desde cero, el campo Checksum se inicializa a 0x0000 antes de sumar.',
        'Si la suma supera 0xFFFF, suma el acarreo superior a los 16 bits inferiores (end-around carry) y aplica NOT bit a bit.'
      ],
      faqs: [
        { q: '¿Qué pasa si la cabecera tiene opciones (IHL > 5)?', a: 'El decodificador suma todas las palabras de 16 bits de los IHL × 4 bytes reales de la cabecera.' },
        { q: '¿Por qué el checksum IPv4 cambia en cada salto de router?', a: 'Porque cada router decrementa el TTL en 1, lo que obliga a recalcular el checksum de la cabecera.' },
        { q: '¿Cómo se interpreta Flags = 0x4000?', a: 'El bit 1 (0x4000) es DF (Don’t Fragment) activo y Fragment Offset = 0.' },
        { q: '¿IPv6 sigue usando checksum en su cabecera?', a: 'No, IPv6 eliminó el checksum de cabecera para acelerar el reenvío en routers.' }
      ],
      related: ['vlsm', 'hamming', 'ipv6']
    },
    en: {
      metaTitle: 'IPv4 Header Decoder & RFC 791 Checksum Calculator — BitsPasoAPaso',
      metaDescription: 'Decode hex IPv4 headers, render the 32-bit-per-row packet diagram, and verify or compute the 16-bit one’s complement checksum step by step.',
      h1: 'IPv4 Header Decoder & RFC 791 Checksum',
      subtitle: 'Inspect every field of a 20+ byte IPv4 header, verify 16-bit one’s complement checksum with end-around carry, or build headers from scratch.',
      modeLabels: { decode: 'Decode Hex + Checksum', build: 'Build / Compute Checksum' },
      inputLabel: 'Hex Header (min 40 hex) or Fields: Src_IP ; Dst_IP ; TTL ; Proto ; Length',
      inputPlaceholder: 'e.g. 4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7',
      examples: [
        { label: 'Valid UDP header (RFC)', mode: 'decode', q: '4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7' },
        { label: 'TCP header (DF=1)', mode: 'decode', q: '4500 003c 1c46 4000 4006 b1e6 ac10 0a63 ac10 0a0c' },
        { label: 'Corrupted checksum', mode: 'decode', q: '4500 0073 0000 4000 4011 b860 c0a8 0001 c0a8 00c7' },
        { label: 'Build: 192.168.0.1 → .199', mode: 'build', q: '192.168.0.1 ; 192.168.0.199 ; 64 ; 17 ; 115' }
      ],
      guide: [
        'A standard IPv4 header is 20 bytes (IHL = 5 32-bit words). The Header Checksum covers only the IPv4 header via 16-bit one’s complement addition.',
        'At the receiver, summing all 16-bit words including the received checksum with end-around carry yields 0xFFFF (complement 0x0000) when valid.'
      ],
      refTable: {
        headers: ['Field', 'Bits', 'Description'],
        rows: [
          ['Version / IHL', '4 + 4', '4 (IPv4) / 5 (20 bytes)'],
          ['Total Length', '16', 'Total packet size in bytes'],
          ['Flags / Offset', '3 + 13', 'DF (Don’t Fragment), MF'],
          ['TTL / Protocol', '8 + 8', 'Hops / ICMP=1, TCP=6, UDP=17'],
          ['Header Checksum', '16', '16-bit one’s complement']
        ]
      },
      tips: [
        'Multiply IHL × 4 to get the header length in bytes.',
        'When computing from scratch, set the checksum field to 0x0000 before summing.',
        'Fold any carry above 16 bits back into the lower 16 bits (end-around carry), then bitwise NOT.'
      ],
      faqs: [
        { q: 'What if IHL > 5 (IP options)?', a: 'The decoder sums all 16-bit words across the full IHL × 4 header bytes.' },
        { q: 'Why does the IPv4 checksum change at every hop?', a: 'Because each router decrements TTL by 1.' },
        { q: 'What does Flags = 0x4000 mean?', a: 'DF (Don’t Fragment) is set and Fragment Offset is 0.' },
        { q: 'Does IPv6 have a header checksum?', a: 'No, IPv6 removed it to speed up router forwarding.' }
      ],
      related: ['vlsm', 'hamming', 'ipv6']
    },
    fr: {
      metaTitle: 'Décodeur d’En-tête IPv4 et Checksum RFC 791 — BitsPasoAPaso',
      metaDescription: 'Décodez des en-têtes IPv4 hexadécimaux, visualisez les 32 bits par ligne et vérifiez le checksum en complément à 1 étape par étape.',
      h1: 'Décodeur d’En-tête IPv4 et Checksum RFC 791',
      subtitle: 'Inspectez chaque champ d’un en-tête IPv4, vérifiez le checksum 16 bits avec retenue circulaire ou construisez un en-tête.',
      modeLabels: { decode: 'Décoder Hex + Checksum', build: 'Construire / Calculer Checksum' },
      inputLabel: 'En-tête Hex (min 40 hex) ou Champs : IP_src ; IP_dst ; TTL ; Proto ; Longueur',
      inputPlaceholder: 'Ex : 4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7',
      examples: [
        { label: 'En-tête UDP valide', mode: 'decode', q: '4500 0073 0000 4000 4011 b861 c0a8 0001 c0a8 00c7' },
        { label: 'En-tête TCP (DF=1)', mode: 'decode', q: '4500 003c 1c46 4000 4006 b1e6 ac10 0a63 ac10 0a0c' },
        { label: 'Checksum corrompu', mode: 'decode', q: '4500 0073 0000 4000 4011 b860 c0a8 0001 c0a8 00c7' },
        { label: 'Construire : 192.168.0.1 → .199', mode: 'build', q: '192.168.0.1 ; 192.168.0.199 ; 64 ; 17 ; 115' }
      ],
      guide: [
        'Un en-tête IPv4 standard mesure 20 octets (IHL = 5 mots de 32 bits). Le checksum protège l’en-tête par addition en complément à 1 sur 16 bits.',
        'À la réception, la somme de tous les mots (checksum inclus) avec retenue circulaire doit donner 0xFFFF.'
      ],
      refTable: {
        headers: ['Champ', 'Bits', 'Description'],
        rows: [
          ['Version / IHL', '4 + 4', '4 (IPv4) / 5 (20 octets)'],
          ['Total Length', '16', 'Longueur totale du paquet'],
          ['Flags / Offset', '3 + 13', 'DF (Don’t Fragment), MF'],
          ['TTL / Protocol', '8 + 8', 'Sauts / ICMP=1, TCP=6, UDP=17'],
          ['Header Checksum', '16', 'Complément à 1 sur 16 bits']
        ]
      },
      tips: [
        'Multipliez IHL × 4 pour obtenir la taille en octets.',
        'Pour calculer depuis zéro, initialisez le champ Checksum à 0x0000.',
        'Additionnez la retenue au-delà de 16 bits puis inversez bit à bit.'
      ],
      faqs: [
        { q: 'Que se passe-t-il si IHL > 5 ?', a: 'Le décodeur somme tous les mots de 16 bits des IHL × 4 octets.' },
        { q: 'Pourquoi le checksum change-t-il à chaque routeur ?', a: 'Parce que chaque routeur décrémente le TTL de 1.' },
        { q: 'Que signifie Flags = 0x4000 ?', a: 'Bit DF actif et Fragment Offset = 0.' },
        { q: 'IPv6 conserve-t-il ce checksum ?', a: 'Non, IPv6 l’a supprimé pour accélérer le routage.' }
      ],
      related: ['vlsm', 'hamming', 'ipv6']
    }
  }
};
