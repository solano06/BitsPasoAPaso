import { UI, TOOL_KEYS } from './i18n.js';
import { generateExam, solveExamExercise, checkUserAnswer } from './engines/exam-generator.js';

const STORAGE_EXAM_HIST = 'bits_exam_history';

const EXAM_TEXT = {
  es: {
    selectTopics: '1. Selecciona los temas del examen',
    allBtn: 'Todos',
    netBtn: 'Solo Redes IP',
    digBtn: 'Solo Sistemas Digitales',
    sysBtn: 'Solo Códigos y Sistemas',
    clearBtn: 'Limpiar',
    difficulty: 'Dificultad',
    diffBasic: 'Básico',
    diffStd: 'Estándar',
    diffExam: 'Examen',
    timerLabel: 'Temporizador opcional (informativo)',
    noLimit: 'Sin límite',
    minUnit: 'min',
    generateBtn: 'Generar examen de 10 ejercicios',
    recentExams: 'Últimos exámenes realizados',
    exTitle: 'Ejercicio {i} de {total}',
    userPlaceholder: 'Tu respuesta (opcional — puedes resolverlo en papel)',
    printStatements: 'Imprimir solo enunciados (PDF)',
    changeTopics: 'Cambiar temas',
    revealAll: 'Mostrar todas las soluciones paso a paso',
    scoreSummary: 'Resultado: {correct} / {total} aciertos',
    onPaperNote: '({paper} resueltos en papel)',
    statusCorrect: 'Correcta',
    statusIncorrect: 'Incorrecta (esperado: {exp})',
    statusPaper: 'En papel',
    saveSolvedPdf: 'Guardar examen resuelto en PDF',
    genAnother: 'Generar otros 10 ejercicios',
    toggleSol: 'Mostrar / ocultar solución',
    printHeader: 'BitsPasoAPaso — Examen',
    printName: 'Nombre: ___________________________   Fecha: ____________',
    timeLeft: 'Tiempo restante'
  },
  en: {
    selectTopics: '1. Select exam topics',
    allBtn: 'All',
    netBtn: 'IP Networking only',
    digBtn: 'Digital Systems only',
    sysBtn: 'Coding & Systems only',
    clearBtn: 'Clear',
    difficulty: 'Difficulty',
    diffBasic: 'Basic',
    diffStd: 'Standard',
    diffExam: 'Exam',
    timerLabel: 'Optional timer (informational)',
    noLimit: 'No limit',
    minUnit: 'min',
    generateBtn: 'Generate 10-question exam',
    recentExams: 'Recent practice exams',
    exTitle: 'Exercise {i} of {total}',
    userPlaceholder: 'Your answer (optional — you may solve on paper)',
    printStatements: 'Print statements only (PDF)',
    changeTopics: 'Change topics',
    revealAll: 'Show all step-by-step solutions',
    scoreSummary: 'Score: {correct} / {total} correct',
    onPaperNote: '({paper} solved on paper)',
    statusCorrect: 'Correct',
    statusIncorrect: 'Incorrect (expected: {exp})',
    statusPaper: 'On paper',
    saveSolvedPdf: 'Save solved exam as PDF',
    genAnother: 'Generate 10 new exercises',
    toggleSol: 'Toggle solution',
    printHeader: 'BitsPasoAPaso — Exam',
    printName: 'Name: ___________________________   Date: ____________',
    timeLeft: 'Time left'
  },
  fr: {
    selectTopics: '1. Sélectionnez les thèmes de l’examen',
    allBtn: 'Tous',
    netBtn: 'Réseaux IP uniquement',
    digBtn: 'Systèmes Numériques uniquement',
    sysBtn: 'Codage & Systèmes uniquement',
    clearBtn: 'Effacer',
    difficulty: 'Difficulté',
    diffBasic: 'Basique',
    diffStd: 'Standard',
    diffExam: 'Examen',
    timerLabel: 'Chronomètre optionnel (informatif)',
    noLimit: 'Sans limite',
    minUnit: 'min',
    generateBtn: 'Générer un examen de 10 exercices',
    recentExams: 'Derniers examens effectués',
    exTitle: 'Exercice {i} sur {total}',
    userPlaceholder: 'Votre réponse (facultatif — résolution sur papier possible)',
    printStatements: 'Imprimer les énoncés seuls (PDF)',
    changeTopics: 'Changer les thèmes',
    revealAll: 'Afficher toutes les solutions étape par étape',
    scoreSummary: 'Résultat : {correct} / {total} réussis',
    onPaperNote: '({paper} sur papier)',
    statusCorrect: 'Correcte',
    statusIncorrect: 'Incorrecte (attendu : {exp})',
    statusPaper: 'Sur papier',
    saveSolvedPdf: 'Enregistrer l’examen corrigé en PDF',
    genAnother: 'Générer 10 autres exercices',
    toggleSol: 'Afficher / masquer la solution',
    printHeader: 'BitsPasoAPaso — Examen',
    printName: 'Nom : ___________________________   Date : ____________',
    timeLeft: 'Temps restant'
  }
};

function loadExamHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_EXAM_HIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExamHistory(entry) {
  try {
    const items = loadExamHistory();
    items.unshift(entry);
    localStorage.setItem(STORAGE_EXAM_HIST, JSON.stringify(items.slice(0, 8)));
  } catch {
    // ignore
  }
}

export function initExamPage(lang) {
  const root = document.getElementById('exam-app');
  if (!root) return;

  const ui = UI[lang] || UI.es;
  const t = EXAM_TEXT[lang] || EXAM_TEXT.es;

  const selected = new Set(TOOL_KEYS);
  let difficulty = 'standard';
  let timerMinutes = 0;
  let timerId = null;
  let secondsLeft = 0;
  let currentExercises = [];
  let userAnswers = {};

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function renderPhase1() {
    stopTimer();
    const groups = [
      { label: ui.nav.networking, keys: TOOL_KEYS.filter((k) => ui.tools[k].category === 'networking') },
      { label: ui.nav.digital, keys: TOOL_KEYS.filter((k) => ui.tools[k].category === 'digital') },
      { label: ui.nav.systems, keys: TOOL_KEYS.filter((k) => ui.tools[k].category === 'systems') }
    ];

    const hist = loadExamHistory();

    root.innerHTML = `
      <div class="space-y-6">
        <div class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">${t.selectTopics}</h2>
            <div class="flex flex-wrap gap-1.5">
              <button type="button" data-preset="all" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:border-cyan-500">${t.allBtn}</button>
              <button type="button" data-preset="networking" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:border-cyan-500">${t.netBtn}</button>
              <button type="button" data-preset="digital" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:border-cyan-500">${t.digBtn}</button>
              <button type="button" data-preset="systems" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:border-cyan-500">${t.sysBtn}</button>
              <button type="button" data-preset="clear" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400">${t.clearBtn}</button>
            </div>
          </div>

          <div class="space-y-4">
            ${groups
              .map(
                (g) => `<div>
                  <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">${g.label}</div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    ${g.keys
                      .map((k) => {
                        const checked = selected.has(k);
                        return `<button type="button" data-topic-toggle="${k}" class="text-left p-3 rounded-xl border transition flex items-start gap-2.5 ${
                          checked
                            ? 'bg-cyan-500/10 border-cyan-500 text-slate-900 dark:text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                        }">
                          <span class="mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            checked ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-400'
                          }">${checked ? '✓' : ''}</span>
                          <span class="text-xs sm:text-sm font-semibold leading-snug">${ui.tools[k].name}</span>
                        </button>`;
                      })
                      .join('')}
                  </div>
                </div>`
              )
              .join('')}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">${t.difficulty}</div>
              <div class="flex flex-wrap gap-2">
                ${[
                  ['basic', t.diffBasic],
                  ['standard', t.diffStd],
                  ['exam', t.diffExam]
                ]
                  .map(
                    ([d, lbl]) => `<button type="button" data-diff="${d}" class="px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold ${
                      difficulty === d ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                    }">${lbl}</button>`
                  )
                  .join('')}
              </div>
            </div>
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">${t.timerLabel}</div>
              <div class="flex flex-wrap gap-2">
                ${[0, 20, 40, 60]
                  .map(
                    (m) => `<button type="button" data-timer="${m}" class="px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold ${
                      timerMinutes === m ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                    }">${m === 0 ? t.noLimit : `${m} ${t.minUnit}`}</button>`
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button id="start-exam-btn" type="button" ${selected.size === 0 ? 'disabled' : ''} class="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm">
              ${t.generateBtn}
            </button>
          </div>
        </div>

        ${
          hist.length
            ? `<div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">${t.recentExams}</h3>
                <div class="space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                  ${hist.map((h) => `<div>${h.date} · ${h.topics.length} temas · ${h.scoreText}</div>`).join('')}
                </div>
              </div>`
            : ''
        }
      </div>
    `;

    root.querySelectorAll('[data-topic-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-topic-toggle');
        if (selected.has(k)) selected.delete(k);
        else selected.add(k);
        renderPhase1();
      });
    });

    root.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-preset');
        selected.clear();
        if (p === 'all') TOOL_KEYS.forEach((k) => selected.add(k));
        else if (p !== 'clear') TOOL_KEYS.filter((k) => ui.tools[k].category === p).forEach((k) => selected.add(k));
        renderPhase1();
      });
    });

    root.querySelectorAll('[data-diff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        difficulty = btn.getAttribute('data-diff');
        renderPhase1();
      });
    });

    root.querySelectorAll('[data-timer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        timerMinutes = Number(btn.getAttribute('data-timer'));
        renderPhase1();
      });
    });

    document.getElementById('start-exam-btn')?.addEventListener('click', () => {
      startNewExam();
    });
  }

  function startNewExam() {
    currentExercises = generateExam(Array.from(selected), difficulty, lang, 10);
    userAnswers = {};
    renderPhase2();
  }

  function renderPhase2() {
    stopTimer();
    let timerHtml = '';
    if (timerMinutes > 0) {
      secondsLeft = timerMinutes * 60;
      timerHtml = `<span id="exam-countdown" class="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">${t.timeLeft}: ${timerMinutes}:00</span>`;
    }

    root.innerHTML = `
      <div class="space-y-5">
        <div class="exam-print-only hidden pb-3 border-b-2 border-slate-900">
          <div class="text-xl font-bold">${t.printHeader}</div>
          <div class="text-xs mt-1">${t.printName}</div>
        </div>

        <div class="exam-no-print sticky top-16 z-30 p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            ${timerHtml}
            <button id="exam-print-btn" type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:border-cyan-500">${t.printStatements}</button>
            <button id="exam-back-btn" type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:border-cyan-500">${t.changeTopics}</button>
          </div>
          <button id="exam-reveal-top" type="button" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold">${t.revealAll}</button>
        </div>

        <div class="space-y-4">
          ${currentExercises
            .map(
              (ex) => `<div class="exam-card p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-bold text-sm text-cyan-600 dark:text-cyan-400">${t.exTitle.replace('{i}', ex.id).replace('{total}', currentExercises.length)}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${ui.tools[ex.topic].shortName} · ${difficulty}</span>
                </div>
                <p class="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">${ex.promptText}</p>
                <div class="exam-no-print">
                  <input type="text" data-exam-input="${ex.id}" placeholder="${t.userPlaceholder}" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>`
            )
            .join('')}
        </div>

        <div class="exam-no-print flex justify-center pt-2">
          <button id="exam-reveal-bottom" type="button" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm">${t.revealAll}</button>
        </div>
      </div>
    `;

    if (timerMinutes > 0) {
      const cd = document.getElementById('exam-countdown');
      timerId = setInterval(() => {
        secondsLeft = Math.max(0, secondsLeft - 1);
        const m = Math.floor(secondsLeft / 60);
        const s = String(secondsLeft % 60).padStart(2, '0');
        if (cd) cd.textContent = `${t.timeLeft}: ${m}:${s}`;
        if (secondsLeft === 0) stopTimer();
      }, 1000);
    }

    root.querySelectorAll('[data-exam-input]').forEach((inp) => {
      inp.addEventListener('input', () => {
        userAnswers[inp.getAttribute('data-exam-input')] = inp.value;
      });
    });

    document.getElementById('exam-print-btn')?.addEventListener('click', () => window.print());
    document.getElementById('exam-back-btn')?.addEventListener('click', () => renderPhase1());
    document.getElementById('exam-reveal-top')?.addEventListener('click', () => renderPhase3());
    document.getElementById('exam-reveal-bottom')?.addEventListener('click', () => renderPhase3());
  }

  function renderPhase3() {
    stopTimer();
    let correct = 0;
    let paper = 0;
    let attempted = 0;

    const evaluated = currentExercises.map((ex) => {
      const uAns = userAnswers[ex.id] || '';
      const status = checkUserAnswer(uAns, ex.expectedAnswer);
      if (status === 'correct') {
        correct++;
        attempted++;
      } else if (status === 'incorrect') {
        attempted++;
      } else {
        paper++;
      }
      const sol = solveExamExercise(ex, lang);
      return { ex, uAns, status, sol };
    });

    const scoreText = attempted > 0
      ? `${t.scoreSummary.replace('{correct}', correct).replace('{total}', attempted)} ${paper > 0 ? t.onPaperNote.replace('{paper}', paper) : ''}`
      : `${t.onPaperNote.replace('{paper}', currentExercises.length)}`;

    saveExamHistory({
      date: new Date().toLocaleDateString(lang),
      topics: Array.from(selected),
      scoreText
    });

    root.innerHTML = `
      <div class="space-y-5">
        <div class="exam-print-only hidden pb-3 border-b-2 border-slate-900">
          <div class="text-xl font-bold">${t.printHeader}</div>
          <div class="text-xs mt-1">${scoreText}</div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div class="font-bold text-base sm:text-lg text-slate-900 dark:text-white">${scoreText}</div>
          <div class="exam-no-print flex flex-wrap gap-2">
            <button id="exam-save-pdf" type="button" class="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold">${t.saveSolvedPdf}</button>
            <button id="exam-new-10" type="button" class="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:border-cyan-500">${t.genAnother}</button>
            <button id="exam-change" type="button" class="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:border-cyan-500">${t.changeTopics}</button>
          </div>
        </div>

        <div class="space-y-5">
          ${evaluated
            .map(({ ex, uAns, status, sol }) => {
              const badgeCls =
                status === 'correct'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : status === 'incorrect'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700';
              const badgeText =
                status === 'correct'
                  ? t.statusCorrect
                  : status === 'incorrect'
                    ? t.statusIncorrect.replace('{exp}', ex.expectedAnswer)
                    : t.statusPaper;

              return `<div class="exam-card p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-bold text-sm text-cyan-600 dark:text-cyan-400">${t.exTitle.replace('{i}', ex.id).replace('{total}', currentExercises.length)} · ${ui.tools[ex.topic].shortName}</span>
                  <span class="px-2.5 py-0.5 rounded-full border text-xs font-bold ${badgeCls}">${badgeText}</span>
                </div>
                <p class="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">${ex.promptText}</p>
                ${uAns ? `<div class="text-xs font-mono text-slate-500">→ ${uAns}</div>` : ''}

                <details open class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-3">
                  <summary class="exam-no-print cursor-pointer text-xs font-bold text-cyan-600 dark:text-cyan-400 select-none">${t.toggleSol}</summary>
                  ${sol.ok ? `<div class="mt-3 space-y-3">${sol.summaryHtml || ''}${sol.visualHtml ? `<div class="min-w-0 max-w-full overflow-x-auto">${sol.visualHtml}</div>` : ''}<div class="space-y-2">${(sol.steps || []).map((s) => `<div class="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"><div class="font-semibold text-xs sm:text-sm">${s.title}</div><div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-1.5">${s.explanation}</div><div>${s.codeOrMathHtml}</div></div>`).join('')}</div></div>` : `<div>${sol.error}</div>`}
                </details>
              </div>`;
            })
            .join('')}
        </div>
      </div>
    `;

    document.getElementById('exam-save-pdf')?.addEventListener('click', () => window.print());
    document.getElementById('exam-new-10')?.addEventListener('click', () => startNewExam());
    document.getElementById('exam-change')?.addEventListener('click', () => renderPhase1());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderPhase1();
}
