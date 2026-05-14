const animatedElements = document.querySelectorAll(
  ".contact-strip, .topbar, .hero__copy, .hero__panel, .hero__actions, .highlight-card, .section-heading, .product-card, .region-card, .brand-card, .testimonial-card, .about__content, .about__panel, .cta__content, .footer__grid > div"
);

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
