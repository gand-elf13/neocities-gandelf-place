(function() {
  const config = {
    emberCount: 22,
    smokeTrailLength: 3,
    smokeLagRatio: 0.1,
    churnCount: 60,
    plumeCount: 12,
    burnColors: ["#7d7d78", "#ababa4", "#d9d9d2", "#f5f4ec", "#ffffff"],
    ashColor: "#c9c4b4",
    smokeColors: ["#ccd4ba", "#a2ad8e", "#78826b"],
    emberMinSize: 4,
    emberMaxSize: 8,
    minSpeed: 13,
    maxSpeed: 22,
    riseHeightRatio: 0.85,
    driftStrength: 50,
    swayStrength: 30,
    zIndex: 9999,
    pixelated: true,
    glow: {
      enabled: true,
      height: 120,
      color: "rgba(216, 232, 206, 0.32)",
      flickerDuration: 1.8
    }
  };

  const wpContainer = document.createElement('div');
  wpContainer.id = 'phosphorus-container';
  wpContainer.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: ${config.zIndex};
    overflow: hidden;
  `;
  document.body.appendChild(wpContainer);

  const pixelStyle = config.pixelated ? 'image-rendering: pixelated; shape-rendering: crispEdges;' : '';

  const flickerDurations = ["1.8s", "2.6s", "2.2s", "1.4s"];
  const flickerStyleSheet = document.createElement('style');
  let flickerCss = '';
  flickerDurations.forEach((_, i) => {
    flickerCss += `
      @keyframes wp-flicker-${i} {
        0%, 100% { opacity: 1;    transform: scale(1); }
        25%      { opacity: 0.84; transform: scale(1.07); }
        50%      { opacity: 1;    transform: scale(0.96); }
        75%      { opacity: 0.87; transform: scale(1.05); }
      }
    `;
  });
  flickerStyleSheet.textContent = flickerCss;
  document.head.appendChild(flickerStyleSheet);

  if (config.glow.enabled) {
    const glowStyleSheet = document.createElement('style');
    glowStyleSheet.textContent = `
      @keyframes phosphorus-glow-flicker {
        0%   { opacity: 0.45; transform: translateX(0) scaleY(1); }
        16%  { opacity: 0.68; transform: translateX(-2%) scaleY(1.1); }
        34%  { opacity: 0.5;  transform: translateX(1.5%) scaleY(0.92); }
        53%  { opacity: 0.72; transform: translateX(-1%) scaleY(1.06); }
        71%  { opacity: 0.48; transform: translateX(2%) scaleY(0.96); }
        100% { opacity: 0.45; transform: translateX(0) scaleY(1); }
      }
    `;
    document.head.appendChild(glowStyleSheet);

    const glow = document.createElement('div');
    glow.id = 'phosphorus-glow';
    glow.style.cssText = `
      position: absolute;
      bottom: -20px;
      left: -5%;
      width: 110%;
      height: ${config.glow.height}px;
      background:
        radial-gradient(ellipse 40% 100% at 28% 100%, ${config.glow.color}, rgba(216,232,206,0) 70%),
        radial-gradient(ellipse 35% 100% at 68% 100%, ${config.glow.color}, rgba(216,232,206,0) 70%),
        linear-gradient(to top, rgba(154, 178, 142, 0.3), rgba(200, 218, 188, 0) 80%);
      transform-origin: bottom center;
      animation: phosphorus-glow-flicker ${config.glow.flickerDuration}s ease-in-out infinite;
      pointer-events: none;
    `;
    wpContainer.appendChild(glow);
  }

  function createBurningGroup() {
    const size = Math.round(Math.random() * (config.emberMaxSize - config.emberMinSize) + config.emberMinSize);
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
    const rise = window.innerHeight * config.riseHeightRatio;
    const bias = Math.random() < 0.5 ? -1 : 1;
    const drift = bias * config.driftStrength * (0.4 + Math.random() * 0.6);
    const sway = config.swayStrength * (0.5 + Math.random() * 0.5);
    const groupId = Math.random().toString(36).substr(2, 9);
    const baseDelay = -Math.random() * duration;

    const pulses = [27, 50, 71, 88];
    const markPs = [0];
    pulses.forEach(pc => {
      markPs.push(pc - 5, pc, pc + 6);
    });
    markPs.push(100);
    const sortedMarks = [...new Set(markPs)].sort((a, b) => a - b);

    const weights = [];
    for (let i = 0; i < sortedMarks.length - 1; i++) {
      const span = sortedMarks[i + 1] - sortedMarks[i];
      const boostIn = pulses.includes(sortedMarks[i + 1]);
      const boostOut = pulses.includes(sortedMarks[i]);
      weights.push(span * (boostIn ? 2.4 : boostOut ? 1.5 : 1));
    }
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    const swayDir = Math.random() < 0.5 ? 1 : -1;
    const stops = [];
    let accY = 0;
    let pulseCount = 0;
    sortedMarks.forEach((p, i) => {
      if (i > 0) {
        accY += (weights[i - 1] / totalWeight) * rise;
      }
      if (pulses.includes(p)) {
        pulseCount++;
      }
      const f = p / 100;
      stops.push({
        p,
        x: drift * f + swayDir * Math.sin(f * Math.PI * 2) * sway * 0.5 + (pulses.includes(p) ? bias * 10 : 0),
        y: -accY,
        scale: 1 - pulseCount * 0.14,
        pulse: pulses.includes(p)
      });
    });
    const endStop = stops[stops.length - 1];

    const burnPhases = [
      [0, 20, config.burnColors[0]],
      [30, 44, config.burnColors[1]],
      [54, 66, config.burnColors[2]],
      [74, 84, config.burnColors[3]],
      [90, 96, config.burnColors[4]]
    ];
    let emberBurnSteps = '';
    burnPhases.forEach(([a, b, col]) => {
      emberBurnSteps += `${a}%, ${b}% { background-color: ${col}; }\n`;
    });

    let emberPathSteps = '';
    let emberGlowSteps = '';
    stops.forEach(s => {
      if (s.p === 0 || s.p === 100) {
        return;
      }
      emberPathSteps += `
        ${s.p}% {
          transform: translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) scale(${s.scale.toFixed(2)});
        }
      `;
      emberGlowSteps += `${s.p}% { opacity: ${s.pulse ? 1 : 0.45}; }\n`;
    });

    let css = `
      @keyframes emberpath-${groupId} {
        0% {
          transform: translate(0, 0) scale(1);
        }
        ${emberPathSteps}
        100% {
          transform: translate(${endStop.x.toFixed(1)}px, ${endStop.y.toFixed(1)}px) scale(${(endStop.scale - 0.06).toFixed(2)});
        }
      }
      @keyframes emberglow-${groupId} {
        0% { opacity: 0.25; }
        ${emberGlowSteps}
        100% { opacity: 1; }
      }
      @keyframes emberburn-${groupId} {
        ${emberBurnSteps}
        100% { background-color: ${config.ashColor}; }
      }
    `;

    for (let k = 0; k < config.smokeTrailLength; k++) {
      const peakOpacity = 0.22 + Math.random() * 0.1;
      const sFrom = 0.8 + k * 0.15;
      const sTo = 2 + k * 0.3;
      let smokeSteps = '';
      stops.forEach(s => {
        const f = s.p / 100;
        const sc = sFrom + (sTo - sFrom) * Math.min(1, f / 0.5);
        const op = peakOpacity * Math.min(1, f * 6) * Math.max(0, 1 - Math.max(0, f - 0.3) / 0.22);
        smokeSteps += `${s.p}% { opacity: ${Math.max(0, op).toFixed(3)}; }\n`;
      });
      css += `
        @keyframes smoke-${groupId}-${k} {
          0% {
            transform: translate(0, 0) scale(${sFrom});
            opacity: 0;
            background-color: ${config.smokeColors[0]};
          }
          ${smokeSteps}
          52% {
            opacity: 0;
          }
          100% {
            transform: translate(${stops[stops.length - 1].x.toFixed(1)}px, ${stops[stops.length - 1].y.toFixed(1)}px) scale(${sTo});
            opacity: 0;
            background-color: ${config.smokeColors[2]};
          }
        }
      `;
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = css;
    document.head.appendChild(styleSheet);

    const fragment = document.createDocumentFragment();

    const emberOuter = document.createElement('div');
    emberOuter.style.cssText = `
      position: absolute;
      bottom: -10px;
      left: ${startX}px;
      width: ${size}px;
      height: ${size}px;
      animation: emberpath-${groupId} ${duration}s linear infinite;
      animation-delay: ${baseDelay}s;
      ${pixelStyle}
    `;

    const emberHalo = document.createElement('div');
    emberHalo.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0;
      box-shadow: 0 0 7px #ffffff, 0 0 14px rgba(255, 255, 245, 0.8);
      animation: emberglow-${groupId} ${duration}s linear infinite;
      animation-delay: ${baseDelay}s;
      pointer-events: none;
    `;
    emberOuter.appendChild(emberHalo);

    const flickerIndex = Math.floor(Math.random() * flickerDurations.length);
    const emberInner = document.createElement('div');
    emberInner.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      background-color: ${config.burnColors[0]};
      border-radius: 0;
      animation: wp-flicker-${flickerIndex} ${flickerDurations[flickerIndex]} steps(1) infinite, emberburn-${groupId} ${duration}s linear infinite;
      animation-delay: -${(Math.random() * 0.5).toFixed(2)}s, ${baseDelay}s;
      ${pixelStyle}
    `;
    emberOuter.appendChild(emberInner);
    fragment.appendChild(emberOuter);

    for (let k = 0; k < config.smokeTrailLength; k++) {
      const smoke = document.createElement('div');
      const s = Math.round(6 + Math.random() * 5 + k);
      smoke.style.cssText = `
        position: absolute;
        bottom: -10px;
        left: ${startX}px;
        width: ${s}px;
        height: ${s}px;
        border-radius: 0;
        animation: smoke-${groupId}-${k} ${duration}s linear infinite;
        animation-delay: ${baseDelay + (k + 1) * config.smokeLagRatio * duration}s;
        ${pixelStyle}
      `;
      fragment.appendChild(smoke);
    }

    return fragment;
  }

  function createChurnPuff() {
    const size = Math.round(16 + Math.random() * 24);
    const duration = 14 + Math.random() * 12;
    const peakOpacity = 0.2 + Math.random() * 0.16;
    const dir = Math.random() < 0.5 ? -1 : 1;
    const dx1 = dir * (20 + Math.random() * 40);
    const dx2 = -dir * (10 + Math.random() * 30);
    const dx3 = dir * (30 + Math.random() * 50);
    const bob = 6 + Math.random() * 14;
    const grow = 2 + Math.random() * 0.9;
    const tone = Math.random() < 0.5 ? config.smokeColors[1] : config.smokeColors[2];
    const keyframeName = `churn-${Math.random().toString(36).substr(2, 9)}`;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes ${keyframeName} {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 0;
        }
        10% { opacity: ${peakOpacity}; }
        32% { transform: translate(${(dx1 * 0.5).toFixed(1)}px, -${bob}px) scale(${(grow * 0.7).toFixed(2)}); opacity: ${peakOpacity}; }
        58% { transform: translate(${dx1.toFixed(1)}px, ${(bob * 0.4).toFixed(1)}px) scale(${grow.toFixed(2)}); opacity: ${peakOpacity}; }
        82% { transform: translate(${dx2.toFixed(1)}px, -${(bob * 0.6).toFixed(1)}px) scale(${(grow * 1.15).toFixed(2)}); opacity: ${(peakOpacity * 0.7).toFixed(3)}; }
        100% {
          transform: translate(${dx3.toFixed(1)}px, 0) scale(${(grow * 1.3).toFixed(2)});
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    const puff = document.createElement('div');
    puff.style.cssText = `
      position: absolute;
      bottom: ${Math.round(Math.random() * window.innerHeight * 0.09)}px;
      left: ${Math.random() * window.innerWidth}px;
      width: ${size}px;
      height: ${size}px;
      background-color: ${tone};
      border-radius: 0;
      animation: ${keyframeName} ${duration}s ease-in-out infinite;
      animation-delay: -${Math.random() * duration}s;
      ${pixelStyle}
    `;
    return puff;
  }

  function createPlumePuff() {
    const size = Math.round(14 + Math.random() * 16);
    const duration = 18 + Math.random() * 14;
    const climb = window.innerHeight * (0.28 + Math.random() * 0.14);
    const driftX = (Math.random() * 2 - 1) * 90;
    const peakOpacity = 0.14 + Math.random() * 0.1;
    const keyframeName = `plume-${Math.random().toString(36).substr(2, 9)}`;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes ${keyframeName} {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 0;
        }
        15% { opacity: ${peakOpacity}; }
        55% { opacity: ${(peakOpacity * 0.85).toFixed(3)}; }
        100% {
          transform: translate(${driftX.toFixed(1)}px, -${climb}px) scale(2.4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    const puff = document.createElement('div');
    puff.style.cssText = `
      position: absolute;
      bottom: -${size}px;
      left: ${Math.random() * window.innerWidth}px;
      width: ${size}px;
      height: ${size}px;
      background-color: ${config.smokeColors[1]};
      border-radius: 0;
      animation: ${keyframeName} ${duration}s ease-out infinite;
      animation-delay: -${Math.random() * duration}s;
      ${pixelStyle}
    `;
    return puff;
  }

  const groupFragment = document.createDocumentFragment();
  for (let i = 0; i < config.churnCount; i++) {
    groupFragment.appendChild(createChurnPuff());
  }
  for (let i = 0; i < config.plumeCount; i++) {
    groupFragment.appendChild(createPlumePuff());
  }
  for (let i = 0; i < config.emberCount; i++) {
    groupFragment.appendChild(createBurningGroup());
  }
  wpContainer.appendChild(groupFragment);

  window.removePhosphorus = function() {
    const container = document.getElementById('phosphorus-container');
    if (container) {
      container.remove();
    }
  };
})();
