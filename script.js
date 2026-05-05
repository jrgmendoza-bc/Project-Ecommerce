function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card reveal";
  card.id = product.id;
  card.setAttribute("role", "link");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `View ${product.name}`);
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

  const detailUrl = `product-detail.html?id=${product.id}`;

  card.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    window.location.href = detailUrl;
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = detailUrl;
    }
  });

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
    setupCarousel();
  }
}

function setupCarousel() {
  const track = document.getElementById("featuredGrid");
  if (!track) return;

  const wrapper = track.closest(".carousel-wrapper");
  if (!wrapper) return;

  const carousel = track.parentElement; // .featured-carousel
  const prevBtn = wrapper.querySelector(".carousel-prev");
  const nextBtn = wrapper.querySelector(".carousel-next");

  const getScrollAmount = () => {
    const card = track.querySelector(".product-card");
    return card ? card.offsetWidth + 20 : 320;
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });
  }

  // Drag-to-scroll (mouse)
  let isDragging = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;
  let didDrag = false;

  carousel.addEventListener("mousedown", (e) => {
    isDragging = true;
    didDrag = false;
    dragStartX = e.pageX - carousel.offsetLeft;
    dragScrollLeft = carousel.scrollLeft;
    carousel.style.cursor = "grabbing";
  });

  carousel.addEventListener("mouseleave", () => {
    isDragging = false;
    carousel.style.cursor = "";
  });

  carousel.addEventListener("mouseup", () => {
    isDragging = false;
    carousel.style.cursor = "";
  });

  carousel.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    if (Math.abs(walk) > 4) didDrag = true;
    carousel.scrollLeft = dragScrollLeft - walk;
  });

  // Prevent card click after drag
  carousel.addEventListener("click", (e) => {
    if (didDrag) {
      e.stopPropagation();
      didDrag = false;
    }
  }, true);

  // Touch swipe
  let touchStartX = 0;
  let touchScrollLeft = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
  }, { passive: true });

  carousel.addEventListener("touchmove", (e) => {
    const walk = touchStartX - e.touches[0].pageX;
    carousel.scrollLeft = touchScrollLeft + walk;
  }, { passive: true });

  // Auto-scroll
  let autoTimer = null;

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (maxScroll <= 0) return;
      if (carousel.scrollLeft >= maxScroll - 4) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
      }
    }, 3800);
  };

  const stopAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  };

  startAuto();
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);
  carousel.addEventListener("touchstart", stopAuto, { passive: true });
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

function setHeroHeight() {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;
  const top = hero.getBoundingClientRect().top + window.scrollY;
  hero.style.height = (window.innerHeight - top) + "px";
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

  const setActiveByHref = (targetHref) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === targetHref);
    });
  };

  if (path === "product-detail.html") {
    setActiveByHref("index.html#products");
    return;
  }

  setActiveByHref("#home");

  const sectionLinks = links.filter((link) => link.getAttribute("href").startsWith("#"));
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const syncHashState = () => {
    const { hash } = window.location;
    if (hash && sectionLinks.some((link) => link.getAttribute("href") === hash)) {
      setActiveByHref(hash);
    }
  };

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveByHref(link.getAttribute("href"));
      if (link.getAttribute("href") === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  window.addEventListener("hashchange", syncHashState);
  syncHashState();

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

function setupFeaturedBannerCarousel() {
  const carousel = document.getElementById("featuredBannerCarousel");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll(".fbc-slide")];
  const dots = [...carousel.querySelectorAll(".fbc-dot")];
  let current = 0;
  let animating = false;
  let autoTimer = null;

  const goTo = (index, direction) => {
    if (animating || index === current) return;
    animating = true;

    const outgoing = slides[current];
    const incoming = slides[index];

    incoming.classList.add("is-active");

    // Set up incoming position off-screen while keeping it in the active state.
    if (direction === "prev") {
      incoming.classList.add("is-entering-from-left");
    }
    incoming.style.transition = "none";
    incoming.style.opacity = "0";
    incoming.style.transform = direction === "next" ? "translateX(60px)" : "translateX(-60px)";
    incoming.style.pointerEvents = "none";

    // Force reflow
    incoming.getBoundingClientRect();
    incoming.style.transition = "";

    // Animate outgoing out
    outgoing.classList.add("is-leaving");
    outgoing.classList.remove("is-active");
    outgoing.style.transform = direction === "next" ? "translateX(-60px)" : "translateX(60px)";

    // Animate incoming in
    incoming.style.opacity = "1";
    incoming.style.transform = "translateX(0)";

    setTimeout(() => {
      outgoing.classList.remove("is-leaving");
      outgoing.style.cssText = "";
      incoming.classList.remove("is-entering-from-left");
      incoming.style.cssText = "";

      dots[current].classList.remove("is-active");
      dots[index].classList.add("is-active");
      current = index;
      animating = false;
    }, 440);
  };

  const next = () => goTo((current + 1) % slides.length, "next");
  const prev = () => goTo((current - 1 + slides.length) % slides.length, "prev");

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(next, 4500);
  };
  const stopAuto = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
    }
    autoTimer = null;
  };

  const prevBtn = carousel.querySelector(".fbc-arrow--prev");
  const nextBtn = carousel.querySelector(".fbc-arrow--next");

  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAuto(); });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
      startAuto();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
      startAuto();
    }
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i, i > current ? "next" : "prev");
      startAuto();
    });
  });

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  startAuto();
}

function init() {
  setHeroHeight();
  window.addEventListener("resize", setHeroHeight);
  renderProducts();
  renderProductDetail();
  setupMobileNav();
  setupRevealAnimation();
  setupActiveNav();
  setupFeaturedBannerCarousel();
}

document.addEventListener("DOMContentLoaded", init);
