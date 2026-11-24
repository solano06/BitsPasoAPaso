const TEXT = {
  es: {
    errFormat: 'Formato inválido. Usa: A-B:4, A-C:2 ; Origen [; Destino] (pesos >= 0).',
    errNeg: 'Dijkstra requiere pesos no negativos (w >= 0). Arista inválida: {edge}.',
    errSrc: 'El nodo origen "{src}" no existe en el grafo.',
    costTo: 'Coste mínimo {src} → {dst}',
    pathLabel: 'Ruta óptima',
    unreachable: 'Inalcanzable (∞)',
    iterTable: 'Tabla de iteraciones (N\', distancia, predecesor)',
    routeTable: 'Tabla de enrutamiento final',
    colStep: 'Paso',
    colVisited: 'N\' (Visitados)',
    colDest: 'Destino',
    colCost: 'Coste',
    colNextHop: 'Next Hop',
    colPath: 'Ruta completa',
    step1: 'Paso 1: Inicialización de distancias',
    step1Desc: 'Fijamos d({src}) = 0 y el resto de nodos a ∞.',
    step2: 'Paso 2: Iteraciones de selección y relajación',
    step2Desc: 'Elegimos el nodo u ∉ N\' de menor coste y relajamos sus aristas si d(u) + w(u,v) < d(v).',
    step3: 'Paso 3: Árbol de caminos mínimos y Next Hop',
    step3Desc: 'Reconstruimos las rutas desde los predecesores.'
  },
  en: {
    errFormat: 'Invalid format. Use: A-B:4, A-C:2 ; Source [; Target] (weights >= 0).',
    errNeg: 'Dijkstra requires non-negative weights (w >= 0). Invalid edge: {edge}.',
    errSrc: 'Source node "{src}" not found in graph.',
    costTo: 'Shortest cost {src} → {dst}',
    pathLabel: 'Optimal path',
    unreachable: 'Unreachable (∞)',
    iterTable: "Iteration Table (N', distance, predecessor)",
    routeTable: 'Final Routing Table',
    colStep: 'Step',
    colVisited: "N' (Visited)",
    colDest: 'Destination',
    colCost: 'Cost',
    colNextHop: 'Next Hop',
    colPath: 'Full Path',
    step1: 'Step 1: Distance initialization',
    step1Desc: 'Set d({src}) = 0 and all other nodes to ∞.',
    step2: 'Step 2: Selection & edge relaxation iterations',
    step2Desc: "Pick unvisited u ∉ N' with minimum distance and relax edges when d(u) + w(u,v) < d(v).",
    step3: 'Step 3: Shortest-path tree & Next Hop',
    step3Desc: 'Reconstruct paths from predecessors.'
  },
  fr: {
    errFormat: 'Format invalide. Utilisez : A-B:4, A-C:2 ; Source [; Cible] (poids >= 0).',
    errNeg: 'Dijkstra exige des poids >= 0. Arête invalide : {edge}.',
    errSrc: 'Le nœud source « {src} » est absent du graphe.',
    costTo: 'Coût minimal {src} → {dst}',
    pathLabel: 'Chemin optimal',
    unreachable: 'Inaccessible (∞)',
    iterTable: "Table des itérations (N', distance, prédécesseur)",
    routeTable: 'Table de routage finale',
    colStep: 'Étape',
    colVisited: "N' (Visités)",
    colDest: 'Destination',
    colCost: 'Coût',
    colNextHop: 'Next Hop',
    colPath: 'Chemin complet',
    step1: 'Étape 1 : Initialisation des distances',
    step1Desc: 'd({src}) = 0 et tous les autres nœuds à ∞.',
    step2: 'Étape 2 : Sélection et relâchement des arêtes',
    step2Desc: 'Choix du nœud minimal et mise à jour si d(u) + w(u,v) < d(v).',
    step3: 'Étape 3 : Arbre des plus courts chemins et Next Hop',
    step3Desc: 'Reconstruction des chemins depuis les prédécesseurs.'
  }
};

