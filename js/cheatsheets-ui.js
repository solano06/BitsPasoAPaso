export function initCheatSheet(pageKey) {
  document.getElementById('cheat-print-btn')?.addEventListener('click', () => window.print());

  if (pageKey === 'cheatCidr') {
    const search = document.getElementById('cidr-filter');
    const hint = document.getElementById('cidr-optimal-hint');
    const rows = Array.from(document.querySelectorAll('[data-cidr-prefix]'));

    search?.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      const isHostNum = /^\d+$/.test(q) && Number(q) > 0 && !q.startsWith('0');
      let bestPrefix = null;

      if (isHostNum) {
        const needed = Number(q);
        for (let i = rows.length - 1; i >= 0; i--) {
          const usable = Number(rows[i].getAttribute('data-cidr-usable'));
          if (usable >= needed) {
            bestPrefix = rows[i].getAttribute('data-cidr-prefix');
            break;
          }
        }
      }

      rows.forEach((tr) => {
        const p = tr.getAttribute('data-cidr-prefix');
        const mask = tr.getAttribute('data-cidr-mask');
        const usable = Number(tr.getAttribute('data-cidr-usable'));
        const isBest = bestPrefix !== null && p === bestPrefix;

        tr.classList.toggle('bg-cyan-500/15', isBest);
        tr.classList.toggle('ring-1', isBest);
        tr.classList.toggle('ring-cyan-500', isBest);

        if (!q) {
          tr.classList.remove('hidden');
        } else if (isHostNum) {
          tr.classList.toggle('hidden', usable < Number(q));
        } else {
          const match = `/${p}`.includes(q) || mask.includes(q);
          tr.classList.toggle('hidden', !match);
        }
      });

      if (hint) {
        if (bestPrefix !== null) {
          hint.textContent = `/${bestPrefix}`;
          hint.parentElement?.classList.remove('hidden');
        } else {
          hint.parentElement?.classList.add('hidden');
        }
      }
    });

    document.querySelectorAll('[data-copy-mask]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const val = btn.getAttribute('data-copy-mask');
        await navigator.clipboard.writeText(val);
        const orig = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => (btn.textContent = orig), 1200);
      });
    });
  }

  if (pageKey === 'cheatAscii') {
    const textIn = document.getElementById('ascii-live-input');
    const textOut = document.getElementById('ascii-live-output');
    const copyBinBtn = document.getElementById('ascii-copy-bin');
    const copyHexBtn = document.getElementById('ascii-copy-hex');
    let lastBin = '';
    let lastHex = '';

    const updateLive = () => {
      if (!textIn || !textOut) return;
      const val = textIn.value;
      if (!val) {
        textOut.innerHTML = '';
        lastBin = '';
        lastHex = '';
        return;
      }
      const chars = Array.from(val).slice(0, 24);
      const bins = [];
      const hexs = [];
      textOut.innerHTML = chars
        .map((ch) => {
          const code = ch.charCodeAt(0);
          const bin = code.toString(2).padStart(8, '0');
          const hex = '0x' + code.toString(16).toUpperCase().padStart(2, '0');
          bins.push(bin);
          hexs.push(hex);
          return `<div class="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-center">
            <div class="font-bold text-cyan-600 dark:text-cyan-400 text-sm">${ch === ' ' ? 'SPC' : ch}</div>
            <div class="text-slate-600 dark:text-slate-300">${code} · ${hex}</div>
            <div class="text-[10px] text-slate-500">${bin}</div>
          </div>`;
        })
        .join('');
      lastBin = bins.join(' ');
      lastHex = hexs.join(' ');
    };

    textIn?.addEventListener('input', updateLive);
    updateLive();

    copyBinBtn?.addEventListener('click', async () => {
      if (!lastBin) return;
      await navigator.clipboard.writeText(lastBin);
      const orig = copyBinBtn.textContent;
      copyBinBtn.textContent = '✓';
      setTimeout(() => (copyBinBtn.textContent = orig), 1200);
    });
    copyHexBtn?.addEventListener('click', async () => {
      if (!lastHex) return;
      await navigator.clipboard.writeText(lastHex);
      const orig = copyHexBtn.textContent;
      copyHexBtn.textContent = '✓';
      setTimeout(() => (copyHexBtn.textContent = orig), 1200);
    });

    const search = document.getElementById('ascii-filter');
    const tabs = document.querySelectorAll('[data-ascii-cat]');
    const rows = Array.from(document.querySelectorAll('[data-ascii-row]'));
    let activeCat = 'all';

    const filterRows = () => {
      const q = (search?.value || '').trim().toLowerCase();
      rows.forEach((tr) => {
        const cat = tr.getAttribute('data-ascii-cat-val');
        const hay = tr.getAttribute('data-ascii-hay') || '';
        const catOk = activeCat === 'all' || cat === activeCat;
        const qOk = !q || hay.includes(q);
        tr.classList.toggle('hidden', !(catOk && qOk));
      });
    };

    search?.addEventListener('input', filterRows);
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activeCat = tab.getAttribute('data-ascii-cat');
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle('bg-cyan-600', on);
          t.classList.toggle('text-white', on);
          t.classList.toggle('border-cyan-600', on);
        });
        filterRows();
      });
    });
  }
}
