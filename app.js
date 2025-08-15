const track = document.getElementById('carouselTrack');
const title = document.getElementById('serviceTitle');
const desc = document.getElementById('serviceDesc');

function updateCarouselClasses() {
  const items = Array.from(track.children);
  items.forEach(item => item.classList.remove('center', 'nearby', 'far'));

  const centerIndex = Math.floor(items.length / 2);
  items[centerIndex].classList.add('center');

  if (items[centerIndex - 1]) items[centerIndex - 1].classList.add('nearby');
  if (items[centerIndex + 1]) items[centerIndex + 1].classList.add('nearby');

  if (items[centerIndex - 2]) items[centerIndex - 2].classList.add('far');
  if (items[centerIndex + 2]) items[centerIndex + 2].classList.add('far');

  title.textContent = items[centerIndex].dataset.title;
  desc.textContent = items[centerIndex].dataset.desc;
}

// Rotate logic
function rotateLeft() {
  const last = track.lastElementChild;
  track.insertBefore(last, track.firstElementChild);
  updateCarouselClasses();
}

function rotateRight() {
  const first = track.firstElementChild;
  track.appendChild(first);
  updateCarouselClasses();
}

// New: click on item to center it
track.addEventListener('click', (e) => {
  const clickedItem = e.target.closest('.carousel-item');
  if (!clickedItem) return;

  const items = Array.from(track.children);
  const clickedIndex = items.indexOf(clickedItem);
  const centerIndex = Math.floor(items.length / 2);
  const steps = clickedIndex - centerIndex;

  if (steps > 0) {
    for (let i = 0; i < steps; i++) rotateRight();
  } else if (steps < 0) {
    for (let i = 0; i < Math.abs(steps); i++) rotateLeft();
  }
});

document.addEventListener('DOMContentLoaded', updateCarouselClasses);

const navLinks = document.querySelectorAll(".nav-bar ul li a");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, {
  threshold: 0.6
});

// Observe all sections
document.querySelectorAll("section").forEach(section => {
  observer.observe(section);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(nav => nav.classList.remove('active'));
    link.classList.add('active');
  });
});


// ========== Mobile nav: hamburger toggle ==========
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navLinks');

if (hamburger && navList) {
  const toggleMenu = () => {
    const isOpen = navList.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  };
  hamburger.addEventListener('click', toggleMenu);

  // close on link click (mobile)
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navList.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ========== Timeline: tap to expand on mobile ==========
const isTouch = window.matchMedia('(hover: none)').matches;
if (isTouch) {
  document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('click', () => {
      const details = card.querySelector('.details');
      if (!details) return;
      const open = details.style.maxHeight && details.style.maxHeight !== '0px';
      details.style.maxHeight = open ? '0px' : '500px';
      details.style.opacity = open ? '0' : '1';
    });
  });
}

// ========== Services carousel: swipe support ==========
let startX = 0, isDown = false;
const trackEl = document.getElementById('carouselTrack');

if (trackEl) {
  const onStart = (x) => { isDown = true; startX = x; };
  const onMove  = (x) => {
    if (!isDown) return;
    const diff = x - startX;
    if (Math.abs(diff) > 40) {
      diff < 0 ? rotateRight() : rotateLeft();
      isDown = false; // prevent multiple triggers per swipe
    }
  };
  const onEnd = () => { isDown = false; };

  trackEl.addEventListener('touchstart', e => onStart(e.touches[0].clientX), {passive: true});
  trackEl.addEventListener('touchmove',  e => onMove(e.touches[0].clientX), {passive: true});
  trackEl.addEventListener('touchend', onEnd);

  // Mouse drag (optional)
  trackEl.addEventListener('mousedown', e => onStart(e.clientX));
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);
}



// ===== Mobile header nav: fixed padding, offset scrolling, center+highlight =====
document.addEventListener('DOMContentLoaded', function () {
  const mqMobile = window.matchMedia('(max-width: 768px)');
  const mobileHeader = document.querySelector('.mobile-header');
  const mobileNav = document.getElementById('mobileNav');
  const desktopLinks = document.querySelectorAll('.nav-bar ul li a');

  if (!mobileHeader || !mobileNav) return;

  // -- keep body padding equal to fixed header height
  function setHeaderPadding() {
    if (!mqMobile.matches) return;
    const h = Math.ceil(mobileHeader.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--mh', `${h}px`);
  }
  setHeaderPadding();
  window.addEventListener('resize', setHeaderPadding);
  setTimeout(setHeaderPadding, 200); // fonts/images settle

  // -- utilities
  const centerInScroller = (el, scroller) => {
    if (!el || !scroller) return;
    const left = el.offsetLeft - (scroller.clientWidth - el.clientWidth) / 2;
    scroller.scrollTo({ left, behavior: 'smooth' });
  };

  const normalizeHash = (href) => {
    if (!href) return null;
    try {
      const u = new URL(href, window.location.href);
      return u.hash || null;  // "#about"
    } catch {
      // if it's just "#about"
      return href.startsWith('#') ? href : null;
    }
  };

  const allNavLinks = () => [
    ...mobileNav.querySelectorAll('a'),
    ...desktopLinks
  ];

  const setActive = (hash) => {
    if (!hash) return;
    const id = hash.startsWith('#') ? hash : `#${hash}`;
    allNavLinks().forEach(a => {
      const h = normalizeHash(a.getAttribute('href'));
      a.classList.toggle('active', h === id);
    });
    const activeMobile = [...mobileNav.querySelectorAll('a')].find(a => a.classList.contains('active'));
    if (activeMobile) centerInScroller(activeMobile, mobileNav);
  };

  const scrollWithOffset = (hash) => {
    if (!hash) return;
    const id = hash.replace(/^#/, '');
    const target = document.getElementById(id);
    if (!target) return;
    const headerH = Math.ceil(mobileHeader.getBoundingClientRect().height);
    const y = window.pageYOffset + target.getBoundingClientRect().top - headerH - 6;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // -- CLICK HANDLERS
  // Event delegation for mobile menu
  mobileNav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const hash = normalizeHash(a.getAttribute('href'));
    if (!hash) return; // not an anchor—let it behave normally
    e.preventDefault();
    setActive(hash);
    scrollWithOffset(hash);
  });

  // Desktop links (optional: keep in sync)
  desktopLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const hash = normalizeHash(a.getAttribute('href'));
      if (!hash) return;
      e.preventDefault();
      setActive(hash);
      scrollWithOffset(hash);
    });
  });

  // -- OBSERVE sections from mobile menu only (keeps highlight on manual scroll)
  const ids = [...mobileNav.querySelectorAll('a')]
    .map(a => normalizeHash(a.getAttribute('href')))
    .filter(Boolean)
    .map(h => h.slice(1));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive('#' + entry.target.id);
    });
  }, { threshold: 0.6 });

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  // -- If loaded on a hash, fix position & highlight
  if (location.hash) {
    setTimeout(() => {
      setActive(location.hash);
      scrollWithOffset(location.hash);
    }, 0);
  }
});
