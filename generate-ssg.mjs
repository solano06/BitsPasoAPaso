import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import {
  LANGUAGES,
  ALL_ROUTE_KEYS,
  TOOL_KEYS,
  LEGAL_KEYS,
  UI,
  getRoutePath,
  getOutputFile
} from './js/i18n.js';
import { TOOL_CONTENT } from './js/seo-content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.SITE_URL || 'https://bitspasoapaso.vercel.app').replace(/\/+$/, '');
const BUILD_VERSION = Date.now().toString(36);

// --- Pure Node 1200x630 PNG generator (zlib + CRC32) ---
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generateOgCoverPng(outPath) {
  const width = 1200;
  const height = 630;
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * stride;
    raw[rowStart] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const idx = rowStart + 1 + x * 4;
      // Dark slate gradient background (#0b1120 -> #0f172a)
      let r = 11 + Math.floor((x / width) * 8);
      let g = 17 + Math.floor((y / height) * 10);
      let b = 32 + Math.floor(((x + y) / (width + height)) * 18);

      // Subtle cyan/emerald radial glows
      const dx1 = (x - 240) / 360;
      const dy1 = (y - 180) / 260;
      const glow1 = Math.max(0, 1 - Math.sqrt(dx1 * dx1 + dy1 * dy1));
      r += Math.floor(glow1 * 6);
      g += Math.floor(glow1 * 55);
      b += Math.floor(glow1 * 72);

      const dx2 = (x - 960) / 380;
      const dy2 = (y - 450) / 280;
      const glow2 = Math.max(0, 1 - Math.sqrt(dx2 * dx2 + dy2 * dy2));
      r += Math.floor(glow2 * 8);
      g += Math.floor(glow2 * 64);
      b += Math.floor(glow2 * 48);

      // Crisp 40px tech grid lines
      if (x % 60 === 0 || y % 60 === 0) {
        r = Math.min(255, r + 10);
        g = Math.min(255, g + 16);
        b = Math.min(255, b + 24);
      }

      // Accent border frame
      if (x >= 44 && x <= width - 44 && y >= 44 && y <= height - 44) {
        if (x <= 47 || x >= width - 47 || y <= 47 || y >= height - 47) {
          r = 34;
          g = 211;
          b = 238;
        }
      }

      // Decorative binary blocks in center-left
      const inCard = x >= 110 && x <= 1090 && y >= 150 && y <= 480;
      if (inCard && (x === 110 || x === 1090 || y === 150 || y === 480)) {
        r = 51;
        g = 65;
        b = 85;
      }

      // Stylized bit-bar motif
      if (y >= 240 && y <= 292 && x >= 180 && x <= 1020) {
        const seg = Math.floor((x - 180) / 52);
        const localX = (x - 180) % 52;
        if (localX < 40) {
          if (seg < 1) {
            r = 244; g = 63; b = 94; // Sign rose
          } else if (seg < 6) {
            r = 56; g = 189; b = 248; // Exponent cyan
          } else {
            r = 52; g = 211; b = 153; // Mantissa emerald
          }
        }
      }

      // Second accent bar
      if (y >= 330 && y <= 354 && x >= 180 && x <= 740) {
        r = 34; g = 211; b = 238;
      }
      if (y >= 376 && y <= 394 && x >= 180 && x <= 560) {
        r = 148; g = 163; b = 184;
      }

      raw[idx] = Math.min(255, r);
      raw[idx + 1] = Math.min(255, g);
      raw[idx + 2] = Math.min(255, b);
      raw[idx + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const png = Buffer.concat([
    sig,
    makePngChunk('IHDR', ihdr),
    makePngChunk('IDAT', compressed),
    makePngChunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(outPath, png);
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHead({ title, description, routeKey, lang, faqs, breadcrumbName }) {
  const canonicalUrl = `${SITE_URL}${getRoutePath(routeKey, lang)}`;
  const hreflangs = LANGUAGES.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${getRoutePath(routeKey, l)}" />`
  ).join('\n  ');
  const xDefault = `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${getRoutePath(routeKey, 'es')}" />`;

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: UI[lang].nav.home,
      item: `${SITE_URL}${getRoutePath('home', lang)}`
    }
  ];
  if (routeKey !== 'home') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: breadcrumbName,
      item: canonicalUrl
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: title,
        url: canonicalUrl,
        description,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        inLanguage: lang,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      },
      {
        '@type': 'FAQPage',
        mainEntity: (faqs || []).map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  };

  return `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  ${hreflangs}
  ${xDefault}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${SITE_URL}/og-cover.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${SITE_URL}/og-cover.png" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="manifest" href="/site.webmanifest" />
  <script>
    (function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();
  </script>
  <link rel="stylesheet" href="/css/tailwind.min.css?v=${BUILD_VERSION}" />
  <script defer src="/_vercel/insights/script.js"></script>
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>`;
}

