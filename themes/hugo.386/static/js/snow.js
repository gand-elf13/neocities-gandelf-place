(function() {
  // Falling Snow Script Configuration
  const config = {
    snowflakeCount: 120,
    snowflakeColor: "#deddda",
    minSize: 2,
    maxSize: 5,
    minSpeed: 1,
    maxSpeed: 3,
    opacity: 0.7,
    enableWind: true,
    windStrength: 10,
    windDirection: -1,        // 1 = blows right, -1 = blows left
    zIndex: 9999,
    pixelated: true,         // sharp square flakes, no blur/antialiasing
    animationStyle: "linear"
  };

  // Create container for snowflakes
  const snowContainer = document.createElement('div');
  snowContainer.id = 'falling-snow-container';
  snowContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: ${config.zIndex};
    overflow: hidden;
  `;
  document.body.appendChild(snowContainer);

  // Create snowflake element
  function createSnowflake() {
    const snowflake = document.createElement('div');
    const size = Math.round(Math.random() * (config.maxSize - config.minSize) + config.minSize);
    const startPositionX = Math.random() * window.innerWidth;
    const duration = (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * 10;

    // Wind always blows the same direction now, only the magnitude is randomized
    const windOffset = config.enableWind
      ? Math.random() * config.windStrength * 100 * config.windDirection
      : 0;

    snowflake.style.cssText = `
      position: absolute;
      top: -10px;
      left: ${startPositionX}px;
      width: ${size}px;
      height: ${size}px;
      background-color: ${config.snowflakeColor};
      border-radius: 0;
      opacity: ${config.opacity};
      animation: fall-${Math.random().toString(36).substr(2, 9)} ${duration}s ${config.animationStyle} infinite;
      ${config.pixelated ? 'image-rendering: pixelated; shape-rendering: crispEdges;' : ''}
    `;

    // Create unique animation for each snowflake
    const keyframeName = `fall-${Math.random().toString(36).substr(2, 9)}`;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes ${keyframeName} {
        0% {
          transform: translateY(0) translateX(0);
        }
        100% {
          transform: translateY(${window.innerHeight + 10}px) translateX(${windOffset}px);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    snowflake.style.animationName = keyframeName;

    // Reset snowflake position when animation ends
    snowflake.addEventListener('animationiteration', () => {
      snowflake.style.left = Math.random() * window.innerWidth + 'px';
    });

    return snowflake;
  }

  // Generate snowflakes
  for (let i = 0; i < config.snowflakeCount; i++) {
    const snowflake = createSnowflake();
    snowflake.style.animationDelay = `-${Math.random() * 10}s`;
    snowContainer.appendChild(snowflake);
  }

  // Cleanup function
  window.removeSnow = function() {
    const container = document.getElementById('falling-snow-container');
    if (container) {
      container.remove();
    }
  };
})();
