const animatedElements = document.querySelectorAll(
  ".contact-strip, .topbar, .hero__copy, .hero__panel, .hero__actions, .highlight-card, .section-heading, .product-card, .region-card, .brand-card, .testimonial-card, .about__content, .about__panel, .cta__content, .footer__grid > div"
);

const navToggle = document.querySelector(".nav-toggle");
const navShell = document.querySelector(".nav-shell");
const navLinks = document.querySelectorAll(".nav a, .nav-mobile-cta a");

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