function buildHeader(routeKey, lang) {
  const ui = UI[lang];
  const netTools = TOOL_KEYS.filter((k) => ui.tools[k].category === 'networking');
  const digTools = TOOL_KEYS.filter((k) => ui.tools[k].category === 'digital');

  const renderDropdown = (label, keys) => `
    <div class="relative" data-dropdown>
      <button type="button" data-dropdown-btn class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
        <span>${esc(label)}</span>
        <svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
      </button>
      <div data-dropdown-panel class="hidden absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50">
        ${keys
          .map(
            (k) => `<a href="${getRoutePath(k, lang)}" class="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">${esc(ui.tools[k].shortName)}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">${esc(ui.tools[k].description)}</div>
            </a>`
          )
          .join('')}
      </div>
    </div>
  `;

  const langLinks = LANGUAGES.map((l) => {
    const active = l === lang;
    const cls = active
      ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    return `<a href="${getRoutePath(routeKey, l)}" hreflang="${l}" class="px-2 py-1 rounded text-xs uppercase transition ${cls}">${l}</a>`;
  }).join('');

  return `<header class="sticky top-0 z-40 backdrop-blur bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800">
  <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
    <div class="flex items-center gap-4">
      <a href="${getRoutePath('home', lang)}" class="flex items-center gap-2 font-extrabold text-lg tracking-tight text-slate-900 dark:text-white shrink-0">
        <img src="/favicon.svg" alt="BitsPasoAPaso" class="w-7 h-7" width="28" height="28" />
        <span>Bits<span class="text-cyan-600 dark:text-cyan-400">PasoAPaso</span></span>
      </a>
      <nav class="hidden lg:flex items-center gap-1">
        ${renderDropdown(ui.nav.networking, netTools)}
        ${renderDropdown(ui.nav.digital, digTools)}
      </nav>
    </div>

    <div class="flex items-center gap-1.5 sm:gap-2">
      <nav aria-label="Language" class="flex items-center gap-0.5 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        ${langLinks}
      </nav>

      <button id="study-mode-toggle" type="button" aria-pressed="false" title="${esc(ui.nav.studyModeHint)}" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        <span class="hidden md:inline">${esc(ui.nav.studyMode)}</span>
      </button>

      <button id="theme-toggle" type="button" aria-label="${esc(ui.nav.themeToggle)}" class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
        <svg class="w-4 h-4 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        <svg class="w-4 h-4 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
      </button>

      <button id="mobile-menu-btn" type="button" aria-label="${esc(ui.nav.menuOpen)}" class="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>

  <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-3">
    <div>
      <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">${esc(ui.nav.networking)}</div>
      <div class="grid grid-cols-1 gap-1">
        ${netTools.map((k) => `<a href="${getRoutePath(k, lang)}" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">${esc(ui.tools[k].name)}</a>`).join('')}
      </div>
    </div>
    <div>
      <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">${esc(ui.nav.digital)}</div>
      <div class="grid grid-cols-1 gap-1">
        ${digTools.map((k) => `<a href="${getRoutePath(k, lang)}" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">${esc(ui.tools[k].name)}</a>`).join('')}
      </div>
    </div>
  </div>
</header>`;
}

function buildFooter(lang) {
  const ui = UI[lang];
  return `<footer class="mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
  <div class="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-400">
    <div>
      <span class="font-bold text-slate-900 dark:text-slate-200">BitsPasoAPaso</span> · ${esc(ui.footer.rights)}
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <a href="${getRoutePath('about', lang)}" class="hover:text-cyan-600 dark:hover:text-cyan-400">${esc(ui.footer.about)}</a>
      <a href="${getRoutePath('privacy', lang)}" class="hover:text-cyan-600 dark:hover:text-cyan-400">${esc(ui.footer.privacy)}</a>
      <a href="${getRoutePath('legal', lang)}" class="hover:text-cyan-600 dark:hover:text-cyan-400">${esc(ui.footer.legal)}</a>
    </div>
  </div>
</footer>`;
}

function buildFaqSection(faqs, title) {
  return `<section class="mt-10">
    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">${esc(title)}</h2>
    <div class="space-y-2.5">
      ${faqs
        .map(
          (f) => `<details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              <span>${esc(f.q)}</span>
              <span class="ml-2 text-cyan-600 dark:text-cyan-400 transition group-open:rotate-45 text-lg leading-none">+</span>
            </summary>
            <p class="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${esc(f.a)}</p>
          </details>`
        )
        .join('')}
    </div>
  </section>`;
}

function buildHomeHtml(lang) {
  const ui = UI[lang];
  const h = ui.home;
  const netTools = TOOL_KEYS.filter((k) => ui.tools[k].category === 'networking');
  const digTools = TOOL_KEYS.filter((k) => ui.tools[k].category === 'digital');

  const renderCard = (k) => {
    const t = ui.tools[k];
    return `<a href="${getRoutePath(k, lang)}" class="group block p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500/60 dark:hover:border-cyan-500/60 shadow-sm hover:shadow-md transition">
      <div class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-3">${esc(t.badge)}</div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">${esc(t.name)}</h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${esc(t.description)}</p>
    </a>`;
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
${buildHead({ title: h.metaTitle, description: h.metaDescription, routeKey: 'home', lang, faqs: h.faqs, breadcrumbName: ui.nav.home })}
<body data-lang="${lang}" class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
  ${buildHeader('home', lang)}
  <main class="max-w-6xl mx-auto px-4 py-10 sm:py-14">
    <section class="text-center max-w-3xl mx-auto">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-4">${esc(h.heroBadge)}</span>
      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">${esc(h.heroTitle)}</h1>
      <p class="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">${esc(h.heroSubtitle)}</p>
      <div class="mt-7 flex flex-wrap justify-center gap-3">
        <a href="#tools-grid" class="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-sm">${esc(h.ctaPrimary)}</a>
        <a href="${getRoutePath('vlsm', lang)}" class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-cyan-500 text-slate-800 dark:text-slate-200 font-semibold text-sm">${esc(h.ctaSecondary)}</a>
      </div>
    </section>

    <section id="tools-grid" class="mt-14 space-y-10">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">${esc(h.sectionNetworking)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${netTools.map(renderCard).join('')}</div>
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">${esc(h.sectionDigital)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${digTools.map(renderCard).join('')}</div>
      </div>
    </section>

    <section class="mt-14 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-5">${esc(h.featuresTitle)}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${h.features
          .map(
            (f) => `<div>
              <h3 class="font-bold text-slate-900 dark:text-white">${esc(f.title)}</h3>
              <p class="mt-1.5 text-sm text-slate-600 dark:text-slate-400">${esc(f.desc)}</p>
            </div>`
          )
          .join('')}
      </div>
    </section>

    ${buildFaqSection(h.faqs, ui.actions.faqTitle)}
  </main>
  ${buildFooter(lang)}
  <script type="module" src="/js/app.js?v=${BUILD_VERSION}"></script>
</body>
</html>`;
}

