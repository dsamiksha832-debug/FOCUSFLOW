// Lightweight Canvas Party Popper & Particle Celebration Animator

export function triggerConfetti(options = {}) {
  const count = options.count || 60;
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#00ffcc'];

  const particles = Array.from({ length: count }, () => ({
    x: width / 2 + (Math.random() * 200 - 100),
    y: height / 2 + (Math.random() * 100 - 50),
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 0.8) * 18,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.2,
    opacity: 1
  }));

  let startTime = null;

  function render(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // Gravity
      p.vx *= 0.98; // Air resistance
      p.rotation += p.vr;
      p.opacity -= 0.015;

      if (p.opacity > 0) {
        activeParticles++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeParticles > 0 && progress < 3000) {
      requestAnimationFrame(render);
    } else {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  requestAnimationFrame(render);
}
