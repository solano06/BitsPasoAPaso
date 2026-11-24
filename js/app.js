import { UI } from './i18n.js';
import { TOOL_CONTENT } from './seo-content.js';
import { solveVlsm } from './engines/vlsm.js';
import { solveIeee754 } from './engines/ieee754.js';
import { solveKarnaugh } from './engines/karnaugh.js';
import { solveBases } from './engines/bases.js';
import { solveHamming } from './engines/hamming.js';
import { solveCidr } from './engines/cidr.js';
import { solveIpv6 } from './engines/ipv6.js';
import { solveTruthTable } from './engines/truth-table.js';
import { solveBandwidth } from './engines/bandwidth.js';
import { solveRaidChmod } from './engines/raid-chmod.js';
import { initExamPage } from './exam-ui.js';
import { initCheatSheet } from './cheatsheets-ui.js';

const ENGINES = {
  vlsm: solveVlsm,
  ieee754: solveIeee754,
  karnaugh: solveKarnaugh,
  bases: solveBases,
  hamming: solveHamming,
  cidr: solveCidr,
  ipv6: solveIpv6,
  truthTable: solveTruthTable,
  bandwidth: solveBandwidth,
  raidChmod: solveRaidChmod
};

const STORAGE_STUDY = 'bits_study_mode';
const STORAGE_HISTORY_PREFIX = 'bits_history_';

function isStudyMode() {
  return localStorage.getItem(STORAGE_STUDY) === '1';
}

function setStudyMode(enabled) {
  localStorage.setItem(STORAGE_STUDY, enabled ? '1' : '0');
}

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}

function initDropdowns() {
  const groups = document.querySelectorAll('[data-dropdown]');
  groups.forEach((group) => {
    const trigger = group.querySelector('[data-dropdown-btn]');
    const panel = group.querySelector('[data-dropdown-panel]');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      groups.forEach((other) => {
        if (other !== group) {
          other.querySelector('[data-dropdown-panel]')?.classList.add('hidden');
        }
      });
      panel.classList.toggle('hidden');
    });
  });
  document.addEventListener('click', () => {
    groups.forEach((g) => g.querySelector('[data-dropdown-panel]')?.classList.add('hidden'));
  });
}

function loadHistory(tool) {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_PREFIX + tool);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(tool, q, mode) {
  try {
    let items = loadHistory(tool).filter((item) => !(item.q === q && item.mode === mode));
    items.unshift({ q, mode });
    items = items.slice(0, 6);
    localStorage.setItem(STORAGE_HISTORY_PREFIX + tool, JSON.stringify(items));
  } catch {
    // ignore storage quota errors
  }
}

