/* ============================================================
   VINES.JS — REFACTORED with Deterministic Replay
   
   NEW APPROACH: Store seeds + events, regenerate vines on load
   - Fixes: slow page load, viewport distortion
   - Storage: bytes instead of megabytes
   - Replay: instant reconstruction at any resolution
   ============================================================ */

window.VINE_CFG = {

  /* ── GRID & APPEARANCE ───────────────────────────────────── */
  px:           4,
  turnChance:   0.11,
  wanderChance: 0.10,
  leafInterval: 7,
  leafCountMin: 2,
  leafCountMax: 5,
  segLenMin:    45,
  segLenMax:    95,
  thickBase:    1.0,
  thickPerDepth:0.55,

  /* ── VINE PALETTES ───────────────────────────────────────── */
  palettes: [
    ['#1a3a0e','#2a5a18','#3a7a22','#4a9a2c','#5ac036'],
    ['#0e3018','#185020','#226e28','#2c8c30','#36aa38'],
    ['#243a10','#345618','#447220','#548e28','#64aa30'],
    ['#143010','#1e4c18','#2a6822','#36842c','#42a036'],
  ],

  /* ── GROWTH LIMITS ───────────────────────────────────────── */
  maxDepth:  5,
  maxVines:  400,

  /* ── COVERAGE CAP ────────────────────────────────────────── */
  maxCoverageRatio: 0.30,

  /* ── LEFT-EDGE GROWTH LIMIT ──────────────────────────────── */
  leftEdge: {
    depthScale:   0.4,
    clusterScale: 0.5,
    segLenScale:  0.5,
  },

  /* ── SESSION VARIATION BOUNDARIES ───────────────────────── */
  sessionVariance: {
    px:           { min: 3,    max: 4    },
    turnChance:   { min: 0.06, max: 0.10 },
    wanderChance: { min: 0.40, max: 0.90 },
    leafInterval: { min: 5,    max: 12   },
    leafCountMin: { min: 1,    max: 3    },
    leafCountMax: { min: 3,    max: 7    },
    segLenMin:    { min: 30,   max: 60   },
    segLenMax:    { min: 70,   max: 120  },
    thickBase:    { min: 0.8,  max: 1.4  },
    thickPerDepth:{ min: 0.4,  max: 0.8  },
  },

  /* ── DECORATION TYPE POOL ────────────────────────────────– */
  decorationPool: [
    'leaves',
    'flowers_red',
    'flowers_yellow',
    'flowers_blue',
  ],

  forceDecorationType: null,

  /* ── TAG → DECORATION MAPPING ───────────────────────────── */
  tagDecorationMap: {
    'man':        'flowers_white',
  },

  /* ── TAG INJECTION ───────────────────────────────────────── */
  tagSource: { type: 'bodyAttr', attr: 'data-tags' },

  /* ── TRIGGERS ───────────────────────────────────────────── */
  triggers: {
    onLoad:           { clusters: 2, depth: 3, chance: 1.0, cooldownMs: 0    },
    onScroll:         { clusters: 1, depth: 3, chance: 0.04, cooldownMs: 3000 },
    onPassive:        { clusters: 1, depth: 3, chance: 0.5,  intervalMs: 10000 },
    onNavClick:       { clusters: 2, depth: 4, chance: 1.0, cooldownMs: 0    },
    onPostTitleClick: { clusters: 2, depth: 4, chance: 1.0, cooldownMs: 0    },
    onPostTitleHover: { clusters: 1, depth: 3, chance: 0.30, cooldownMs: 8000  },
    onTagClick:       { clusters: 1, depth: 3, chance: 1.0, cooldownMs: 0    },
    onTagHover:       { clusters: 1, depth: 2, chance: 0.20, cooldownMs: 1000 },
    onSidebarClick:   { clusters: 1, depth: 3, chance: 1.0, cooldownMs: 0    },
    onSidebarHover:   { clusters: 1, depth: 2, chance: 0.20, cooldownMs: 1000 },
    onFooterHover:    { clusters: 1, depth: 2, chance: 0.25, cooldownMs: 1500 },
  },

  /* ── REPLAY ANIMATION ───────────────────────────────────── */
  replayAnimationMs: 600,  // How long the draw animation takes (milliseconds)
  replayStepsPerFrame: 5,  // How many vine growth steps per animation frame

  /* ── MOBILE & iOS OPTIMIZATIONS ────────────────────────── */
  // On mobile, only grow vines from center (top/bottom), skip left/right edges
  mobileVinesOnly: true,           // Enable mobile-specific vine placement
  mobileGrowthAreas: ['left', 'right'],  // Only grow from these edges on mobile

  /* ── CSS SELECTORS ───────────────────────────────────────── */
  selectors: {
    nav:       '.navbar a, .navbar-nav a, #navbar a',
    postTitle: '.post-title, h1.entry-title, .list-post-title, article h2 a',
    tag:       'a[href*="/tags/"]',
    sidebar:   '.bs-docs-sidebar a, .sidebar a, aside a',
    footer:    'footer, #footer, .site-footer',
  },

};

