/* ============================================================
   VINES.JS — REFACTORED with Deterministic Replay
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

  /* ── DECORATION TYPE POOL ────────────────────────────────── */
  decorationPool: [
    'leaves',
    'flowers_red',
    'flowers_yellow',
    'flowers_blue',
  ],

  forceDecorationType: null,

  /* ── TAG → DECORATION MAPPING ───────────────────────────── */
  tagDecorationMap: {
    'man': 'flowers_white',
  },

  /* ── TAG INJECTION ───────────────────────────────────────── */
  tagSource: { type: 'bodyAttr', attr: 'data-tags' },

  /* ── TRIGGERS ───────────────────────────────────────────── */
  triggers: {
    onLoad:           { clusters: 2, depth: 3, chance: 0.5,   cooldownMs: 0     },
    onScroll:         { clusters: 1, depth: 3, chance: 0.004, cooldownMs: 6000  },
    onPassive:        { clusters: 1, depth: 3, chance: 0.5,   intervalMs: 10000 },
    onNavClick:       { clusters: 2, depth: 4, chance: 0.5,   cooldownMs: 0     },
    onPostTitleClick: { clusters: 2, depth: 4, chance: 0.5,   cooldownMs: 0     },
    onPostTitleHover: { clusters: 1, depth: 3, chance: 0.10,  cooldownMs: 8000  },
    onTagClick:       { clusters: 1, depth: 3, chance: 0.5,   cooldownMs: 0     },
    onTagHover:       { clusters: 1, depth: 2, chance: 0.20,  cooldownMs: 1000  },
    onSidebarClick:   { clusters: 1, depth: 3, chance: 0.5,   cooldownMs: 0     },
    onSidebarHover:   { clusters: 1, depth: 2, chance: 0.10,  cooldownMs: 1000  },
    onFooterHover:    { clusters: 1, depth: 2, chance: 0.10,  cooldownMs: 1500  },
  },

  /* ── REPLAY ANIMATION ───────────────────────────────────── */
  replayAnimationMs:   3000,
  replayStepsPerFrame: 1,

  /* ── MOBILE & iOS OPTIMIZATIONS ─────────────────────────── */
  mobileVinesOnly:    true,
  mobileGrowthAreas: ['left', 'right'],

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
  drawPixel(x+dx*px,     y+dy*px,     px,    r,g,b);
  drawPixel(x+dx*px*2,   y+dy*px*2,   px>>1, r,g,b);
}

/* ============================================================
   ENGINE — DETERMINISTIC REPLAY ARCHITECTURE
   ============================================================ */