function initCalculator(tool, lang) {
  const engine = ENGINES[tool];
  if (!engine) return;

  const ui = UI[lang] || UI.es;
  const content = TOOL_CONTENT[tool]?.[lang] || TOOL_CONTENT[tool]?.es;

  const form = document.getElementById('calc-form');
  const inputEl = document.getElementById('calc-input');
  const modeBtns = document.querySelectorAll('[data-mode-btn]');
  const exampleBtns = document.querySelectorAll('[data-example-idx]');
  const errorBox = document.getElementById('calc-error');
  const resultWrap = document.getElementById('calc-results');
  const summaryEl = document.getElementById('result-summary');
  const visualEl = document.getElementById('result-visual');
  const stepsEl = document.getElementById('result-steps');
  const studyBanner = document.getElementById('study-banner');
  const studyControls = document.getElementById('study-controls');
  const studyProgress = document.getElementById('study-progress');
  const nextStepBtn = document.getElementById('study-next-btn');
  const showAllBtn = document.getElementById('study-all-btn');
  const copyResultBtn = document.getElementById('copy-result-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const pdfBtn = document.getElementById('save-pdf-btn');
  const historyBar = document.getElementById('history-bar');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  let currentMode = modeBtns[0]?.getAttribute('data-mode-btn') || '';
  let kmapSubmode = 'table';
  const kmapSubmodeBtns = document.querySelectorAll('[data-kmap-submode]');
  const kmapKeypad = document.getElementById('kmap-keypad');
  let lastCopyText = '';
  let revealedCount = 1;
  let totalSteps = 0;

  function setKmapSubmode(sub) {
    kmapSubmode = sub === 'expr' ? 'expr' : 'table';
    kmapSubmodeBtns.forEach((b) => {
      const active = b.getAttribute('data-kmap-submode') === kmapSubmode;
      b.classList.toggle('bg-cyan-600', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('text-slate-600', !active);
      b.classList.toggle('dark:text-slate-300', !active);
    });
    if (kmapKeypad) {
      kmapKeypad.classList.toggle('hidden', kmapSubmode !== 'expr');
      kmapKeypad.classList.toggle('flex', kmapSubmode === 'expr');
    }
  }

  function setActiveMode(mode) {
    if (tool === 'karnaugh' && mode.includes(':')) {
      const [vPart, sPart] = mode.split(':');
      currentMode = vPart;
      setKmapSubmode(sPart);
    } else {
      currentMode = mode;
    }
    modeBtns.forEach((b) => {
      const active = b.getAttribute('data-mode-btn') === currentMode;
      b.classList.toggle('bg-cyan-600', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('border-cyan-600', active);
      b.classList.toggle('bg-white', !active);
      b.classList.toggle('dark:bg-slate-800', !active);
      b.classList.toggle('text-slate-700', !active);
      b.classList.toggle('dark:text-slate-300', !active);
    });
  }

  function renderHistory() {
    if (!historyBar || !historyList) return;
    const items = loadHistory(tool);
    if (items.length === 0) {
      historyBar.classList.add('hidden');
      return;
    }
    historyBar.classList.remove('hidden');
    historyList.innerHTML = '';
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/15 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 truncate max-w-[220px]';
      btn.textContent = item.q;
      btn.title = `${item.q} (${item.mode})`;
      btn.addEventListener('click', () => {
        setActiveMode(item.mode);
        inputEl.value = item.q;
        runCalculation(false);
      });
      historyList.appendChild(btn);
    });
  }

  function applyStudyVisibility() {
    const study = isStudyMode();
    const stepCards = stepsEl.querySelectorAll('.step-card');
    totalSteps = stepCards.length;

    if (!study || totalSteps === 0) {
      summaryEl.classList.remove('hidden');
      studyBanner?.classList.add('hidden');
      studyControls?.classList.add('hidden');
      stepCards.forEach((card) => card.classList.remove('step-hidden-in-study', 'hidden'));
      return;
    }

    const done = revealedCount >= totalSteps;
    if (done) {
      summaryEl.classList.remove('hidden');
      studyBanner?.classList.add('hidden');
      studyControls?.classList.add('hidden');
    } else {
      summaryEl.classList.add('hidden');
      studyBanner?.classList.remove('hidden');
      studyControls?.classList.remove('hidden');
    }

    stepCards.forEach((card, idx) => {
      const show = idx < revealedCount;
      card.classList.toggle('hidden', !show);
      card.classList.toggle('step-hidden-in-study', !show);
    });

    if (studyProgress) {
      studyProgress.textContent = ui.actions.stepProgress
        .replace('{current}', Math.min(revealedCount, totalSteps))
        .replace('{total}', totalSteps);
    }
  }

  function bindInteractiveVisuals() {
    // IEEE-754 clickable bits
    visualEl.querySelectorAll('[data-ieee-bit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-ieee-bit'));
        const bits = btn.getAttribute('data-ieee-bits');
        const bin = btn.getAttribute('data-ieee-bin');
        const arr = bin.split('');
        arr[idx] = arr[idx] === '0' ? '1' : '0';
        const flippedBig = BigInt('0b' + arr.join(''));
        const hex = '0x' + flippedBig.toString(16).toUpperCase().padStart(Number(bits) / 4, '0');
        setActiveMode(bits === '64' ? 'hex2dec64' : 'hex2dec32');
        inputEl.value = hex;
        runCalculation(false);
      });
    });

    // Karnaugh clickable cells (both Truth Table and Gray Map)
    visualEl.querySelectorAll('[data-kmap-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-kmap-idx'));
        const grid = btn.getAttribute('data-kmap-grid').split('');
        const cycle = { '0': '1', '1': 'X', X: '0' };
        grid[idx] = cycle[grid[idx]] || '1';
        setKmapSubmode('table');
        inputEl.value = 'grid:' + grid.join('');
        runCalculation(false);
      });
    });

    // Karnaugh quick action buttons (all0, all1, clearX, invert)
    visualEl.querySelectorAll('[data-kmap-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-kmap-action');
        const grid = btn.getAttribute('data-kmap-grid').split('');
        let next = grid;
        if (action === 'all0') next = grid.map(() => '0');
        else if (action === 'all1') next = grid.map(() => '1');
        else if (action === 'clearX') next = grid.map((v) => (v === 'X' ? '0' : v));
        else if (action === 'invert') next = grid.map((v) => (v === '1' ? '0' : v === '0' ? '1' : 'X'));
        setKmapSubmode('table');
        inputEl.value = 'grid:' + next.join('');
        runCalculation(false);
      });
    });

    // Karnaugh term <-> SVG loop highlight
    const setLoopHighlight = (targetIdx) => {
      visualEl.querySelectorAll('[data-loop-idx]').forEach((rect) => {
        const idx = rect.getAttribute('data-loop-idx');
        if (targetIdx === null) {
          rect.setAttribute('stroke-width', '2');
          rect.style.opacity = '1';
        } else if (idx === targetIdx) {
          rect.setAttribute('stroke-width', '4');
          rect.style.opacity = '1';
        } else {
          rect.setAttribute('stroke-width', '1.5');
          rect.style.opacity = '0.25';
        }
      });
    };
    summaryEl.querySelectorAll('[data-loop-term]').forEach((badge) => {
      const idx = badge.getAttribute('data-loop-term');
      badge.addEventListener('mouseenter', () => setLoopHighlight(idx));
      badge.addEventListener('mouseleave', () => setLoopHighlight(null));
      badge.addEventListener('click', () => setLoopHighlight(idx));
    });

    // Hamming clickable bits (simulate 1-bit flip)
    visualEl.querySelectorAll('[data-hamming-flip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pos = Number(btn.getAttribute('data-hamming-flip')) - 1;
        const word = btn.getAttribute('data-hamming-word').split('');
        word[pos] = word[pos] === '0' ? '1' : '0';
        setActiveMode('hamming_check');
        inputEl.value = word.join('');
        runCalculation(false);
      });
    });

    // chmod clickable 3x3 matrix
    visualEl.querySelectorAll('[data-chmod-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [who, bitStr] = btn.getAttribute('data-chmod-toggle').split(':');
        const bit = Number(bitStr);
        const oct = btn.getAttribute('data-chmod-oct').split('').map(Number);
        const umask = btn.getAttribute('data-chmod-umask') || '022';
        const idxMap = { u: 1, g: 2, o: 3 };
        const idx = idxMap[who];
        if (idx !== undefined) {
          oct[idx] = oct[idx] ^ bit;
          const nextOct = oct[0] > 0 ? oct.join('') : oct.slice(1).join('');
          setActiveMode('chmod');
          inputEl.value = `${nextOct} ; umask ${umask}`;
          runCalculation(false);
        }
      });
    });
  }

  function runCalculation(pushHistory = true) {
    const q = inputEl.value.trim();
    const effectiveMode = tool === 'karnaugh' ? `${currentMode}:${kmapSubmode}` : currentMode;
    const res = engine(q, effectiveMode, lang);

    if (!res.ok) {
      errorBox.textContent = res.error;
      errorBox.classList.remove('hidden');
      resultWrap.classList.add('hidden');
      return;
    }

    errorBox.classList.add('hidden');
    resultWrap.classList.remove('hidden');
    summaryEl.innerHTML = res.summaryHtml || '';

    if (res.visualHtml) {
      visualEl.innerHTML = res.visualHtml;
      visualEl.classList.remove('hidden');
      bindInteractiveVisuals();
    } else {
      visualEl.innerHTML = '';
      visualEl.classList.add('hidden');
    }

    stepsEl.innerHTML = (res.steps || [])
      .map(
        (s) => `<div class="step-card p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 class="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">${s.title}</h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2.5">${s.explanation}</p>
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">${s.codeOrMathHtml}</div>
        </div>`
      )
      .join('');

    lastCopyText = res.copyText || '';
    revealedCount = 1;
    applyStudyVisibility();

    const url = new URL(window.location.href);
    url.searchParams.set('q', q);
    if (currentMode) url.searchParams.set('mode', currentMode);
    window.history.replaceState({}, '', url.toString());

    if (pushHistory) {
      saveHistory(tool, q, currentMode);
      renderHistory();
    }
  }

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextMode = btn.getAttribute('data-mode-btn');
      setActiveMode(nextMode);
      if (tool === 'karnaugh' && inputEl.value.startsWith('grid:')) {
        inputEl.value = 'grid:' + '0'.repeat(1 << Number(nextMode));
      }
      if (inputEl.value.trim()) runCalculation(false);
    });
  });

  kmapSubmodeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setKmapSubmode(btn.getAttribute('data-kmap-submode'));
    });
  });

  document.querySelectorAll('[data-kmap-sym]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sym = btn.getAttribute('data-kmap-sym');
      if (sym === 'CLEAR') {
        inputEl.value = '';
      } else if (sym === 'BACK') {
        inputEl.value = inputEl.value.slice(0, -1);
      } else {
        inputEl.value += sym;
      }
      inputEl.focus();
    });
  });

  exampleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-example-idx'));
      const ex = content?.examples?.[idx];
      if (!ex) return;
      setActiveMode(ex.mode);
      inputEl.value = ex.q;
      runCalculation(true);
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    runCalculation(true);
  });

  nextStepBtn?.addEventListener('click', () => {
    revealedCount = Math.min(totalSteps, revealedCount + 1);
    applyStudyVisibility();
  });

  showAllBtn?.addEventListener('click', () => {
    revealedCount = totalSteps;
    applyStudyVisibility();
  });

  clearHistoryBtn?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_HISTORY_PREFIX + tool);
    renderHistory();
  });

  copyResultBtn?.addEventListener('click', async () => {
    if (!lastCopyText) return;
    await navigator.clipboard.writeText(lastCopyText);
    const orig = copyResultBtn.textContent;
    copyResultBtn.textContent = ui.actions.copied;
    setTimeout(() => (copyResultBtn.textContent = orig), 1500);
  });

  copyLinkBtn?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(window.location.href);
    const orig = copyLinkBtn.textContent;
    copyLinkBtn.textContent = ui.actions.copied;
    setTimeout(() => (copyLinkBtn.textContent = orig), 1500);
  });

  pdfBtn?.addEventListener('click', () => window.print());

  // Listen to global study mode toggle
  window.addEventListener('bits:study-changed', () => {
    revealedCount = 1;
    applyStudyVisibility();
  });

  // Initial load from URL params or default first example
  const params = new URLSearchParams(window.location.search);
  const urlQ = params.get('q');
  const urlMode = params.get('mode');

  if (urlMode) setActiveMode(urlMode);
  if (urlQ) {
    inputEl.value = urlQ;
    runCalculation(false);
  } else if (content?.examples?.[0]) {
    setActiveMode(content.examples[0].mode);
    inputEl.value = content.examples[0].q;
    runCalculation(false);
  }

  renderHistory();
}

