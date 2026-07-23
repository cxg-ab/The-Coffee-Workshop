/**
 * The Coffee Workshop — theme JavaScript
 * Mobile menu · cart drawer · AJAX add-to-cart · locale · hero Arabic shuffle
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

function formatMoney(cents, format) {
  if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
    return window.Shopify.formatMoney(cents, format);
  }
  const amount = (Number(cents) / 100).toFixed(2);
  return `AED ${amount}`;
}

function moneyFormat() {
  return (window.theme && window.theme.moneyFormat) || '{{amount}}';
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-mobile-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  const mobileDropdowns = document.querySelectorAll('[data-mobile-dropdown]');
  mobileDropdowns.forEach((dropdown) => {
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
    overlay.classList.remove('pointer-events-none', 'opacity-0');
    overlay.classList.add('opacity-100');
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    releaseFocus = trapFocus(drawer);
  };

  const close = () => {
    drawer.classList.remove('is-open');
    overlay.classList.add('pointer-events-none', 'opacity-0');
    overlay.classList.remove('opacity-100');
    document.body.style.overflow = '';
    if (releaseFocus) releaseFocus();
    releaseFocus = null;
  };

  openButtons.forEach((button) => button.addEventListener('click', open));
  closeButton?.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });

  window.TCW = window.TCW || {};
  window.TCW.openCartDrawer = open;
  window.TCW.closeCartDrawer = close;
}

function updateCartCount(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
    el.classList.toggle('hidden', Number(count) === 0);
  });

  document.querySelectorAll('[data-cart-drawer-count]').forEach((el) => {
    el.textContent = `(${count})`;
  });
}

/* Escape untrusted values before they are interpolated into innerHTML.
   Cart line data (product/variant titles, urls) is merchant/catalog sourced,
   but line-item properties and app-injected titles can carry markup — escape
   so a title like `<img onerror=...>` renders as text, never as HTML. */
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCartLineHtml(item) {
  const url = escapeHtml(item.url);
  const title = escapeHtml(item.product_title);
  const key = escapeHtml(item.key);
  const image = item.image
    ? `<a href="${url}" class="shrink-0"><img src="${escapeHtml(item.image)}" alt="${title}" class="h-20 w-20 object-cover" loading="lazy" width="80" height="80"></a>`
    : '';
  const variant =
    item.variant_title && item.variant_title !== 'Default Title'
      ? `<p class="mt-1 text-xs text-muted">${escapeHtml(item.variant_title)}</p>`
      : '';

  return `
    <li class="flex gap-4 py-4" data-cart-line-item="${key}">
      ${image}
      <div class="min-w-0 flex-1">
        <a href="${url}" class="block text-sm font-medium text-ink hover:text-brand">${title}</a>
        ${variant}
        <div class="mt-2 flex items-center justify-between gap-2">
          <span class="text-sm font-semibold text-brand">${formatMoney(item.final_line_price, moneyFormat())}</span>
          <span class="text-xs text-muted">× ${escapeHtml(item.quantity)}</span>
        </div>
      </div>
    </li>
  `;
}

function renderCartDrawer(cart) {
  const itemsRoot = document.querySelector('[data-cart-drawer-items]');
  const subtotal = document.querySelector('[data-cart-subtotal]');
  const checkoutBtn = document.querySelector('[data-cart-drawer] button[name="checkout"]');
  const emptyLabel = (window.theme && window.theme.strings && window.theme.strings.cartEmpty) || 'Your cart is empty';

  if (itemsRoot) {
    if (!cart.item_count) {
      itemsRoot.innerHTML = `<p class="py-12 text-center text-sm text-muted">${emptyLabel}</p>`;
    } else {
      itemsRoot.innerHTML = `<ul class="divide-y divide-line">${cart.items.map(buildCartLineHtml).join('')}</ul>`;
    }
  }

  if (subtotal) {
    subtotal.textContent = formatMoney(cart.total_price, moneyFormat());
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.item_count === 0;
  }

  updateCartCount(cart.item_count);
}

