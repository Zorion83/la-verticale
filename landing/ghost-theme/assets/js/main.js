(function () {
  /* Fade-in on scroll */
  var els = document.querySelectorAll('.reveal, .post-card, .hero-content');
  if (els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('visible');
      });
    }, 80);
  }

  /* Nav scroll effect */
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
      } else {
        nav.style.boxShadow = 'none';
      }
    });
  }
})();
