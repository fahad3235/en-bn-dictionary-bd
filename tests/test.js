/* Node unit tests for DictLogic + data integrity. Run: node tests/test.js */
"use strict";
var L = require("../js/logic.js");
var fs = require("fs");

var dataRaw = fs.readFileSync(__dirname + "/../js/dict-data-a.js", "ascii");
var bRaw = fs.readFileSync(__dirname + "/../js/dict-data-b.js", "ascii");
// Simulate browser global
global.window = {};
eval(dataRaw.replace(/^\/\*[\s\S]*?\*\//, ""));
eval(bRaw.replace(/^\/\*[\s\S]*?\*\//, ""));
var DATA = window.DICT_DATA;

var pass = 0, fail = 0, fails = [];
function ok(cond, name) {
  if (cond) { pass++; }
  else { fail++; fails.push(name); console.log("FAIL: " + name); }
}

// --- data integrity ---
ok(DATA.length >= 1500, "data has >=1500 entries (got " + DATA.length + ")");
var seenW = {};
var dup = 0;
DATA.forEach(function (e) {
  var k = e.w + "|" + e.p;
  if (seenW[k]) dup++;
  seenW[k] = 1;
  if (!e.w || !e.p || !e.b) { ok(false, "entry has all fields: " + JSON.stringify(e)); }
});
ok(dup === 0, "no word+pos duplicates");
ok(DATA.every(function (e) { return e.p === "verb" || e.p === "noun"; }), "all pos are verb|noun");
ok(DATA.every(function (e) { return /[^\x00-\x7F]/.test(e.b); }), "every gloss has Bengali text");
ok(DATA.every(function (e) { return /^[a-z-]+$/.test(e.w); }), "words are lowercase ascii");

// --- search EN->BN ---
var r = L.search(DATA, "book", "en2bn");
ok(r.length >= 1 && r[0].w === "book", "search 'book' hits exact first");
ok(L.search(DATA, "boo", "en2bn")[0].w === "book", "prefix 'boo' -> book first");
ok(L.search(DATA, "ook", "en2bn").some(function (e) { return e.w === "book"; }), "substring 'ook' finds book");
ok(L.search(DATA, "   ", "en2bn").length === 0, "blank query -> []");
ok(L.search(DATA, "zzzqqq", "en2bn").length === 0, "no match -> []");
ok(L.search(DATA, "a", "en2bn").length === 50, "single letter capped at 50");
ok(L.search(DATA, "BOOK", "en2bn")[0].w === "book", "case-insensitive");

// --- search BN->EN ---
var bn = L.search(DATA, "\u09AC\u09BF\u09B6\u09CD\u09AC\u09BE\u09B8", "bn2en");
ok(bn.length >= 1, "BN gloss search finds বিশ্বাস matches (" + bn.length + ")");
ok(L.search(DATA, "\u09AC\u09BF\u09B6\u09CD\u09AC\u09BE\u09B8", "en2bn").length === 0, "BN query in en2bn finds nothing (honest dir)");

// --- exact ---
ok(L.exact(DATA, "Dictionary").w === "dictionary", "exact is case-insensitive");
ok(L.exact(DATA, "nopeword") === null, "exact missing -> null");

// --- word of day ---
var w1 = L.wordOfDay(DATA, "2026-10-21");
var w2 = L.wordOfDay(DATA, "2026-10-21");
ok(w1.w === w2.w, "WOTD deterministic same day");
var w3 = L.wordOfDay(DATA, "2026-10-22");
ok(w3 && w3.w, "WOTD returns an entry for another day");

// --- favorites ---
var f = L.toggleFav([], "book");
ok(L.isFav(f, "book"), "toggle adds");
f = L.toggleFav(f, "book");
ok(!L.isFav(f, "book") && f.length === 0, "toggle removes");

// --- digits ---
ok(L.toBnDigits("1985") === "\u09E7\u09EF\u09EE\u09EB", "toBnDigits 1985");
ok(L.toBnDigits("abc") === "abc", "toBnDigits leaves non-digits");

console.log("\n" + pass + " passed, " + fail + " failed");
if (fails.length) process.exit(1);
