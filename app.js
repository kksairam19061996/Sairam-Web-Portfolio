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








