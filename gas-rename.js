(function() {
  const lang = document.documentElement.lang || navigator.language || 'en';
  const isNL = lang.startsWith('nl');
  const MAP = isNL ? [
    [/\bGasverbruik\b/g,      'Stadsverwarming Verbruik'],
    [/\bGasdoorstroom\b/g,    'Stadsverwarming Doorstroom'],
    [/\bGas consumption\b/g,  'Stadsverwarming Verbruik'],
    [/\bGas flow rate\b/g,    'Stadsverwarming Doorstroom'],
    [/\bGas total\b/g,        'Stadsverwarming Totaal'],
    [/\bGas\b/g,              'Stadsverwarming'],
    [/\bgas\b/g,              'stadsverwarming'],
  ] : [
    [/\bGas flow rate\b/g,    'District Heating flow rate'],
    [/\bGas consumption\b/g,  'District Heating consumption'],
    [/\bGas total\b/g,        'District Heating total'],
    [/\bGas\b/g,              'District Heating'],
    [/\bgas\b/g,              'district heating'],
  ];

  function replaceText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      let t = node.textContent;
      let changed = false;
      for (const [p, r] of MAP) { const n = t.replace(p, r); if (n !== t) { t = n; changed = true; } }
      if (changed) node.textContent = t;
    }
    root.querySelectorAll('*').forEach(el => { if (el.shadowRoot) replaceText(el.shadowRoot); });
  }

  let timer = null;
  function scheduleRun() {
    if (timer) return;
    timer = setTimeout(() => { timer = null; replaceText(document.body); }, 300);
  }

  new MutationObserver(scheduleRun)
    .observe(document.body, { childList: true, subtree: true });

  const _orig = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(init) {
    const shadow = _orig.call(this, init);
    new MutationObserver(scheduleRun).observe(shadow, { childList: true, subtree: true });
    return shadow;
  };

  [200, 800, 2000].forEach(d => setTimeout(() => replaceText(document.body), d));
})();
