(function() {
  // Fiery Particles Script Configuration
  const config = {
    particleCount: 80,
    colors: ["#fff5b0", "#ffd23f", "#ff9a3c", "#ff5e2e", "#e6331a"], // hot -> cool
    minSize: 2,
    maxSize: 4,       // kept small so the square shape reads as a "pixel", not a blob
    minSpeed: 4,       // seconds to rise (lower = faster)
    maxSpeed: 8,
    minOpacity: 0.6,
    maxOpacity: 1,
    enableDrift: true,
    driftStrength: 40,   // max horizontal wobble in px
    spawnWidth: window.innerWidth, // horizontal spread of the source
    riseHeightRatio: 0.66, // how far up the page particles travel (0.66 = ~2/3 of viewport)
    pixelated: true,     // sharp square particles, no blur/antialiasing
    zIndex: 9999,
    glow: {
      enabled: true,
      height: 130,          // smaller than before, hugs the bottom edge
      color: "rgba(255, 90, 0, 0.85)",   // more saturated/contrasted core color
      flickerDuration: 3     // seconds per flicker cycle
    }
  };

  // Create container for particles
  const fireContainer = document.createElement('div');
  fireContainer.id = 'fiery-particles-container';
  fireContainer.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: ${config.zIndex};
    overflow: hidden;
  `;
  document.body.appendChild(fireContainer);

  // Ambient glow at the bottom of the page - flickering, uneven, more contrasted
  if (config.glow.enabled) {
    const glowStyleSheet = document.createElement('style');
    glowStyleSheet.textContent = `
      @keyframes fiery-glow-flicker {
        0%   { opacity: 0.75; transform: translateX(0) scaleY(1); }
        20%  { opacity: 1;    transform: translateX(-1.5%) scaleY(1.08); }
        40%  { opacity: 0.85; transform: translateX(1%) scaleY(0.95); }
        60%  { opacity: 1;    transform: translateX(-0.5%) scaleY(1.05); }
        80%  { opacity: 0.8;  transform: translateX(1.5%) scaleY(0.98); }
        100% { opacity: 0.75; transform: translateX(0) scaleY(1); }
      }
    `;
    document.head.appendChild(glowStyleSheet);

    const glow = document.createElement('div');
    glow.id = 'fiery-particles-glow';
    glow.style.cssText = `
      position: absolute;
      bottom: -20px;
      left: -5%;
      width: 110%;
      height: ${config.glow.height}px;
      background:
        radial-gradient(ellipse 45% 100% at 25% 100%, ${config.glow.color}, rgba(255,90,0,0) 70%),
        radial-gradient(ellipse 40% 100% at 65% 100%, ${config.glow.color}, rgba(255,90,0,0) 70%),
        linear-gradient(to top, rgba(255, 60, 0, 0.5), rgba(255, 90, 0, 0) 80%);
      transform-origin: bottom center;
      animation: fiery-glow-flicker ${config.glow.flickerDuration}s ease-in-out infinite;
      pointer-events: none;
    `;
    fireContainer.appendChild(glow);
  }

  function createParticle() {
    const particle = document.createElement('div');
    const size = Math.round(Math.random() * (config.maxSize - config.minSize) + config.minSize);
    const startX = Math.random() * config.spawnWidth;
    const duration = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
    const opacity = Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const drift = config.enableDrift ? (Math.random() * 2 - 1) * config.driftStrength : 0;
    const rise = window.innerHeight * config.riseHeightRatio;

    const keyframeName = `rise-${Math.random().toString(36).substr(2, 9)}`;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes ${keyframeName} {
        0% {
          transform: translateY(0) translateX(0) scale(1);
          opacity: ${opacity};
        }
        60% {
          transform: translateY(-${rise * 0.6}px) translateX(${drift * 0.6}px) scale(1);
          opacity: ${opacity};
        }
        100% {
          transform: translateY(-${rise}px) translateX(${drift}px) scale(0.3);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    particle.style.cssText = `
      position: absolute;
      bottom: -10px;
      left: ${startX}px;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 0;
      opacity: ${opacity};
      animation: ${keyframeName} ${duration}s ease-out infinite;
      animation-delay: -${Math.random() * duration}s;
      ${config.pixelated ? 'image-rendering: pixelated; shape-rendering: crispEdges;' : ''}
    `;

    // Recolor on each loop for variation
    particle.addEventListener('animationiteration', () => {
      const newColor = config.colors[Math.floor(Math.random() * config.colors.length)];
      particle.style.left = Math.random() * config.spawnWidth + 'px';
      particle.style.backgroundColor = newColor;
    });

    return particle;
  }

  // Generate particles
  for (let i = 0; i < config.particleCount; i++) {
    const particle = createParticle();
    fireContainer.appendChild(particle);
  }

  // Cleanup function
  window.removeFire = function() {
    const container = document.getElementById('fiery-particles-container');
    if (container) {
      container.remove();
    }
  };
})();
