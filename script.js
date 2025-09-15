/* === Script galleria e lightbox === */

// mostra l'anno corrente nel footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// riferimenti agli elementi
const gallery = document.getElementById('gallery');
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
const lbClose = document.querySelector('.lb-close');
const lbPrev = document.querySelector('.lb-prev');
const lbNext = document.querySelector('.lb-next');

let photos = [];
let current = -1;

function openLightbox(index) {
  current = index;
  const p = photos[current];
  lbImg.src = p.file;
  lbImg.alt = p.alt || '';
  lbCap.textContent = p.caption || '';
  lb.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lb.setAttribute('aria-hidden', 'true');
  current = -1;
}

function prev() { if (photos.length) openLightbox((current - 1 + photos.length) % photos.length); }
function next() { if (photos.length) openLightbox((current + 1) % photos.length); }

// eventi
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prev);
lbNext.addEventListener('click', next);

document.addEventListener('keydown', (e) => {
  if (lb.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }
});

// carica la lista delle foto da photos.json
fetch('photos.json')
  .then(r => r.json())
  .then(list => {
    photos = list;
    list.forEach((p, i) => {
      const fig = document.createElement('figure');
      fig.className = 'card';
      fig.innerHTML = `
        <img src="${p.file}" alt="${p.alt || ''}" loading="lazy">
        ${p.caption ? '<figcaption>' + p.caption + '</figcaption>' : ''}
      `;
      fig.addEventListener('click', () => openLightbox(i));
      gallery.appendChild(fig);
    });
  })
  .catch(() => {
    gallery.innerHTML = '<p style="color:#666">Aggiungi immagini modificando <code>photos.json</code> e caricando file in <code>/images</code>.</p>';
  });
