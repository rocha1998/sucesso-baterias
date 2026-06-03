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
const productShowcase = document.querySelector(".product-showcase");
const productShowcaseCards = document.querySelectorAll(".product-showcase__card");
const productShowcaseDots = document.querySelectorAll("[data-product-dot]");
const whatsappLinks = document.querySelectorAll('a[href*="wa.me/"]');

const GOOGLE_ADS_CONTACT_SEND_TO = "AW-18158988776/SCe8CMmg8bYcEOjb8NJD";

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

const trackGoogleAdsContactConversion = ({ url, openInNewTab }) => {
  if (typeof window.gtag !== "function") {
    if (url && !openInNewTab) {
      window.location.href = url;
    }

    return;
  }

  let hasNavigated = false;

  const navigateToContact = () => {
    if (!url || openInNewTab || hasNavigated) {
      return;
    }

    hasNavigated = true;
    window.location.href = url;
  };

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CONTACT_SEND_TO,
    event_callback: navigateToContact,
  });

  window.setTimeout(navigateToContact, 1000);
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

if (whatsappLinks.length) {
  whatsappLinks.forEach((link) => {
    if (link.dataset.conversionBound === "true") {
      return;
    }

    link.dataset.conversionBound = "true";

    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      const openInNewTab = link.target === "_blank" || isModifiedClick;

      if (!openInNewTab) {
        event.preventDefault();
      }

      trackGoogleAdsContactConversion({
        url: link.href,
        openInNewTab,
      });
    });
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

if (productShowcase && productShowcaseCards.length && productShowcaseDots.length) {
  const setActiveProductDot = (activeIndex) => {
    productShowcaseDots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  const updateActiveProductFromScroll = () => {
    const showcaseLeft = productShowcase.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    productShowcaseCards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - showcaseLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveProductDot(closestIndex);
  };

  productShowcaseDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const targetCard = productShowcaseCards[index];

      if (!targetCard) {
        return;
      }

      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveProductDot(index);
    });
  });

  productShowcase.addEventListener("scroll", updateActiveProductFromScroll, {
    passive: true,
  });

  window.addEventListener("resize", updateActiveProductFromScroll);
  updateActiveProductFromScroll();
}
