/**
 * JS da landing page Terras de Genova. Site estatico de pagina unica: um
 * arquivo so, sem build step, cobrindo menu mobile, animacao de entrada ao
 * rolar a pagina e o ano do rodape.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------- */
  /* Menu mobile                                                             */
  /* ---------------------------------------------------------------------- */
  function initMenu() {
    var openBtn = document.querySelector('[data-menu-open]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!openBtn || !menu) return;

    var closeTargets = menu.querySelectorAll('[data-menu-close], a');

    function closeMenu() {
      openBtn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function openMenu() {
      openBtn.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    openBtn.addEventListener('click', function () {
      var isOpen = openBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    closeTargets.forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        openBtn.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Animacao de entrada ao rolar a pagina                                   */
  /* ---------------------------------------------------------------------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js-reveal-ready');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      el.style.setProperty('--reveal-index', i % 8);
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Carrosseis de fotos (parque, lotes e casas) - troca automatica a cada  */
  /* 7s, com uma unica barra que enche mostrando o tempo ate a proxima foto.*/
  /* A pagina pode ter mais de um carrossel, entao cada um roda sozinho.    */
  /* ---------------------------------------------------------------------- */
  function initCarousels() {
    var roots = document.querySelectorAll('[data-carousel]');
    roots.forEach(initCarousel);
  }

  function initCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel__slide'));
    var progressHolder = root.querySelector('[data-carousel-progress]');
    if (!slides.length || !progressHolder) return;

    var DURATION = 7000;
    var index = 0;
    var timer = null;

    var bar = document.createElement('span');
    bar.className = 'carousel__progress-bar';
    progressHolder.appendChild(bar);

    function restartBar() {
      bar.classList.remove('is-filling');
      // forca reflow antes de reiniciar a animacao, senao o navegador as
      // vezes ignora a reaplicacao da classe "no mesmo frame"
      void bar.offsetWidth;
      bar.classList.add('is-filling');
    }

    function show(i) {
      slides.forEach(function (slide, si) {
        slide.classList.toggle('is-active', si === i);
      });
      index = i;
      restartBar();
    }

    function next() {
      show((index + 1) % slides.length);
    }

    function start() {
      stop();
      timer = window.setInterval(next, DURATION);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    show(0);
    start();
  }

  /* ---------------------------------------------------------------------- */
  /* Ano do rodape                                                           */
  /* ---------------------------------------------------------------------- */
  function initFooterYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function boot() {
    initMenu();
    initReveal();
    initCarousels();
    initFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
