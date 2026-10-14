(function () {
  'use strict';
  var root = document.getElementById('research');
  if (!root) return;
  var slides = Array.from(root.querySelectorAll('.yvn-highlight'));
  var controls = root.querySelector('.yvn-highlight-controls');
  if (slides.length < 2 || !controls) return;
  var dots = Array.from(root.querySelectorAll('[data-highlight-index]'));
  var pause = root.querySelector('[data-highlight-pause]');
  var status = root.querySelector('.yvn-highlight-status');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var index = 0;
  var paused = reducedMotion.matches;
  var timer;
  var hovered = false;

  function show(next, announce) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.hidden = i !== index; });
    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    if (announce) status.textContent = 'Highlight ' + (index + 1) + ' of ' + slides.length + ': ' + slides[index].querySelector('h3').textContent;
  }
  function schedule() {
    window.clearInterval(timer);
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', paused ? 'Play automatic highlights' : 'Pause automatic highlights');
    if (!paused && !hovered && !document.hidden && !root.contains(document.activeElement)) {
      timer = window.setInterval(function () { show(index + 1, false); }, 8000);
    }
  }
  function navigate(next) {
    // Keep a reader's selected paper on screen until they choose to resume.
    paused = true;
    show(next, true);
    schedule();
  }
  root.classList.add('is-carousel');
  show(0, false);
  controls.hidden = false;
  root.querySelector('[data-highlight-prev]').addEventListener('click', function () { navigate(index - 1); });
  root.querySelector('[data-highlight-next]').addEventListener('click', function () { navigate(index + 1); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () { navigate(Number(dot.dataset.highlightIndex)); });
  });
  pause.addEventListener('click', function () { paused = !paused; schedule(); });
  root.addEventListener('mouseenter', function () { hovered = true; schedule(); });
  root.addEventListener('mouseleave', function () { hovered = false; schedule(); });
  root.addEventListener('focusin', function () { schedule(); });
  root.addEventListener('focusout', function () { window.setTimeout(schedule, 0); });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', function (event) { if (event.matches) paused = true; schedule(); });
  schedule();
}());