async function fetchCart() {
  const response = await fetch('/cart.js', {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('cart_fetch_failed');
  return response.json();
}

async function addToCart(form) {
  const formData = new FormData(form);
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data.description ||
      data.message ||
      (window.theme && window.theme.strings && window.theme.strings.cartAddError) ||
      'Could not add to cart';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

function setAddButtonState(button, state) {
  if (!button) return;
  const addLabel = button.dataset.addLabel || 'Add to cart';
  const addingLabel =
    button.dataset.addingLabel ||
    (window.theme && window.theme.strings && window.theme.strings.addingToCart) ||
    'Adding…';
  const soldoutLabel = button.dataset.soldoutLabel || 'Sold out';
  const hasIcon = button.querySelector('svg');

  if (state === 'loading') {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    if (!hasIcon) button.textContent = addingLabel;
    return;
  }

  button.removeAttribute('aria-busy');

  if (state === 'soldout') {
    button.disabled = true;
    if (!hasIcon) button.textContent = soldoutLabel;
    return;
  }

  button.disabled = false;
  if (!hasIcon) button.textContent = addLabel;
}

function showFormError(form, message) {
  let errorEl = form.querySelector('[data-cart-error]');
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.className = 'mt-3 text-sm text-red-700';
    errorEl.setAttribute('data-cart-error', '');
    errorEl.setAttribute('role', 'alert');
    form.appendChild(errorEl);
  }
  errorEl.textContent = message || '';
  errorEl.hidden = !message;
  errorEl.classList.toggle('hidden', !message);
}

function initAjaxCart() {
  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const isProductForm = form.id === 'product-form' || form.matches('[data-ajax-cart]');
    const isCartAdd = form.getAttribute('action') === '/cart/add' || (form.action && form.action.includes('/cart/add'));
    if (!isProductForm && !isCartAdd) return;
    if (form.dataset.ajaxCart === 'false') return;

    event.preventDefault();

    const button =
      form.querySelector('[data-add-to-cart-btn], [type="submit"][name="add"], button[type="submit"]') ||
      form.querySelector('button[type="submit"]');

    showFormError(form, '');
    setAddButtonState(button, 'loading');

    try {
      await addToCart(form);
      const cart = await fetchCart();
      renderCartDrawer(cart);
      if (window.TCW && typeof window.TCW.openCartDrawer === 'function') {
        window.TCW.openCartDrawer();
      }
      setAddButtonState(button, 'idle');
    } catch (error) {
      const msg = error && error.message ? error.message : 'Could not add to cart';
      showFormError(form, msg);
      const soldOut = /sold out|inventory|unavailable/i.test(msg);
      setAddButtonState(button, soldOut ? 'soldout' : 'idle');
    }
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

  fields.forEach((field) => {
    const words = (field.dataset.heroArabicWords || '')
      .split(',')
      .map((word) => word.trim())
      .filter(Boolean);
    const slots = [...field.querySelectorAll('.hero-arabic-bg__word')];
    if (!words.length || !slots.length) return;

    const storageKey = 'tcw-hero-arabic-order-v4';
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

function initHomeTrustMarquee(root) {
  const sections = root
    ? [root].filter((el) => el?.matches?.('[data-home-trust]'))
    : [...document.querySelectorAll('[data-home-trust]')];

  sections.forEach((section) => {
    if (section.dataset.trustMarqueeInit === '1') return;

    const enabled = section.dataset.trustMarquee === 'true';
    const track = section.querySelector('[data-trust-track]');
    const viewport = section.querySelector('.home-trust-bar__viewport');
    if (!enabled || !track || !viewport) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    section.dataset.trustMarqueeInit = '1';

    const durationSec = Math.max(10, Number(section.dataset.trustDuration) || 40);
    const pauseOnHover = section.dataset.trustPauseHover !== 'false';

    // Keep one content set, fill track with seamless clones (no gap between repeats)
    const source = track.querySelector('.home-trust-bar__list');
    if (!source) return;

    track.querySelectorAll('.home-trust-bar__list[data-trust-clone]').forEach((node) => node.remove());

    const fillTrack = () => {
      track.querySelectorAll('.home-trust-bar__list[data-trust-clone]').forEach((node) => node.remove());
      const setWidth = source.offsetWidth;
      if (setWidth <= 0) return 0;

      let copies = 2;
      const need = viewport.clientWidth * 2;
      while (setWidth * copies < need) copies += 1;

      for (let i = 1; i < copies; i += 1) {
        const clone = source.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('data-trust-clone', 'true');
        clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
        track.appendChild(clone);
      }
      return setWidth;
    };

    let offset = 0;
    let paused = false;
    let lastTs = 0;
    let rafId = 0;
    let setWidth = 0;

    const measure = () => {
      setWidth = fillTrack();
    };

    const tick = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (!paused && setWidth > 0) {
        const pxPerSec = setWidth / durationSec;
        offset += pxPerSec * dt;
        if (offset >= setWidth) offset %= setWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    measure();
    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      const prev = setWidth;
      measure();
      if (setWidth > 0) {
        if (prev > 0) offset = (offset / prev) * setWidth;
        offset %= setWidth;
      }
    };
    window.addEventListener('resize', onResize);

    if (pauseOnHover) {
      section.addEventListener('mouseenter', () => {
        paused = true;
        section.classList.add('is-paused');
      });
      section.addEventListener('mouseleave', () => {
        paused = false;
        lastTs = 0;
        section.classList.remove('is-paused');
      });
    }

    section._trustMarqueeCleanup = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      delete section.dataset.trustMarqueeInit;
    };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroArabicShuffle();
  initHomeTrustMarquee();
  initMobileMenu();
  initCartDrawer();
  initAjaxCart();
  initLocaleSwitcher();
});

document.addEventListener('shopify:section:load', (event) => {
  initHeroArabicShuffle();
  initHomeTrustMarquee(event.target);
});

document.addEventListener('shopify:section:unload', (event) => {
  const section = event.target?.querySelector?.('[data-home-trust]') || event.target;
  section?._trustMarqueeCleanup?.();
});

