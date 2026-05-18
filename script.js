const animatedElements = document.querySelectorAll(
  ".contact-strip, .topbar, .hero__copy, .hero__stage, .hero__badge, .hero__actions, .highlight-card, .section-heading, .product-card, .product-showcase__card, .region-card, .brand-card, .about__content, .about__panel, .cta__content, .footer__grid > div, .location-card, .reviews-overview, .reviews-carousel"
);

const navToggle = document.querySelector(".nav-toggle");
const navShell = document.querySelector(".nav-shell");
const navLinks = document.querySelectorAll(".nav a, .nav-mobile-cta a");
const promoPopup = document.querySelector("#promo-popup");
const promoPopupCloseButtons = document.querySelectorAll("[data-popup-close]");
const reviewsTrack = document.querySelector("#reviews-track");
const reviewsScrollButtons = document.querySelectorAll("[data-reviews-scroll]");

const openPromoPopup = () => {
  if (!promoPopup || sessionStorage.getItem("promoPopupDismissed") === "true") {
    return;
  }

  promoPopup.classList.add("is-visible");
  promoPopup.setAttribute("aria-hidden", "false");
  document.body.classList.add("promo-open");
};

const closePromoPopup = () => {
  if (!promoPopup) {
    return;
  }

  promoPopup.classList.remove("is-visible");
  promoPopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("promo-open");
  sessionStorage.setItem("promoPopupDismissed", "true");
};

animatedElements.forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  }
);

animatedElements.forEach((element) => observer.observe(element));

const closeMobileMenu = () => {
  document.body.classList.remove("menu-open");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu principal");
  }
};

if (navToggle && navShell) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu principal" : "Abrir menu principal"
    );
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("menu-open")) {
      return;
    }

    const target = event.target;

    if (
      target instanceof Node &&
      !navShell.contains(target) &&
      !navToggle.contains(target)
    ) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

if (promoPopup) {
  window.setTimeout(openPromoPopup, 2200);

  promoPopupCloseButtons.forEach((button) => {
    button.addEventListener("click", closePromoPopup);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePromoPopup();
    }
  });
}

if (reviewsTrack) {
  reviewsScrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.reviewsScroll === "next" ? 1 : -1;
      const scrollAmount = reviewsTrack.clientWidth * 0.88;

      reviewsTrack.scrollBy({
        left: scrollAmount * direction,
        behavior: "smooth",
      });
    });
  });
}
