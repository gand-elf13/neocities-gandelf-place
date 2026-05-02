/* ============================================================
   VINES.JS — pixel vine overlay for Hugo.386
   All configuration is in the VINE_CFG block below.
   ============================================================ */

window.VINE_CFG = {

  /* ── GRID & APPEARANCE ───────────────────────────────────── */
  px:           4,      // pixel grid size in CSS px. 3=fine  4=chunky  6=coarse
  turnChance:   0.11,   // 0–1 prob of a 90° turn each step.  0=straight  0.3=zigzag
  wanderChance: 0.10,   // 0–1 lateral drift each step.       0=rigid  0.15=organic
  leafInterval: 7,      // draw a decoration cluster every N steps
  leafCountMin: 2,      // min decoration pixels per cluster
  leafCountMax: 5,      // max decoration pixels per cluster
  segLenMin:    45,     // min segment length (px, before grid snap)
  segLenMax:    95,     // max segment length (px, grows slightly with takeover %)
  thickBase:    1.0,    // pixel thickness multiplier at max depth.  1=1px  1.5=chunkier
  thickPerDepth:0.55,   // extra thickness added per remaining depth level

  /* ── VINE PALETTES ───────────────────────────────────────── */
  palettes: [
    ['#1a3a0e','#2a5a18','#3a7a22','#4a9a2c','#5ac036'], // forest green
    ['#0e3018','#185020','#226e28','#2c8c30','#36aa38'], // deep moss
    ['#243a10','#345618','#447220','#548e28','#64aa30'], // yellow-green
    ['#143010','#1e4c18','#2a6822','#36842c','#42a036'], // emerald
  ],

  /* ── GROWTH LIMITS ───────────────────────────────────────── */
  maxDepth:     5,
  maxVines:     400,

  /* ── SESSION VARIATION BOUNDARIES ───────────────────────── */
  // Each visit randomises the vine settings within these ranges.
  // The chosen values are stored in sessionStorage and reused for
  // the whole browser session (same tab, refresh, navigation).
  sessionVariance: {
    px:           { min: 5,    max: 5    },   // pixel grid size
    turnChance:   { min: 0.06, max: 0.20 },   // how twisty
    wanderChance: { min: 0.4, max: 0.9 },   // lateral drift
    leafInterval: { min: 5,    max: 12   },   // decoration density
    leafCountMin: { min: 1,    max: 3    },
    leafCountMax: { min: 3,    max: 7    },
    segLenMin:    { min: 30,   max: 60   },
    segLenMax:    { min: 70,   max: 120  },
    thickBase:    { min: 0.8,  max: 1.4  },
    thickPerDepth:{ min: 0.4,  max: 0.8  },
  },

  /* ── DECORATION TYPE SELECTION ───────────────────────────── */
  // One decoration type is chosen per session (or forced by tag).
  // Set to null for pure random pick each session.
  // Set to a key from VINE_DECORATION_TYPES to force a type.
  forceDecorationType: null,

  /* ── TAG → DECORATION MAPPING ───────────────────────────── */
  // If a page tag (from <a href*="/tags/..."> text) matches a key here,
  // the mapped decoration type is used instead of the session default.
  // Tag matching is case-insensitive.
  tagDecorationMap: {
    //'anime':      'flowers_blue',
    //'game':       'flowers_red',
    //'video_game': 'flowers_red',
    //'review':     'flowers_yellow',
    //'tutorial':   'thorns_grey',
    //'technique':  'thorns_brown',
    //'deep':       'flowers_black',
    //'man':        'thorns_white',
    //'man':        'flowers_white',
    //'système':    'thorns_black',
  },

  /* ── TRIGGERS ───────────────────────────────────────────── */
  triggers: {
    onLoad: {
      clusters:   2,
      depth:      3,
      chance:     1.0,
      cooldownMs: 0,
    },
    onScroll: {
      clusters:   1,
      depth:      3,
      chance:     0.04,
      cooldownMs: 1200,
    },
    onPassive: {
      clusters:   1,
      depth:      3,
      chance:     0.5,
      intervalMs: 5000,
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
      chance:     0.30,
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

  /* ── CSS SELECTORS ───────────────────────────────────────── */
  selectors: {
    nav:        '.navbar a, .navbar-nav a, #navbar a',
    postTitle:  '.post-title, h1.entry-title, .list-post-title, article h2 a',
    tag:        '.tag, .tags a, a[href*="/tags/"]',
    sidebar:    '.sidebar a, aside a, #sidebar a, .widget a',
    footer:     'footer, #footer, .site-footer',
  },

};

/* ============================================================
   DECORATION TYPE REGISTRY
   Each entry defines how decorations look when drawn.

   To add a new type:
   1. Add a new key below with the same shape as existing entries.
   2. Optionally map tags to it in VINE_CFG.tagDecorationMap.
   That's it — no engine changes needed.

   Shape of each entry:
   {
     label:    string,             // human-readable name (debug only)
     stemPalettes: [[hex,…],…],   // overrides vine palettes (null = use global)
     clusters: function(ctx, x, y, px, rgb, rng) → void
       -- called each leafInterval to draw the decoration.
       -- ctx: CanvasRenderingContext2D (also call pxFill via closure)
       -- x, y: canvas coords of current vine tip
       -- px: current pixel grid size
       -- rgb: [r,g,b] of the vine segment
       -- rng: seeded random function () → 0..1
   }
   ============================================================ */
window.VINE_DECORATION_TYPES = {

  /* ── default: classic leaves (fallback) ─────────────────── */
  leaves: {
    label: 'Leaves',
    stemPalettes: null, // use global vine palettes
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      const OFFSETS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1]];
      const lr = Math.min(255, rgb[0] + 50);
      const lg = Math.min(255, rgb[1] + 60);
      const lb = Math.min(255, rgb[2] + 10);
      const n = cfg.leafCountMin + Math.floor(rng() * (cfg.leafCountMax - cfg.leafCountMin));
      for (let i = 0; i < n; i++) {
        const [ox, oy] = OFFSETS[Math.floor(rng() * OFFSETS.length)];
        drawPixel(x + ox * px, y + oy * px, px, lr, lg, lb);
      }
    },
  },

  /* ── flowers: red ───────────────────────────────────────── */
  flowers_red: {
    label: 'Red flowers',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'], // standard green stems
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawFlower(drawPixel, x, y, px, rng,
        { rBase: 180, gBase: 10,  bBase: 10  },  // petal colour
        { rBase: 240, gBase: 220, bBase: 20  }    // centre colour
      );
    },
  },

  /* ── flowers: yellow ────────────────────────────────────── */
  flowers_yellow: {
    label: 'Yellow flowers',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawFlower(drawPixel, x, y, px, rng,
        { rBase: 230, gBase: 210, bBase: 0   },
        { rBase: 255, gBase: 140, bBase: 0   }
      );
    },
  },

  /* ── flowers: blue ──────────────────────────────────────── */
  flowers_blue: {
    label: 'Blue flowers',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawFlower(drawPixel, x, y, px, rng,
        { rBase: 30,  gBase: 60,  bBase: 200 },
        { rBase: 220, gBase: 230, bBase: 255 }
      );
    },
  },

  /* ── flowers: white ─────────────────────────────────────── */
  flowers_white: {
    label: 'White flowers',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawFlower(drawPixel, x, y, px, rng,
        { rBase: 230, gBase: 230, bBase: 230 },
        { rBase: 255, gBase: 255, bBase: 180 }
      );
    },
  },

  /* ── flowers: black ─────────────────────────────────────── */
  flowers_black: {
    label: 'Black flowers',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawFlower(drawPixel, x, y, px, rng,
        { rBase: 20,  gBase: 10,  bBase: 25  },
        { rBase: 80,  gBase: 0,   bBase: 80  }
      );
    },
  },

  /* ── thorns: grey ───────────────────────────────────────── */
  thorns_grey: {
    label: 'Grey thorns',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawThorn(drawPixel, x, y, px, rng,
        { rBase: 120, gBase: 125, bBase: 120 }
      );
    },
  },

  /* ── thorns: brown ──────────────────────────────────────── */
  thorns_brown: {
    label: 'Brown thorns',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawThorn(drawPixel, x, y, px, rng,
        { rBase: 110, gBase: 65,  bBase: 20  }
      );
    },
  },

  /* ── thorns: white ──────────────────────────────────────── */
  thorns_white: {
    label: 'White thorns',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawThorn(drawPixel, x, y, px, rng,
        { rBase: 210, gBase: 215, bBase: 210 }
      );
    },
  },

  /* ── thorns: black ──────────────────────────────────────── */
  thorns_black: {
    label: 'Black thorns',
    stemPalettes: [
      ['#1a3a0e','#2a5a18','#3a7a22'],
    ],
    clusters: function (drawPixel, x, y, px, rgb, cfg, rng) {
      _drawThorn(drawPixel, x, y, px, rng,
        { rBase: 15,  gBase: 12,  bBase: 10  }
      );
    },
  },

};

