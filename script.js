const PRODUCTS = [
  {
    id: "byou",
    name: "BYOU / Build Your Own UNO",
    description: "DIY Arduino-Uno-class board with ATMEGA328P, CH9340G USB-TTL, and LM7805 regulation.",
    priceText: "₱1,500",
    image: "assets/images/BYOU/BLK.JPG",
    shopeeLink: "https://shopee.ph/search?keyword=BYOU%20Build%20Your%20Own%20UNO"
  },
  {
    id: "nano-expansion",
    name: "Nano Expansion Board",
    description: "Arduino Nano-compatible expansion module with TB6612FNG support and organized wiring.",
    priceText: "₱500",
    image: "assets/images/Nano Expansion/2.jpg",
    shopeeLink: "https://shopee.ph/search?keyword=Nano%20Expansion%20Board"
  },
  {
    id: "rover-module",
    name: "Rover Robotics Module",
    description: "Arduino Nano-compatible robotics control module with ultrasonic/IR sensor ports and TB6612FNG motor driver mount support.",
    priceText: "₱1,200",
    image: "assets/images/Rover/1.png",
    shopeeLink: "https://shopee.ph/search?keyword=Rover%20Robotics%20Module"
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    description: "New robotics product lineup will be available soon.",
    priceText: "TBA",
    image: "assets/images/Others/2.png",
    comingSoon: true
  }
];

function renderProducts() {
  const host = document.getElementById("productGrid");
  if (!host) return;

  host.innerHTML = PRODUCTS.map(
    (product) => `
      <article class="product-card ${product.comingSoon ? "is-coming-soon" : ""} reveal">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-price">${product.priceText}</div>
          <div class="product-button-wrap">
            ${
              product.comingSoon
                ? '<span class="buy-button product-button coming-soon-button">Coming Soon</span>'
                : `<a class="buy-button product-button" href="${product.shopeeLink || "https://shopee.ph/"}" target="_blank" rel="noopener">Buy Now</a>`
            }
          </div>
        </div>
      </article>
    `
  ).join("");
}

function setupRevealAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    if (!element.classList.contains("reveal-hero")) {
      observer.observe(element);
    }
  });
}

function setupActiveNav() {
  const links = [...document.querySelectorAll(".shell-link")];
  const sections = ["home", "products", "about", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const activeId = visible.target.id;

      links.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function init() {
  renderProducts();
  setupRevealAnimation();
  setupActiveNav();
}

document.addEventListener("DOMContentLoaded", init);
