const revealSections = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-target]');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const reviewCards = document.querySelectorAll('.review-card');
const heroMedia = document.querySelector('.hero-media');
const heroImage = document.querySelector('.hero-product-image');
const variantSearch = document.getElementById('variantSearch');
const variantCards = document.querySelectorAll('#warianty .variant-card');
const ageGate = document.getElementById('ageGate');
const ageYes = document.getElementById('ageYes');
const ageNo = document.getElementById('ageNo');
const AGE_STORAGE_KEY = 'merrymi_age_verified_v1';
const wheelOpenBtn = document.getElementById('wheelOpenBtn');
const wheelModal = document.getElementById('wheelModal');
const wheelCloseBtn = document.getElementById('wheelCloseBtn');
const spinBtn = document.getElementById('spinBtn');
const discountWheel = document.getElementById('discountWheel');
const wheelResult = document.getElementById('wheelResult');
const DISCOUNT_VALUES = [10, 15, 20, 25, 30, 35, 40, 45, 50];
const WHEEL_SEGMENTS = DISCOUNT_VALUES.length;
const SEGMENT_DEG = 360 / WHEEL_SEGMENTS;
let hasSpunDiscountWheel = false;
let isWheelSpinning = false;

// Hero Carousel
const heroCarousel = document.getElementById('heroCarousel');
let currentSlideIndex = 0;
const carouselSlides = document.querySelectorAll('.carousel-slide');
const CAROUSEL_INTERVAL = 3000; // 3 seconds

const initHeroCarousel = () => {
  if (!heroCarousel || carouselSlides.length === 0) return;
  
  setInterval(() => {
    carouselSlides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;
    carouselSlides[currentSlideIndex].classList.add('active');
  }, CAROUSEL_INTERVAL);
};

initHeroCarousel();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealSections.forEach((section) => revealObserver.observe(section));

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  let value = 0;
  const step = Math.max(1, Math.ceil(target / 30));

  const loop = () => {
    value += step;
    if (value >= target) {
      counter.textContent = String(target);
      return;
    }
    counter.textContent = String(value);
    requestAnimationFrame(loop);
  };

  loop();
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.65 }
);

counters.forEach((counter) => counterObserver.observe(counter));

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (reviewCards.length > 1) {
  let activeIndex = 0;
  setInterval(() => {
    reviewCards[activeIndex].classList.remove('active');
    activeIndex = (activeIndex + 1) % reviewCards.length;
    reviewCards[activeIndex].classList.add('active');
  }, 2500);
}

if (heroMedia) {
  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 6;
    const y = (event.clientY / window.innerHeight - 0.5) * -6;
    heroMedia.style.transform = `translate(${x}px, ${y}px)`;
  });
}

if (heroImage) {
  const heroVariants = [
    {
      src: 'images/merrymi-olejki-30ml-lush-ice.png',
      alt: 'MERRYMI Salts 30ml Lush Ice - olejek do e papierosa',
    },
    {
      src: 'images/merrymi-olejki-30ml-miami-mint.png',
      alt: 'MERRYMI Salts 30ml Miami Mint - olejek do e papierosa',
    },
  ];
  let heroIndex = 0;
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroVariants.length;
    heroImage.src = heroVariants[heroIndex].src;
    heroImage.alt = heroVariants[heroIndex].alt;
  }, 3000);
}

if (variantSearch && variantCards.length) {
  variantSearch.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();

    variantCards.forEach((card) => {
      const flavor = card.querySelector('h3')?.textContent?.toLowerCase() ?? '';
      card.style.display = flavor.includes(query) ? '' : 'none';
    });
  });
}

const setAgeVerified = () => {
  try {
    localStorage.setItem(AGE_STORAGE_KEY, 'true');
  } catch (_error) {
    // Ignore storage failures (private mode / blocked storage).
  }
};

const getAgeVerified = () => {
  try {
    return localStorage.getItem(AGE_STORAGE_KEY) === 'true';
  } catch (_error) {
    return false;
  }
};

const openAgeGate = () => {
  if (!ageGate) return;
  ageGate.classList.add('visible');
  document.body.classList.add('age-gate-open');
};

const closeAgeGate = () => {
  if (!ageGate) return;
  ageGate.classList.remove('visible');
  document.body.classList.remove('age-gate-open');
};

if (ageGate && ageYes && ageNo) {
  if (!getAgeVerified()) {
    openAgeGate();
  }

  ageYes.addEventListener('click', () => {
    setAgeVerified();
    closeAgeGate();
  });

  ageNo.addEventListener('click', () => {
    window.location.href = 'https://www.google.com/';
  });
}

const applyDiscountBadges = (percent) => {
  if (!percent) return;
  variantCards.forEach((card) => {
    let badge = card.querySelector('.discount-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'discount-badge';
      card.appendChild(badge);
    }
    badge.textContent = `-${percent}% Rabat`;
  });
};

const hideWheelButton = () => {
  if (!wheelOpenBtn) return;
  wheelOpenBtn.classList.add('hidden');
};

const openWheel = () => {
  if (!wheelModal) return;
  if (spinBtn) {
    spinBtn.disabled = false;
    spinBtn.textContent = hasSpunDiscountWheel ? 'Zamknij' : 'Zakręć i wygraj';
  }
  wheelModal.classList.add('visible');
  wheelModal.setAttribute('aria-hidden', 'false');
};

const closeWheel = () => {
  if (!wheelModal) return;
  wheelModal.classList.remove('visible');
  wheelModal.setAttribute('aria-hidden', 'true');
};

const getRandomIndex = () => Math.floor(Math.random() * WHEEL_SEGMENTS);

if (wheelOpenBtn && wheelModal && wheelCloseBtn && spinBtn && discountWheel && wheelResult) {
  discountWheel.innerHTML = DISCOUNT_VALUES.map(
    (value, idx) =>
      `<span class="wheel-label" style="--a:${idx * SEGMENT_DEG + SEGMENT_DEG / 2}deg">${value}%</span>`
  ).join('');

  wheelOpenBtn.addEventListener('click', openWheel);
  wheelCloseBtn.disabled = false;
  wheelCloseBtn.setAttribute('aria-disabled', 'false');
  wheelCloseBtn.addEventListener('click', () => {
    if (isWheelSpinning) return;
    closeWheel();
  });

  spinBtn.addEventListener('click', () => {
    if (hasSpunDiscountWheel) {
      closeWheel();
      return;
    }

    isWheelSpinning = true;
    spinBtn.disabled = true;
    const idx = getRandomIndex();
    const won = DISCOUNT_VALUES[idx];
    const extraTurns = 7;
    const segmentCenter = idx * SEGMENT_DEG + SEGMENT_DEG / 2;
    // Conic gradient starts at 0deg at top; align winning segment center with top pointer.
    const landingAngle = (360 - segmentCenter) % 360;
    const totalRotation = extraTurns * 360 + landingAngle;
    discountWheel.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      isWheelSpinning = false;
      hasSpunDiscountWheel = true;
      applyDiscountBadges(won);
      wheelResult.textContent = `Gratulacje! Wygrywasz -${won}% Rabat`;
      hideWheelButton();
      spinBtn.disabled = false;
      spinBtn.textContent = 'Zamknij';
    }, 4000);
  });
}
