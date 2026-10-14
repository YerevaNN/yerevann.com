(function () {
  'use strict';
  var root = document.getElementById('research');
  if (!root) return;
  var slides = Array.from(root.querySelectorAll('.yvn-highlight'));
  var controls = root.querySelector('.yvn-highlight-controls');
  if (slides.length < 2 || !controls) return;
  var dots = Array.from(root.querySelectorAll('[data-highlight-index]'));
  var status = root.querySelector('.yvn-highlight-status');
  var index = 0;

  function show(next, announce) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.hidden = i !== index; });
    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    if (announce) status.textContent = 'Highlight ' + (index + 1) + ' of ' + slides.length + ': ' + slides[index].querySelector('h3').textContent;
  }
  function navigate(next) {
    show(next, true);
  }
  root.classList.add('is-carousel');
  show(0, false);
  controls.hidden = false;
  root.querySelector('[data-highlight-prev]').addEventListener('click', function () { navigate(index - 1); });
  root.querySelector('[data-highlight-next]').addEventListener('click', function () { navigate(index + 1); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () { navigate(Number(dot.dataset.highlightIndex)); });
  });
}());