export function solveDijkstra(input, mode = 'undirected', lang = 'es') {
  const t = TEXT[lang] || TEXT.es;
  const parts = (input || '').split(';').map((s) => s.trim());
  if (parts.length < 2 || !parts[0] || !parts[1]) return { ok: false, error: t.errFormat };

  const directed = mode === 'directed';
  const rawEdges = parts[0].split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  const src = parts[1];
  const dst = parts[2] || null;

  const nodesSet = new Set();
  const adj = new Map();
  const edgeList = [];

  for (const e of rawEdges) {
    const m = e.match(/^([A-Za-z0-9_]+)\s*[-–>:]+\s*([A-Za-z0-9_]+)\s*[:=]\s*(-?[\d.]+)$/);
    if (!m) return { ok: false, error: t.errFormat };
    const [, u, v, wStr] = m;
    const w = Number(wStr);
    if (!Number.isFinite(w) || w < 0) return { ok: false, error: t.errNeg.replace('{edge}', e) };
    nodesSet.add(u);
    nodesSet.add(v);
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u).push({ to: v, w });
    if (!directed) adj.get(v).push({ to: u, w });
    edgeList.push({ u, v, w });
  }

  if (!nodesSet.has(src)) return { ok: false, error: t.errSrc.replace('{src}', src) };
  const nodes = Array.from(nodesSet).sort();

  const dist = Object.fromEntries(nodes.map((n) => [n, n === src ? 0 : Infinity]));
  const pred = Object.fromEntries(nodes.map((n) => [n, null]));
  const visited = new Set();
  const iterations = [];

  for (let step = 0; step < nodes.length; step++) {
    let u = null;
    let best = Infinity;
    for (const n of nodes) {
      if (!visited.has(n) && dist[n] < best) {
        best = dist[n];
        u = n;
      }
    }
    if (u === null) break;
    visited.add(u);

    const relaxed = [];
    for (const edge of adj.get(u) || []) {
      if (!visited.has(edge.to) && dist[u] + edge.w < dist[edge.to]) {
        dist[edge.to] = dist[u] + edge.w;
        pred[edge.to] = u;
        relaxed.push(`${edge.to}=${dist[edge.to]}`);
      }
    }

    iterations.push({
      step: step + 1,
      chosen: u,
      visited: Array.from(visited).join(','),
      snapshot: nodes.map((n) => (dist[n] === Infinity ? '∞' : `${dist[n]},${pred[n] || '-'}`)),
      relaxed
    });
  }

  const getPath = (target) => {
    if (dist[target] === Infinity) return null;
    const path = [];
    let cur = target;
    while (cur) {
      path.unshift(cur);
      cur = pred[cur];
    }
    return path;
  };

  const targetPath = dst && nodesSet.has(dst) ? getPath(dst) : null;
  const targetEdgeSet = new Set();
  if (targetPath) {
    for (let i = 0; i < targetPath.length - 1; i++) {
      targetEdgeSet.add(`${targetPath[i]}->${targetPath[i + 1]}`);
      if (!directed) targetEdgeSet.add(`${targetPath[i + 1]}->${targetPath[i]}`);
    }
  }
  const treeEdgeSet = new Set();
  for (const n of nodes) {
    if (pred[n]) {
      treeEdgeSet.add(`${pred[n]}->${n}`);
      if (!directed) treeEdgeSet.add(`${n}->${pred[n]}`);
    }
  }

  // Circular SVG layout (max 10 nodes cleanly)
  const cx = 180;
  const cy = 140;
  const rad = 100;
  const pos = {};
  nodes.forEach((n, i) => {
    const ang = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    pos[n] = { x: cx + rad * Math.cos(ang), y: cy + rad * Math.sin(ang) };
  });

  const svgEdges = edgeList
    .map((e) => {
      const p1 = pos[e.u];
      const p2 = pos[e.v];
      const inTarget = targetEdgeSet.has(`${e.u}->${e.v}`);
      const inTree = treeEdgeSet.has(`${e.u}->${e.v}`);
      const stroke = inTarget ? '#10b981' : inTree ? '#06b6d4' : '#94a3b8';
      const sw = inTarget ? 3.5 : inTree ? 2.5 : 1.5;
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;
      return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${stroke}" stroke-width="${sw}" />
        <rect x="${mx - 10}" y="${my - 9}" width="20" height="16" rx="4" class="fill-white dark:fill-slate-900" />
        <text x="${mx}" y="${my + 3}" text-anchor="middle" class="font-mono text-[10px] font-bold fill-slate-700 dark:fill-slate-200">${e.w}</text>`;
    })
    .join('');

  const svgNodes = nodes
    .map((n) => {
      const p = pos[n];
      const isSrc = n === src;
      const isDst = n === dst;
      const fill = isSrc ? '#06b6d4' : isDst ? '#10b981' : '#1e293b';
      return `<circle cx="${p.x}" cy="${p.y}" r="16" fill="${fill}" stroke="#38bdf8" stroke-width="2" />
        <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" class="font-mono text-xs font-bold fill-white">${n}</text>`;
    })
    .join('');

  const routingRows = nodes
    .filter((n) => n !== src)
    .map((n) => {
      const path = getPath(n);
      const nextHop = path && path.length > 1 ? path[1] : '—';
      return `<tr class="border-t border-slate-200 dark:border-slate-800 ${n === dst ? 'bg-emerald-500/10 font-bold' : ''}">
        <td class="px-3 py-1.5 font-mono font-bold">${n}</td>
        <td class="px-3 py-1.5 font-mono text-cyan-600 dark:text-cyan-400">${dist[n] === Infinity ? '∞' : dist[n]}</td>
        <td class="px-3 py-1.5 font-mono">${nextHop}</td>
        <td class="px-3 py-1.5 font-mono text-xs">${path ? path.join(' → ') : t.unreachable}</td>
      </tr>`;
    })
    .join('');

  const targetCost = dst && nodesSet.has(dst) ? (dist[dst] === Infinity ? '∞' : dist[dst]) : null;

  const summaryHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${dst ? t.costTo.replace('{src}', src).replace('{dst}', dst) : `${t.colVisited} (${src})`}</div>
        <div class="font-mono font-extrabold text-2xl text-cyan-600 dark:text-cyan-400">${targetCost !== null ? targetCost : `${nodes.length} nodes`}</div>
      </div>
      <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500">${t.pathLabel}</div>
        <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">${targetPath ? targetPath.join(' → ') : nodes.map((n) => `${n}:${dist[n] === Infinity ? '∞' : dist[n]}`).join(' · ')}</div>
      </div>
    </div>
  `;

  const visualHtml = `
    <div class="space-y-4">
      <div class="min-w-0 max-w-full overflow-x-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 flex justify-center">
        <svg width="360" height="280" viewBox="0 0 360 280">${svgEdges}${svgNodes}</svg>
      </div>

      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div class="px-3 py-2 text-xs font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">${t.iterTable}</div>
        <table class="w-full text-left text-xs whitespace-nowrap">
          <thead class="bg-slate-100 dark:bg-slate-800 font-mono">
            <tr><th class="px-2.5 py-2">${t.colStep}</th><th class="px-2.5 py-2">${t.colVisited}</th>${nodes.map((n) => `<th class="px-2.5 py-2 text-center">${n}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${iterations
              .map(
                (it) => `<tr class="border-t border-slate-200 dark:border-slate-800">
                  <td class="px-2.5 py-1.5 font-mono font-bold">${it.step} (${it.chosen})</td>
                  <td class="px-2.5 py-1.5 font-mono">{${it.visited}}</td>
                  ${it.snapshot.map((cell) => `<td class="px-2.5 py-1.5 font-mono text-center">${cell}</td>`).join('')}
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="min-w-0 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div class="px-3 py-2 text-xs font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">${t.routeTable}</div>
        <table class="w-full text-left text-xs sm:text-sm whitespace-nowrap">
          <thead class="bg-slate-100 dark:bg-slate-800"><tr><th class="px-3 py-2">${t.colDest}</th><th class="px-3 py-2">${t.colCost}</th><th class="px-3 py-2">${t.colNextHop}</th><th class="px-3 py-2">${t.colPath}</th></tr></thead>
          <tbody>${routingRows}</tbody>
        </table>
      </div>
    </div>
  `;

  const steps = [
    {
      title: t.step1,
      explanation: t.step1Desc.replace('{src}', src),
      codeOrMathHtml: `<div class="font-mono text-xs">${nodes.map((n) => `d(${n})=${n === src ? 0 : '∞'}`).join(' · ')}</div>`
    },
    {
      title: t.step2,
      explanation: t.step2Desc,
      codeOrMathHtml: `<div class="font-mono text-xs space-y-1">${iterations.map((it) => `<div>#${it.step}: pick <b>${it.chosen}</b> ${it.relaxed.length ? `→ relax ${it.relaxed.join(', ')}` : ''}</div>`).join('')}</div>`
    },
    {
      title: t.step3,
      explanation: t.step3Desc,
      codeOrMathHtml: `<div class="font-mono text-xs sm:text-sm">${targetPath ? `${targetPath.join(' → ')} (${targetCost})` : nodes.map((n) => `${n}=${dist[n]}`).join(', ')}</div>`
    }
  ];

  const copyText = targetPath
    ? `Dijkstra ${src} -> ${dst}: Cost ${targetCost} (${targetPath.join(' -> ')})`
    : nodes.map((n) => `${src} -> ${n}: ${dist[n]}`).join('\n');
  const csvText = ['Dest,Cost,Path', ...nodes.filter((n) => n !== src).map((n) => `${n},${dist[n]},${(getPath(n) || []).join('->')}`)].join('\n');
  const latexText = targetPath ? `d(${src},${dst}) = ${targetCost} \\; (${targetPath.join(' \\to ')})` : `d(${src}) = 0`;

  return { ok: true, summaryHtml, visualHtml, steps, copyText, csvText, latexText };
}