function buildToolHtml(toolKey, lang) {
  const ui = UI[lang];
  const c = TOOL_CONTENT[toolKey][lang];
  const modes = Object.entries(c.modeLabels || {});
  const inputLabel = c.inputLabel || c.inputLabelSingle || '';
  const inputPlaceholder = c.inputPlaceholder || c.inputPlaceholderSingle || '';

  return `<!DOCTYPE html>
<html lang="${lang}">
${buildHead({ title: c.metaTitle, description: c.metaDescription, routeKey: toolKey, lang, faqs: c.faqs, breadcrumbName: ui.tools[toolKey].shortName })}
<body data-tool="${toolKey}" data-lang="${lang}" class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
  ${buildHeader(toolKey, lang)}
  <main class="max-w-5xl mx-auto px-4 py-8 sm:py-10">
    <div class="print-only-header hidden">
      <div class="text-xl font-bold">${esc(c.h1)}</div>
      <div class="text-xs text-slate-500">${esc(ui.actions.printSubtitle)}</div>
    </div>

    <div class="mb-6">
      <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-2">${esc(ui.tools[toolKey].badge)}</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">${esc(c.h1)}</h1>
      <p class="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">${esc(c.subtitle)}</p>
    </div>

    <section id="tool-form-card" class="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div class="flex flex-wrap gap-2">
          ${modes
            .map(
              ([mKey, mLabel], idx) =>
                `<button type="button" data-mode-btn="${esc(mKey)}" class="px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition ${
                  idx === 0
                    ? 'bg-cyan-600 text-white border-cyan-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }">${esc(mLabel)}</button>`
            )
            .join('')}
        </div>
        ${
          toolKey === 'karnaugh' && c.submodeLabels
            ? `<div class="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <button type="button" data-kmap-submode="table" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-600 text-white">${esc(c.submodeLabels.table)}</button>
                <button type="button" data-kmap-submode="expr" class="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300">${esc(c.submodeLabels.expr)}</button>
              </div>`
            : ''
        }
      </div>

      <form id="calc-form" class="space-y-3">
        <label for="calc-input" class="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">${esc(inputLabel)}</label>
        <div class="flex flex-col sm:flex-row gap-2.5">
          <input id="calc-input" type="text" autocomplete="off" spellcheck="false" placeholder="${esc(inputPlaceholder)}" class="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shrink-0 shadow-sm">${esc(ui.actions.calculate)}</button>
        </div>
        ${
          toolKey === 'karnaugh'
            ? `<div id="kmap-keypad" class="hidden flex-wrap items-center gap-1.5 pt-1">
                ${['A', 'B', 'C', 'D', "'", '·', '+', '(', ')', '⊕'].map((sym) => `<button type="button" data-kmap-sym="${esc(sym)}" class="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-cyan-500 font-mono text-xs font-bold">${esc(sym)}</button>`).join('')}
                <button type="button" data-kmap-sym="BACK" class="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-rose-500 font-mono text-xs font-semibold">⌫</button>
                <button type="button" data-kmap-sym="CLEAR" class="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-rose-500 text-xs font-semibold">CLR</button>
              </div>`
            : ''
        }
      </form>

      <div id="examples-bar" class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">${esc(ui.actions.examples)}:</div>
        <div class="flex flex-wrap gap-2">
          ${c.examples
            .map(
              (ex, i) =>
                `<button type="button" data-example-idx="${i}" class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/15 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">${esc(ex.label)}</button>`
            )
            .join('')}
        </div>
      </div>

      <div id="history-bar" class="hidden mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${esc(ui.actions.history)}:</span>
          <button id="clear-history-btn" type="button" class="text-xs text-rose-600 dark:text-rose-400 hover:underline">${esc(ui.actions.clearHistory)}</button>
        </div>
        <div id="history-list" class="flex flex-wrap gap-1.5"></div>
      </div>
    </section>

    <div id="calc-error" class="hidden mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm font-medium"></div>

    <section id="calc-results" class="hidden mt-6 space-y-5">
      <div class="flex flex-wrap items-center justify-end gap-2 no-print">
        <button id="copy-result-btn" type="button" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold hover:border-cyan-500">${esc(ui.actions.copyResult)}</button>
        <button id="copy-link-btn" type="button" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold hover:border-cyan-500">${esc(ui.actions.copyLink)}</button>
        <button id="save-pdf-btn" type="button" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold hover:border-cyan-500">${esc(ui.actions.savePdf)}</button>
      </div>

      <div id="study-banner" class="hidden p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-800 dark:text-cyan-200 text-xs sm:text-sm font-medium">${esc(ui.actions.studyBanner)}</div>

      <div id="result-summary" class="result-summary-card p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"></div>
      <div id="result-visual" class="hidden"></div>
      <div id="result-steps" class="space-y-3"></div>

      <div id="study-controls" class="hidden p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span id="study-progress" class="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300"></span>
        <div class="flex items-center gap-2">
          <button id="study-next-btn" type="button" class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm font-semibold">${esc(ui.actions.nextStep)}</button>
          <button id="study-all-btn" type="button" class="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold">${esc(ui.actions.showAllSteps)}</button>
        </div>
      </div>
    </section>

    <section id="seo-content-section" class="mt-12 space-y-10">
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">${esc(ui.actions.quickGuide)}</h2>
        ${c.guide.map((p) => `<p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">${esc(p)}</p>`).join('')}
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">${esc(ui.actions.refTable)}</h2>
        <div class="min-w-0 max-w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table class="w-full text-left text-xs sm:text-sm whitespace-nowrap">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <tr>${c.refTable.headers.map((h) => `<th class="px-4 py-2.5">${esc(h)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${c.refTable.rows.map((row) => `<tr class="border-t border-slate-200 dark:border-slate-800">${row.map((cell) => `<td class="px-4 py-2.5 font-mono">${esc(cell)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">${esc(ui.actions.practicalTips)}</h2>
        <ul class="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          ${c.tips.map((tip) => `<li>${esc(tip)}</li>`).join('')}
        </ul>
      </div>

      ${buildFaqSection(c.faqs, ui.actions.faqTitle)}

      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">${esc(ui.actions.relatedTools)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${c.related
            .map(
              (rk) => `<a href="${getRoutePath(rk, lang)}" class="block p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500 transition">
                <div class="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">${esc(ui.tools[rk].badge)}</div>
                <div class="font-bold text-slate-900 dark:text-white">${esc(ui.tools[rk].name)}</div>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${esc(ui.tools[rk].description)}</p>
              </a>`
            )
            .join('')}
        </div>
      </div>
    </section>
  </main>
  ${buildFooter(lang)}
  <script type="module" src="/js/app.js?v=${BUILD_VERSION}"></script>
