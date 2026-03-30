 const cursor = document.getElementById('cursor');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;
  let velX = 0;
 
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
 
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
 
  function lerp(a, b, t) { return a + (b - a) * t; }
 
  function tick() {
    const prevX = curX;
    curX = lerp(curX, mouseX, 0.18);
    curY = lerp(curY, mouseY, 0.18);
 
    velX = curX - prevX;
 
    // Tilt tag based on horizontal velocity
    const tilt = Math.max(-22, Math.min(22, velX * 3.5));
 
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    cursor.querySelector('svg').style.transform = `rotate(${tilt}deg)`;
 
    requestAnimationFrame(tick);
  }
 
  tick();