/* ============================================================
   DECORATION TYPE REGISTRY
   ============================================================ */
window.VINE_DECORATION_TYPES = {

  leaves: {
    label: 'Leaves',
    stemPalettes: null,
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      const OFFS = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1]];
      const lr = Math.min(255, rgb[0]+50), lg = Math.min(255, rgb[1]+60), lb = Math.min(255, rgb[2]+10);
      const n = cfg.leafCountMin + Math.floor(rng()*(cfg.leafCountMax-cfg.leafCountMin));
      for (let i = 0; i < n; i++) {
        const [ox,oy] = OFFS[Math.floor(rng()*OFFS.length)];
        drawPixel(x+ox*px, y+oy*px, px, lr, lg, lb);
      }
    },
  },

  flowers_red: {
    label: 'Red flowers',
    stemPalettes: [['#1a3a0e','#2a5a18','#3a7a22']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _flower(drawPixel, x, y, px, rng, {r:180,g:10, b:10 }, {r:240,g:220,b:20 });
    },
  },

  flowers_yellow: {
    label: 'Yellow flowers',
    stemPalettes: [['#1a3a0e','#2a5a18','#3a7a22']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _flower(drawPixel, x, y, px, rng, {r:230,g:210,b:0  }, {r:255,g:140,b:0  });
    },
  },

  flowers_blue: {
    label: 'Blue flowers',
    stemPalettes: [['#1a3a0e','#2a5a18','#3a7a22']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _flower(drawPixel, x, y, px, rng, {r:30, g:60, b:200}, {r:220,g:230,b:255});
    },
  },

  flowers_white: {
    label: 'White flowers',
    stemPalettes: [['#1a3a0e','#2a5a18','#4a9a2c']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _flower(drawPixel, x, y, px, rng, {r:230,g:230,b:230}, {r:255,g:255,b:180});
    },
  },

  flowers_black: {
    label: 'Black flowers',
    stemPalettes: [['#0a1a06','#102808','#16380a','#1c480c']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _flower(drawPixel, x, y, px, rng, {r:20, g:10, b:25 }, {r:80, g:0,  b:80 });
    },
  },

  thorns_grey: {
    label: 'Grey thorns',
    stemPalettes: [['#1a2a1a','#2a3a2a','#3a4a3a']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _thorn(drawPixel, x, y, px, rng, {r:120,g:125,b:120});
    },
  },

  thorns_brown: {
    label: 'Brown thorns',
    stemPalettes: [['#1a1206','#2a1e08','#3a2a0a','#4a360c']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _thorn(drawPixel, x, y, px, rng, {r:110,g:65, b:20 });
    },
  },

  thorns_white: {
    label: 'White thorns',
    stemPalettes: [['#1a3a0e','#2a5a18','#3a7a22']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _thorn(drawPixel, x, y, px, rng, {r:210,g:215,b:210});
    },
  },

  thorns_black: {
    label: 'Black thorns',
    stemPalettes: [['#0a1a06','#102808','#16380a']],
    clusters(drawPixel, x, y, px, rgb, cfg, rng) {
      _thorn(drawPixel, x, y, px, rng, {r:15, g:12, b:10 });
    },
  },

};

