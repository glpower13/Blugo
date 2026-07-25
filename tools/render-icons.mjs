// Rendert die App-Icons aus `public/favicon.svg` — EINE Quelle für das Zeichen.
//
// WARUM MIT VERSION IM DATEINAMEN: Beim ersten Austausch des Zeichens blieben die
// Dateinamen gleich (`icon-192.png`) und nur der Inhalt änderte sich. Für ein
// installiertes PWA reicht das NICHT: Android baut beim Installieren ein WebAPK
// mit eingebackenem Icon und fragt später nur das **Manifest** ab, um Änderungen
// zu erkennen. Bei identischen Dateinamen ist das Manifest byte-gleich — also
// „keine Änderung", also bleibt das alte Icon dauerhaft auf dem Startbildschirm.
//
// REGEL: Ändert sich das Zeichen, wird ICON_VERSION erhöht. Dann ändert sich das
// Manifest wirklich, Android holt ein neues WebAPK, und der zähe Favicon-Cache
// des Browsers greift ins Leere.
//
// BENUTZUNG: npm run icons

import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

export const ICON_VERSION = 'v2';

const SVG = 'public/favicon.svg';
const OUT = 'public/icons';
const SIZES = [192, 512];

const svg = readFileSync(SVG, 'utf-8');
const browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE_PATH });

// Alte Größen wegräumen, damit nichts Verwaistes mitdeployt wird.
for (const f of readdirSync(OUT)) {
  if (f.startsWith('icon-')) unlinkSync(join(OUT, f));
}

for (const size of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(
    `<style>*{margin:0;padding:0}html,body{width:${size}px;height:${size}px;overflow:hidden}` +
      `svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  await page.waitForTimeout(250);
  const name = `icon-${size}-${ICON_VERSION}.png`;
  writeFileSync(join(OUT, name), await page.screenshot());
  console.log('geschrieben:', name);
  await ctx.close();
}

await browser.close();
console.log(`\nNicht vergessen: dieselbe Version (${ICON_VERSION}) in index.html und vite.config.ts.`);
