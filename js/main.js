document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var quoteForm = document.getElementById("quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(quoteForm);
      var service = data.get("service") || "General enquiry";
      var reason = data.get("reason") || "info";

      var recipient = reason === "sales"
        ? "sales@sujumaengineeringltd.com"
        : "info@sujumaengineeringltd.com";

      var subjectPrefix = reason === "sales" ? "Sales enquiry" : "General enquiry";
      var subject = subjectPrefix + " — " + service;
      var body =
        "Name: " + data.get("name") + "\n" +
        "Company: " + (data.get("company") || "-") + "\n" +
        "Email: " + data.get("email") + "\n" +
        "Phone: " + data.get("phone") + "\n" +
        "Service needed: " + service + "\n" +
        "Site location: " + data.get("location") + "\n\n" +
        "Project details:\n" + data.get("details");

      var mailto =
        "mailto:" + recipient +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      var confirmation = document.getElementById("form-confirmation");
      if (confirmation) {
        var recipientEl = document.getElementById("fc-recipient");
        if (recipientEl) recipientEl.textContent = recipient;

        var revealed = false;
        var leftPage = false;
        var fallbackTimer = null;

        function revealConfirmation() {
          if (revealed) return;
          revealed = true;
          window.removeEventListener("blur", onBlur);
          window.removeEventListener("focus", onFocus);
          document.removeEventListener("visibilitychange", onVisibility);
          if (fallbackTimer) clearTimeout(fallbackTimer);
          confirmation.hidden = false;
          confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
          confirmation.focus();
        }

        function onBlur() { leftPage = true; }
        function onFocus() { if (leftPage) revealConfirmation(); }
        function onVisibility() {
          if (document.visibilityState === "visible" && leftPage) revealConfirmation();
        }

        window.addEventListener("blur", onBlur);
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);

        /* Safety net: some browsers/OSes never fire blur for mailto (e.g. no
           mail client configured). Reveal anyway after a short delay so the
           person still gets feedback either way. */
        fallbackTimer = setTimeout(revealConfirmation, 2500);
      }
      quoteForm.reset();
    });
  }

  /* Hero slider — rotate through background images */
  var heroBgImgs = document.querySelectorAll(".hero-bg-img");
  var heroSlides = document.querySelectorAll(".hero-slide");
  var heroDots = document.getElementById("hero-dots");
  var currentIndex = 0;
  var rotationInterval = 6000; /* 6 seconds per slide */

  function updateSlide(index) {
    /* Update hero background images */
    heroBgImgs.forEach((img, i) => {
      img.classList.toggle("is-active", i === index);
    });
    
    /* Update hero slides */
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    
    /* Update dots */
    if (heroDots) {
      var dots = heroDots.querySelectorAll(".hero-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    }
    
    currentIndex = index;
  }

  function nextSlide() {
    var totalSlides = heroSlides.length || heroBgImgs.length;
    updateSlide((currentIndex + 1) % totalSlides);
  }

  function initHeroDots() {
    var totalSlides = heroSlides.length || heroBgImgs.length;
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement("button");
      dot.className = "hero-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Slide " + (i + 1));
      dot.addEventListener("click", function(e) {
        updateSlide(Array.from(e.currentTarget.parentElement.children).indexOf(e.currentTarget));
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, rotationInterval);
      });
      heroDots.appendChild(dot);
    }
  }

  if (heroDots) {
    initHeroDots();
  }

  var sliderInterval = setInterval(nextSlide, rotationInterval);
});
