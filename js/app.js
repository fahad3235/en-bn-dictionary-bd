/* UI wiring for the offline EN-BN pocket dictionary. Pure ASCII sources. */
(function () {
  "use strict";
  var L = window.DictLogic;
  var DATA = window.DICT_DATA || [];

  var STR = {
    en: {
      title: "EN-BN Pocket Dictionary",
      tagline: "Offline English \u2013 Bangla word lookup",
      searchPh: "Type an English or Bangla word...",
      dirLabel: "Direction",
      en2bn: "EN \u2192 BN",
      bn2en: "BN \u2192 EN",
      resultsFor: "results",
      noResults: "No matches. Try another spelling.",
      typeMore: "Type at least 1 letter to search.",
      detailPos: "Part of speech",
      fav: "Favorite",
      unfav: "Remove favorite",
      favTitle: "Favorites",
      favEmpty: "No favorites yet. Tap the star on any word.",
      favClear: "Erase all favorites",
      wotd: "Word of the day",
      random: "Surprise me",
      stats: "entries in this pocket dictionary",
      offline: "100% offline \u2014 no network, no account, no tracking",
      entries: "entries",
      confirmClearTitle: "Erase all favorites?",
      confirmClearBody: "Type DELETE below to erase all favorites.",
      confirmPlaceholder: "Type DELETE",
      cancel: "Cancel",
      confirm: "Erase",
      wrongWord: "Type DELETE exactly.",
      erased: "Favorites erased."
    },
    bn: {
      title: "\u0987\u0982\u09B0\u0947\u099C\u093F\u2013\u09AC\u09BE\u0982\u09B2\u09BE \u09AA\u0995\u09C7\u099F \u0985\u09AD\u09BF\u09A7\u09BE\u09A8",
      tagline: "\u09AA\u09C2\u09B0\u09BE\u09AA\u09C1\u09B0\u09BF \u0985\u09AB\u09B2\u09BE\u0987\u0928 \u09B6\u09AC\u09CD\u09A6 \u0985\u09AD\u09BF\u09A7\u09BE\u09A8",
      searchPh: "\u0987\u0982\u09B0\u0947\u099C\u093F \u09AC\u09BE \u09AC\u09BE\u0982\u09B2\u09BE \u09B6\u09AC\u09CD\u09A6 \u09B2\u09BF\u0996\u09C1\u09A8...",
      dirLabel: "\u09A6\u093F\u0915",
      en2bn: "EN \u2192 BN",
      bn2en: "BN \u2192 EN",
      resultsFor: "\u099F\u09BF \u09AB\u09B2\u09BE\u09AB\u09B2",
      noResults: "\u0995\u09CB\u09A8 \u09AB\u09B2 \u09AA\u09BE\u0993\u09AF\u093C\u093E \u09AF\u09BE\u09AF\u093C\u0928\u093F\u0964 \u0986\u09B0\u09C7\u0995\u091F\u09BF \u09AC\u09BE\u09A8\u09BE\u09A8 \u099A\u09C7\u09B7\u09CD\u099F\u09BE \u0995\u09B0\u09C1\u09A8\u0964",
      typeMore: "\u0996\u09C1\u0981\u099C\u09A4\u09C7 \u0995\u09AE\u09AA\u0995\u09CD\u09B7\u09C7 1\u099F\u09BF \u0985\u0995\u09CD\u09B7\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8\u0964",
      detailPos: "\u09AA\u09A6",
      fav: "\u09AA\u09CD\u09B0\u09BF\u09AF\u09BC",
      unfav: "\u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09A5\u09C7\u0995\u09C7 \u09B8\u09B0\u09BE\u09A8",
      favTitle: "\u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09B6\u09AC\u09CD\u09A6",
      favEmpty: "\u098F\u0996\u09A8\u0993 \u0995\u09CB\u09A8 \u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09B6\u09AC\u09CD\u09A6 \u09A8\u09C7\u0987\u0964 \u09AF\u09C7\u0915\u09CB\u09A8\u09CB \u09B6\u09AC\u09CD\u09A6\u09C7 \u09B8\u09CD\u099F\u09BE\u09B0\u09C7 \u099F\u09CD\u09AF\u09BE\u09AA \u0995\u09B0\u09C1\u09A8\u0964",
      favClear: "\u09B8\u09AC \u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09AE\u09C1\u099B\u09C1\u09A8",
      wotd: "\u0986\u099C\u0995\u09C7\u09B0 \u09B6\u09AC\u09CD\u09A6",
      random: "\u0986\u09AE\u09BE\u0915\u09C7 \u099A\u09AE\u0995\u09BE\u0928",
      stats: "\u099F\u09BF \u09B6\u09AC\u09CD\u09A6 \u098F\u0987 \u0985\u09AD\u09BF\u09A7\u09BE\u09A8\u09C7",
      offline: "100% \u0985\u09AB\u09B2\u09BE\u0987\u0928 \u2014 \u0995\u09CB\u09A8\u09CB \u09A8\u09C7\u099F\u0993\u09AF\u09BC\u09BE\u09B0\u09CD\u0995 \u09A8\u09C7\u0987, \u0995\u09CB\u09A8\u09CB \u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09A8\u09C7\u0987",
      entries: "\u099F\u09BF \u09B6\u09AC\u09CD\u09A6",
      confirmClearTitle: "\u09B8\u09AC \u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09AC\u09C7\u09A8?",
      confirmClearBody: "\u09B8\u09AC \u09AE\u09C1\u099B\u09A4\u09C7 \u09A8\u09BF\u099A\u09C7 DELETE \u09B2\u09BF\u0996\u09C1\u09A8\u0964",
      confirmPlaceholder: "DELETE \u09B2\u09BF\u0996\u09C1\u09A8",
      cancel: "\u09AC\u09BE\u09A4\u09BF\u09B2",
      confirm: "\u09AE\u09C1\u099B\u09C1\u09A8",
      wrongWord: "DELETE \u09B9\u0941\u09AC\u09B9\u0941 \u09B2\u09BF\u0996\u09C1\u09A8\u0964",
      erased: "\u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09B6\u09AC\u09CD\u09A6 \u09AE\u09C1\u099B\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964"
    }
  };

  var POS_LABEL = {
    en: { verb: "verb", noun: "noun" },
    bn: { verb: "\u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09BE", noun: "\u09AC\u09BF\u09B6\u09C7\u09B7\u09CD\u09AF" }
  };

  var state = {
    lang: "en",
    dir: "en2bn",
    favs: [],
    detail: null
  };
  var wotdWord = null;

  function $(id) { return document.getElementById(id); }

  function loadPrefs() {
    try {
      state.lang = localStorage.getItem("dict.lang") || "en";
      state.dir = localStorage.getItem("dict.dir") || "en2bn";
      state.favs = JSON.parse(localStorage.getItem("dict.favs") || "[]");
    } catch (e) { state.favs = []; }
  }
  function savePrefs() {
    try {
      localStorage.setItem("dict.lang", state.lang);
      localStorage.setItem("dict.dir", state.dir);
      localStorage.setItem("dict.favs", JSON.stringify(state.favs));
    } catch (e) {}
  }

  function t(key) { return (STR[state.lang] && STR[state.lang][key]) || STR.en[key] || key; }
  function num(n) { return state.lang === "bn" ? L.toBnDigits(n) : String(n); }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function applyI18n() {
    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute("data-i18n");
      if (k === "searchPh") els[i].setAttribute("placeholder", t("searchPh"));
      else els[i].textContent = t(k);
    }
    document.documentElement.lang = state.lang === "bn" ? "bn" : "en";
    document.title = t("title");
    $("statCount").textContent = num(DATA.length);
    $("statWord").textContent = t("stats");
  }

  function renderResults(query) {
    var box = $("results");
    var q = query.trim();
    if (!q) {
      box.innerHTML = '<div class="hint">' + esc(t("typeMore")) + "</div>";
      return;
    }
    var hits = L.search(DATA, q, state.dir);
    if (!hits.length) {
      box.innerHTML = '<div class="hint">' + esc(t("noResults")) + "</div>";
      return;
    }
    var html = '<div class="reshead">' + num(hits.length) + " " + esc(t("resultsFor")) + "</div>";
    for (var i = 0; i < hits.length; i++) {
      var e = hits[i];
      var fav = L.isFav(state.favs, e.w) ? " \u2605" : "";
      html += '<button class="card" data-w="' + esc(e.w) + '">' +
        '<span class="w">' + esc(e.w) + fav + "</span>" +
        '<span class="pos">' + esc(POS_LABEL[state.lang][e.p] || e.p) + "</span>" +
        '<span class="b">' + esc(e.b) + "</span></button>";
    }
    box.innerHTML = html;
    var cards = box.querySelectorAll(".card");
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener("click", function () {
        showDetail(this.getAttribute("data-w"));
      });
    }
  }

  function showDetail(word) {
    var e = L.exact(DATA, word);
    if (!e) return;
    state.detail = e.w;
    var fav = L.isFav(state.favs, e.w);
    $("dWord").textContent = e.w;
    $("dPos").textContent = (POS_LABEL[state.lang][e.p] || e.p);
    $("dGloss").textContent = e.b;
    $("dPosLabel").textContent = t("detailPos");
    var fb = $("dFav");
    fb.textContent = (fav ? "\u2605 " : "\u2606 ") + t(fav ? "unfav" : "fav");
    fb.classList.toggle("on", fav);
    $("detail").classList.add("open");
  }
  function hideDetail() {
    state.detail = null;
    $("detail").classList.remove("open");
  }

  function renderWotd() {
    var today = new Date();
    var ds = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var e = L.wordOfDay(DATA, ds);
    wotdWord = e.w;
    $("wotdWord").textContent = e.w;
    $("wotdGloss").textContent = e.b;
  }

  function renderFavs() {
    var box = $("favList");
    if (!state.favs.length) {
      box.innerHTML = '<div class="hint">' + esc(t("favEmpty")) + "</div>";
      $("favClear").style.display = "none";
      return;
    }
    $("favClear").style.display = "";
    var html = "";
    for (var i = 0; i < state.favs.length; i++) {
      var e = L.exact(DATA, state.favs[i]);
      if (!e) continue;
      html += '<button class="card fav" data-w="' + esc(e.w) + '">' +
        '<span class="w">\u2605 ' + esc(e.w) + "</span>" +
        '<span class="b">' + esc(e.b) + "</span></button>";
    }
    box.innerHTML = html;
    var cards = box.querySelectorAll(".card");
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener("click", function () { showDetail(this.getAttribute("data-w")); });
    }
  }

  function wire() {
    var q = $("q");
    q.addEventListener("input", function () { renderResults(q.value); });

    $("dirBtn").addEventListener("click", function () {
      state.dir = state.dir === "en2bn" ? "bn2en" : "en2bn";
      savePrefs();
      this.textContent = t(state.dir === "en2bn" ? "en2bn" : "bn2en");
      q.setAttribute("placeholder", t("searchPh"));
      q.value = "";
      renderResults("");
    });

    $("langBtn").addEventListener("click", function () {
      state.lang = state.lang === "en" ? "bn" : "en";
      savePrefs();
      applyI18n();
      $("dirBtn").textContent = t(state.dir === "en2bn" ? "en2bn" : "bn2en");
      $("langBtn").textContent = state.lang === "en" ? "\u09AC\u0982" : "EN";
      renderResults(q.value);
      renderWotd();
      renderFavs();
      if (state.detail) showDetail(state.detail);
    });

    $("randBtn").addEventListener("click", function () {
      var e = L.randomEntry(DATA);
      showDetail(e.w);
    });

    $("wotdCard").addEventListener("click", function () {
      if (wotdWord) showDetail(wotdWord);
    });

    $("dClose").addEventListener("click", hideDetail);
    $("detail").addEventListener("click", function (ev) {
      if (ev.target === this) hideDetail();
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { hideDetail(); closeClear(); }
    });

    $("dFav").addEventListener("click", function () {
      if (!state.detail) return;
      state.favs = L.toggleFav(state.favs, state.detail);
      savePrefs();
      showDetail(state.detail);
      renderFavs();
    });

    $("favClear").addEventListener("click", openClear);
    $("clearCancel").addEventListener("click", closeClear);
    $("clearOk").addEventListener("click", doClear);
    $("clearInput").addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") doClear();
    });

    $("langBtn").textContent = state.lang === "en" ? "\u09AC\u0982" : "EN";
    $("dirBtn").textContent = t(state.dir === "en2bn" ? "en2bn" : "bn2en");
  }

  function openClear() {
    $("clearInput").value = "";
    $("clearMsg").textContent = t("confirmClearBody");
    $("clearModal").classList.add("open");
    $("clearInput").setAttribute("placeholder", t("confirmPlaceholder"));
    $("clearInput").focus();
  }
  function closeClear() { $("clearModal").classList.remove("open"); }
  function doClear() {
    if ($("clearInput").value.trim() !== "DELETE") {
      $("clearMsg").textContent = t("wrongWord");
      return;
    }
    state.favs = [];
    savePrefs();
    renderFavs();
    closeClear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadPrefs();
    applyI18n();
    wire();
    renderWotd();
    renderFavs();
    renderResults("");
    // Re-render the WOTD card text after wire() attached (card built once)
    $("wotdLabel").textContent = t("wotd");
  });
})();