/* ── shared drawing helpers ─────────────────────────────────── */

function _flower(drawPixel, x, y, px, rng, petal, centre) {
  const j = () => Math.floor(rng()*40)-20;
  const c = v => Math.min(255,Math.max(0,v));
  const pr=c(petal.r+j()),  pg=c(petal.g+j()),  pb=c(petal.b+j());
  const cr=c(centre.r+j()), cg=c(centre.g+j()), cb=c(centre.b+j());
  drawPixel(x-px, y,    px, pr,pg,pb);
  drawPixel(x+px, y,    px, pr,pg,pb);
  drawPixel(x,    y-px, px, pr,pg,pb);
  drawPixel(x,    y+px, px, pr,pg,pb);
  drawPixel(x,    y,    px, cr,cg,cb);
}

function _thorn(drawPixel, x, y, px, rng, col) {
  const j = () => Math.floor(rng()*30)-15;
  const c = v => Math.min(255,Math.max(0,v));
  const r=c(col.r+j()), g=c(col.g+j()), b=c(col.b+j());
  const dirs=[[-1,-1],[1,-1],[-1,1],[1,1],[-2,-1],[-2,1],[2,-1],[2,1]];
  const [dx,dy] = dirs[Math.floor(rng()*dirs.length)];
  drawPixel(x+dx*px,     y+dy*px,     px,      r,g,b);
  drawPixel(x+dx*px*2,   y+dy*px*2,   px>>1,   r,g,b);
}

/* ============================================================
   ENGINE — DETERMINISTIC REPLAY ARCHITECTURE
   ============================================================ */
