// Photo filters + lightbox
(() => {
  const grid = document.getElementById('grid');
  const links = [...grid.querySelectorAll('a')];
  const box = document.getElementById('lightbox');
  const img = box.querySelector('img');
  const count = box.querySelector('.lb-count');
  let visible = links, i = 0, lastFocus = null;

  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      document.querySelectorAll('.filters button').forEach(b => b.setAttribute('aria-pressed', b === btn));
      links.forEach(a => { a.hidden = !(f === 'all' || a.dataset.cat === f); });
      visible = links.filter(a => !a.hidden);
    });
  });

  function show(n) {
    i = (n + visible.length) % visible.length;
    const a = visible[i];
    img.src = a.href;
    img.alt = a.querySelector('img').alt;
    count.textContent = `${i + 1} of ${visible.length}`;
  }
  function open(a) {
    lastFocus = a;
    show(visible.indexOf(a));
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(a => a.addEventListener('click', e => { e.preventDefault(); open(a); }));
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(i - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(i + 1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  // swipe
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });
})();
