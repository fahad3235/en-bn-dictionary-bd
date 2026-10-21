/* Pure dictionary logic - no DOM. Testable in Node and the browser. */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.DictLogic = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var BN_DIGITS = ["\u09E6", "\u09E7", "\u09E8", "\u09E9", "\u09EA", "\u09EB", "\u09EC", "\u09ED", "\u09EE", "\u09EF"];

  function toBnDigits(s) {
    return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[d.charCodeAt(0) - 48]; });
  }

  function norm(q) {
    return String(q || "").trim().toLowerCase();
  }

  // dir: "en2bn" | "bn2en". EN->BN: word matches (prefix first, then substring).
  // BN->EN: substring match on the Bengali gloss. Caps results.
  function search(entries, query, dir, limit) {
    var q = norm(query);
    limit = limit || 50;
    if (!q) return [];
    var prefix = [], rest = [];
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (dir === "bn2en") {
        if (e.b.indexOf(query.trim()) !== -1) {
          (e.b.indexOf(query.trim()) === 0 ? prefix : rest).push(e);
        }
      } else {
        var w = e.w.toLowerCase();
        if (w.indexOf(q) === 0) prefix.push(e);
        else if (w.indexOf(q) !== -1) rest.push(e);
      }
      if (prefix.length + rest.length >= limit) break;
    }
    return prefix.concat(rest).slice(0, limit);
  }

  function exact(entries, word) {
    var q = norm(word);
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].w.toLowerCase() === q) return entries[i];
    }
    return null;
  }

  // Deterministic word-of-the-day from a YYYY-MM-DD string.
  function wordOfDay(entries, dateStr) {
    var h = 0;
    var s = String(dateStr || "");
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return entries[h % entries.length];
  }

  function randomEntry(entries, rng) {
    var r = rng || Math.random;
    return entries[Math.floor(r() * entries.length)];
  }

  function toggleFav(favs, word) {
    var out = [];
    var found = false;
    for (var i = 0; i < favs.length; i++) {
      if (favs[i] === word) found = true;
      else out.push(favs[i]);
    }
    if (!found) out.push(word);
    return out;
  }

  function isFav(favs, word) {
    for (var i = 0; i < favs.length; i++) if (favs[i] === word) return true;
    return false;
  }

  return {
    toBnDigits: toBnDigits,
    search: search,
    exact: exact,
    wordOfDay: wordOfDay,
    randomEntry: randomEntry,
    toggleFav: toggleFav,
    isFav: isFav
  };
});
