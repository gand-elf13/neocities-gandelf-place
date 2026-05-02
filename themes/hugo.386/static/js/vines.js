/* ============================================================
   VINES.JS — pixel vine overlay for Hugo.386
   All configuration is in the VINE_CFG block below.
   ============================================================ */

window.VINE_CFG = {

  /* ── GRID & APPEARANCE ───────────────────────────────────── */
  px:           4,      // pixel grid size in CSS px. 3=fine  4=chunky  6=coarse
  turnChance:   0.11,   // 0–1 prob of a 90° turn each step.  0=straight  0.3=zigzag
  wanderChance: 0.10,   // 0–1 lateral drift each step.       0=rigid  0.15=organic
  leafInterval: 7,      // draw a leaf cluster every N steps
  leafCountMin: 2,      // min leaf pixels per cluster
  leafCountMax: 5,      // max leaf pixels per cluster
  segLenMin:    45,     // min segment length (px, before grid snap)
  segLenMax:    95,     // max segment length (px, grows slightly with takeover %)
  thickBase:    1.0,    // pixel thickness multiplier at max depth.  1=1px  1.5=chunkier
  thickPerDepth:0.55,   // extra thickness added per remaining depth level

  /* ── VINE PALETTES ───────────────────────────────────────── */
  // Each inner array is a palette of hex colours from dark to light.
  // A random palette is chosen per vine; a random stop within it per segment.
  palettes: [
    ['#1a3a0e','#2a5a18','#3a7a22','#4a9a2c','#5ac036'], // forest green
    ['#0e3018','#185020','#226e28','#2c8c30','#36aa38'], // deep moss
    ['#243a10','#345618','#447220','#548e28','#64aa30'], // yellow-green
    ['#143010','#1e4c18','#2a6822','#36842c','#42a036'], // emerald
  ],
  leafLighten: [50, 60, 10], // [R, G, B] added to vine colour for leaves

  /* ── GROWTH LIMITS ───────────────────────────────────────── */
  maxDepth:     5,      // max branch recursion depth
  maxVines:     400,    // hard cap on concurrent active vine tips (perf guard)

  /* ── TRIGGERS — configure each action independently ─────── */
  // clusters:   how many edge-anchored vine clusters to spawn  (int, 0=disabled)
  // depth:      override branch depth for this trigger         (null = use global maxDepth)
  // chance:     0–1 probability the event fires at all        (1=always)
  // cooldownMs: minimum ms between firings of this trigger    (0=no cooldown)
  triggers: {

    onLoad: {
      clusters:   2,      // vines spawned when the page first loads
      depth:      3,
      chance:     1.0,
      cooldownMs: 0,
    },

    onScroll: {
      clusters:   1,      // vines per scroll event
      depth:      3,
      chance:     0.04,   // very low — scroll fires constantly, keep this small
      cooldownMs: 1200,   // hard cooldown between scroll bursts
    },

    onPassive: {
      clusters:   1,      // vines per passive auto-tick
      depth:      3,
      chance:     0.5,    // 50% chance each tick fires
      intervalMs: 5000,   // ms between passive ticks
    },

    onNavClick: {
      clusters:   2,
      depth:      4,
      chance:     1.0,
      cooldownMs: 0,
    },

    onPostTitleClick: {
      clusters:   2,
      depth:      4,
      chance:     1.0,
      cooldownMs: 0,
    },

    onPostTitleHover: {
      clusters:   1,
      depth:      3,
      chance:     0.30,   // 30% chance hover fires
      cooldownMs: 800,
    },

    onTagClick: {
      clusters:   1,
      depth:      3,
      chance:     1.0,
      cooldownMs: 0,
    },

    onTagHover: {
      clusters:   1,
      depth:      2,
      chance:     0.20,
      cooldownMs: 1000,
    },

    onSidebarClick: {
      clusters:   1,
      depth:      3,
      chance:     1.0,
      cooldownMs: 0,
    },

    onSidebarHover: {
      clusters:   1,
      depth:      2,
      chance:     0.20,
      cooldownMs: 1000,
    },

    onFooterHover: {
      clusters:   1,
      depth:      2,
      chance:     0.25,
      cooldownMs: 1500,
    },

  },

  /* ── CSS SELECTORS — map triggers to DOM elements ───────── */
  // To find the real class names: right-click any nav link or post title
  // in your browser → Inspect → read the class="..." in the Elements panel.
  selectors: {
    nav:        '.navbar a, .navbar-nav a, #navbar a',
    postTitle:  '.post-title, h1.entry-title, .list-post-title, article h2 a',
    tag:        '.tag, .tags a, a[href*="/tags/"]',
    sidebar:    '.sidebar a, aside a, #sidebar a, .widget a',
    footer:     'footer, #footer, .site-footer',
  },

};

/* ============================================================
   ENGINE — do not edit below unless you know what you're doing
   ============================================================ */
