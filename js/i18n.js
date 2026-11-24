export const CONTACT_EMAIL = 'contacto@bitspasoapaso.com';

export const LANGUAGES = ['es', 'en', 'fr'];

export const ROUTES = {
  home: {
    es: '/',
    en: '/en',
    fr: '/fr'
  },
  vlsm: {
    es: '/calculadora-subredes-vlsm',
    en: '/en/ipv4-vlsm-subnet-calculator',
    fr: '/fr/calculateur-sous-reseaux-vlsm'
  },
  ieee754: {
    es: '/conversor-ieee-754',
    en: '/en/ieee-754-converter',
    fr: '/fr/convertisseur-ieee-754'
  },
  karnaugh: {
    es: '/mapa-karnaugh',
    en: '/en/karnaugh-map-solver',
    fr: '/fr/tableau-de-karnaugh'
  },
  bases: {
    es: '/conversor-binario-complemento-a-2',
    en: '/en/binary-twos-complement-converter',
    fr: '/fr/convertisseur-binaire-complement-a-2'
  },
  hamming: {
    es: '/codigo-hamming-crc',
    en: '/en/hamming-crc-calculator',
    fr: '/fr/code-hamming-crc'
  },
  cidr: {
    es: '/calculadora-cidr-supernetting',
    en: '/en/cidr-supernetting-calculator',
    fr: '/fr/calculateur-cidr-supernetting'
  },
  ipv6: {
    es: '/calculadora-ipv6',
    en: '/en/ipv6-subnet-calculator',
    fr: '/fr/calculateur-ipv6'
  },
  truthTable: {
    es: '/tablas-de-verdad',
    en: '/en/truth-table-generator',
    fr: '/fr/table-de-verite'
  },
  bandwidth: {
    es: '/calculadora-ancho-de-banda-tcp',
    en: '/en/bandwidth-tcp-throughput-calculator',
    fr: '/fr/calculateur-bande-passante-tcp'
  },
  raidChmod: {
    es: '/calculadora-raid-chmod',
    en: '/en/raid-chmod-calculator',
    fr: '/fr/calculateur-raid-chmod'
  },
  exam: {
    es: '/modo-examen',
    en: '/en/exam-mode',
    fr: '/fr/mode-examen'
  },
  about: {
    es: '/sobre-nosotros',
    en: '/en/about',
    fr: '/fr/a-propos'
  },
  privacy: {
    es: '/privacidad',
    en: '/en/privacy',
    fr: '/fr/confidentialite'
  },
  legal: {
    es: '/aviso-legal',
    en: '/en/legal',
    fr: '/fr/mentions-legales'
  }
};

export const TOOL_KEYS = [
  'vlsm', 'cidr', 'ipv6', 'bandwidth',
  'ieee754', 'karnaugh', 'bases', 'truthTable',
  'hamming', 'raidChmod'
];
export const LEGAL_KEYS = ['about', 'privacy', 'legal'];
export const ALL_ROUTE_KEYS = ['home', 'exam', ...TOOL_KEYS, ...LEGAL_KEYS];

export function getRoutePath(key, lang) {
  return ROUTES[key]?.[lang] || ROUTES.home[lang] || '/';
}

export function getOutputFile(key, lang) {
  const route = getRoutePath(key, lang);
  if (route === '/') return 'index.html';
  return `${route.replace(/^\//, '')}.html`;
}

