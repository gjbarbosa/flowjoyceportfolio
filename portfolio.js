/* ===================================================================
   Flow With Joyce — Portfolio motion
   Gentle, film-like: staggered reveals, soft parallax, pinned scenes.
   =================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // motion scale: 1 cinematic, 0.4 calm, 0 off. Driven by Tweaks.
  var motion = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--motion")
  ) || 1;
  if (reduce) motion = 0;

  window.PORTFOLIO = {
    setMotion: function (m) {
      motion = reduce ? 0 : m;
      document.documentElement.style.setProperty("--motion", String(m));
      if (m === 0) {
        document.documentElement.classList.remove("anim");
        document.querySelectorAll("[data-parallax]").forEach(function (el) {
          el.style.transform = "";
        });
      } else if (!reduce) {
        document.documentElement.classList.add("anim");
      }
      onScroll();
    }
  };

  /* ---------- staggered reveals (scroll-driven, fail-safe) ---------- */
  var revealEls = [].slice.call(document.querySelectorAll("[data-reveal]"));
  // opt into the hidden-by-default state only when we can animate
  if (motion > 0 && !reduce) document.documentElement.classList.add("anim");
  function revealPass(vh) {
    for (var i = 0; i < revealEls.length; i++) {
      var el = revealEls[i];
      if (el.classList.contains("in")) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add("in");
    }
  }
  // safety net: never leave content hidden
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }, 2600);

  /* ---------- progress bar + topbar ---------- */
  var progress = document.querySelector(".progress");
  var topbar = document.querySelector(".topbar");
  var masthead = document.querySelector(".masthead");

  /* ---------- parallax + long-screenshot scroll ---------- */
  var parEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
  var scrollers = [].slice.call(document.querySelectorAll("[data-scroll-img]"));
  var navlinks = [].slice.call(document.querySelectorAll(".topbar__nav a"));
  var sections = navlinks.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });

  var vh = window.innerHeight;
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    var docH = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";

    revealPass(vh);

    // topbar appears once past masthead
    if (topbar && masthead) {
      if (y > masthead.offsetHeight * 0.7) topbar.classList.add("show");
      else topbar.classList.remove("show");
    }

    if (motion > 0) {
      // soft parallax — drift relative to element's distance from viewport center
      for (var i = 0; i < parEls.length; i++) {
        var el = parEls[i];
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var off = (center - vh / 2) / vh;          // -1..1 across the viewport
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var t = -off * f * 100 * motion;
        el.style.transform = "translate3d(0," + t.toFixed(2) + "px,0)";
      }
    }

    // long website screenshots scroll through their window
    for (var j = 0; j < scrollers.length; j++) {
      var view = scrollers[j];
      var img = view.querySelector(".browser__scroll");
      if (!img) continue;
      var rr = view.getBoundingClientRect();
      var travel = img.scrollHeight - view.clientHeight;
      if (travel <= 0) continue;
      // progress as the frame moves from entering to leaving the viewport
      var p = (vh - rr.top) / (vh + rr.height);
      p = Math.max(0, Math.min(1, p));
      img.style.transform = "translateY(" + (-travel * p).toFixed(1) + "px)";
    }

    // active nav
    var active = -1;
    for (var k = 0; k < sections.length; k++) {
      if (sections[k] && sections[k].getBoundingClientRect().top <= vh * 0.4) active = k;
    }
    navlinks.forEach(function (a, idx) { a.classList.toggle("active", idx === active); });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () { vh = window.innerHeight; onScroll(); });

  // smooth-scroll for nav + scrollcue
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 64, behavior: reduce ? "auto" : "smooth" });
    });
  });

  onScroll();
})();
