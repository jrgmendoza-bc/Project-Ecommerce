function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card reveal";
  card.id = product.id;
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.images[0]}" alt="${product.name} product image">
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-desc">${product.shortDescription}</p>
      <div class="product-price">${product.priceText}</div>
      <div class="product-button-wrap">
        <a class="buy-button product-button" href="product-detail.html?id=${product.id}">View Product</a>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  const products = Array.isArray(window.PRODUCT_DATA) ? window.PRODUCT_DATA : [];
  const featuredHost = document.getElementById("featuredGrid");
  if (featuredHost) {
    featuredHost.innerHTML = "";
    products.forEach((product) => {
      featuredHost.appendChild(createProductCard(product));
    });
  }
}

function renderProductDetail() {
  const detailRoot = document.getElementById("productDetailRoot");
  if (!detailRoot) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = typeof getProductById === "function" ? getProductById(productId) : null;

  if (!product) {
    detailRoot.innerHTML = `
      <article class="detail-card reveal is-visible">
        <h1 class="section-title">Product Not Found</h1>
        <p class="section-copy section-copy-compact">The selected product could not be found. Return to the store and choose another product.</p>
        <a class="cta-button" href="index.html#products">Back to Products</a>
      </article>
    `;
    return;
  }

  document.title = `MICROBOT | ${product.name}`;
  let activeImageIndex = 0;

  detailRoot.innerHTML = `
    <article class="detail-card reveal is-visible">
      <div class="detail-layout">
        <div class="detail-media">
          <div class="detail-main-image-wrap">
            <button class="gallery-nav gallery-prev" type="button" aria-label="Previous image">&#10094;</button>
            <img id="detailMainImage" class="detail-main-image" src="${product.images[0]}" alt="${product.name} image">
            <button class="gallery-nav gallery-next" type="button" aria-label="Next image">&#10095;</button>
          </div>
          <div class="detail-thumbs" id="detailThumbs"></div>
        </div>
        <div class="detail-content">
          <p class="detail-label">MICROBOT PRODUCT</p>
          <h1 class="detail-title">${product.name}</h1>
          <p class="detail-price">${product.priceText}</p>
          <p class="detail-description">${product.fullDescription}</p>
          <div class="detail-list-wrap">
            <h2 class="detail-list-title">Key Features</h2>
            <ul id="featureList" class="detail-list"></ul>
          </div>
          <div class="detail-list-wrap">
            <h2 class="detail-list-title">Applications</h2>
            <ul id="applicationList" class="detail-list"></ul>
          </div>
          <div class="detail-actions">
            <a class="buy-button detail-buy" href="${product.shopeeLink || "https://shopee.ph/"}" target="_blank" rel="noopener">Buy Now</a>
            <a class="section-link" href="index.html#products">Back to Products</a>
          </div>
        </div>
      </div>
    </article>
  `;

  const mainImage = document.getElementById("detailMainImage");
  const thumbs = document.getElementById("detailThumbs");
  const features = document.getElementById("featureList");
  const applications = document.getElementById("applicationList");
  const prevButton = detailRoot.querySelector(".gallery-prev");
  const nextButton = detailRoot.querySelector(".gallery-next");

  product.keyFeatures.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    features.appendChild(li);
  });

  product.applications.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    applications.appendChild(li);
  });

  const setActiveImage = (index) => {
    activeImageIndex = (index + product.images.length) % product.images.length;
    mainImage.src = product.images[activeImageIndex];
    mainImage.alt = `${product.name} image ${activeImageIndex + 1}`;
    thumbs.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === activeImageIndex);
    });
  };

  product.images.forEach((imagePath, index) => {
    const button = document.createElement("button");
    button.className = "detail-thumb";
    button.type = "button";
    button.setAttribute("aria-label", `Show image ${index + 1}`);
    button.innerHTML = `<img src="${imagePath}" alt="${product.name} thumbnail ${index + 1}">`;
    button.addEventListener("click", () => setActiveImage(index));
    thumbs.appendChild(button);
  });

  prevButton.addEventListener("click", () => setActiveImage(activeImageIndex - 1));
  nextButton.addEventListener("click", () => setActiveImage(activeImageIndex + 1));
  setActiveImage(0);
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".shell-nav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeNav();
    }
  });
}

function setupRevealAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    if (!element.classList.contains("reveal-hero")) {
      observer.observe(element);
    }
  });
}

function setupActiveNav() {
  const links = [...document.querySelectorAll(".shell-link")];
  const path = window.location.pathname.split("/").pop() || "index.html";

  if (path === "product-detail.html") {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "index.html#products");
    });
    return;
  }

  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === "#home");
  });

  const sectionLinks = links.filter((link) => link.getAttribute("href").startsWith("#"));
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      const activeId = `#${visible.target.id}`;
      sectionLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === activeId;
        link.classList.toggle("is-active", isActive);
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function init() {
  renderProducts();
  renderProductDetail();
  setupMobileNav();
  setupRevealAnimation();
  setupActiveNav();
}

document.addEventListener("DOMContentLoaded", init);