export const UI = {
  es: {
    langName: 'Español',
    siteName: 'BitsPasoAPaso',
    tagline: 'Calculadoras paso a paso de Redes IP y Sistemas Digitales',
    nav: {
      networking: 'Redes IP',
      digital: 'Sistemas Digitales',
      systems: 'Códigos y Sistemas',
      studyMode: 'Modo Estudio',
      studyModeHint: 'Revela los pasos uno a uno',
      examMode: 'Modo Examen',
      themeToggle: 'Cambiar tema claro/oscuro',
      menuOpen: 'Abrir menú',
      home: 'Inicio'
    },
    tools: {
      vlsm: {
        name: 'Subredes IPv4 y VLSM',
        shortName: 'Subredes VLSM',
        category: 'networking',
        badge: 'Redes IP',
        description: 'Calcula CIDR, máscara, wildcard, broadcast y particionado VLSM paso a paso.'
      },
      ieee754: {
        name: 'Conversor IEEE-754',
        shortName: 'IEEE-754 (32/64)',
        category: 'digital',
        badge: 'Sistemas Digitales',
        description: 'Convierte números decimales a coma flotante de 32 y 64 bits con bits interactivos.'
      },
      karnaugh: {
        name: 'Mapa de Karnaugh',
        shortName: 'Mapa de Karnaugh',
        category: 'digital',
        badge: 'Sistemas Digitales',
        description: 'Simplifica funciones booleanas de 2, 3 y 4 variables en SOP y POS con lazos visuales.'
      },
      bases: {
        name: 'Bases y Complemento a 2',
        shortName: 'Bases y C2',
        category: 'digital',
        badge: 'Sistemas Digitales',
        description: 'Convierte Decimal, Binario, Octal, Hex, Complemento a 1/2, BCD y código Gray.'
      },
      hamming: {
        name: 'Código Hamming y CRC',
        shortName: 'Hamming y CRC',
        category: 'systems',
        badge: 'Códigos y Sistemas',
        description: 'Codifica, detecta y corrige errores de 1 bit con Hamming y divide polinomios CRC.'
      },
      cidr: {
        name: 'CIDR y Supernetting',
        shortName: 'CIDR / Supernetting',
        category: 'networking',
        badge: 'Redes IP',
        description: 'Sumariza rutas IPv4 en binario y descompone rangos IP en bloques CIDR mínimos.'
      },
      ipv6: {
        name: 'Calculadora IPv6',
        shortName: 'Subredes IPv6',
        category: 'networking',
        badge: 'Redes IP',
        description: 'Comprime según RFC 5952, analiza subredes /64 y genera direcciones EUI-64 desde MAC.'
      },
      truthTable: {
        name: 'Tablas de Verdad',
        shortName: 'Tablas de Verdad',
        category: 'digital',
        badge: 'Sistemas Digitales',
        description: 'Evalúa fórmulas lógicas, detecta tautologías, extrae FND/FNC y comprueba equivalencias.'
      },
      bandwidth: {
        name: 'Ancho de Banda y TCP',
        shortName: 'Ancho de Banda / TCP',
        category: 'networking',
        badge: 'Redes IP',
        description: 'Calcula tiempos de transferencia (SI/IEC), BDP, ventana deslizante y cota de Mathis.'
      },
      raidChmod: {
        name: 'RAID y Permisos chmod',
        shortName: 'RAID y chmod',
        category: 'systems',
        badge: 'Códigos y Sistemas',
        description: 'Calcula capacidad útil y tolerancia RAID (0/1/5/6/10) y matriz interactiva chmod/umask.'
      }
    },
    actions: {
      calculate: 'Calcular paso a paso',
      examples: 'Ejemplos de examen',
      history: 'Historial reciente',
      clearHistory: 'Limpiar',
      copyResult: 'Copiar resultado',
      copyLink: 'Copiar enlace',
      savePdf: 'Guardar PDF',
      copied: '¡Copiado!',
      nextStep: 'Ver siguiente paso',
      showAllSteps: 'Mostrar todo',
      stepProgress: 'Paso {current} de {total}',
      studyBanner: 'Modo Estudio activo: el resumen final permanece oculto hasta completar todos los pasos.',
      printSubtitle: 'Informe paso a paso generado en BitsPasoAPaso',
      relatedTools: 'Otras herramientas relacionadas',
      quickGuide: 'Guía rápida y fundamentos',
      refTable: 'Tabla de referencia clave',
      practicalTips: '3 consejos prácticos de examen',
      faqTitle: 'Preguntas frecuentes'
    },
    home: {
      metaTitle: 'BitsPasoAPaso — Calculadoras paso a paso de Redes IP y Sistemas Digitales',
      metaDescription: 'Calculadoras educativas gratuitas con resolución paso a paso: Subredes IPv4 y VLSM, IEEE-754 32/64 bits, Mapas de Karnaugh, Complemento a 2, Hamming y CRC.',
      heroBadge: '100% Client-Side · Sin registros · Instantáneo',
      heroTitle: 'Domina las Redes IP y los Sistemas Digitales paso a paso',
      heroSubtitle: 'Resuelve ejercicios de examen y práctica profesional con explicaciones detalladas bit a bit, gráficos interactivos y Modo Estudio.',
      ctaPrimary: 'Explorar calculadoras',
      ctaSecondary: 'Probar VLSM ahora',
      sectionNetworking: 'Redes IP y Conectividad',
      sectionDigital: 'Sistemas Digitales y Lógica',
      sectionSystems: 'Códigos, Almacenamiento y Sistemas',
      searchPlaceholder: 'Filtrar calculadoras (ej. IPv6, CIDR, RAID, chmod, Karnaugh...)',
      noResults: 'No hay calculadoras que coincidan con tu búsqueda.',
      examBannerBadge: 'Nuevo · Simulacro de Examen',
      examBannerTitle: 'Modo Examen: 10 ejercicios aleatorios con corrección paso a paso',
      examBannerDesc: 'Elige tus temas de Redes IP o Sistemas Digitales, resuelve en papel o en pantalla y desbloquea las 10 soluciones completas a la vez.',
      examBannerCta: 'Iniciar Modo Examen',
      featuresTitle: 'Diseñado para estudiar, verificar y enseñar',
      features: [
        { title: 'Exactitud bit a bit', desc: 'Aritmética exacta con BigInt y DataView sin errores de redondeo en coma flotante.' },
        { title: 'Modo Estudio interactivo', desc: 'Oculta el resultado final y revela cada paso a tu ritmo para ponerte a prueba.' },
        { title: 'Exportable a PDF y URL', desc: 'Comparte cualquier ejercicio con un enlace directo o imprime apuntes limpios.' }
      ],
      faqs: [
        {
          q: '¿Mis cálculos se envían a algún servidor?',
          a: 'No. Todas las calculadoras de BitsPasoAPaso se ejecutan al 100% en tu navegador mediante JavaScript puro, garantizando privacidad total y respuesta instantánea.'
        },
        {
          q: '¿Para qué sirve el Modo Estudio?',
          a: 'El Modo Estudio oculta el resumen final y te permite revelar los pasos intermedios uno a uno, ideal para comprobar si resuelves bien ejercicios de examen antes de ver la solución.'
        },
        {
          q: '¿Puedo compartir un ejercicio ya resuelto con compañeros o alumnos?',
          a: 'Sí. Cada cálculo actualiza los parámetros de la URL; pulsando "Copiar enlace" obtendrás una dirección que abre exactamente el mismo ejercicio.'
        },
        {
          q: '¿Qué precisión tienen los conversores IEEE-754 y Complemento a 2?',
          a: 'Utilizan búferes binarios nativos (ArrayBuffer/DataView) y enteros arbitrarios (BigInt) para representar exactamente los 32 o 64 bits sin aproximaciones.'
        }
      ]
    },
    legalPages: {
      about: {
        title: 'Sobre nosotros',
        metaTitle: 'Sobre nosotros — BitsPasoAPaso',
        metaDescription: 'Conoce el proyecto educativo BitsPasoAPaso: calculadoras gratuitas de Redes IP y Sistemas Digitales paso a paso.',
        paragraphs: [
          'BitsPasoAPaso nace con el objetivo de ayudar a estudiantes de ingeniería informática, telecomunicaciones, ciclos formativos y profesionales de redes a comprender el porqué de cada cálculo binario o de direccionamiento IP.',
          'En lugar de ofrecer únicamente un resultado final opaco, cada herramienta desglosa las operaciones intermedias: máscaras alineadas bit a bit, divisiones sucesivas, mapas de Karnaugh con código Gray, síndromes de Hamming y divisiones XOR módulo 2.',
          `Si detectas cualquier errata o quieres proponer una nueva calculadora educativa, puedes escribirnos a ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: '¿Es gratuito usar BitsPasoAPaso?', a: 'Sí, todas las calculadoras y el Modo Estudio son completamente gratuitos y accesibles sin registro.' },
          { q: '¿Puedo usar las herramientas en clase o en presentaciones?', a: 'Por supuesto. Puedes proyectarlas en clase o exportar los pasos en PDF para material docente.' },
          { q: '¿En qué idiomas está disponible la plataforma?', a: 'Actualmente está disponible íntegramente en Español, Inglés y Francés.' },
          { q: '¿Cómo puedo contactar con el equipo?', a: `Puedes enviarnos sugerencias o reportes de errores al correo ${CONTACT_EMAIL}.` }
        ]
      },
      privacy: {
        title: 'Política de Privacidad',
        metaTitle: 'Política de Privacidad — BitsPasoAPaso',
        metaDescription: 'Política de privacidad de BitsPasoAPaso. Cálculos 100% locales en tu navegador sin almacenamiento de datos personales.',
        paragraphs: [
          'En BitsPasoAPaso respetamos tu privacidad. Todos los cálculos introducidos en las herramientas se procesan localmente en tu navegador y nunca se envían a servidores externos.',
          'El historial reciente de ejercicios, la preferencia de tema claro/oscuro y el estado del Modo Estudio se guardan únicamente en el almacenamiento local (localStorage) de tu propio dispositivo.',
          `Utilizamos analítica agregada y anónima sin cookies invasivas (Vercel Web Analytics) únicamente para medir el rendimiento técnico del sitio. Para cualquier consulta de privacidad, contacta en ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: '¿Guardáis mis direcciones IP o ejercicios en bases de datos?', a: 'No. Ningún dato introducido en los formularios sale de tu navegador.' },
          { q: '¿Cómo borro mi historial de cálculos?', a: 'Pulsa el botón "Limpiar" en la barra de historial reciente de cualquier calculadora o borra los datos del sitio en tu navegador.' },
          { q: '¿Usáis cookies de seguimiento publicitario?', a: 'No utilizamos cookies publicitarias ni perfiles de seguimiento entre sitios.' },
          { q: '¿Cuál es el correo de contacto para privacidad?', a: `Puedes escribirnos en cualquier momento a ${CONTACT_EMAIL}.` }
        ]
      },
      legal: {
        title: 'Aviso Legal',
        metaTitle: 'Aviso Legal — BitsPasoAPaso',
        metaDescription: 'Aviso legal y condiciones de uso de las calculadoras educativas BitsPasoAPaso.',
        paragraphs: [
          'BitsPasoAPaso es una plataforma web de carácter divulgativo y educativo orientada al aprendizaje de Redes IP y Sistemas Digitales.',
          'Aunque todas las operaciones se verifican mediante pruebas automatizadas y aritmética exacta, los resultados se ofrecen con fines formativos y de apoyo. En entornos de producción críticos, verifica siempre las configuraciones de red antes de aplicarlas.',
          `Para comunicaciones legales o notificaciones, utiliza el correo electrónico ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: '¿Puedo enlazar a las calculadoras desde mi web o apuntes?', a: 'Sí, puedes enlazar libremente a cualquiera de las páginas o compartir enlaces con parámetros de ejercicio.' },
          { q: '¿Cuál es la finalidad de los resultados generados?', a: 'Fines educativos, de estudio y verificación rápida de cálculos técnicos.' },
          { q: '¿Se requiere licencia para uso académico?', a: 'No, su uso académico y personal es libre y gratuito.' },
          { q: '¿Dónde dirigir consultas formales?', a: `Todas las consultas formales pueden enviarse a ${CONTACT_EMAIL}.` }
        ]
      }
    },
    footer: {
      about: 'Sobre nosotros',
      privacy: 'Privacidad',
      legal: 'Aviso legal',
      rights: 'Herramientas educativas de código abierto para Redes IP y Sistemas Digitales.'
    },
    notFound: {
      title: '404 — Página no encontrada',
      desc: 'La ruta que buscas no existe o ha cambiado. Vuelve al inicio para elegir una calculadora.',
      backHome: 'Volver al inicio'
    }
  },
  en: {
    langName: 'English',
    siteName: 'BitsPasoAPaso',
    tagline: 'Step-by-step IP Networking and Digital Systems Calculators',
    nav: {
      networking: 'IP Networking',
      digital: 'Digital Systems',
      systems: 'Coding & Systems',
      studyMode: 'Study Mode',
      studyModeHint: 'Reveal steps one by one',
      examMode: 'Exam Mode',
      themeToggle: 'Toggle light/dark theme',
      menuOpen: 'Open menu',
      home: 'Home'
    },
    tools: {
      vlsm: {
        name: 'IPv4 & VLSM Subnet Calculator',
        shortName: 'IPv4 & VLSM',
        category: 'networking',
        badge: 'IP Networking',
        description: 'Compute CIDR, subnet mask, wildcard, broadcast, and VLSM partitioning step by step.'
      },
      ieee754: {
        name: 'IEEE-754 Converter',
        shortName: 'IEEE-754 (32/64)',
        category: 'digital',
        badge: 'Digital Systems',
        description: 'Convert decimals to 32-bit and 64-bit floating point with interactive clickable bits.'
      },
      karnaugh: {
        name: 'Karnaugh Map Solver',
        shortName: 'Karnaugh Map',
        category: 'digital',
        badge: 'Digital Systems',
        description: 'Simplify 2, 3, and 4-variable Boolean functions into SOP and POS with visual loops.'
      },
      bases: {
        name: "Binary & Two's Complement",
        shortName: "Bases & 2's Comp",
        category: 'digital',
        badge: 'Digital Systems',
        description: "Convert Decimal, Binary, Octal, Hex, 1's/2's Complement, BCD, and Gray code."
      },
      hamming: {
        name: 'Hamming Code & CRC',
        shortName: 'Hamming & CRC',
        category: 'systems',
        badge: 'Coding & Systems',
        description: 'Encode, detect, and correct 1-bit Hamming errors and run step-by-step CRC XOR division.'
      },
      cidr: {
        name: 'CIDR & Supernetting',
        shortName: 'CIDR / Supernetting',
        category: 'networking',
        badge: 'IP Networking',
        description: 'Summarize IPv4 routes in binary and decompose IP ranges into minimal CIDR blocks.'
      },
      ipv6: {
        name: 'IPv6 Subnet Calculator',
        shortName: 'IPv6 Subnets',
        category: 'networking',
        badge: 'IP Networking',
        description: 'Compress per RFC 5952, analyze /64 subnets, and derive EUI-64 addresses from MAC.'
      },
      truthTable: {
        name: 'Truth Table Generator',
        shortName: 'Truth Tables',
        category: 'digital',
        badge: 'Digital Systems',
        description: 'Evaluate logic formulas, detect tautologies, extract DNF/CNF, and check equivalences.'
      },
      bandwidth: {
        name: 'Bandwidth & TCP Throughput',
        shortName: 'Bandwidth / TCP',
        category: 'networking',
        badge: 'IP Networking',
        description: 'Compute transfer times (SI/IEC), BDP, sliding window throughput, and Mathis bound.'
      },
      raidChmod: {
        name: 'RAID & chmod Calculator',
        shortName: 'RAID & chmod',
        category: 'systems',
        badge: 'Coding & Systems',
        description: 'Calculate RAID (0/1/5/6/10) usable capacity & fault tolerance and interactive chmod/umask.'
      }
    },
    actions: {
      calculate: 'Calculate step by step',
      examples: 'Exam examples',
      history: 'Recent history',
      clearHistory: 'Clear',
      copyResult: 'Copy result',
      copyLink: 'Copy link',
      savePdf: 'Save PDF',
      copied: 'Copied!',
      nextStep: 'Reveal next step',
      showAllSteps: 'Show all',
      stepProgress: 'Step {current} of {total}',
      studyBanner: 'Study Mode active: the final summary stays hidden until all steps are revealed.',
      printSubtitle: 'Step-by-step report generated by BitsPasoAPaso',
      relatedTools: 'Related calculators',
      quickGuide: 'Quick guide & fundamentals',
      refTable: 'Key reference table',
      practicalTips: '3 practical exam tips',
      faqTitle: 'Frequently asked questions'
    },
    home: {
      metaTitle: 'BitsPasoAPaso — Step-by-step IP Networking & Digital Systems Calculators',
      metaDescription: 'Free educational calculators with step-by-step breakdowns: IPv4 VLSM subnetting, IEEE-754 32/64-bit, Karnaugh maps, Two\'s complement, Hamming code, and CRC.',
      heroBadge: '100% Client-Side · No sign-up · Instant',
      heroTitle: 'Master IP Networking and Digital Systems step by step',
      heroSubtitle: 'Solve exam problems and engineering tasks with bit-by-bit explanations, interactive diagrams, and Study Mode.',
      ctaPrimary: 'Explore calculators',
      ctaSecondary: 'Try VLSM now',
      sectionNetworking: 'IP Networking & Connectivity',
      sectionDigital: 'Digital Systems & Logic',
      sectionSystems: 'Coding, Storage & Systems',
      searchPlaceholder: 'Filter calculators (e.g. IPv6, CIDR, RAID, chmod, Karnaugh...)',
      noResults: 'No calculators match your search.',
      examBannerBadge: 'New · Practice Exam',
      examBannerTitle: 'Exam Mode: 10 randomized problems with step-by-step grading',
      examBannerDesc: 'Pick your IP Networking or Digital Systems topics, solve on paper or screen, and reveal all 10 full solutions at once.',
      examBannerCta: 'Start Exam Mode',
      featuresTitle: 'Built for studying, verifying, and teaching',
      features: [
        { title: 'Bit-level accuracy', desc: 'Exact arithmetic using BigInt and DataView with zero floating-point drift.' },
        { title: 'Interactive Study Mode', desc: 'Hide the final answer and reveal each step at your own pace to test yourself.' },
        { title: 'PDF & URL export', desc: 'Share any exercise with a direct link or print clean study notes.' }
      ],
      faqs: [
        {
          q: 'Is my input data sent to a server?',
          a: 'No. Every calculator in BitsPasoAPaso runs 100% client-side in pure JavaScript, ensuring complete privacy and instant results.'
        },
        {
          q: 'How does Study Mode work?',
          a: 'Study Mode hides the final summary and lets you reveal intermediate steps one by one, making it ideal for self-testing before checking the final answer.'
        },
        {
          q: 'Can I share a solved exercise with classmates or students?',
          a: 'Yes. Every calculation syncs with URL parameters; clicking "Copy link" gives you a direct URL that loads the exact same problem.'
        },
        {
          q: 'How accurate are the IEEE-754 and Two\'s Complement engines?',
          a: 'They rely on native binary buffers (ArrayBuffer/DataView) and arbitrary-precision BigInt math for exact 32-bit and 64-bit representations.'
        }
      ]
    },
    legalPages: {
      about: {
        title: 'About Us',
        metaTitle: 'About Us — BitsPasoAPaso',
        metaDescription: 'Learn about BitsPasoAPaso: free step-by-step calculators for IP Networking and Digital Systems.',
        paragraphs: [
          'BitsPasoAPaso was created to help computer science, networking, and electrical engineering students understand the reasoning behind every binary and IP subnetting calculation.',
          'Instead of showing only a black-box answer, each tool breaks down intermediate operations: bit-aligned masks, successive divisions, Gray-coded Karnaugh maps, Hamming syndromes, and modulo-2 XOR divisions.',
          `If you spot any issue or want to suggest a new educational calculator, reach out to ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: 'Is BitsPasoAPaso free to use?', a: 'Yes, all calculators and Study Mode are completely free with no account required.' },
          { q: 'Can I use these tools in lectures or study groups?', a: 'Yes, you can project them in class or export clean PDFs for study handouts.' },
          { q: 'Which languages are supported?', a: 'The entire platform is available in English, Spanish, and French.' },
          { q: 'How can I contact the team?', a: `You can send feedback or bug reports to ${CONTACT_EMAIL}.` }
        ]
      },
      privacy: {
        title: 'Privacy Policy',
        metaTitle: 'Privacy Policy — BitsPasoAPaso',
        metaDescription: 'BitsPasoAPaso privacy policy. 100% local browser calculations with no personal data collection.',
        paragraphs: [
          'At BitsPasoAPaso we respect your privacy. All inputs entered into our calculators are processed locally in your browser and never transmitted to external servers.',
          'Recent exercise history, light/dark theme preference, and Study Mode state are stored strictly in your device\'s localStorage.',
          `We use privacy-friendly, cookieless aggregated analytics (Vercel Web Analytics) solely to monitor technical performance. For privacy questions, contact ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: 'Do you store my IP addresses or exercises in a database?', a: 'No. No form input ever leaves your browser.' },
          { q: 'How do I clear my calculation history?', a: 'Click "Clear" on the recent history bar of any calculator or clear site data in your browser.' },
          { q: 'Do you use advertising or tracking cookies?', a: 'No, we do not use advertising cookies or cross-site tracking.' },
          { q: 'Where can I send privacy inquiries?', a: `You can contact us anytime at ${CONTACT_EMAIL}.` }
        ]
      },
      legal: {
        title: 'Legal Notice',
        metaTitle: 'Legal Notice — BitsPasoAPaso',
        metaDescription: 'Legal notice and terms of use for BitsPasoAPaso educational calculators.',
        paragraphs: [
          'BitsPasoAPaso is an educational web platform dedicated to learning IP Networking and Digital Systems.',
          'While all engines are verified with automated unit tests and exact arithmetic, outputs are provided for educational and verification purposes. Always double-check production network configurations before deployment.',
          `For legal inquiries or notices, please write to ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: 'Can I link to the calculators from my website or notes?', a: 'Yes, you are free to link to any page or share URLs with exercise parameters.' },
          { q: 'What is the intended purpose of the results?', a: 'Educational study, exam preparation, and quick technical verification.' },
          { q: 'Is a license required for academic use?', a: 'No, academic and personal use is completely free.' },
          { q: 'Where should formal inquiries be sent?', a: `All formal inquiries may be sent to ${CONTACT_EMAIL}.` }
        ]
      }
    },
    footer: {
      about: 'About',
      privacy: 'Privacy',
      legal: 'Legal Notice',
      rights: 'Educational tools for IP Networking and Digital Systems.'
    },
    notFound: {
      title: '404 — Page not found',
      desc: 'The page you are looking for does not exist or has moved. Return home to pick a calculator.',
      backHome: 'Back to home'
    }
  },
  fr: {
    langName: 'Français',
    siteName: 'BitsPasoAPaso',
    tagline: 'Calculateurs étape par étape de Réseaux IP et Systèmes Numériques',
    nav: {
      networking: 'Réseaux IP',
      digital: 'Systèmes Numériques',
      systems: 'Codage & Systèmes',
      studyMode: 'Mode Étude',
      studyModeHint: 'Révéler les étapes une par une',
      examMode: 'Mode Examen',
      themeToggle: 'Changer le thème clair/sombre',
      menuOpen: 'Ouvrir le menu',
      home: 'Accueil'
    },
    tools: {
      vlsm: {
        name: 'Sous-réseaux IPv4 et VLSM',
        shortName: 'Sous-réseaux VLSM',
        category: 'networking',
        badge: 'Réseaux IP',
        description: 'Calculez CIDR, masque, wildcard, broadcast et découpage VLSM étape par étape.'
      },
      ieee754: {
        name: 'Convertisseur IEEE-754',
        shortName: 'IEEE-754 (32/64)',
        category: 'digital',
        badge: 'Systèmes Numériques',
        description: 'Convertissez en virgule flottante 32 et 64 bits avec bits cliquables interactifs.'
      },
      karnaugh: {
        name: 'Tableau de Karnaugh',
        shortName: 'Tableau de Karnaugh',
        category: 'digital',
        badge: 'Systèmes Numériques',
        description: 'Simplifiez des fonctions booléennes à 2, 3 et 4 variables en SOP et POS avec boucles.'
      },
      bases: {
        name: 'Bases et Complément à 2',
        shortName: 'Bases & C2',
        category: 'digital',
        badge: 'Systèmes Numériques',
        description: 'Convertissez Décimal, Binaire, Octal, Hex, Complément à 1/2, BCD et code Gray.'
      },
      hamming: {
        name: 'Code de Hamming et CRC',
        shortName: 'Hamming et CRC',
        category: 'systems',
        badge: 'Codage & Systèmes',
        description: 'Codez, détectez et corrigez 1 bit avec Hamming et effectuez la division XOR CRC.'
      },
      cidr: {
        name: 'CIDR et Supernetting',
        shortName: 'CIDR / Supernetting',
        category: 'networking',
        badge: 'Réseaux IP',
        description: 'Agrégez des routes IPv4 en binaire et décomposez des plages IP en blocs CIDR minimaux.'
      },
      ipv6: {
        name: 'Calculateur IPv6',
        shortName: 'Sous-réseaux IPv6',
        category: 'networking',
        badge: 'Réseaux IP',
        description: 'Compressez selon RFC 5952, analysez les /64 et générez des adresses EUI-64.'
      },
      truthTable: {
        name: 'Tables de Vérité',
        shortName: 'Tables de Vérité',
        category: 'digital',
        badge: 'Systèmes Numériques',
        description: 'Évaluez des formules logiques, détectez les tautologies et vérifiez l’équivalence.'
      },
      bandwidth: {
        name: 'Bande Passante et TCP',
        shortName: 'Bande Passante / TCP',
        category: 'networking',
        badge: 'Réseaux IP',
        description: 'Calculez temps de transfert (SI/IEC), BDP, fenêtre glissante et borne de Mathis.'
      },
      raidChmod: {
        name: 'RAID et Permissions chmod',
        shortName: 'RAID et chmod',
        category: 'systems',
        badge: 'Codage & Systèmes',
        description: 'Calculez capacité utile RAID (0/1/5/6/10) et matrice interactive chmod/umask.'
      }
    },
    actions: {
      calculate: 'Calculer étape par étape',
      examples: "Exemples d'examen",
      history: 'Historique récent',
      clearHistory: 'Effacer',
      copyResult: 'Copier le résultat',
      copyLink: 'Copier le lien',
      savePdf: 'Enregistrer PDF',
      copied: 'Copié !',
      nextStep: "Voir l'étape suivante",
      showAllSteps: 'Tout afficher',
      stepProgress: 'Étape {current} sur {total}',
      studyBanner: 'Mode Étude actif : le résumé final reste masqué jusqu’à la révélation de toutes les étapes.',
      printSubtitle: 'Rapport étape par étape généré par BitsPasoAPaso',
      relatedTools: 'Outils associés',
      quickGuide: 'Guide rapide et principes',
      refTable: 'Tableau de référence clé',
      practicalTips: "3 conseils pratiques d'examen",
      faqTitle: 'Questions fréquentes'
    },
    home: {
      metaTitle: 'BitsPasoAPaso — Calculateurs étape par étape de Réseaux IP et Systèmes Numériques',
      metaDescription: 'Calculateurs éducatifs gratuits avec résolution détaillée : sous-réseaux IPv4 VLSM, IEEE-754 32/64 bits, tableaux de Karnaugh, complément à 2, Hamming et CRC.',
      heroBadge: '100% Client-Side · Sans inscription · Instantané',
      heroTitle: 'Maîtrisez les Réseaux IP et les Systèmes Numériques étape par étape',
      heroSubtitle: 'Résolvez vos exercices d’examen avec des explications bit à bit, des schémas interactifs et le Mode Étude.',
      ctaPrimary: 'Explorer les calculateurs',
      ctaSecondary: 'Essayer VLSM',
      sectionNetworking: 'Réseaux IP et Connectivité',
      sectionDigital: 'Systèmes Numériques et Logique',
      sectionSystems: 'Codage, Stockage et Systèmes',
      searchPlaceholder: 'Filtrer les calculateurs (ex. IPv6, CIDR, RAID, chmod, Karnaugh...)',
      noResults: 'Aucun calculateur ne correspond à votre recherche.',
      examBannerBadge: 'Nouveau · Examen Blanc',
      examBannerTitle: 'Mode Examen : 10 exercices aléatoires avec correction étape par étape',
      examBannerDesc: 'Choisissez vos thèmes, résolvez sur papier ou à l’écran, puis débloquez les 10 solutions détaillées d’un coup.',
      examBannerCta: 'Lancer le Mode Examen',
      featuresTitle: 'Conçu pour étudier, vérifier et enseigner',
      features: [
        { title: 'Précision bit à bit', desc: 'Arithmétique exacte avec BigInt et DataView sans dérive en virgule flottante.' },
        { title: 'Mode Étude interactif', desc: 'Masquez la réponse finale et révélez chaque étape à votre rythme.' },
        { title: 'Export PDF et URL', desc: 'Partagez n’importe quel exercice par lien direct ou imprimez vos fiches.' }
      ],
      faqs: [
        {
          q: 'Mes données sont-elles envoyées à un serveur ?',
          a: 'Non. Tous les calculateurs de BitsPasoAPaso s’exécutent à 100 % dans votre navigateur en JavaScript pur.'
        },
        {
          q: 'À quoi sert le Mode Étude ?',
          a: 'Le Mode Étude masque le résultat final et vous permet de révéler les étapes intermédiaires une par une pour vous auto-évaluer.'
        },
        {
          q: 'Puis-je partager un exercice résolu avec des camarades ?',
          a: 'Oui. Chaque calcul met à jour l’URL ; le bouton « Copier le lien » génère une adresse ouvrant exactement le même exercice.'
        },
        {
          q: 'Quelle est la précision des moteurs IEEE-754 et Complément à 2 ?',
          a: 'Ils utilisent des tampons binaires natifs (ArrayBuffer/DataView) et BigInt pour une exactitude totale sur 32 et 64 bits.'
        }
      ]
    },
    legalPages: {
      about: {
        title: 'À propos',
        metaTitle: 'À propos — BitsPasoAPaso',
        metaDescription: 'Découvrez BitsPasoAPaso : calculateurs gratuits étape par étape pour les Réseaux IP et Systèmes Numériques.',
        paragraphs: [
          'BitsPasoAPaso a été conçu pour aider les étudiants en informatique, réseaux et électronique à comprendre le raisonnement derrière chaque calcul binaire ou d’adressage IP.',
          'Plutôt que d’afficher un résultat brut, chaque outil détaille les étapes intermédiaires : masques alignés bit à bit, divisions successives, tableaux de Karnaugh en code Gray, syndromes de Hamming et divisions XOR.',
          `Pour signaler une erreur ou proposer un nouvel outil pédagogique, écrivez-nous à ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: 'BitsPasoAPaso est-il gratuit ?', a: 'Oui, tous les calculateurs et le Mode Étude sont gratuits et sans inscription.' },
          { q: 'Puis-je utiliser ces outils en cours ?', a: 'Oui, vous pouvez les projeter en classe ou exporter des PDF pour vos supports.' },
          { q: 'Quelles langues sont disponibles ?', a: 'La plateforme est entièrement disponible en français, espagnol et anglais.' },
          { q: 'Comment contacter l’équipe ?', a: `Vous pouvez nous écrire à ${CONTACT_EMAIL}.` }
        ]
      },
      privacy: {
        title: 'Confidentialité',
        metaTitle: 'Politique de confidentialité — BitsPasoAPaso',
        metaDescription: 'Politique de confidentialité de BitsPasoAPaso. Calculs 100% locaux sans collecte de données personnelles.',
        paragraphs: [
          'Chez BitsPasoAPaso, nous respectons votre vie privée. Tous les calculs saisis sont traités localement dans votre navigateur et ne sont jamais envoyés à des serveurs externes.',
          'L’historique récent, le thème clair/sombre et l’état du Mode Étude sont conservés uniquement dans le localStorage de votre appareil.',
          `Nous utilisons une mesure d’audience anonyme sans cookies publicitaires (Vercel Web Analytics) pour suivre les performances techniques. Contact : ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: 'Enregistrez-vous mes adresses IP ou exercices ?', a: 'Non. Aucune donnée saisie ne quitte votre navigateur.' },
          { q: 'Comment effacer mon historique de calculs ?', a: 'Cliquez sur « Effacer » dans la barre d’historique récent ou videz les données du site.' },
          { q: 'Utilisez-vous des cookies publicitaires ?', a: 'Non, aucun cookie publicitaire ni traceur inter-sites n’est utilisé.' },
          { q: 'Quel est le contact pour la confidentialité ?', a: `Écrivez-nous à ${CONTACT_EMAIL}.` }
        ]
      },
      legal: {
        title: 'Mentions légales',
        metaTitle: 'Mentions légales — BitsPasoAPaso',
        metaDescription: 'Mentions légales et conditions d’utilisation des calculateurs éducatifs BitsPasoAPaso.',
        paragraphs: [
          'BitsPasoAPaso est une plateforme web éducative dédiée à l’apprentissage des Réseaux IP et des Systèmes Numériques.',
          'Bien que tous les moteurs soient validés par des tests automatisés et une arithmétique exacte, les résultats sont fournis à titre pédagogique. Vérifiez toujours vos configurations réseau avant mise en production.',
          `Pour toute communication légale, veuillez écrire à ${CONTACT_EMAIL}.`
        ],
        faqs: [
          { q: 'Puis-je créer des liens vers les calculateurs ?', a: 'Oui, vous pouvez librement partager les liens ou les URL paramétrées.' },
          { q: 'Quel est l’usage prévu des résultats ?', a: 'Étude, préparation aux examens et vérification technique rapide.' },
          { q: 'Faut-il une licence pour un usage académique ?', a: 'Non, l’usage académique et personnel est libre et gratuit.' },
          { q: 'Où adresser les demandes officielles ?', a: `Toutes les demandes peuvent être envoyées à ${CONTACT_EMAIL}.` }
        ]
      }
    },
    footer: {
      about: 'À propos',
      privacy: 'Confidentialité',
      legal: 'Mentions légales',
      rights: 'Outils éducatifs pour les Réseaux IP et les Systèmes Numériques.'
    },
    notFound: {
      title: '404 — Page introuvable',
      desc: 'La page demandée n’existe pas ou a été déplacée. Retournez à l’accueil pour choisir un calculateur.',
      backHome: "Retour à l'accueil"
    }
  }
};