</body>
</html>`;
}

function buildLegalHtml(legalKey, lang) {
  const ui = UI[lang];
  const page = ui.legalPages[legalKey];
  return `<!DOCTYPE html>
<html lang="${lang}">
${buildHead({ title: page.metaTitle, description: page.metaDescription, routeKey: legalKey, lang, faqs: page.faqs, breadcrumbName: page.title })}
<body data-lang="${lang}" class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
  ${buildHeader(legalKey, lang)}
  <main class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">${esc(page.title)}</h1>
    <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
      ${page.paragraphs.map((p) => `<p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">${esc(p)}</p>`).join('')}
    </div>
    ${buildFaqSection(page.faqs, ui.actions.faqTitle)}
  </main>
  ${buildFooter(lang)}
  <script type="module" src="/js/app.js?v=${BUILD_VERSION}"></script>
</body>
</html>`;
}

function build404Html() {
  const ui = UI.es;
  return `<!DOCTYPE html>
<html lang="es">
${buildHead({ title: ui.notFound.title, description: ui.notFound.desc, routeKey: 'home', lang: 'es', faqs: ui.home.faqs, breadcrumbName: '404' })}
<body data-lang="es" class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased flex flex-col">
  ${buildHeader('home', 'es')}
  <main class="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
    <div class="font-mono text-6xl font-extrabold text-cyan-600 dark:text-cyan-400">404</div>
    <h1 class="mt-4 text-2xl font-bold text-slate-900 dark:text-white">${esc(ui.notFound.title)}</h1>
    <p class="mt-2 text-slate-600 dark:text-slate-400">${esc(ui.notFound.desc)}</p>
    <a href="/" class="inline-block mt-6 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm">${esc(ui.notFound.backHome)}</a>
  </main>
  ${buildFooter('es')}
  <script type="module" src="/js/app.js?v=${BUILD_VERSION}"></script>
