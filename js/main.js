/**
 * Minimal bilingual switcher and responsive navigation
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio_lang';

  // Determine initial language: URL param -> localStorage -> browser language -> 'it'
  function getPreferredLanguage() {
    var urlParams = new URLSearchParams(window.location.search);
    var langParam = urlParams.get('lang');
    if (langParam === 'it' || langParam === 'en') {
      return langParam;
    }
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'it' || saved === 'en') {
      return saved;
    }
    var navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (navLang.indexOf('it') === 0) {
      return 'it';
    }
    return 'en';
  }

  function setLanguage(lang) {
    if (lang !== 'it' && lang !== 'en') lang = 'it';
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Update active class on toggle buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Update visible translatable texts
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key]) {
        el.innerHTML = window.TRANSLATIONS[lang][key];
      }
    });

    // Update translatable attributes (e.g. aria-label, title, href, download)
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var attrRules = el.getAttribute('data-i18n-attr').split(';');
      attrRules.forEach(function (rule) {
        var parts = rule.trim().split(':');
        if (parts.length === 2) {
          var attrName = parts[0].trim();
          var key = parts[1].trim();
          if (window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key]) {
            el.setAttribute(attrName, window.TRANSLATIONS[lang][key]);
          }
        }
      });
    });

    // Update page title if translation exists
    if (window.PAGE_TITLE_KEY && window.TRANSLATIONS && window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][window.PAGE_TITLE_KEY]) {
      document.title = window.TRANSLATIONS[lang][window.PAGE_TITLE_KEY];
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Language buttons click events
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var selectedLang = btn.getAttribute('data-lang');
        setLanguage(selectedLang);
      });
    });

    // Fallback for avatar image if not yet present
    var avatarImg = document.querySelector('.hero-avatar');
    if (avatarImg) {
      avatarImg.addEventListener('error', function () {
        var wrapper = avatarImg.parentElement;
        if (wrapper) {
          avatarImg.style.display = 'none';
          var placeholder = document.createElement('div');
          placeholder.className = 'avatar-placeholder';
          placeholder.textContent = 'GN';
          wrapper.appendChild(placeholder);
        }
      });
    }

    // Apply language on initial load
    var initialLang = getPreferredLanguage();
    setLanguage(initialLang);
  });
})();