/* ── shared drawing helpers (used by decoration types above) ──
   These are plain functions, not methods, so decoration types
   can call them without any `this` binding issues.
   ─────────────────────────────────────────────────────────── */

/**
 * Draw a simple 5-pixel cross "flower" with a centre pixel.
 * petalCol and centreCol each have { rBase, gBase, bBase }.
 * A small random hue jitter (±20) is applied per flower for variety.
 */
function _drawFlower(drawPixel, x, y, px, rng, petalCol, centreCol) {
  const jitter = () => Math.floor(rng() * 40) - 20;
  const pr = Math.min(255, Math.max(0, petalCol.rBase + jitter()));
  const pg = Math.min(255, Math.max(0, petalCol.gBase + jitter()));
  const pb = Math.min(255, Math.max(0, petalCol.bBase + jitter()));
  const cr = Math.min(255, Math.max(0, centreCol.rBase + jitter()));
  const cg = Math.min(255, Math.max(0, centreCol.gBase + jitter()));
  const cb = Math.min(255, Math.max(0, centreCol.bBase + jitter()));

  // four petals
  drawPixel(x - px, y,      px, pr, pg, pb);
  drawPixel(x + px, y,      px, pr, pg, pb);
  drawPixel(x,      y - px, px, pr, pg, pb);
  drawPixel(x,      y + px, px, pr, pg, pb);
  // centre
  drawPixel(x,      y,      px, cr, cg, cb);
}

