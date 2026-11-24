export const PHASE3_CONTENT = {
  cache: {
    es: {
      metaTitle: 'Simulador de Memoria Caché paso a paso (Tag, Index, Offset, LRU/FIFO) — BitsPasoAPaso',
      metaDescription: 'Simula memoria caché paso a paso: desglose Tag/Index/Offset, mapeo directo, asociativo por conjuntos y total, hits/misses, motivo de fallo y estado final.',
      h1: 'Simulador de Memoria Caché paso a paso',
      subtitle: 'Desglosa Tag, Index y Offset, traza cada acceso con hits, misses (frío/conflicto/capacidad) y políticas de reemplazo LRU o FIFO.',
      modeLabels: {
        '1_LRU': 'Mapeo Directo (1 vía)',
        '2_LRU': '2 vías (LRU)',
        '4_LRU': '4 vías (LRU)',
        'full_LRU': 'Totalmente Asociativa (LRU)',
        '2_FIFO': '2 vías (FIFO)'
      },
      inputLabel: 'Bits_dir ; Tamaño_caché ; Tamaño_bloque ; [Vías ; Política ;] Accesos (hex/dec)',
      inputPlaceholder: 'Ej: 16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010, 0x0018, 0x0114',
      examples: [
        { label: '16b, 256B, Blq 16B (Directo)', mode: '1_LRU', q: '16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010' },
        { label: '16b, 256B, 2 vías LRU', mode: '2_LRU', q: '16 ; 256 B ; 16 B ; 0x0010, 0x0110, 0x0210, 0x0010' },
        { label: '32b, 4 KiB, Blq 64B (4 vías)', mode: '4_LRU', q: '32 ; 4 KiB ; 64 B ; 0x1000, 0x1020, 0x2000, 0x1000, 0x3000' },
        { label: '8b, 64B, Blq 8B (Total Assoc.)', mode: 'full_LRU', q: '8 ; 64 B ; 8 B ; 0x00, 0x08, 0x10, 0x00, 0x18' }
      ],
      guide: [
        'Una dirección de memoria física de A bits se divide de derecha a izquierda en: Offset = log₂(tamaño_bloque), Index = log₂(número_de_conjuntos) y Tag = A - Index - Offset.',
        'Los fallos (misses) se clasifican en las 3 Cs: Frío/Compulsory (primer acceso al bloque), Conflicto (colisión en el mismo conjunto habiendo otros conjuntos libres) y Capacidad (la caché completa está llena).'
      ],
      refTable: {
        headers: ['Organización', 'Conjuntos (S)', 'Vías (W)', 'Index bits'],
        rows: [
          ['Mapeo directo', 'Líneas (L)', '1', 'log₂(L)'],
          ['Asociativa 2 vías', 'L / 2', '2', 'log₂(L / 2)'],
          ['Asociativa 4 vías', 'L / 4', '4', 'log₂(L / 4)'],
          ['Totalmente asociativa', '1', 'L', '0 bits']
        ]
      },
      tips: [
        'Dos direcciones pertenecen al mismo bloque si comparten exactamente los mismos bits de Tag + Index (solo cambia el Offset).',
        'En mapeo directo no hay política de reemplazo porque cada bloque solo tiene 1 línea posible.',
        'Aumentar la asociatividad reduce los fallos por conflicto, pero incrementa los comparadores de Tag.'
      ],
      faqs: [
        { q: '¿Cómo se calculan los bits de Offset, Index y Tag?', a: 'Offset = log₂(bloque), Conjuntos = (Caché / Bloque) / Vías, Index = log₂(Conjuntos) y Tag = Bits_dirección - Index - Offset.' },
        { q: '¿Qué diferencia hay entre fallo de conflicto y de capacidad?', a: 'El fallo de conflicto ocurre en un conjunto lleno aunque queden líneas libres en otros conjuntos; el de capacidad ocurre cuando toda la caché ya está ocupada.' },
        { q: '¿Cómo funciona LRU frente a FIFO?', a: 'LRU desaloja el bloque menos recientemente usado (se actualiza en cada Hit), mientras que FIFO desaloja el más antiguo en entrar.' },
        { q: '¿Puedo exportar la traza de accesos?', a: 'Sí, pulsa "Copiar CSV" o "Copiar LaTeX" encima de los resultados.' }
      ],
      related: ['bases', 'ieee754', 'raidChmod']
    },
    en: {
      metaTitle: 'Cache Memory Simulator Step by Step (Tag, Index, Offset, LRU/FIFO) — BitsPasoAPaso',
      metaDescription: 'Simulate cache memory step by step: Tag/Index/Offset breakdown, direct-mapped, set-associative & fully associative, hits/misses, and final state.',
      h1: 'Cache Memory Simulator Step by Step',
      subtitle: 'Split Tag, Index, and Offset bits, trace every memory access (Hits, Cold/Conflict/Capacity Misses), and inspect LRU/FIFO replacement.',
      modeLabels: {
        '1_LRU': 'Direct Mapped (1-way)',
        '2_LRU': '2-way (LRU)',
        '4_LRU': '4-way (LRU)',
        'full_LRU': 'Fully Associative (LRU)',
        '2_FIFO': '2-way (FIFO)'
      },
      inputLabel: 'Addr_bits ; Cache_size ; Block_size ; [Ways ; Policy ;] Accesses (hex/dec)',
      inputPlaceholder: 'e.g. 16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010, 0x0018, 0x0114',
      examples: [
        { label: '16b, 256B, Blk 16B (Direct)', mode: '1_LRU', q: '16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010' },
        { label: '16b, 256B, 2-way LRU', mode: '2_LRU', q: '16 ; 256 B ; 16 B ; 0x0010, 0x0110, 0x0210, 0x0010' },
        { label: '32b, 4 KiB, Blk 64B (4-way)', mode: '4_LRU', q: '32 ; 4 KiB ; 64 B ; 0x1000, 0x1020, 0x2000, 0x1000, 0x3000' },
        { label: '8b, 64B, Blk 8B (Full Assoc.)', mode: 'full_LRU', q: '8 ; 64 B ; 8 B ; 0x00, 0x08, 0x10, 0x00, 0x18' }
      ],
      guide: [
        'An A-bit physical address splits from LSB to MSB into: Offset = log₂(block_size), Index = log₂(num_sets), and Tag = A - Index - Offset.',
        'Misses fall into the 3 Cs: Compulsory/Cold (first access), Conflict (set collision while other sets have room), and Capacity (entire cache is full).'
      ],
      refTable: {
        headers: ['Organization', 'Sets (S)', 'Ways (W)', 'Index bits'],
        rows: [
          ['Direct Mapped', 'Lines (L)', '1', 'log₂(L)'],
          ['2-way Set Assoc.', 'L / 2', '2', 'log₂(L / 2)'],
          ['4-way Set Assoc.', 'L / 4', '4', 'log₂(L / 4)'],
          ['Fully Associative', '1', 'L', '0 bits']
        ]
      },
      tips: [
        'Two addresses map to the same block if they share identical Tag + Index bits.',
        'Direct-mapped caches need no replacement policy since each block has only one slot.',
        'Higher associativity lowers conflict misses at the cost of extra Tag comparators.'
      ],
      faqs: [
        { q: 'How are Offset, Index, and Tag bits computed?', a: 'Offset = log₂(block), Sets = (Cache / Block) / Ways, Index = log₂(Sets), Tag = Addr_bits - Index - Offset.' },
        { q: 'Conflict vs Capacity miss?', a: 'Conflict happens when a set is full while other sets are free; Capacity happens when the entire cache is full.' },
        { q: 'LRU vs FIFO?', a: 'LRU evicts the least recently accessed block (updated on Hits); FIFO evicts the oldest loaded block.' },
        { q: 'Can I export the trace table?', a: 'Yes, use "Copy CSV" or "Copy LaTeX" above the results.' }
      ],
      related: ['bases', 'ieee754', 'raidChmod']
    },
    fr: {
      metaTitle: 'Simulateur de Mémoire Cache étape par étape (Tag, Index, Offset) — BitsPasoAPaso',
      metaDescription: 'Simulez une mémoire cache étape par étape : Tag/Index/Offset, correspondance directe, associative par ensembles, hits/misses et LRU/FIFO.',
      h1: 'Simulateur de Mémoire Cache étape par étape',
      subtitle: 'Découpage Tag, Index et Offset, trace des accès (Hits, Misses froid/conflit/capacité) et politiques LRU ou FIFO.',
      modeLabels: {
        '1_LRU': 'Directe (1 voie)',
        '2_LRU': '2 voies (LRU)',
        '4_LRU': '4 voies (LRU)',
        'full_LRU': 'Totalement Associative (LRU)',
        '2_FIFO': '2 voies (FIFO)'
      },
      inputLabel: 'Bits_adr ; Taille_cache ; Taille_bloc ; [Voies ; Politique ;] Accès (hex/déc)',
      inputPlaceholder: 'Ex : 16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010, 0x0018, 0x0114',
      examples: [
        { label: '16b, 256B, Bloc 16B (Directe)', mode: '1_LRU', q: '16 ; 256 B ; 16 B ; 0x0010, 0x0014, 0x0110, 0x0010' },
        { label: '16b, 256B, 2 voies LRU', mode: '2_LRU', q: '16 ; 256 B ; 16 B ; 0x0010, 0x0110, 0x0210, 0x0010' },
        { label: '32b, 4 KiB, Bloc 64B (4 voies)', mode: '4_LRU', q: '32 ; 4 KiB ; 64 B ; 0x1000, 0x1020, 0x2000, 0x1000, 0x3000' },
        { label: '8b, 64B, Bloc 8B (Totale)', mode: 'full_LRU', q: '8 ; 64 B ; 8 B ; 0x00, 0x08, 0x10, 0x00, 0x18' }
      ],
      guide: [
        'Une adresse physique de A bits se découpe en : Offset = log₂(bloc), Index = log₂(ensembles) et Tag = A - Index - Offset.',
        'Les défauts (misses) sont classés en 3 C : Froid (premier accès), Conflit (collision dans un ensemble) et Capacité (cache plein).'
      ],
      refTable: {
        headers: ['Organisation', 'Ensembles (S)', 'Voies (W)', 'Bits Index'],
        rows: [
          ['Directe', 'Lignes (L)', '1', 'log₂(L)'],
          ['2 voies', 'L / 2', '2', 'log₂(L / 2)'],
          ['4 voies', 'L / 4', '4', 'log₂(L / 4)'],
          ['Totalement associative', '1', 'L', '0 bit']
        ]
      },
      tips: [
        'Deux adresses appartiennent au même bloc si leurs bits Tag + Index sont identiques.',
        'En correspondance directe, il n’y a pas de politique de remplacement.',
        'Plus d’associativité réduit les conflits mais augmente le coût des comparateurs.'
      ],
      faqs: [
        { q: 'Comment calculer Offset, Index et Tag ?', a: 'Offset = log₂(bloc), Ensembles = (Cache / Bloc) / Voies, Index = log₂(Ensembles), Tag = Bits - Index - Offset.' },
        { q: 'Différence entre conflit et capacité ?', a: 'Le conflit survient dans un ensemble saturé alors que d’autres sont libres ; la capacité survient quand tout le cache est plein.' },
        { q: 'LRU vs FIFO ?', a: 'LRU évince le moins récemment utilisé ; FIFO évince le plus ancien entré.' },
        { q: 'Puis-je exporter la trace ?', a: 'Oui, via « Copier CSV » ou « Copier LaTeX ».' }
      ],
      related: ['bases', 'ieee754', 'raidChmod']
    }
  },
  lineCoding: {
    es: {
      metaTitle: 'Simulador de Codificación de Línea en SVG (NRZ, Manchester, AMI, HDB3) — BitsPasoAPaso',
      metaDescription: 'Dibuja cronogramas SVG paso a paso para NRZ-L, NRZI, Manchester, Manchester Diferencial, AMI y HDB3 (ITU-T G.703) con etiquetas B/V.',
      h1: 'Simulador de Codificación de Línea en SVG',
      subtitle: 'Genera cronogramas vectoriales de NRZ-L, NRZI, Manchester, Manchester Diferencial, AMI y HDB3 (ITU-T G.703) con análisis bit a bit.',
      modeLabels: {
        all: 'Comparar todos (6)',
        hdb3: 'HDB3 (ITU-T G.703)',
        ami: 'AMI (Bipolar)',
        manchester: 'Manchester (802.3)',
        diff_manchester: 'Manchester Dif.',
        nrzl: 'NRZ-L',
        nrzi: 'NRZI'
      },
      inputLabel: 'Trama binaria (4 a 32 bits, ej. 1100001010)',
      inputPlaceholder: 'Ej: 1100001010',
      examples: [
        { label: 'HDB3 (4 ceros): 1100001010', mode: 'all', q: '1100001010' },
        { label: 'HDB3 doble: 10000110000', mode: 'hdb3', q: '10000110000' },
        { label: 'AMI: 10110010', mode: 'ami', q: '10110010' },
        { label: 'Manchester: 01001101', mode: 'manchester', q: '01001101' }
      ],
      guide: [
        'La codificación de línea adapta una secuencia binaria a señales eléctricas de transmisión. Esquemas como Manchester garantizan una transición en cada bit (autosincronización de reloj), mientras que AMI alterna +V y -V para eliminar la componente continua (DC).',
        'HDB3 (High Density Bipolar 3) evita largas secuencias de ceros en AMI sustituyendo cada bloque 0000 por 000V (si los pulsos desde la última violación V son impares) o B00V (si son pares), manteniendo V con igual polaridad que el pulso previo.'
      ],
      refTable: {
        headers: ['Esquema', 'Componente DC', 'Sincronización reloj', 'Ancho de banda'],
        rows: [
          ['NRZ-L / NRZI', 'Alta (si hay rachas)', 'Baja en 0s/1s largos', '1× (bajo)'],
          ['Manchester / Dif.', 'Nula (0 DC)', 'Excelente (cada bit)', '2× (doble)'],
          ['AMI', 'Nula (0 DC)', 'Baja en 0s largos', '1×'],
          ['HDB3', 'Nula (0 DC)', 'Alta (máx. 3 ceros)', '1×']
        ]
      },
      tips: [
        'En Manchester IEEE 802.3, el 0 baja (+V → -V) y el 1 sube (-V → +V) justo a mitad de bit.',
        'En HDB3, recuerda el estado inicial antes de empezar: último pulso negativo (-V) y paridad de pulsos PAR.',
        'Las violaciones V en HDB3 rompen intencionadamente la alternancia bipolar de AMI para que el receptor identifique el relleno.'
      ],
      faqs: [
        { q: '¿Por qué HDB3 usa B00V y 000V?', a: 'Para garantizar que las violaciones consecutivas V alternen su polaridad (+V y -V), preservando así la componente continua nula (0 DC).' },
        { q: '¿Cuál es la diferencia entre Manchester y Manchester Diferencial?', a: 'En Manchester el nivel a mitad de bit codifica el 0 o 1; en Manchester Diferencial se codifica mediante la presencia (0) o ausencia (1) de transición al inicio del bit.' },
        { q: '¿Qué es la autosincronización de reloj?', a: 'La capacidad del receptor de recuperar la señal de reloj a partir de las transiciones de la señal recibida.' },
        { q: '¿Cuántos bits admite el simulador?', a: 'De 4 a 32 bits con renderizado SVG nítido y exportable a PDF.' }
      ],
      related: ['hamming', 'bandwidth', 'bases']
    },
    en: {
      metaTitle: 'Line Coding SVG Simulator (NRZ, Manchester, AMI, HDB3) — BitsPasoAPaso',
      metaDescription: 'Render crisp SVG timing diagrams for NRZ-L, NRZI, Manchester, Differential Manchester, AMI, and HDB3 (ITU-T G.703) step by step.',
      h1: 'Line Coding SVG Simulator Step by Step',
      subtitle: 'Generate vector waveforms for NRZ-L, NRZI, Manchester, Differential Manchester, AMI, and HDB3 (ITU-T G.703) with bit-by-bit analysis.',
      modeLabels: {
        all: 'Compare All (6)',
        hdb3: 'HDB3 (ITU-T G.703)',
        ami: 'AMI (Bipolar)',
        manchester: 'Manchester (802.3)',
        diff_manchester: 'Diff. Manchester',
        nrzl: 'NRZ-L',
        nrzi: 'NRZI'
      },
      inputLabel: 'Binary frame (4 to 32 bits, e.g. 1100001010)',
      inputPlaceholder: 'e.g. 1100001010',
      examples: [
        { label: 'HDB3 (4 zeros): 1100001010', mode: 'all', q: '1100001010' },
        { label: 'HDB3 double: 10000110000', mode: 'hdb3', q: '10000110000' },
        { label: 'AMI: 10110010', mode: 'ami', q: '10110010' },
        { label: 'Manchester: 01001101', mode: 'manchester', q: '01001101' }
      ],
      guide: [
        'Line coding maps digital bits onto physical voltage waveforms. Manchester guarantees a mid-bit transition for clock recovery, while AMI alternates +V and -V pulses to achieve zero DC component.',
        'HDB3 (ITU-T G.703) prevents long runs of zeros in AMI by replacing each 0000 with 000V (if pulses since last V are odd) or B00V (if even), keeping V at the same polarity as the preceding pulse.'
      ],
      refTable: {
        headers: ['Scheme', 'DC Component', 'Clock Sync', 'Bandwidth'],
        rows: [
          ['NRZ-L / NRZI', 'High (long runs)', 'Poor on long runs', '1× (low)'],
          ['Manchester / Diff.', 'Zero (0 DC)', 'Excellent (every bit)', '2× (double)'],
          ['AMI', 'Zero (0 DC)', 'Poor on long 0s', '1×'],
          ['HDB3', 'Zero (0 DC)', 'High (max 3 zeros)', '1×']
        ]
      },
      tips: [
        'In IEEE 802.3 Manchester, 0 transitions high-to-low (+V → -V) and 1 transitions low-to-high (-V → +V).',
        'In HDB3, assume initial state before the frame: last pulse -V and even pulse parity.',
        'V violations deliberately break AMI alternation so the receiver detects zero-suppression.'
      ],
      faqs: [
        { q: 'Why does HDB3 alternate between B00V and 000V?', a: 'So consecutive V violations alternate polarity (+V / -V), preserving zero DC balance.' },
        { q: 'Manchester vs Differential Manchester?', a: 'Manchester encodes 0/1 by mid-bit direction; Differential Manchester encodes 0/1 by presence/absence of a transition at bit start.' },
        { q: 'What is self-clocking?', a: 'The receiver’s ability to recover clock timing directly from signal transitions.' },
        { q: 'How many bits are supported?', a: '4 to 32 bits with crisp SVG waveforms and PDF export.' }
      ],
      related: ['hamming', 'bandwidth', 'bases']
    },
    fr: {
      metaTitle: 'Simulateur de Codage en Ligne SVG (NRZ, Manchester, AMI, HDB3) — BitsPasoAPaso',
      metaDescription: 'Tracez les chronogrammes SVG pour NRZ-L, NRZI, Manchester, Manchester Différentiel, AMI et HDB3 (ITU-T G.703) étape par étape.',
      h1: 'Simulateur de Codage en Ligne SVG',
      subtitle: 'Chronogrammes vectoriels NRZ-L, NRZI, Manchester, Manchester Différentiel, AMI et HDB3 avec analyse bit à bit.',
      modeLabels: {
        all: 'Comparer tous (6)',
        hdb3: 'HDB3 (ITU-T G.703)',
        ami: 'AMI (Bipolaire)',
        manchester: 'Manchester (802.3)',
        diff_manchester: 'Manchester Diff.',
        nrzl: 'NRZ-L',
        nrzi: 'NRZI'
      },
      inputLabel: 'Trame binaire (4 à 32 bits, ex. 1100001010)',
      inputPlaceholder: 'Ex : 1100001010',
      examples: [
        { label: 'HDB3 (4 zéros) : 1100001010', mode: 'all', q: '1100001010' },
        { label: 'HDB3 double : 10000110000', mode: 'hdb3', q: '10000110000' },
        { label: 'AMI : 10110010', mode: 'ami', q: '10110010' },
        { label: 'Manchester : 01001101', mode: 'manchester', q: '01001101' }
      ],
      guide: [
        'Le codage en ligne traduit des bits en signaux électriques. Manchester garantit une transition par bit pour l’horloge, tandis qu’AMI alterne +V et -V pour annuler la composante continue.',
        'HDB3 remplace chaque bloc 0000 par 000V (nombre impair d’impulsions depuis le dernier V) ou B00V (nombre pair).'
      ],
      refTable: {
        headers: ['Code', 'Composante DC', 'Synchro horloge', 'Bande passante'],
        rows: [
          ['NRZ-L / NRZI', 'Élevée', 'Faible sur longues suites', '1×'],
          ['Manchester / Diff.', 'Nulle (0 DC)', 'Excellente', '2×'],
          ['AMI', 'Nulle (0 DC)', 'Faible sur 0 longs', '1×'],
          ['HDB3', 'Nulle (0 DC)', 'Élevée (max 3 zéros)', '1×']
        ]
      },
      tips: [
        'En Manchester 802.3, 0 descend (+V → -V) et 1 monte (-V → +V).',
        'En HDB3, l’état initial avant la trame est dernier pulse -V et parité paire.',
        'Les violations V rompent volontairement l’alternance AMI.'
      ],
      faqs: [
        { q: 'Pourquoi HDB3 utilise-t-il B00V et 000V ?', a: 'Pour que les violations V alternent en polarité et maintiennent une composante continue nulle.' },
        { q: 'Différence entre Manchester et Différentiel ?', a: 'Le Différentiel code 0/1 par la présence ou l’absence de transition en début de bit.' },
        { q: 'Qu’est-ce que l’auto-synchronisation ?', a: 'La récupération de l’horloge directement depuis les transitions du signal.' },
        { q: 'Combien de bits sont acceptés ?', a: 'De 4 à 32 bits en SVG net et exportable en PDF.' }
      ],
      related: ['hamming', 'bandwidth', 'bases']
    }
  }
};