</body>
</html>`;
}

function buildSitemapXml() {
  const urls = [];
  for (const key of ALL_ROUTE_KEYS) {
    const alternates = LANGUAGES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${getRoutePath(key, l)}" />`
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${getRoutePath(key, 'es')}" />`;

    for (const lang of LANGUAGES) {
      const loc = `${SITE_URL}${getRoutePath(key, lang)}`;
      const prio = key === 'home' ? '1.0' : TOOL_KEYS.includes(key) ? '0.9' : '0.4';
      urls.push(`  <url>
    <loc>${loc}</loc>
${alternates}
${xDefault}
    <priority>${prio}</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function writeOut(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function main() {
  generateOgCoverPng(path.join(__dirname, 'og-cover.png'));

  let count = 0;
  for (const lang of LANGUAGES) {
    writeOut(getOutputFile('home', lang), buildHomeHtml(lang));
    count++;

    for (const toolKey of TOOL_KEYS) {
      writeOut(getOutputFile(toolKey, lang), buildToolHtml(toolKey, lang));
      count++;
    }

    for (const legalKey of LEGAL_KEYS) {
      writeOut(getOutputFile(legalKey, lang), buildLegalHtml(legalKey, lang));
      count++;
    }
  }

  writeOut('404.html', build404Html());
  writeOut('sitemap.xml', buildSitemapXml());
  writeOut('robots.txt', buildRobotsTxt());

  console.log(`Generated ${count} localized HTML pages + 404.html, sitemap.xml, robots.txt, and og-cover.png (v=${BUILD_VERSION}).`);
}

main();