(function (CFG) {
  'use strict';

  const STORAGE_KEY = 'vines_pixels_v3';
  const STORAGE_DIM = 'vines_dim_v3';

  /* ── canvas ── */
  let W = 0, H = 0;
  const canvas = document.createElement('canvas');
  canvas.id = 'vine-canvas';
  Object.assign(canvas.style, {
    position:       'fixed',
    top:            '0',
    left:           '0',
    pointerEvents:  'none',
    zIndex:         '9999',
    imageRendering: 'pixelated',
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  /* ── JS-side pixel buffer ─────────────────────────────────────
     We maintain our own RGBA Uint8ClampedArray that mirrors every
     pixel we draw. On save we store this buffer (never reading back
     from the canvas). On restore we write it straight to the canvas
     with putImageData.

     This completely avoids canvas fingerprinting:
       - toDataURL()  → poisoned by LibreWolf/Tor (adds noise to R channel)
       - getImageData → also poisoned by LibreWolf/Tor
       - putImageData → write-only, never read back, not touched by protection
  ─────────────────────────────────────────────────────────────── */
  let pixelBuf = null; // Uint8ClampedArray, W*H*4

  function initBuffer () {
    pixelBuf = new Uint8ClampedArray(W * H * 4);
  }

  /* Write an RGBA value into our buffer at canvas coords (x, y) */
  function bufSet (x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    pixelBuf[i]     = r;
    pixelBuf[i + 1] = g;
    pixelBuf[i + 2] = b;
    pixelBuf[i + 3] = a;
  }

  /* Fill a rectangle in both the canvas and our buffer */
  function pxFill (x, y, w, h, r, g, b) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, w, h);
    // mirror into buffer
    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        bufSet(col, row, r, g, b, 255);
      }
    }
  }

  function resize () {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    initBuffer();
  }

  /* ── persistence ── */
  function saveState () {
    if (!pixelBuf) return;
    try {
      // base64-encode the raw buffer in 32 KB chunks (avoids stack overflow)
      const CHUNK = 0x8000;
      let binary = '';
      for (let i = 0; i < pixelBuf.length; i += CHUNK) {
        binary += String.fromCharCode.apply(null, pixelBuf.subarray(i, i + CHUNK));
      }
      localStorage.setItem(STORAGE_KEY, btoa(binary));
      localStorage.setItem(STORAGE_DIM, JSON.stringify({ w: W, h: H }));
    } catch (e) { /* quota exceeded — skip */ }
  }

  function restoreState () {
    try {
      const saved    = localStorage.getItem(STORAGE_KEY);
      const savedDim = localStorage.getItem(STORAGE_DIM);
      if (!saved || !savedDim) return;
      const { w, h } = JSON.parse(savedDim);
      if (w !== W || h !== H) return; // viewport changed — start fresh

      const binary = atob(saved);
      const bytes  = new Uint8ClampedArray(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      // write straight to canvas — no read-back, fingerprinting doesn't apply
      ctx.putImageData(new ImageData(bytes, W, H), 0, 0);
      // sync our buffer so future draws are consistent
      pixelBuf.set(bytes);
    } catch (e) { /* corrupted data — start fresh */ }
  }

  resize();
  restoreState();

  window.addEventListener('beforeunload', saveState);
  window.addEventListener('resize', resize); // clears buffer; vines continue on new size

  /* ── colour helpers ── */
  const PX   = CFG.px;
  const snap = v => Math.round(v / PX) * PX;
  const rnd  = (a, b) => a + Math.random() * (b - a);

  function hexToRgb (hex) {
    return [
      parseInt(hex.slice(1,3), 16),
      parseInt(hex.slice(3,5), 16),
      parseInt(hex.slice(5,7), 16),
    ];
  }

  function pickRgb () {
    const pal = CFG.palettes[0 | rnd(0, CFG.palettes.length)];
    return hexToRgb(pal[0 | rnd(0, pal.length)]);
  }

  function leafRgb (rgb) {
    const [dr, dg, db] = CFG.leafLighten;
    return [
      Math.min(255, rgb[0] + dr),
      Math.min(255, rgb[1] + dg),
      Math.min(255, rgb[2] + db),
    ];
  }

  /* ── vine objects ── */
  let vines = [];

  function mkVine (x, y, dx, dy, depth, delay) {
    const len = snap(rnd(CFG.segLenMin, CFG.segLenMax)) / PX;
    return {
      x: snap(x), y: snap(y),
      dx, dy, depth,
      rgb:        pickRgb(),
      life:       0,
      delay:      delay || 0,
      ms:         len,
      done:       false,
      branchCount:1,
    };
  }

  const LEAF_OFFSETS = [
    [-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1]
  ].map(([ox, oy]) => [ox * PX, oy * PX]);

  function stepVine (v) {
    if (v.done) return;
    if (v.delay > 0) { v.delay--; return; }

    let nx = v.x, ny = v.y;

    if (Math.random() < CFG.turnChance) {
      const perp = Math.random() < 0.5 ? 1 : -1;
      if (v.dx !== 0) ny = v.y + perp * PX;
      else            nx = v.x + perp * PX;
    } else {
      nx = v.x + v.dx * PX;
      ny = v.y + v.dy * PX;
    }

    if (Math.random() < CFG.wanderChance) {
      if (v.dx !== 0) ny += Math.random() < 0.5 ? -PX : PX;
      else            nx += Math.random() < 0.5 ? -PX : PX;
    }

    nx = Math.max(0, Math.min(W - PX, snap(nx)));
    ny = Math.max(0, Math.min(H - PX, snap(ny)));

    const thick = Math.round(PX * (CFG.thickBase + Math.max(0, v.depth) * CFG.thickPerDepth));
    pxFill(snap(v.x), snap(v.y), thick, thick, v.rgb[0], v.rgb[1], v.rgb[2]);

    if (v.life % CFG.leafInterval === 0) {
      const lc = leafRgb(v.rgb);
      const n  = CFG.leafCountMin + Math.floor(rnd(0, CFG.leafCountMax - CFG.leafCountMin));
      for (let i = 0; i < n; i++) {
        const [ox, oy] = LEAF_OFFSETS[0 | rnd(0, LEAF_OFFSETS.length)];
        pxFill(snap(v.x + ox), snap(v.y + oy), PX, PX, lc[0], lc[1], lc[2]);
      }
    }

    v.x = nx; v.y = ny; v.life++;

    if (v.life >= v.ms) {
      v.done = true;
      if (v.depth > 0) {
        for (let i = 0; i < v.branchCount; i++) {
          const dir   = inwardDir(v.x, v.y);
          const child = mkVine(v.x, v.y, dir[0], dir[1], v.depth - 1, i * 5);
          child.branchCount = v.branchCount;
          vines.push(child);
        }
      }
    }
  }

  function inwardDir (x, y) {
    const tx = x < W / 2 ? 1 : -1;
    const ty = y < H / 2 ? 1 : -1;
    const pool = [[tx,0],[0,ty],[1,0],[-1,0],[0,1],[0,-1],[tx,ty]];
    return pool[0 | rnd(0, pool.length)];
  }

  function edgeAnchors (n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const side = 0 | rnd(0, 4);
      if      (side === 0) arr.push({ x: 0,      y: snap(rnd(40, H - 80)), dx:  1, dy:  0 });
      else if (side === 1) arr.push({ x: W - PX,  y: snap(rnd(40, H - 80)), dx: -1, dy:  0 });
      else if (side === 2) arr.push({ x: snap(rnd(0, W)), y: 0,      dx:  0, dy:  1 });
      else                 arr.push({ x: snap(rnd(0, W)), y: H - PX, dx:  0, dy: -1 });
    }
    return arr;
  }

  /* ── trigger system ── */
  const _cooldowns = {};

  function fire (triggerKey) {
    const t = CFG.triggers[triggerKey];
    if (!t || t.clusters === 0) return;
    if (Math.random() > t.chance) return;

    const now = Date.now();
    if (t.cooldownMs && _cooldowns[triggerKey] && now - _cooldowns[triggerKey] < t.cooldownMs) return;
    _cooldowns[triggerKey] = now;

    if (vines.filter(v => !v.done).length >= CFG.maxVines) return;

    const depth   = t.depth != null ? t.depth : CFG.maxDepth;
    const density = Math.min(3, Math.max(1, t.clusters));

    edgeAnchors(t.clusters).forEach((a, i) => {
      const v = mkVine(a.x, a.y, a.dx, a.dy, depth, i * 4);
      v.branchCount = density;
      vines.push(v);
    });
  }

  /* ── main loop ── */
  const STEP_INTERVAL_MS = 55;
  let lastTs = 0, tickAcc = 0;

  function loop (ts) {
    requestAnimationFrame(loop);
    tickAcc += ts - lastTs;
    lastTs = ts;
    if (tickAcc < STEP_INTERVAL_MS) return;
    tickAcc = 0;

    vines.filter(v => !v.done).forEach(stepVine);
    if (vines.length > CFG.maxVines * 2) vines = vines.filter(v => !v.done);
  }
  requestAnimationFrame(loop);

  /* ── DOM bindings ── */
  function on (sel, event, triggerKey) {
    try {
      document.querySelectorAll(sel).forEach(el =>
        el.addEventListener(event, () => fire(triggerKey))
      );
    } catch (e) {}
  }

  const S = CFG.selectors;
  on(S.nav,       'click',      'onNavClick');
  on(S.postTitle, 'click',      'onPostTitleClick');
  on(S.postTitle, 'mouseenter', 'onPostTitleHover');
  on(S.tag,       'click',      'onTagClick');
  on(S.tag,       'mouseenter', 'onTagHover');
  on(S.sidebar,   'click',      'onSidebarClick');
  on(S.sidebar,   'mouseenter', 'onSidebarHover');
  on(S.footer,    'mouseenter', 'onFooterHover');

  window.addEventListener('scroll', () => fire('onScroll'), { passive: true });

  const pt = CFG.triggers.onPassive;
  if (pt && pt.clusters > 0) {
    setInterval(() => fire('onPassive'), pt.intervalMs || 5000);
  }

  setTimeout(() => fire('onLoad'), 400);

})(window.VINE_CFG);