/**
 * Draw a small thorn: a spike of 2-3 pixels at a diagonal,
 * with a jitter on the base colour.
 */
function _drawThorn(drawPixel, x, y, px, rng, col) {
  const jitter = () => Math.floor(rng() * 30) - 15;
  const r = Math.min(255, Math.max(0, col.rBase + jitter()));
  const g = Math.min(255, Math.max(0, col.gBase + jitter()));
  const b = Math.min(255, Math.max(0, col.bBase + jitter()));

  // pick a random diagonal direction for the spike
  const dirs = [[-1,-1],[1,-1],[-1,1],[1,1],[-2,-1],[-2,1],[2,-1],[2,1]];
  const [dx, dy] = dirs[Math.floor(rng() * dirs.length)];

  // thorn base (thicker)
  drawPixel(x + dx * px,       y + dy * px,       px,     r, g, b);
  // thorn tip (one pixel further, thinner — half px)
  drawPixel(x + dx * px * 2,   y + dy * px * 2,   px / 2, r, g, b);
}

/* ============================================================
   ENGINE — session seeding, decoration dispatch, canvas
   ============================================================ */
(function (CFG, TYPES) {
  'use strict';

  const STORAGE_KEY   = 'vines_pixels_v3';
  const STORAGE_DIM   = 'vines_dim_v3';
  const SESSION_CFG   = 'vines_session_cfg_v3';  // sessionStorage key

  /* ── 1. session-seeded configuration ──────────────────────
     On first load: pick random values within sessionVariance,
     pick a decoration type, store in sessionStorage.
     On subsequent loads within the same session: reuse them.
  ─────────────────────────────────────────────────────────── */
  let sessionCfg = null;
  try {
    const raw = sessionStorage.getItem(SESSION_CFG);
    if (raw) sessionCfg = JSON.parse(raw);
  } catch (e) {}

  if (!sessionCfg) {
    // Build randomised values within declared variance boundaries
    const variance = CFG.sessionVariance;
    const picked   = {};

    for (const key in variance) {
      const { min, max } = variance[key];
      // integer keys
      if (Number.isInteger(min) && Number.isInteger(max)) {
        picked[key] = min + Math.floor(Math.random() * (max - min + 1));
      } else {
        picked[key] = min + Math.random() * (max - min);
      }
    }

    // pick decoration type
    let decoType = CFG.forceDecorationType;
    if (!decoType) {
      const keys = Object.keys(TYPES);
      decoType = keys[Math.floor(Math.random() * keys.length)];
    }

    sessionCfg = { variance: picked, decoType };

    try { sessionStorage.setItem(SESSION_CFG, JSON.stringify(sessionCfg)); } catch (e) {}
  }

  // Merge session variance into CFG (overrides defaults for this session)
  for (const key in sessionCfg.variance) {
    CFG[key] = sessionCfg.variance[key];
  }

  /* ── 2. detect page tag and possibly override decoration type */
  let activeDecoType = sessionCfg.decoType;

  // scan all tag links on the page
  const tagLinks = document.querySelectorAll('a[href*="/tags/"]');
  for (const a of tagLinks) {
    const tagText = (a.textContent || '').trim().toLowerCase();
    if (CFG.tagDecorationMap && CFG.tagDecorationMap[tagText]) {
      const mapped = CFG.tagDecorationMap[tagText];
      if (TYPES[mapped]) {
        activeDecoType = mapped;
        break; // first matching tag wins
      }
    }
  }

  // fallback
  if (!TYPES[activeDecoType]) activeDecoType = Object.keys(TYPES)[0];

  const decoPlugin = TYPES[activeDecoType];

  // use type-specific stem palettes if defined, else fall back to global
  const activePalettes = (decoPlugin.stemPalettes && decoPlugin.stemPalettes.length)
    ? decoPlugin.stemPalettes
    : CFG.palettes;

  /* ── 3. seeded-ish rng (LCG, seeded from session timestamp) */
  const _seed0 = parseInt(sessionStorage.getItem('vines_rng_seed') || String(Date.now()), 10);
  try { sessionStorage.setItem('vines_rng_seed', String(_seed0)); } catch (e) {}
  let _rngState = _seed0;
  function seededRng () {
    _rngState = (1664525 * _rngState + 1013904223) & 0xffffffff;
    return ((_rngState >>> 0) / 0xffffffff);
  }

  /* ── 4. canvas setup ─────────────────────────────────────── */
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

  let pixelBuf = null;

  function initBuffer () {
    pixelBuf = new Uint8ClampedArray(W * H * 4);
  }

  function bufSet (x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    pixelBuf[i]     = r;
    pixelBuf[i + 1] = g;
    pixelBuf[i + 2] = b;
    pixelBuf[i + 3] = a;
  }

  // drawPixel is what decoration plugins receive — they call this instead of
  // touching ctx directly, so the pixel buffer stays consistent.
  function drawPixel (x, y, size, r, g, b) {
    const sx = Math.round(x / CFG.px) * CFG.px;
    const sy = Math.round(y / CFG.px) * CFG.px;
    const s  = Math.max(1, Math.round(size));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(sx, sy, s, s);
    for (let row = sy; row < sy + s; row++) {
      for (let col = sx; col < sx + s; col++) {
        bufSet(col, row, r, g, b, 255);
      }
    }
  }

  // internal alias used by the vine engine (same as drawPixel but size = PX)
  function pxFill (x, y, w, h, r, g, b) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, w, h);
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

  /* ── 5. persistence ── */
  function saveState () {
    if (!pixelBuf) return;
    try {
      const CHUNK = 0x8000;
      let binary = '';
      for (let i = 0; i < pixelBuf.length; i += CHUNK) {
        binary += String.fromCharCode.apply(null, pixelBuf.subarray(i, i + CHUNK));
      }
      localStorage.setItem(STORAGE_KEY, btoa(binary));
      localStorage.setItem(STORAGE_DIM, JSON.stringify({ w: W, h: H }));
    } catch (e) {}
  }

  function restoreState () {
    try {
      const saved    = localStorage.getItem(STORAGE_KEY);
      const savedDim = localStorage.getItem(STORAGE_DIM);
      if (!saved || !savedDim) return;
      const { w, h } = JSON.parse(savedDim);
      if (w !== W || h !== H) return;

      const binary = atob(saved);
      const bytes  = new Uint8ClampedArray(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      ctx.putImageData(new ImageData(bytes, W, H), 0, 0);
      pixelBuf.set(bytes);
    } catch (e) {}
  }

  resize();
  restoreState();

  window.addEventListener('beforeunload', saveState);
  window.addEventListener('resize', resize);

  /* ── 6. colour helpers ── */
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
    const pal = activePalettes[0 | rnd(0, activePalettes.length)];
    return hexToRgb(pal[0 | rnd(0, pal.length)]);
  }

  /* ── 7. vine objects ── */
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
      // Call the active decoration plugin's clusters function
      decoPlugin.clusters(
        drawPixel,
        snap(v.x), snap(v.y),
        PX,
        v.rgb,
        CFG,
        seededRng
      );
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

  /* ── 8. trigger system ── */
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

  /* ── 9. tag click: switch decoration for burst ───────────── */
  // When a tag link is clicked, we temporarily switch the active
  // decoration type for the burst of vines that fires, if the tag
  // maps to a specific type.
  document.querySelectorAll('a[href*="/tags/"]').forEach(a => {
    a.addEventListener('click', function () {
      const tagText = (this.textContent || '').trim().toLowerCase();
      if (CFG.tagDecorationMap && CFG.tagDecorationMap[tagText]) {
        const mapped = CFG.tagDecorationMap[tagText];
        if (TYPES[mapped]) {
          // store the original and temporarily swap
          const orig = activeDecoType;
          Object.assign(decoPlugin, TYPES[mapped]);
          setTimeout(() => Object.assign(decoPlugin, TYPES[orig]), 3000);
        }
      }
      fire('onTagClick');
    });
  });

  /* ── 10. main loop ── */
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

  /* ── 11. DOM bindings ── */
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
  // tag events are handled manually above (click) + below (hover)
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

})(window.VINE_CFG, window.VINE_DECORATION_TYPES);
