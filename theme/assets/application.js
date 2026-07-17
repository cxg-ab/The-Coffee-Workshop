/**
 * The Coffee Workshop — theme JavaScript
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(container) {
  const focusable = [...container.querySelectorAll(FOCUSABLE)];
  if (!focusable.length) return () => {};

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handler = (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', handler);
  first.focus();
  return () => container.removeEventListener('keydown', handler);
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-mobile-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Mobile Dropdown Accordions
  const mobileDropdowns = document.querySelectorAll('[data-mobile-dropdown]');
  mobileDropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('[data-mobile-dropdown-toggle]');
    const dropdownMenu = dropdown.querySelector('[data-mobile-dropdown-menu]');
    const icon = dropdown.querySelector('[data-mobile-dropdown-icon]');
    
    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = dropdownMenu.classList.contains('hidden');
        dropdownMenu.classList.toggle('hidden', !isHidden);
        dropdownMenu.classList.toggle('flex', isHidden);
        if (icon) {
          icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }
  });
}

function initCartDrawer() {
  const drawer = document.querySelector('[data-cart-drawer]');
  const overlay = document.querySelector('[data-cart-overlay]');
  const openButtons = document.querySelectorAll('[data-cart-toggle]');
  const closeButton = document.querySelector('[data-cart-close]');
  if (!drawer || !overlay) return;

  let releaseFocus = null;

  const open = () => {
    drawer.hidden = false;
    overlay.classList.remove('pointer-events-none', 'opacity-0');
    overlay.classList.add('opacity-100');
    drawer.classList.remove('ltr:translate-x-full', 'rtl:-translate-x-full');
    document.body.style.overflow = 'hidden';
    releaseFocus = trapFocus(drawer);
  };

  const close = () => {
    drawer.classList.add('ltr:translate-x-full', 'rtl:-translate-x-full');
    overlay.classList.add('pointer-events-none', 'opacity-0');
    overlay.classList.remove('opacity-100');
    document.body.style.overflow = '';
    if (releaseFocus) releaseFocus();
    releaseFocus = null;
    window.setTimeout(() => {
      drawer.hidden = true;
    }, 300);
  };

  openButtons.forEach((button) => button.addEventListener('click', open));
  closeButton?.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawer.hidden) close();
  });
}

function initLocaleSwitcher() {
  const select = document.querySelector('[data-locale-select]');
  if (!select) return;

  select.addEventListener('change', () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/localization';

    const localeInput = document.createElement('input');
    localeInput.type = 'hidden';
    localeInput.name = 'locale_code';
    localeInput.value = select.value;
    form.appendChild(localeInput);

    const returnTo = document.createElement('input');
    returnTo.type = 'hidden';
    returnTo.name = 'return_to';
    returnTo.value = window.location.pathname + window.location.search;
    form.appendChild(returnTo);

    document.body.appendChild(form);
    form.submit();
  });
}

function shuffleArray(items) {
  const list = items.slice();
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function initHeroArabicShuffle() {
  const fields = document.querySelectorAll('[data-hero-arabic-bg]');
  if (!fields.length) return;

  fields.forEach(field => {
    const words = (field.dataset.heroArabicWords || '')
      .split(',')
      .map((word) => word.trim())
      .filter(Boolean);
    const slots = [...field.querySelectorAll('.hero-arabic-bg__word')];
    if (!words.length || !slots.length) return;

    const storageKey = 'tcw-hero-arabic-order-v3';
    let order = null;

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) order = JSON.parse(saved);
    } catch {
      order = null;
    }

    if (!Array.isArray(order) || order.length !== words.length) {
      order = shuffleArray(words.map((_, index) => index));
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(order));
      } catch {
        /* ignore storage errors */
      }
    }

    slots.forEach((slot, index) => {
      const word = words[order[index % order.length]];
      if (word) slot.textContent = word;
    });

    field.classList.add('is-ready');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroArabicShuffle();
  initMobileMenu();
  initCartDrawer();
  initLocaleSwitcher();
});

document.addEventListener('shopify:section:load', initHeroArabicShuffle);
