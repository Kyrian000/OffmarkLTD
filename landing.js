(function () {
  const canvas = document.getElementById('meteors');
  const ctx    = canvas.getContext('2d');
 
  /* Size canvas to its wrapper */
  function resize() {
    const scene  = canvas.parentElement;
    canvas.width  = scene.offsetWidth;
    canvas.height = scene.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
 
  const W = () => canvas.width;
  const H = () => canvas.height;
 
  /* ── Colour helpers ── */
  const COLOURS = ['#F05A25', '#FF8C42', '#FFB347'];
 
  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
 
  /* ── Meteor factory ── */
  function spawnMeteor(visible) {
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = 2.5 + Math.random() * 3.5;
    const len   = 40  + Math.random() * 90;
    const x     = visible
      ? Math.random() * W()
      : -len + Math.random() * (W() + len * 2);
    const y     = visible
      ? Math.random() * H() * 0.6
      : -len - Math.random() * H() * 0.5;
 
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len,
      color: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      alpha: 0.55 + Math.random() * 0.45,
      width: 0.8  + Math.random() * 1.4,
    };
  }
 
  /* ── Star field ── */
  const stars = Array.from({ length: 55 }, () => ({
    x:       Math.random() * 400,
    y:       Math.random() * 70,
    r:       Math.random() * 0.8 + 0.2,
    a:       Math.random() * 0.4 + 0.1,
    phase:   Math.random() * Math.PI * 2,
    speed:   0.01 + Math.random() * 0.02,
  }));
 
  /* ── Meteor pool ── */
  const POOL    = 18;
  const meteors = Array.from({ length: POOL }, () => spawnMeteor(true));
 
  /* ── Draw one meteor ── */
  function drawMeteor(m) {
    const mag   = Math.hypot(m.vx, m.vy);
    const tailX = m.x - m.vx / mag * m.len;
    const tailY = m.y - m.vy / mag * m.len;
 
    /* Streak */
    const streak = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
    streak.addColorStop(0,   'rgba(0,0,0,0)');
    streak.addColorStop(0.6, hexToRgba(m.color, m.alpha * 0.4));
    streak.addColorStop(1,   hexToRgba(m.color, m.alpha));
 
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(m.x, m.y);
    ctx.strokeStyle = streak;
    ctx.lineWidth   = m.width;
    ctx.lineCap     = 'round';
    ctx.stroke();
 
    /* Head */
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.width * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(m.color, m.alpha);
    ctx.fill();
 
    /* Glow */
    const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.width * 5);
    glow.addColorStop(0, hexToRgba(m.color, m.alpha * 0.5));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.width * 5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }
 
  /* ── Main loop ── */
  let frame = 0;
 
  function loop() {
    frame++;
    ctx.clearRect(0, 0, W(), H());
 
    /* Deep space */
    ctx.fillStyle = '#0a0704';
    ctx.fillRect(0, 0, W(), H());
 
    /* Ambient orange glow */
    const amb = ctx.createRadialGradient(W() * 0.5, H() * 0.5, 0, W() * 0.5, H() * 0.5, W());
    amb.addColorStop(0, 'rgba(240,90,37,0.04)');
    amb.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, W(), H());
 
    /* Stars */
    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = s.a * (0.6 + 0.4 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x % W(), s.y % H(), s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,180,${alpha})`;
      ctx.fill();
    });
 
    /* Move & draw meteors */
    meteors.forEach((m, i) => {
      m.x += m.vx;
      m.y += m.vy;
      drawMeteor(m);
      if (m.x > W() + m.len || m.y > H() + m.len) {
        meteors[i] = spawnMeteor(false);
      }
    });
 
    requestAnimationFrame(loop);
  }
 
  loop();
 
  /* ── Active state on click ── */
  document.querySelectorAll('.floating-nav a').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.floating-nav a').forEach(x => {
        x.classList.remove('active');
        const d = x.querySelector('.active-dot');
        if (d) d.remove();
      });
      this.classList.add('active');
      const dot = document.createElement('span');
      dot.className = 'active-dot';
      this.appendChild(dot);
    });
  });
})();




// Solidify navbar on scroll
window.addEventListener('scroll', () =>{
    document.querySelector('nav').classList.toggle
    ('window-scroll', window.scrollY > 0)
})


    // Initialize Swiper
        const swiper = new Swiper('.mySwiper', {
            effect: 'cards',
            grabCursor: true,
            loop: false,
            centeredSlides: true,
            slidesPerView: 'auto',
                      
              // Autoplay
            autoplay: {
                delay: 2500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
            },
            
            
            // Smooth transitions
            speed: 1000,

        });



        