(function (CFG, TYPES) {
  'use strict';

  /* ── STORAGE KEYS ── */
  const STORAGE_EVENTS  = 'vines_events_v5';
  const SESSION_KEY     = 'vines_session_cfg_v5';
  const RNG_SEED        = 'vines_rng_seed_v5';
  /* Written to localStorage on pagehide/visibilitychange:hidden.
     Read on load and compared to now — if the gap is large enough
     the browser was genuinely closed between visits.            */
  const LS_HIDE_TIME    = 'vines_hide_ts_v5';
  /* Written to sessionStorage on first load of a tab.
     Used as a secondary cross-check and to distinguish
     navigations-within-tab from fresh opens.                   */
  const SS_LOAD_TIME    = 'vines_load_ts_v5';

  /* ── NEW-SESSION DETECTION ───────────────────────────────────
   *
   *  sessionStorage alone is unreliable:
   *    • iOS Safari suspends (not kills) background tabs, keeping
   *      sessionStorage alive across what the user perceives as
   *      a "close and reopen".
   *    • Chromium's "restore last session" or ctrl-shift-t also
   *      restores sessionStorage for closed tabs.
   *
   *  Robust two-signal approach:
   *
   *  A) sessionStorage has no load-timestamp  → definitely new tab.
   *
   *  B) sessionStorage HAS a load-timestamp but localStorage
   *     hide-timestamp is NEWER than that load-timestamp.
   *     This means the tab was hidden (user left / closed browser)
   *     AFTER the tab last loaded → treat as new session.
   *     Threshold: 5 s grace period to ignore same-page nav blur.
   *
   *  Either condition → wipe all persisted vine state.
   *  Within-tab page navigations: SS_LOAD_TIME already exists and
   *  LS_HIDE_TIME is from before or during the current session,
   *  so the B-check won't fire.
   *
   *  This block runs FIRST — before any vine data is loaded.
   * ─────────────────────────────────────────────────────────── */
  const now         = Date.now();
  const ssLoadTime  = parseInt(sessionStorage.getItem(SS_LOAD_TIME) || '0', 10);
  const lsHideTime  = parseInt(localStorage.getItem(LS_HIDE_TIME)   || '0', 10);

  const noLoadStamp  = ssLoadTime === 0;                      // signal A
  const hiddenAfter  = lsHideTime > ssLoadTime + 5000;       // signal B

  const isNewSession = noLoadStamp || hiddenAfter;

  if (isNewSession) {
    /* Stamp this load so same-tab navigations are recognised. */
    try { sessionStorage.setItem(SS_LOAD_TIME, String(now)); } catch (e) {}

    /* Wipe ALL persisted vine state — events, seed, session cfg. */
    try { localStorage.removeItem(STORAGE_EVENTS); }  catch (e) {}
    try { sessionStorage.removeItem(RNG_SEED); }      catch (e) {}
    try { sessionStorage.removeItem(SESSION_KEY); }   catch (e) {}

    console.log('[VINES] New session detected — state cleared.',
      noLoadStamp ? '(no load stamp)' : '(hidden after load)');
  }
  /* else: same tab, navigating within site — keep everything */

  const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

  /* ── DEVICE DETECTION ── */
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = isIOS ||
    /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;
  console.log('[VINES] isMobile:', isMobile, 'isNewSession:', isNewSession);

  /* ── VIEWPORT (iOS compatible) ── */
  function getViewport() {
    if (window.visualViewport) {
      return {
        w: Math.round(window.visualViewport.width),
        h: Math.round(window.visualViewport.height),
      };
    }
    return { w: window.innerWidth, h: window.innerHeight };
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
        raw.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean).forEach(t=>tags.add(t));
        if (tags.size > 0) return tags;
      }
    }
    const onHomepage = (location.pathname==='/' || location.pathname==='/index.html');
    if (onHomepage) return tags;
    document.querySelectorAll('a[href*="/tags/"]').forEach(a => {
      const m = a.href.match(/\/tags\/([^/?#]+)/);
      if (m) tags.add(decodeURIComponent(m[1]).toLowerCase());
      const t = (a.textContent||'').trim().toLowerCase();
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

  let decoPlugin = Object.assign({}, TYPES[activeDecoKey]);

  const activePalettes = (decoPlugin.stemPalettes && decoPlugin.stemPalettes.length)
    ? decoPlugin.stemPalettes : CFG.palettes;

  /* ── RNG — TWO SEPARATE STREAMS ─────────────────────────────
   *  seededRng() — deterministic geometry, resets to seed0 on replay.
   *  liveRng()   — Math.random(), used for chance/cooldown only.
   * ─────────────────────────────────────────────────────────── */
  const seed0 = parseInt(
    sessionStorage.getItem(RNG_SEED) || String(Date.now() & 0x7fffffff), 10
  );
  try { sessionStorage.setItem(RNG_SEED, String(seed0)); } catch (e) {}
  let _rngState = seed0;

  function seededRng() {
    _rngState = (Math.imul(1664525, _rngState) + 1013904223) | 0;
    return ((_rngState >>> 0) / 0xffffffff);
  }

  function resetRng() { _rngState = seed0; }

  const liveRng = Math.random.bind(Math);

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
    const isFirst = (W === 0 && H === 0);
    W = vp.w; H = vp.h;

    if (isMobile && !isFirst) {
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      return;
    }

    canvas.width  = W;
    canvas.height = H;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    initBuffer();
  }

  let resizeTimeout = null;
  let lastW = 0, lastH = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const vp = getViewport();
      if (isMobile && Math.abs(vp.w - lastW) < 50 && Math.abs(vp.h - lastH) < 50) return;
      lastW = vp.w; lastH = vp.h;
      resize();
      if (!isMobile) replayVines();
    }, 200);
  });

  function bufSet(x, y, r, g, b, vw, vh) {
    const _vw = vw||RW(), _vh = vh||RH();
    if (x<0||y<0||x>=_vw||y>=_vh||x>=W||y>=H) return;
    const i=(y*W+x)*4;
    pixelBuf[i]=r; pixelBuf[i+1]=g; pixelBuf[i+2]=b; pixelBuf[i+3]=255;
  }

  function drawPixel(x, y, size, r, g, b, vw, vh) {
    const _vw=vw||RW(), _vh=vh||RH();
    const sx=Math.round(x/CFG.px)*CFG.px, sy=Math.round(y/CFG.px)*CFG.px;
    const s=Math.max(1,Math.round(size));
    ctx.fillStyle=`rgb(${r},${g},${b})`;
    ctx.fillRect(sx,sy,s,s);
    for (let row=sy; row<sy+s; row++) for (let col=sx; col<sx+s; col++) {
      if (col>=0&&col<_vw&&row>=0&&row<_vh) {
        if (col<W&&row<H) { const i=(row*W+col)*4; if(pixelBuf[i+3]===0) coveredPixels++; }
        bufSet(col,row,r,g,b,_vw,_vh);
      }
    }
  }

  function pxFill(x, y, w, h, r, g, b, vw, vh) {
    const _vw=vw||RW(), _vh=vh||RH();
    ctx.fillStyle=`rgb(${r},${g},${b})`;
    ctx.fillRect(x,y,w,h);
    for (let row=y; row<y+h; row++) for (let col=x; col<x+w; col++) {
      if (col>=0&&col<_vw&&row>=0&&row<_vh) {
        if (col<W&&row<H) { const i=(row*W+col)*4; if(pixelBuf[i+3]===0) coveredPixels++; }
        bufSet(col,row,r,g,b,_vw,_vh);
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
    try { localStorage.setItem(STORAGE_EVENTS, JSON.stringify(eventLog)); } catch (e) {}
  }

  /* ── REPLAY VIEWPORT ── */
  let replayW = null, replayH = null;
  function RW() { return replayW !== null ? replayW : W; }
  function RH() { return replayH !== null ? replayH : H; }

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
    const pal = activePalettes[0|Math.floor(seededRng()*activePalettes.length)];
    return hexToRgb(pal[0|Math.floor(seededRng()*pal.length)]);
  }

  let vines = [];

  function mkVine(x, y, dx, dy, depth, delay, isLeft, vw, vh) {
    let sMin=CFG.segLenMin, sMax=CFG.segLenMax;
    if (isLeft) { sMin*=CFG.leftEdge.segLenScale; sMax*=CFG.leftEdge.segLenScale; }
    const len = snap(sMin + seededRng()*(sMax-sMin)) / PX;
    return {
      x:snap(x), y:snap(y), dx, dy, depth,
      rgb:pickRgb(), life:0, delay:delay||0,
      ms:len, done:false, branchCount:1, isLeft:!!isLeft,
      vw:vw||RW(), vh:vh||RH(),
    };
  }

  function stepVine(v) {
    if (v.done) return;
    if (v.delay>0) { v.delay--; return; }
    const VW=v.vw, VH=v.vh;
    if (coveredPixels/(VW*VH) >= CFG.maxCoverageRatio) { v.done=true; return; }

    let nx=v.x, ny=v.y;
    if (seededRng()<CFG.turnChance) {
      const p=seededRng()<0.5?1:-1;
      if (v.dx!==0) ny=v.y+p*PX; else nx=v.x+p*PX;
    } else { nx=v.x+v.dx*PX; ny=v.y+v.dy*PX; }
    if (seededRng()<CFG.wanderChance) {
      if (v.dx!==0) ny+=seededRng()<0.5?-PX:PX;
      else          nx+=seededRng()<0.5?-PX:PX;
    }
    nx=clamp(snap(nx),0,VW-PX); ny=clamp(snap(ny),0,VH-PX);

    const thick=Math.round(PX*(CFG.thickBase+Math.max(0,v.depth)*CFG.thickPerDepth));
    pxFill(snap(v.x),snap(v.y),thick,thick,v.rgb[0],v.rgb[1],v.rgb[2],VW,VH);

    const _dp=(x,y,size,r,g,b)=>drawPixel(x,y,size,r,g,b,VW,VH);
    if (v.life%CFG.leafInterval===0)
      decoPlugin.clusters(_dp,snap(v.x),snap(v.y),PX,v.rgb,CFG,seededRng);

    v.x=nx; v.y=ny; v.life++;

    if (v.life>=v.ms) {
      v.done=true;
      if (v.depth>0) {
        for (let i=0; i<v.branchCount; i++) {
          const dir=inwardDir(v.x,v.y,VW,VH);
          const child=mkVine(v.x,v.y,dir[0],dir[1],v.depth-1,i*5,v.isLeft,VW,VH);
          child.branchCount=v.branchCount;
          vines.push(child);
        }
      }
    }
  }

  function inwardDir(x, y, vw, vh) {
    const tx=x<vw/2?1:-1, ty=y<vh/2?1:-1;
    const pool=[[tx,0],[0,ty],[1,0],[-1,0],[0,1],[0,-1],[tx,ty]];
    return pool[0|Math.floor(seededRng()*pool.length)];
  }

  function edgeAnchors(n, forMobile=false) {
    const arr=[];
    let validSides=[0,1,2,3];
    if (forMobile&&CFG.mobileVinesOnly&&CFG.mobileGrowthAreas) {
      validSides=[];
      const areas=CFG.mobileGrowthAreas;
      if (areas.includes('left'))   validSides.push(0);
      if (areas.includes('right'))  validSides.push(1);
      if (areas.includes('top'))    validSides.push(2);
      if (areas.includes('bottom')) validSides.push(3);
    }
    for (let i=0; i<n; i++) {
      const side=validSides[Math.floor(seededRng()*validSides.length)];
      if      (side===0) arr.push({x:0,       y:snap(seededRng()*(RH()-160)+80), dx:1, dy:0,  left:true });
      else if (side===1) arr.push({x:RW()-PX,  y:snap(seededRng()*(RH()-160)+80), dx:-1,dy:0,  left:false});
      else if (side===2) arr.push({x:snap(seededRng()*RW()), y:0,       dx:0, dy:1,  left:false});
      else               arr.push({x:snap(seededRng()*RW()), y:RH()-PX,  dx:0, dy:-1, left:false});
    }
    return arr;
  }

  function spawnFromTrigger(triggerKey) {
    const t=CFG.triggers[triggerKey];
    if (!t||t.clusters===0) return;
    const depth=t.depth!=null?t.depth:CFG.maxDepth;
    const spawnVW=RW(), spawnVH=RH();
    edgeAnchors(t.clusters,isMobile).forEach((a,i)=>{
      const isLeft=a.left;
      const d=isLeft?Math.max(1,Math.round(depth*CFG.leftEdge.depthScale)):depth;
      const density=Math.max(1,Math.round(Math.min(3,t.clusters)*(isLeft?CFG.leftEdge.clusterScale:1)));
      const v=mkVine(a.x,a.y,a.dx,a.dy,d,i*4,isLeft,spawnVW,spawnVH);
      v.branchCount=density;
      vines.push(v);
    });
  }

  /* ── REPLAY ── */
  let isReplaying=false, replayAnimationId=null;

  function replayVines() {
    clearCanvas();
    vines=[];
    resetRng();
    isReplaying=true;
    if (replayAnimationId) cancelAnimationFrame(replayAnimationId);

    for (const event of eventLog) {
      replayW=event.vw||W;
      replayH=event.vh||H;
      spawnFromTrigger(event.trigger);
    }

    const maxFrames=Math.ceil(CFG.replayAnimationMs/(1000/60));
    let frameCount=0;

    function animateGrowth() {
      for (let i=0; i<CFG.replayStepsPerFrame; i++) {
        vines.forEach(stepVine);
        if (!vines.some(v=>!v.done)) break;
      }
      frameCount++;
      if (vines.some(v=>!v.done)&&frameCount<maxFrames) {
        replayAnimationId=requestAnimationFrame(animateGrowth);
      } else {
        while (vines.some(v=>!v.done)) vines.forEach(stepVine);
        replayW=null; replayH=null;
        isReplaying=false; replayAnimationId=null;
        saveEventLog();
      }
    }
    replayAnimationId=requestAnimationFrame(animateGrowth);
  }

  /* ── TRIGGER FIRING ── */
  const _cd={};

  function fire(triggerKey) {
    const t=CFG.triggers[triggerKey];
    if (!t||t.clusters===0) return;
    if (liveRng()>t.chance) return;
    const now=Date.now();
    if (t.cooldownMs&&_cd[triggerKey]&&now-_cd[triggerKey]<t.cooldownMs) return;
    _cd[triggerKey]=now;
    if (vines.filter(v=>!v.done).length>=CFG.maxVines) return;
    eventLog.push({trigger:triggerKey, vw:W, vh:H});
    saveEventLog();
    spawnFromTrigger(triggerKey);
  }

  function bindTagLinks() {
    document.querySelectorAll('a[href*="/tags/"]').forEach(a => {
      a.addEventListener('click',      ()=>fire('onTagClick'));
      a.addEventListener('mouseenter', ()=>fire('onTagHover'));
    });
  }
  bindTagLinks();

  /* ── MAIN LOOP ── */
  const STEP_MS=55;
  let lastTs=0, tickAcc=0;
  function loop(ts) {
    requestAnimationFrame(loop);
    tickAcc+=ts-lastTs; lastTs=ts;
    if (tickAcc<STEP_MS) return;
    tickAcc=0;
    vines.filter(v=>!v.done).forEach(stepVine);
    if (vines.length>CFG.maxVines*2) vines=vines.filter(v=>!v.done);
  }
  requestAnimationFrame(loop);

  /* ── EVENT BINDINGS ── */
  function on(sel,ev,key) {
    try { document.querySelectorAll(sel).forEach(el=>el.addEventListener(ev,()=>fire(key))); }
    catch(e){}
  }
  const S=CFG.selectors;
  on(S.nav,       'click',      'onNavClick');
  on(S.postTitle, 'click',      'onPostTitleClick');
  on(S.postTitle, 'mouseenter', 'onPostTitleHover');
  on(S.sidebar,   'click',      'onSidebarClick');
  on(S.sidebar,   'mouseenter', 'onSidebarHover');
  on(S.footer,    'mouseenter', 'onFooterHover');
  window.addEventListener('scroll',()=>fire('onScroll'),{passive:true});
  const pt=CFG.triggers.onPassive;
  if (pt&&pt.clusters>0) setInterval(()=>fire('onPassive'),pt.intervalMs||5000);

  /* ── INITIALIZATION ── */
  resize();
  lastW=W; lastH=H;

  if (!eventLog.length) {
    eventLog.push({trigger:'onLoad', vw:W, vh:H});
    saveEventLog();
  }

  setTimeout(()=>replayVines(), 400);

  /* ── HIDE TIMESTAMP — the key to reliable reset detection ────
   *
   *  Written to localStorage (survives tab close) on every hide
   *  event so the next load can compare it against the session's
   *  load timestamp.  Uses both pagehide and visibilitychange for
   *  maximum cross-browser / iOS coverage.
   * ─────────────────────────────────────────────────────────── */
  function stampHide() {
    try { localStorage.setItem(LS_HIDE_TIME, String(Date.now())); } catch(e){}
  }
  window.addEventListener('pagehide',          stampHide);
  window.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden') stampHide(); });

})(window.VINE_CFG, window.VINE_DECORATION_TYPES);