function initStudyToggle() {
  const btn = document.getElementById('study-mode-toggle');
  if (!btn) return;

  const syncUi = () => {
    const active = isStudyMode();
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.classList.toggle('bg-cyan-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('border-cyan-600', active);
    btn.classList.toggle('bg-slate-100', !active);
    btn.classList.toggle('dark:bg-slate-800', !active);
    btn.classList.toggle('text-slate-700', !active);
    btn.classList.toggle('dark:text-slate-200', !active);
    btn.classList.toggle('border-slate-200', !active);
    btn.classList.toggle('dark:border-slate-700', !active);
  };

  syncUi();
  btn.addEventListener('click', () => {
    setStudyMode(!isStudyMode());
    syncUi();
    window.dispatchEvent(new CustomEvent('bits:study-changed'));
  });
}

function initHomeSearch() {
  const input = document.getElementById('home-tool-search');
  if (!input) return;
  const cards = document.querySelectorAll('[data-tool-card]');
  const sections = document.querySelectorAll('[data-tool-section]');
  const emptyMsg = document.getElementById('home-no-results');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const hay = card.getAttribute('data-tool-card') || '';
      const match = !q || hay.includes(q);
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    sections.forEach((sec) => {
      const anyVisible = sec.querySelectorAll('[data-tool-card]:not(.hidden)').length > 0;
      sec.classList.toggle('hidden', !anyVisible);
    });
    emptyMsg?.classList.toggle('hidden', visible > 0);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initDropdowns();
  initStudyToggle();
  initHomeSearch();

  const tool = document.body.getAttribute('data-tool');
  const page = document.body.getAttribute('data-page');
  const lang = document.body.getAttribute('data-lang') || 'es';
  if (page === 'exam') {
    initExamPage(lang);
  } else if (page && page.startsWith('cheat')) {
    initCheatSheet(page);
  } else if (tool && ENGINES[tool]) {
    initCalculator(tool, lang);
  }
});
