# en-bn-dictionary-bd

Offline English&#8211;Bangla pocket dictionary. Type a word, get the Bangla meaning — no network, no account, no tracking.

## Problem

Students and everyday users in Bangladesh need a fast, offline EN&#8594;BN lookup tool that works on a phone without burning mobile data. Most dictionary apps are ad-heavy, require sign-in, or need the internet.

## Features

- **1,985-entry word list** (verbs + nouns), English words with short Bengali glosses
- **Live search** — EN&#8594;BN prefix-then-substring matching, BN&#8594;EN gloss search
- **Direction toggle** — search by English word or by Bengali meaning
- **Word detail card** — word, part of speech, Bengali meaning, favorite button
- **Word of the day** — deterministic per date, tap to open
- **Favorites** — localStorage, typed-`DELETE` erase gate (wrong word is rejected)
- **Surprise me** — random word
- **EN / Bangla UI toggle** — persisted, with Bengali digits in Bangla mode
- **Empty / no-match / loading states**, 390px mobile layout, zero network requests

## Stack

Pure static web: HTML + CSS + vanilla JS. No frameworks, no build step, no dependencies.

## Prerequisites

Any modern browser. For development/testing: Node.js 18+ (unit tests) and Chromium (smoke tests).

## Install & run

```bash
# just open it
open index.html
# or serve locally
npx serve .
```

## Dev commands

```bash
node tests/test.js                 # 22 unit tests (logic + data integrity)
node tests/smoke.js --viewport=desktop   # 30 headless-Chrome checks
node tests/smoke.js --viewport=mobile     # 30 headless-Chrome checks (390px)
```

The word data is generated from `words.tsv` (UTF-8) into two ASCII-safe JS files
(`js/dict-data-a.js`, `js/dict-data-b.js`, Bengali as `\uXXXX` escapes). To regenerate:

```bash
python3 - <<'EOF'
import json
entries = []
for line in open('words.tsv', encoding='utf-8'):
    if line.startswith('#') or not line.strip(): continue
    w, p, b = [x.strip() for x in line.rstrip('\n').split('|')]
    entries.append({"w": w, "p": p, "b": b})
entries.sort(key=lambda e: e["w"].lower())
half = len(entries)//2
for i, part in enumerate([entries[:half], entries[half:]]):
    body = json.dumps(part, ensure_ascii=True, separators=(",", ":"))
    expr = "window.DICT_DATA = " + ("" if i == 0 else "window.DICT_DATA.concat(") + body + ("" if i == 0 else ")") + ";"
    open('js/dict-data-%s.js' % chr(97+i), 'w', encoding='ascii').write(
        "/* Part %d of 2. Generated from words.tsv. Do not edit by hand. */\n%s\n" % (i+1, expr))
EOF
```

## Environment

None. No API keys, no secrets, no backend.

## Testing

- `tests/test.js` — 22/22 green: data integrity (count, dedupe, fields, Bengali glosses present),
  search ranking (prefix-first, substring, case-insensitive, 50-result cap), BN&#8594;EN gloss search,
  exact lookup, deterministic word-of-day, favorite toggle, Bengali digit conversion.
- `tests/smoke.js` — 30/30 desktop + 30/30 mobile headless-Chrome checks, 0 console/page errors:
  boot, search, detail modal, favorite toggle + persistence, direction switch, BN UI toggle with
  Bengali digits, typed-DELETE erase gate, surprise-me, no horizontal overflow at 390px.

## Deployment

Static — deploy anywhere: GitHub Pages, Netlify Drop, or any static host. No build step.

## Limitations

- Glosses are **short practice meanings**, not a scholarly dictionary; some words carry multiple
  senses separated by `;`. No example sentences are included.
- BN&#8594;EN search matches substrings of the gloss, not a full Bengali index.
- Favorites live in the browser's localStorage — clearing site data erases them.

## Status

MVP complete. PUBLISHED_AND_VERIFIED (2026-10-21).
