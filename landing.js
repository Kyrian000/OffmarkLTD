(function() {
    // ------------------------------
    // 1. METEOR CANVAS (YOUR EXACT SCRIPT, with minor resize fix for wrapper)
    // ------------------------------
    const canvas = document.getElementById('meteors');
    const ctx    = canvas.getContext('2d');
   
    /* Size canvas to its wrapper (nav-wrapper) */
    function resize() {
      const wrapper = canvas.parentElement; // .nav-wrapper
      if (!wrapper) return;
      canvas.width  = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
   
    const W = () => canvas.width;
    const H = () => canvas.height;
   
    /* Colour helpers */
    const COLOURS = ['#d68b70', '#f7f3f1', '#ccc9c4'];
   
    function hexToRgba(hex, a) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
   
    /* Meteor factory */
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
   
    /* Star field */
    const stars = Array.from({ length: 45 }, () => ({
      x:       Math.random() * 400,
      y:       Math.random() * 70,
      r:       Math.random() * 0.8 + 0.2,
      a:       Math.random() * 0.4 + 0.1,
      phase:   Math.random() * Math.PI * 2,
      speed:   0.01 + Math.random() * 0.02,
    }));
   
    const POOL    = 16;
    const meteors = Array.from({ length: POOL }, () => spawnMeteor(true));
   
    function drawMeteor(m) {
      const mag   = Math.hypot(m.vx, m.vy);
      const tailX = m.x - m.vx / mag * m.len;
      const tailY = m.y - m.vy / mag * m.len;
   
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
   
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.width * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(m.color, m.alpha);
      ctx.fill();
   
      const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.width * 5);
      glow.addColorStop(0, hexToRgba(m.color, m.alpha * 0.5));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.width * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
   
    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W(), H());
   
      ctx.fillStyle = '#0a0704';
      ctx.fillRect(0, 0, W(), H());
   
      const amb = ctx.createRadialGradient(W() * 0.5, H() * 0.5, 0, W() * 0.5, H() * 0.5, W());
      amb.addColorStop(0, 'rgba(240,90,37,0.04)');
      amb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W(), H());
   
      stars.forEach(s => {
        s.phase += s.speed;
        const alpha = s.a * (0.6 + 0.4 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x % W(), s.y % H(), s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,180,${alpha})`;
        ctx.fill();
      });
   
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
   
    // ensure canvas redraw on wrapper resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        resize();
      }, 80);
    });
   
    // ------------------------------
    // 2. SCROLL-RESPONSIVE ACTIVE CLASS (Intersection Observer + manual)
    //    and preserves the dot / active style exactly as your CSS expects.
    // ------------------------------
    const navLinks = document.querySelectorAll('.floating-nav a');
    const heroElement = document.querySelector('.hero');
    const projectsSection = document.getElementById('projects');
    const faqsSection = document.getElementById('faqs');
    const contactSection = document.getElementById('contact');
    
    function getNavLinkBySection(sectionId) {
      if (sectionId === 'hero') {
        return Array.from(navLinks).find(link => link.getAttribute('href') === '#');
      }
      return Array.from(navLinks).find(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) return true;
        return link.getAttribute('data-section') === sectionId;
      });
    }
    
    function removeActiveClassFromAll() {
      navLinks.forEach(link => {
        link.classList.remove('active');
        // the dot is inside span, we don't remove it, CSS hides when parent not active.
      });
    }
    
    function setActiveLink(link) {
      if (!link) return;
      removeActiveClassFromAll();
      link.classList.add('active');
      // update status chip for fun
      const statusSpan = document.getElementById('liveSense');
      if (statusSpan) {
        let activeText = '';
        if (link.getAttribute('href') === '#') activeText = '🏠 Home (hero)';
        else if (link.getAttribute('href') === '#projects') activeText = '👕 Projects';
        else if (link.getAttribute('href') === '#faqs') activeText = '❓ FAQs';
        else if (link.getAttribute('href') === '#contact') activeText = '✉️ Contact';
        else if (link.getAttribute('href') === 'team.html') activeText = '👥 Team page';
        else activeText = 'active';
        statusSpan.innerHTML = `✨ active: ${activeText} • scroll-aware`;
      }
    }
    
    // Map sections
    const sectionMap = new Map();
    if (heroElement) sectionMap.set('hero', { element: heroElement, navLink: getNavLinkBySection('hero') });
    if (projectsSection) sectionMap.set('projects', { element: projectsSection, navLink: getNavLinkBySection('projects') });
    if (faqsSection) sectionMap.set('faqs', { element: faqsSection, navLink: getNavLinkBySection('faqs') });
    if (contactSection) sectionMap.set('contact', { element: contactSection, navLink: getNavLinkBySection('contact') });
    
    const visibilityMap = new Map();
    let activeSectionId = 'hero';
    
    const observerOptions = {
      threshold: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
      rootMargin: "-80px 0px -20% 0px"
    };
    
    function updateActiveFromObserver() {
      let maxRatio = 0;
      let bestSectionId = null;
      for (let [sectionId, data] of sectionMap.entries()) {
        const ratio = visibilityMap.get(sectionId) || 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestSectionId = sectionId;
        }
      }
      if (!bestSectionId || maxRatio < 0.1) {
        if (window.scrollY < 130) bestSectionId = 'hero';
        else if (projectsSection && window.scrollY > 100) bestSectionId = 'projects';
      }
      if (bestSectionId && activeSectionId !== bestSectionId) {
        activeSectionId = bestSectionId;
        const targetNav = sectionMap.get(bestSectionId)?.navLink;
        if (targetNav) setActiveLink(targetNav);
        else if (bestSectionId === 'hero') {
          const homeLink = getNavLinkBySection('hero');
          if (homeLink) setActiveLink(homeLink);
        }
      } else if (bestSectionId && !activeSectionId) {
        const targetNav = sectionMap.get(bestSectionId)?.navLink;
        if (targetNav) setActiveLink(targetNav);
      }
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        let foundSectionId = null;
        for (let [sId, data] of sectionMap.entries()) {
          if (data.element === entry.target) {
            foundSectionId = sId;
            break;
          }
        }
        if (foundSectionId) visibilityMap.set(foundSectionId, entry.intersectionRatio);
      });
      updateActiveFromObserver();
    }, observerOptions);
    
    for (let [sId, data] of sectionMap.entries()) {
      if (data.element) observer.observe(data.element);
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY < 120) {
            const homeLink = getNavLinkBySection('hero');
            if (homeLink && activeSectionId !== 'hero') {
              activeSectionId = 'hero';
              setActiveLink(homeLink);
            }
          } else {
            updateActiveFromObserver();
          }
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // CLICK HANDLER: also preserve dot & active class, plus smooth scroll
    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          event.preventDefault();
          const targetId = href.substring(1);
          let targetElement = null;
          if (targetId === 'projects') targetElement = projectsSection;
          else if (targetId === 'faqs') targetElement = faqsSection;
          else if (targetId === 'contact') targetElement = contactSection;
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveLink(link);
            activeSectionId = targetId;
            history.pushState(null, null, href);
            setTimeout(() => updateActiveFromObserver(), 400);
          }
        } 
        else if (href === '#') {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const homeNav = getNavLinkBySection('hero');
          if (homeNav) setActiveLink(homeNav);
          activeSectionId = 'hero';
          if (window.location.hash) history.pushState(null, null, window.location.pathname);
          setTimeout(() => updateActiveFromObserver(), 300);
        }
        else if (href === 'team.html') {
          // allow default, but show status hint
          const statusSpan = document.getElementById('liveSense');
          if (statusSpan) statusSpan.innerHTML = `🚀 navigating to team.html...`;
          // no preventDefault
        }
      });
    });
    
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (hash === '#projects') {
        const projLink = getNavLinkBySection('projects');
        if (projLink) setActiveLink(projLink);
        activeSectionId = 'projects';
      } else if (hash === '#faqs') {
        const faqLink = getNavLinkBySection('faqs');
        if (faqLink) setActiveLink(faqLink);
        activeSectionId = 'faqs';
      } else if (hash === '#contact') {
        const contactLink = getNavLinkBySection('contact');
        if (contactLink) setActiveLink(contactLink);
        activeSectionId = 'contact';
      } else if (!hash || hash === '') {
        const homeLink = getNavLinkBySection('hero');
        if (homeLink && window.scrollY < 100) setActiveLink(homeLink);
        else updateActiveFromObserver();
      } else {
        updateActiveFromObserver();
      }
    });
    
    function detectTeamPageAndSetActive() {
      if (window.location.pathname.includes('team.html')) {
        const teamNav = Array.from(navLinks).find(link => link.getAttribute('href') === 'team.html');
        if (teamNav) setActiveLink(teamNav);
      }
    }
    detectTeamPageAndSetActive();
    
    window.addEventListener('load', () => {
      detectTeamPageAndSetActive();
      if (!window.location.pathname.includes('team.html')) {
        if (window.location.hash) {
          const hash = window.location.hash;
          if (hash === '#projects') setActiveLink(getNavLinkBySection('projects'));
          else if (hash === '#faqs') setActiveLink(getNavLinkBySection('faqs'));
          else if (hash === '#contact') setActiveLink(getNavLinkBySection('contact'));
        } else {
          if (window.scrollY < 100) {
            const homeLink = getNavLinkBySection('hero');
            if (homeLink) setActiveLink(homeLink);
          } else {
            updateActiveFromObserver();
          }
        }
      }
      setTimeout(updateActiveFromObserver, 150);
    });
    
    window.addEventListener('resize', () => {
      setTimeout(updateActiveFromObserver, 100);
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


// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // fires once only
    }
  });
}, { threshold: 0.15 }); // triggers when 15% is visible

document.querySelectorAll('.fade-up, .slide-left, .scale-pop, .clip-reveal')
  .forEach(el => observer.observe(el));

// Stagger: observe the parent, animate children with delay
document.querySelectorAll('.stagger-parent').forEach(el => {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.querySelectorAll('.stagger-item').forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 110);
      });
    }
  }, { threshold: 0.15 }).observe(el);
});




// curtain 
 /* Swipe UP on load — reveal the page */
    window.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => {
        document.getElementById('curtain').classList.add('up');
      });
    });
 
    /* Call this for every link/button instead of href */
    function navigateTo(url) {
      const curtain = document.getElementById('curtain');
      curtain.classList.remove('up');
      curtain.classList.add('down');          // swipe DOWN to cover page
 
      setTimeout(() => {
        window.location.href = url;           // go to new page (swipe UP fires on load there)
      }, 800);                                // wait for animation to finish
    }