(function (CFG, TYPES) {
  'use strict';

  const STORAGE_SEED = 'vines_seed_v5';
  const STORAGE_EVENTS = 'vines_events_v5';
  const SESSION_KEY = 'vines_session_cfg_v5';
  const RNG_SEED = 'vines_rng_seed_v5';

  const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

  /* ── DEVICE DETECTION ── */
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  /* ── VIEWPORT (iOS compatible) ── */
  function getViewport() {
    if (window.visualViewport) {
      return {
        w: Math.round(window.visualViewport.width),
        h: Math.round(window.visualViewport.height)
      };
    }
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  }

  /* ── TAG DETECTION ── */
  function resolvePageTags() {
    const tags = new Set();

    if (CFG.tagSource) {
      let raw = null;
      if (CFG.tagSource.type === 'bodyAttr')
        raw = document.body.getAttribute(CFG.tagSource.attr);
      else if (CFG.tagSource.type === 'meta') {
        const m = document.querySelector(`meta[name="${CFG.tagSource.name}"]`);
        if (m) raw = m.getAttribute('content');
      }
      if (raw) {
        raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).forEach(t => tags.add(t));
        if (tags.size > 0) return tags;
      }
    }

    const onHomepage = (location.pathname === '/' || location.pathname === '/index.html');
    if (onHomepage) return tags;

    document.querySelectorAll('a[href*="/tags/"]').forEach(a => {
      const m = a.href.match(/\/tags\/([^/?#]+)/);
      if (m) tags.add(decodeURIComponent(m[1]).toLowerCase());
      const t = (a.textContent || '').trim().toLowerCase();
      if (t) tags.add(t);
    });

    return tags;
  }

  const pageTags = resolvePageTags();

  function decoFromTags(tags) {
    for (const tag of tags) {
      const mapped = CFG.tagDecorationMap[tag];
      if (mapped && TYPES[mapped]) return mapped;
    }
    return null;
  }

  /* ── SESSION CONFIG ── */
  let sessionCfg = null;
  try { sessionCfg = JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (e) {}

  if (!sessionCfg) {
    const picked = {};
    for (const key in CFG.sessionVariance) {
      const { min, max } = CFG.sessionVariance[key];
      picked[key] = (Number.isInteger(min) && Number.isInteger(max))
        ? min + Math.floor(Math.random() * (max - min + 1))
        : min + Math.random() * (max - min);
    }
    const pool    = (CFG.decorationPool || Object.keys(TYPES)).filter(k => TYPES[k]);
    const rndType = pool[Math.floor(Math.random() * pool.length)];
    sessionCfg = { variance: picked, decoType: CFG.forceDecorationType || rndType };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionCfg)); } catch (e) {}
  }

  for (const key in sessionCfg.variance) CFG[key] = sessionCfg.variance[key];

  const pageTagDeco = decoFromTags(pageTags);
  let activeDecoKey = pageTagDeco || sessionCfg.decoType;
  if (!TYPES[activeDecoKey]) activeDecoKey = Object.keys(TYPES)[0];

  const decoPlugin = Object.assign({}, TYPES[activeDecoKey]);

  const activePalettes = (decoPlugin.stemPalettes && decoPlugin.stemPalettes.length)
    ? decoPlugin.stemPalettes : CFG.palettes;

  /* ── GLOBAL RNG STATE ── */
  const seed0 = parseInt(sessionStorage.getItem(RNG_SEED) || String(Date.now() & 0x7fffffff), 10);
  try { sessionStorage.setItem(RNG_SEED, String(seed0)); } catch (e) {}
  let _rngState = seed0;

  function seededRng() {
    _rngState = (Math.imul(1664525, _rngState) + 1013904223) | 0;
    return ((_rngState >>> 0) / 0xffffffff);
  }

  function resetRng() {
    _rngState = seed0;
  }

  /* ── CANVAS SETUP ── */
  let W = 0, H = 0;
  const canvas = document.createElement('canvas');
  canvas.id = 'vine-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    pointerEvents: 'none', zIndex: '9999', imageRendering: 'pixelated',
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let pixelBuf = null;
  let coveredPixels = 0;

  function initBuffer() {
    pixelBuf = new Uint8ClampedArray(W * H * 4);
    coveredPixels = 0;
  }

  function resize() {
    const vp = getViewport();
    const newW = vp.w;
    const newH = vp.h;

    const isFirst = (W === 0 && H === 0);

    // store old canvas content BEFORE resize (mobile only)
    let oldCanvas = null;
    if (isMobile && !isFirst) {
      oldCanvas = document.createElement('canvas');
      oldCanvas.width = W;
      oldCanvas.height = H;
      oldCanvas.getContext('2d').drawImage(canvas, 0, 0);
    }

    W = newW;
    H = newH;

    canvas.width = W;
    canvas.height = H;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    // ONLY reset buffer if NOT mobile
    if (!isMobile || isFirst) {
      initBuffer();
    }

    // restore pixels on mobile
    if (isMobile && oldCanvas) {
      ctx.drawImage(oldCanvas, 0, 0);
    }
  }

  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();

      if (!isMobile) {
        replayVines();
      }

    }, 200);
  });
  function bufSet(x, y, r, g, b) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    pixelBuf[i]=r; pixelBuf[i+1]=g; pixelBuf[i+2]=b; pixelBuf[i+3]=255;
  }

  function isCapped() {
    return (coveredPixels / (W * H)) >= CFG.maxCoverageRatio;
  }

  function drawPixel(x, y, size, r, g, b) {
    const sx = Math.round(x / CFG.px) * CFG.px;
    const sy = Math.round(y / CFG.px) * CFG.px;
    const s  = Math.max(1, Math.round(size));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(sx, sy, s, s);
    for (let row = sy; row < sy+s; row++) {
      for (let col = sx; col < sx+s; col++) {
        if (col >= 0 && col < W && row >= 0 && row < H) {
          const i = (row*W+col)*4;
          if (pixelBuf[i+3] === 0) coveredPixels++;
          bufSet(col, row, r, g, b);
        }
      }
    }
  }

  function pxFill(x, y, w, h, r, g, b) {
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, w, h);
    for (let row = y; row < y+h; row++) {
      for (let col = x; col < x+w; col++) {
        if (col >= 0 && col < W && row >= 0 && row < H) {
          const i = (row*W+col)*4;
          if (pixelBuf[i+3] === 0) coveredPixels++;
          bufSet(col, row, r, g, b);
        }
      }
    }
  }

  /* ── SAVE/LOAD EVENT LOG ── */
  let eventLog = [];
  try {
    const saved = localStorage.getItem(STORAGE_EVENTS);
    if (saved) eventLog = JSON.parse(saved);
  } catch (e) {}

  function saveEventLog() {
    try {
      localStorage.setItem(STORAGE_EVENTS, JSON.stringify(eventLog));
    } catch (e) {}
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
    initBuffer();
  }

  /* ── VINE SYSTEM ── */
  const PX   = CFG.px;
  const snap = v => Math.round(v / PX) * PX;

  function hexToRgb(hex) {
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }

  function pickRgb() {
    const pal = activePalettes[0|Math.floor(seededRng() * activePalettes.length)];
    return hexToRgb(pal[0|Math.floor(seededRng() * pal.length)]);
  }

  let vines = [];
  let turboMode = false;

  function mkVine(x, y, dx, dy, depth, delay, isLeft) {
    let sMin = CFG.segLenMin, sMax = CFG.segLenMax;
    if (isLeft) { sMin *= CFG.leftEdge.segLenScale; sMax *= CFG.leftEdge.segLenScale; }
    const len = snap(
      sMin + seededRng() * (sMax - sMin)
    ) / PX;
    return {
      x: snap(x), y: snap(y), dx, dy, depth,
      rgb: pickRgb(), life: 0, delay: delay||0,
      ms: len, done: false, branchCount: 1, isLeft: !!isLeft,
    };
  }

  function stepVine(v) {
    if (v.done) return;
    if (v.delay > 0) { v.delay--; return; }
    if (isCapped()) { v.done = true; return; }

    let nx = v.x, ny = v.y;
    if (seededRng() < CFG.turnChance) {
      const p = seededRng() < 0.5 ? 1 : -1;
      if (v.dx !== 0) ny = v.y + p*PX; else nx = v.x + p*PX;
    } else {
      nx = v.x + v.dx*PX; ny = v.y + v.dy*PX;
    }
    if (seededRng() < CFG.wanderChance) {
      if (v.dx !== 0) ny += seededRng()<0.5 ? -PX : PX;
      else            nx += seededRng()<0.5 ? -PX : PX;
    }

    nx = clamp(snap(nx), 0, W-PX);
    ny = clamp(snap(ny), 0, H-PX);

    const thick = Math.round(PX * (CFG.thickBase + Math.max(0, v.depth) * CFG.thickPerDepth));
    pxFill(snap(v.x), snap(v.y), thick, thick, v.rgb[0], v.rgb[1], v.rgb[2]);

    if (v.life % CFG.leafInterval === 0)
      decoPlugin.clusters(drawPixel, snap(v.x), snap(v.y), PX, v.rgb, CFG, seededRng);

    v.x = nx; v.y = ny; v.life++;

    if (v.life >= v.ms) {
      v.done = true;
      if (v.depth > 0) {
        for (let i = 0; i < v.branchCount; i++) {
          const dir = inwardDir(v.x, v.y);
          const child = mkVine(v.x, v.y, dir[0], dir[1], v.depth-1, i*5, v.isLeft);
          child.branchCount = v.branchCount;
          vines.push(child);
        }
      }
    }
  }

  function inwardDir(x, y) {
    const tx = x < W/2 ? 1 : -1, ty = y < H/2 ? 1 : -1;
    const pool = [[tx,0],[0,ty],[1,0],[-1,0],[0,1],[0,-1],[tx,ty]];
    return pool[0|Math.floor(seededRng()*pool.length)];
  }

  function edgeAnchors(n, forMobile = false) {
    const arr = [];
    
    // Determine which edges are valid for this device
    let validSides = [0, 1, 2, 3];  // all: left, right, top, bottom
    
    if (forMobile && CFG.mobileVinesOnly && CFG.mobileGrowthAreas) {
      // On mobile, only use specified growth areas
      validSides = [];
      const areas = CFG.mobileGrowthAreas;
      if (areas.includes('left')) validSides.push(0);
      if (areas.includes('right')) validSides.push(1);
      if (areas.includes('top')) validSides.push(2);
      if (areas.includes('bottom')) validSides.push(3);
    }
    
    for (let i = 0; i < n; i++) {
      // Pick random side from valid sides only
      const side = validSides[Math.floor(seededRng() * validSides.length)];
      
      if      (side===0) arr.push({x:0, y:snap(seededRng()*(H-160)+80), dx:1,dy:0,left:true});
      else if (side===1) arr.push({x:W-PX, y:snap(seededRng()*(H-160)+80), dx:-1,dy:0,left:false});
      else if (side===2) arr.push({x:snap(seededRng()*W), y:0, dx:0,dy:1,left:false});
      else               arr.push({x:snap(seededRng()*W), y:H-PX, dx:0,dy:-1,left:false});
    }
    return arr;
  }

  function spawnFromTrigger(triggerKey) {
    const t = CFG.triggers[triggerKey];
    if (!t || t.clusters===0) return;

    const depth = t.depth != null ? t.depth : CFG.maxDepth;

    edgeAnchors(t.clusters, isMobile).forEach((a, i) => {
      const isLeft  = a.left;
      const d       = isLeft ? Math.max(1, Math.round(depth * CFG.leftEdge.depthScale)) : depth;
      const density = Math.max(1, Math.round(Math.min(3, t.clusters) * (isLeft ? CFG.leftEdge.clusterScale : 1)));
      const v = mkVine(a.x, a.y, a.dx, a.dy, d, i*4, isLeft);
      v.branchCount = density;
      vines.push(v);
    });
  }

  /* 🔑 REPLAY: regenerate all vines from event log with smooth animation */
  let isReplaying = false;
  let replayAnimationId = null;

  function replayVines() {
    clearCanvas();
    vines = [];
    resetRng();
    isReplaying = true;

    if (replayAnimationId) cancelAnimationFrame(replayAnimationId);

    // Execute all logged events to spawn vines
    for (const event of eventLog) {
      spawnFromTrigger(event.trigger);
    }

    // Calculate animation parameters
    const targetMs = CFG.replayAnimationMs;
    const stepsPerFrame = CFG.replayStepsPerFrame;
    const frameMs = 1000 / 60;  // ~16.67ms per frame at 60fps
    const maxFrames = Math.ceil(targetMs / frameMs);

    // Animate the growth frame by frame
    let frameCount = 0;

    function animateGrowth() {
      // Step all vines multiple times per frame for smooth progression
      for (let i = 0; i < stepsPerFrame; i++) {
        vines.forEach(stepVine);
        if (!vines.some(v => !v.done)) break;
      }

      frameCount++;

      if (vines.some(v => !v.done) && frameCount < maxFrames) {
        replayAnimationId = requestAnimationFrame(animateGrowth);
      } else {
        // Finish any remaining vines instantly
        while (vines.some(v => !v.done)) {
          vines.forEach(stepVine);
        }
        isReplaying = false;
        replayAnimationId = null;
        saveEventLog();
      }
    }

    replayAnimationId = requestAnimationFrame(animateGrowth);
  }

  const _cd = {};

  function fire(triggerKey) {
    const t = CFG.triggers[triggerKey];
    if (!t || t.clusters===0) return;
    if (seededRng() > t.chance) return;

    const now = Date.now();
    if (t.cooldownMs && _cd[triggerKey] && now - _cd[triggerKey] < t.cooldownMs) return;
    _cd[triggerKey] = now;

    if (vines.filter(v => !v.done).length >= CFG.maxVines) return;

    // Log event
    eventLog.push({ trigger: triggerKey });
    saveEventLog();

    // Spawn immediately (live mode)
    spawnFromTrigger(triggerKey);
  }

  function bindTagLinks() {
    document.querySelectorAll('a[href*="/tags/"]').forEach(a => {
      a.addEventListener('click', () => fire('onTagClick'));
      a.addEventListener('mouseenter', () => fire('onTagHover'));
    });
  }
  bindTagLinks();

  /* ── MAIN LOOP ── */
  const STEP_MS = 55;
  let lastTs = 0, tickAcc = 0;

  function loop(ts) {
    requestAnimationFrame(loop);

    tickAcc += ts - lastTs; lastTs = ts;
    if (tickAcc < STEP_MS) return;
    tickAcc = 0;

    vines.filter(v => !v.done).forEach(stepVine);
    if (vines.length > CFG.maxVines * 2) vines = vines.filter(v => !v.done);
  }
  requestAnimationFrame(loop);

  /* ── EVENT BINDINGS ── */
  function on(sel, ev, key) {
    try { document.querySelectorAll(sel).forEach(el => el.addEventListener(ev, () => fire(key))); }
    catch (e) {}
  }

  const S = CFG.selectors;
  on(S.nav,'click','onNavClick');
  on(S.postTitle,'click','onPostTitleClick');
  on(S.postTitle,'mouseenter','onPostTitleHover');
  on(S.sidebar,'click','onSidebarClick');
  on(S.sidebar,'mouseenter','onSidebarHover');
  on(S.footer,'mouseenter','onFooterHover');

  window.addEventListener('scroll', () => fire('onScroll'), {passive:true});

  const pt = CFG.triggers.onPassive;
  if (pt && pt.clusters > 0) setInterval(() => fire('onPassive'), pt.intervalMs||5000);

  /* ── INITIALIZATION ── */
  resize();

  /* ensure onLoad is part of deterministic history BEFORE replay */
  if (!eventLog.length) {
    eventLog.push({ trigger: 'onLoad' });
    saveEventLog();
  }

  setTimeout(() => {
    replayVines();
  }, 400);

  /* ── TEST AUTO-RESET (EVERY 60s) ── */
  setInterval(() => {
    console.log('[VINES] FULL test reset (including generation + type)');

    /* ── 1. CLEAR PERSISTED DATA ── */
    localStorage.removeItem('vines_events_v5');

    sessionStorage.removeItem('vines_rng_seed_v5');
    sessionStorage.removeItem('vines_session_cfg_v5');

    /* ── 2. RESET IN-MEMORY STATE ── */
    eventLog = [];
    vines = [];

    /* ── 3. RESET DECORATION / GENERATION STATE ── */
    sessionCfg = null;          // IMPORTANT: forces re-roll
    activeDecoKey = null;       // wipe current vine type
    decoPlugin = null;

    /* ── 4. CLEAR CANVAS ── */
    clearCanvas();

    /* ── 5. FORCE NEW RNG SEED ── */
    const newSeed = (Date.now() + Math.random() * 1e6) | 0;
    sessionStorage.setItem('vines_rng_seed_v5', String(newSeed));

    /* ── 6. REGENERATE SESSION CONFIG (NEW TYPE + VARIANCE) ── */
    const picked = {};
    for (const key in CFG.sessionVariance) {
      const { min, max } = CFG.sessionVariance[key];
      picked[key] = (Number.isInteger(min) && Number.isInteger(max))
        ? min + Math.floor(Math.random() * (max - min + 1))
        : min + Math.random() * (max - min);
    }

    const pool = (CFG.decorationPool || Object.keys(window.VINE_DECORATION_TYPES))
      .filter(k => window.VINE_DECORATION_TYPES[k]);

    const rndType = pool[Math.floor(Math.random() * pool.length)];

    sessionCfg = {
      variance: picked,
      decoType: CFG.forceDecorationType || rndType
    };

    sessionStorage.setItem('vines_session_cfg_v5', JSON.stringify(sessionCfg));

    /* ── 7. RESTART CLEAN STATE ── */
    eventLog.push({ trigger: 'onLoad' });
    saveEventLog();

    replayVines();

  }, 10 * 1000);

  const DAY_MS = 10 * 1000;
  const last = localStorage.getItem('vines_last_reset_time');

  if (!last || Date.now() - Number(last) > DAY_MS) {
    localStorage.removeItem('vines_events_v5');
    sessionStorage.removeItem('vines_rng_seed_v5');
    sessionStorage.removeItem('vines_session_cfg_v5');
    localStorage.setItem('vines_last_reset_time', String(Date.now()));
  }
  /* ── PERSISTENCE ── */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveEventLog();
  });

})(window.VINE_CFG, window.VINE_DECORATION_TYPES);
