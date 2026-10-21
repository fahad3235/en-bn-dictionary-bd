'use strict';
/* en-bn-dictionary-bd -- headless-Chrome smoke tests via RAW CDP (no dependencies).
 * Usage: node tests/smoke.js [--viewport=desktop|mobile]
 * Exit code 0 = all checks pass. */
var path = require('path');
var http = require('http');
var child_process = require('child_process');

var VIEWPORT = 'desktop';
process.argv.slice(2).forEach(function (a) {
  if (a.indexOf('--viewport=') === 0) VIEWPORT = a.split('=')[1];
});
var MOBILE = VIEWPORT === 'mobile';
var PORT = MOBILE ? 19243 : 19242;
var CHROME = '/opt/meta-chromium/chrome';
var INDEX = 'file://' + path.resolve(__dirname, '..', 'index.html');

var passed = 0, failed = 0, pageErrors = [];

function check(name, cond, extra) {
  if (cond) { passed++; }
  else { failed++; console.log('FAIL: ' + name + (extra ? ' | ' + extra : '')); }
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

function getVersion() {
  return new Promise(function (resolve, reject) {
    http.get('http://127.0.0.1:' + PORT + '/json/version', function (res) {
      var data = '';
      res.on('data', function (c) { data += c; });
      res.on('end', function () { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

function launchChrome() {
  var args = [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--disable-dev-shm-usage', '--no-first-run',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=/tmp/dict-smoke-' + VIEWPORT + '-' + process.pid,
    'about:blank'
  ];
  return child_process.spawn(CHROME, args, { stdio: 'ignore', detached: true });
}

function main() {
  var chrome = launchChrome();
  var ws = null, nextId = 1;
  var pending = new Map();

  function send(method, params, sessionId) {
    return new Promise(function (resolve, reject) {
      var id = nextId++;
      pending.set(id, { resolve: resolve, reject: reject });
      var msg = { id: id, method: method, params: params || {} };
      if (sessionId) msg.sessionId = sessionId;
      ws.send(JSON.stringify(msg));
      setTimeout(function () {
        if (pending.has(id)) { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }
      }, 15000);
    });
  }

  function onMessage(data) {
    var msg;
    try { msg = JSON.parse(data.toString()); } catch (e) { return; }
    if (msg.id && pending.has(msg.id)) {
      var p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
      else p.resolve(msg.result || {});
      return;
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      var d = msg.params.exceptionDetails || {};
      pageErrors.push('exception: ' + (d.text || '') + ' ' + ((d.exception && d.exception.description) || ''));
    }
    if (msg.method === 'Log.entryAdded') {
      var e = msg.params.entry || {};
      if (e.level === 'error') pageErrors.push('log: ' + (e.text || '') + ' ' + (e.url || ''));
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      var args = msg.params.args || [];
      pageErrors.push('console.error: ' + args.map(function (a) { return a.value || a.description || ''; }).join(' '));
    }
  }

  (async function () {
    try {
      var version = null;
      for (var i = 0; i < 50 && !version; i++) {
        try { version = await getVersion(); } catch (e) { await sleep(200); }
      }
      if (!version) throw new Error('Chrome DevTools endpoint did not come up');

      ws = new WebSocket(version.webSocketDebuggerUrl);
      await new Promise(function (res, rej) { ws.onopen = res; ws.onerror = rej; });
      ws.onmessage = function (ev2) { onMessage(ev2.data); };

      var target = await send('Target.createTarget', { url: 'about:blank' });
      var attach = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
      var session = attach.sessionId;

      await send('Runtime.enable', {}, session);
      await send('Page.enable', {}, session);
      await send('Log.enable', {}, session);
      await send('Emulation.setDeviceMetricsOverride',
        MOBILE
          ? { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }
          : { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false },
        session);

      function ev(expr) {
        return send('Runtime.evaluate', { expression: expr, returnByValue: true }, session)
          .then(function (res) {
            if (res.exceptionDetails) throw new Error('evaluate failed: ' + JSON.stringify(res.exceptionDetails));
            return res.result.value;
          });
      }
      function setQ(text) {
        return ev('(function(){var q=document.getElementById("q");q.focus();q.value=' + JSON.stringify(text) +
          ';q.dispatchEvent(new Event("input",{bubbles:true}));return document.querySelectorAll("#results .card").length;})()');
      }
      async function boot() {
        await send('Page.navigate', { url: INDEX }, session);
        var ready = false;
        for (var w = 0; w < 60 && !ready; w++) {
          ready = await ev('document.readyState === "complete" && window.DICT_DATA && window.DICT_DATA.length > 1000 ? "yes" : "no"') === 'yes';
          if (!ready) await sleep(200);
        }
        return ready;
      }

      // ---- boot ----
      check('app boots (1985 entries loaded, DOM complete)', await boot());
      check('title is English by default', (await ev('document.title')) === 'EN-BN Pocket Dictionary');
      check('WOTD card has a word', (await ev('document.getElementById("wotdWord").textContent.length')) > 0);
      check('WOTD gloss has Bengali', (await ev('/[\\u0980-\\u09FF]/.test(document.getElementById("wotdGloss").textContent)')) === true);
      check('stats count shows 1985', (await ev('document.getElementById("statCount").textContent')) === '1985');
      check('results hint shown initially', (await ev('document.querySelector("#results .hint") !== null')) === true);

      // ---- search EN->BN ----
      var n = await setQ('book');
      check('search "book" returns cards', n > 0, 'got ' + n);
      var first = await ev('document.querySelector("#results .card .w").textContent');
      check('first result is "book"', first === 'book', JSON.stringify(first));
      var gloss = await ev('document.querySelector("#results .card .b").textContent');
      var glossBengali = (/[\u0980-\u09FF]/.test(gloss));
      check('result gloss is Bengali', glossBengali === true, JSON.stringify(gloss.slice(0, 40)));

      // ---- detail modal ----
      await ev('document.querySelector("#results .card").click()');
      await sleep(200);
      check('detail modal opens', (await ev('document.getElementById("detail").classList.contains("open")')) === true);
      check('detail shows word', (await ev('document.getElementById("dWord").textContent')) === 'book');
      check('detail gloss Bengali', (await ev('/[\\u0980-\\u09FF]/.test(document.getElementById("dGloss").textContent)')) === true);
      await ev('document.getElementById("dFav").click()');
      await sleep(200);
      check('favorite toggles on', (await ev('document.querySelectorAll("#favList .card").length')) === 1);
      check('star shows in detail', (await ev('document.getElementById("dFav").textContent.indexOf("\\u2605")')) !== -1);
      await ev('document.getElementById("dClose").click()');
      await sleep(200);
      check('detail modal closes', (await ev('document.getElementById("detail").classList.contains("open")')) === false);

      // ---- persistence ----
      await send('Page.navigate', { url: INDEX }, session);
      await sleep(1500);
      check('favorite persists across reload', (await ev('document.querySelectorAll("#favList .card").length')) === 1);

      // ---- BN direction search ----
      await ev('document.getElementById("dirBtn").click()');
      await sleep(200);
      var nbn = await setQ('\u09AC\u09BF\u09B6\u09CD\u09AC\u09BE\u09B8');
      check('BN gloss search returns cards', nbn > 0, 'got ' + nbn);
      var bnw = await ev('document.querySelector("#results .card .w").textContent');
      check('BN search card has English word', /^[a-z-]+$/.test(bnw) === true, JSON.stringify(bnw));

      // ---- empty / no-match states ----
      await ev('document.getElementById("dirBtn").click()'); // back to en2bn
      await sleep(150);
      await setQ('zzzqqqnope');
      await sleep(150);
      check('no-match shows hint', (await ev('document.querySelector("#results .hint") !== null')) === true);
      await setQ('');
      await sleep(150);
      check('empty query shows type hint', (await ev('document.querySelector("#results .hint") !== null')) === true);

      // ---- typed-DELETE erase ----
      await ev('document.getElementById("favClear").click()');
      await sleep(200);
      check('erase modal opens', (await ev('document.getElementById("clearModal").classList.contains("open")')) === true);
      await ev('(function(){var i=document.getElementById("clearInput");i.value="nope";document.getElementById("clearOk").click();})()');
      await sleep(200);
      check('wrong word does not erase', (await ev('document.querySelectorAll("#favList .card").length')) === 1);
      await ev('(function(){var i=document.getElementById("clearInput");i.value="DELETE";document.getElementById("clearOk").click();})()');
      await sleep(200);
      check('DELETE erases favorites', (await ev('document.querySelectorAll("#favList .card").length')) === 0);
      check('empty-fav hint returns', (await ev('document.querySelector("#favList .hint") !== null')) === true);

      // ---- BN UI toggle ----
      await ev('document.getElementById("langBtn").click()');
      await sleep(300);
      check('BN toggle changes title', (await ev('document.title !== "EN-BN Pocket Dictionary"')) === true);
      check('BN stats use Bengali digits', (await ev('/[\\u09E6-\\u09EF]/.test(document.getElementById("statCount").textContent)')) === true);
      await ev('document.getElementById("langBtn").click()');
      await sleep(300);
      check('EN toggle restores title', (await ev('document.title')) === 'EN-BN Pocket Dictionary');

      // ---- surprise me ----
      await ev('document.getElementById("randBtn").click()');
      await sleep(200);
      check('surprise opens detail', (await ev('document.getElementById("detail").classList.contains("open") && document.getElementById("dWord").textContent.length > 0')) === true);

      // ---- mobile overflow ----
      var overflow = await ev('(function(){var de=document.documentElement;return de.scrollWidth > de.clientWidth + 1;})()');
      check((MOBILE ? '390px' : 'desktop') + ' no horizontal overflow', overflow === false);

      // ---- error check ----
      check('no console/page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

      console.log('\n' + passed + ' passed, ' + failed + ' failed [' + VIEWPORT + ']');
      try { await send('Target.closeTarget', { targetId: target.targetId }); } catch (e) {}
      ws.close();
      chrome.kill();
      process.exit(failed ? 1 : 0);
    } catch (err) {
      console.log('SMOKE ERROR: ' + (err && err.message));
      try { chrome.kill(); } catch (e) {}
      process.exit(2);
    }
  })();
}

main();
