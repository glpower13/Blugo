import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

// Vom Verteiler „Heute" in eine Lern-Session wechseln.
async function startSession(page: Page) {
  await page.getByRole('button', { name: /Weiterlernen/ }).click();
  await expect(page.getByText(/Begegnung ·/)).toBeVisible();
}

// In den Reiter „Lernen" wechseln (globale Navigation, gremium-navigation.md).
// Bewusst über die Landmarke: „Lernen" gibt es auch als Kachel auf „Heute".
async function openTab(page: Page, label: string) {
  await page.getByRole('navigation', { name: 'Hauptbereiche' }).getByRole('button', { name: label }).click();
}

// Cloud-KI einrichten — seit der Einstellungs-Fläche EIN Ort statt eines Modals.
async function configureCloud(page: Page) {
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();
  await page.getByText('Claude (Cloud)').click();
  await page.getByPlaceholder('sk-ant-…').fill('sk-ant-test-000');
  await page.getByRole('button', { name: 'Speichern' }).click();
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();
}

async function openLearn(page: Page) {
  await openTab(page, 'Lernen');
  await expect(page.getByRole('heading', { name: 'Bereiche' })).toBeVisible();
}

// Stufe B: Übersicht → Session; der Comprehension-Loop läuft bis
// "Session erledigt." durch, ohne Konsolen-/Seitenfehler.
test('comprehension loop runs to completion without errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');

  // App-Shell: der Verteiler „Heute" zeigt EINE gemessene Zahl und EINEN Knopf.
  await expect(page.getByRole('heading', { name: /Hej/ })).toBeVisible();
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  // Die Bereichsliste liegt jetzt hinter dem Reiter „Lernen", nicht mehr hier.
  await expect(page.getByRole('heading', { name: 'Bereiche' })).toHaveCount(0);

  await startSession(page);

  // Loop durchspielen (max. 15 Schritte)
  let reachedDone = false;
  for (let i = 0; i < 15; i++) {
    if (await page.getByText('Sitzung erledigt.').isVisible()) {
      reachedDone = true;
      break;
    }
    const reveal = page.getByRole('button', { name: 'Auflösen' });
    await reveal.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    if (!(await reveal.count())) break;
    await reveal.first().click();
    const grade = page.getByRole('button', { name: 'Selbsteinschätzung: Sitzt' }).first();
    await grade.click();
    await grade.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {}); // wait for advance
  }

  expect(reachedDone).toBe(true);
  await expect(page.getByText('Sitzung erledigt.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zurück zur Übersicht' })).toBeVisible();
  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: die KI-Einstellungs-/Login-Fläche öffnet, zeigt den Login und schließt
// — ohne Konsolen-/Seitenfehler (Schritt C: nutzerseitige KI-Auswahl).
test('AI settings overlay opens, shows the login, and closes cleanly', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');

  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();

  // Alle Abschnitte da — die Fläche ist EIN Ort, keine Resterampe.
  await expect(page.getByRole('heading', { name: 'Lernen' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Deine Daten' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Über' })).toBeVisible();

  // Die On-Device-Prüfung läuft NICHT von allein — sie hat in der CI die Seite
  // abgeschossen, als sie beim Aufbau der Fläche startete.
  await expect(page.getByText('noch nicht geprüft')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Jetzt prüfen' })).toBeVisible();

  // Der Erhalt-Ziel-Regler ist eingeklappt (progressive Offenlegung) …
  await expect(page.getByRole('slider', { name: 'Erhalt-Ziel' })).toHaveCount(0);
  await page.getByRole('button', { name: /Für Fortgeschrittene/ }).click();
  await expect(page.getByRole('slider', { name: 'Erhalt-Ziel' })).toBeVisible();
  // … und sagt ausdrücklich, dass er den Maßstab NICHT anfasst.
  await expect(page.getByText(/nicht den Maßstab/)).toBeVisible();

  // Claude wählen → Schlüssel-Eingabe (Login) erscheint
  await page.getByText('Claude (Cloud)').click();
  await expect(page.getByPlaceholder('sk-ant-…')).toBeVisible();

  // schließen → Fläche verschwindet
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();
  await expect(page.getByText('Dein KI-Zugang (Claude-Schlüssel)')).toHaveCount(0);

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: nach Einrichten eines Cloud-Anbieters erscheinen die On-Demand-Knöpfe
// "KI-Dekodierung" UND "Neuer Kontext" (der Moat) in der Session. Kein echter Aufruf.
test('AI decode and generate buttons appear in the session once a cloud provider is configured', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });

  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  // Cloud einrichten: Claude wählen, (Test-)Schlüssel eintragen, speichern
  await configureCloud(page);

  await startSession(page);

  // Jetzt sind beide On-Demand-KI-Knöpfe in der Session sichtbar
  await expect(page.getByRole('button', { name: /KI-Dekodierung/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Neuer Kontext/ })).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
});

// Stufe B: Baum-Drill-down — Übersicht → Bereich → Thema-Detail (Wendungen,
// ehrliche Abdeckung); dort Fokus setzen und eine Ebene zurück zum Bereich.
test('tree drill-down: area → theme shows phrases and a focus can be set', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await openLearn(page);

  // Ebene 1 → 2: in einen Bereich hineinklicken
  await page.getByRole('button', { name: /Erste Schritte/ }).click();
  await expect(page.getByRole('heading', { name: 'Erste Schritte' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Themen' })).toBeVisible();

  // Ebene 2 → 3: in ein Thema hineinklicken → Detail mit den Wendungen
  await page.getByRole('button', { name: /Begrüßen & Kennenlernen/ }).click();
  await expect(page.getByRole('heading', { name: 'Begrüßen & Kennenlernen' })).toBeVisible();
  // Ehrliche Abdeckungszeile („X von Y bewiesen", ggf. „· N reifen").
  await expect(page.getByText(/von \d+ bewiesen/).first()).toBeVisible();

  // Fokus für neuen Stoff setzen
  await page.getByRole('button', { name: 'Fokus setzen' }).click();
  await expect(page.getByRole('button', { name: /Im Fokus/ })).toBeVisible();

  // Eine Ebene zurück zum Bereich → dort erscheint die Fokus-Zeile
  await page.getByRole('button', { name: /zurück zum Bereich/ }).click();
  await expect(page.getByText(/Fokus: Begrüßen & Kennenlernen/)).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: Dialog-Modus — eine Szene öffnet (Hör-zuerst), man deckt auf, geht
// weiter zur "Du bist dran"-Zeile, produziert per Vorschlag und bewertet ehrlich;
// danach läuft das Gespräch weiter. Ohne Konsolen-/Seitenfehler.
test('dialog mode: a scene runs and a produced line advances the conversation', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');

  // Lernen → Bereich → Thema → Gespräch
  await openLearn(page);
  await page.getByRole('button', { name: /Essen & Café/ }).click();
  await page.getByRole('button', { name: /Im Restaurant/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Im Restaurant' })).toBeVisible();
  await page.getByRole('button', { name: /Im Restaurant: Tisch, bestellen, zahlen/ }).click();

  // Hör-zuerst: aufdecken, dann zweimal weiter bis zur Produktion
  await page.getByRole('button', { name: 'Aufdecken' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();

  // "Du bist dran" → Vorschlag nutzen → prüfen → ehrlich bewerten
  await expect(page.getByText('Du bist dran')).toBeVisible();
  await page.getByRole('button', { name: 'Ja, tack.' }).click();
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('Wie saß es?')).toBeVisible();
  await page.getByRole('button', { name: 'Selbsteinschätzung: Sitzt' }).click();

  // Gespräch läuft weiter: die nächste Partner-Zeile erscheint
  await expect(page.getByText(/Varsågod\. Här är menyn\./)).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: Namens-Personalisierung — Vorname eintragen, Begrüßung erscheint, und
// im Gespräch spricht die Person einen mit Namen an. Ohne Konsolen-/Seitenfehler.
test('name personalisation: greeting on the home and address inside a dialog', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');

  // Vorname eintragen (die Begrüßung selbst ist der Einstieg)
  await page.getByRole('button', { name: /Dein Name/ }).click();
  await page.getByLabel('Dein Vorname').fill('Andreas');
  await page.getByRole('button', { name: 'Speichern' }).click();

  // Begrüßung auf der Übersicht
  await expect(page.getByText(/Hej, Andreas!/)).toBeVisible();

  // Im Gespräch wird man mit Namen angesprochen (erste Zeile ist Hör-zuerst)
  await openLearn(page);
  await page.getByRole('button', { name: /Essen & Café/ }).click();
  await page.getByRole('button', { name: /Im Restaurant/ }).first().click();
  await page.getByRole('button', { name: /Im Restaurant: Tisch, bestellen, zahlen/ }).click();
  await page.getByRole('button', { name: 'Aufdecken' }).click();
  await expect(page.getByText('Hej Andreas, välkommen!')).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: die On-device-Aussprache-Hilfe öffnet in der Session, ohne Fehler.
test('pronunciation help toggles open in the session', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await startSession(page);

  await page.getByRole('button', { name: /Aussprache/ }).click();
  await expect(page.getByRole('button', { name: 'Aussprache ausblenden' })).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: die globale Navigation (docs/gremium-navigation.md, Schritt 1) —
// alle vier Räume sind erreichbar, und beim Lernen verschwindet die Leiste.
test('tab bar: all four rooms open, and the bar disappears inside a session', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  const bar = page.getByRole('navigation', { name: 'Hauptbereiche' });
  await expect(bar).toBeVisible();

  // Heute → Lernen: der Baum liegt hier, nicht mehr auf der Startseite
  await openLearn(page);

  // Lernen → Gespräche: die Szenen haben einen eigenen Raum statt drei Klicks Tiefe
  await openTab(page, 'Gespräche');
  await expect(page.getByRole('heading', { name: 'Gespräche' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Im Restaurant: Tisch, bestellen, zahlen/ })).toBeVisible();

  // Gespräche → Fortschritt: die ehrliche Messung
  await openTab(page, 'Fortschritt');
  await expect(page.getByText(/Trefferquote/).first()).toBeVisible();
  await expect(page.getByText('reift', { exact: true }).first()).toBeVisible(); // Zahl
  await expect(page.getByRole('term').filter({ hasText: 'reift' })).toBeVisible(); // Erklärung dazu

  // Zurück nach Heute und in die Session → Ebene 4: nichts lenkt mehr ab
  await openTab(page, 'Heute');
  await startSession(page);
  await expect(bar).toHaveCount(0);

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe C (Regression): Die Reiterleiste muss AM FENSTER kleben, auch ganz unten.
// Sie lag zuerst in <main>, und dort erzwingt `view-transition-name` ein
// `contain: layout` — `position: fixed` bezog sich dadurch auf <main> statt aufs
// Fenster, und die Leiste scrollte am Listenende weg.
test('tab bar stays pinned to the viewport when scrolled to the end', async ({ page }) => {
  await page.goto('/');
  await openLearn(page);
  await page.mouse.wheel(0, 6000); // bis ans Ende der Bereichsliste
  await page.waitForTimeout(400);

  const bar = page.getByRole('navigation', { name: 'Hauptbereiche' });
  await expect(bar).toBeVisible();
  const box = await bar.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box, 'Leiste hat keine Box').not.toBeNull();
  // Unterkante der Leiste == Unterkante des Fensters (±2 px für Safe-Area/Rundung)
  expect(Math.abs(box!.y + box!.height - viewport.height)).toBeLessThanOrEqual(2);
});

// Stufe C (Regression): Kein Bedienelement darf über den Bildschirmrand ragen.
// Der „Prüfen"-Knopf stand neben dem Eingabefeld; `flex-1` schrumpft nicht unter
// die Textbreite des Platzhalters, also lief die Zeile über und der Knopf war
// rechts abgeschnitten. Gilt für Gespräch UND Lern-Loop.
test('no control overflows the screen edge in a dialogue', async ({ page }) => {
  await page.goto('/');
  await openTab(page, 'Gespräche');
  await page.getByRole('button', { name: /Im Restaurant: Tisch, bestellen, zahlen/ }).click();
  await page.getByRole('button', { name: 'Aufdecken' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await expect(page.getByText('Du bist dran')).toBeVisible();

  const width = page.viewportSize()!.width;
  for (const name of ['Prüfen', 'Ja, tack.']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box, `Knopf „${name}" hat keine Box`).not.toBeNull();
    expect(box!.x, `„${name}" ragt links heraus`).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, `„${name}" ragt rechts heraus`).toBeLessThanOrEqual(width);
  }
});

// Stufe B: Die Sprachpaar-Fläche (docs/gremium-navigation.md §5) — sie zeigt die
// Richtung als GEMESSENEN Stand statt als Schalter, und zählt nie begegnete
// Wendungen bewusst getrennt statt sie als „verstanden" auszugeben.
test('language pair sheet reports direction as a measurement, not a switch', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await page.getByRole('button', { name: /Deutsch.*Schwedisch/ }).click();

  const sheet = page.getByRole('dialog', { name: /Deutsch → Schwedisch/ });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByText('sprichst du selbst', { exact: true })).toBeVisible();
  await expect(sheet.getByText('verstehst du', { exact: true })).toBeVisible();
  // Frischer Stand: alles ist „noch nicht begegnet" — nichts wird als verstanden ausgegeben.
  await expect(sheet.getByText('noch nicht begegnet')).toBeVisible();
  await expect(sheet.getByText(/Warum du die Richtung nicht umstellen kannst/)).toBeVisible();

  await sheet.getByRole('button', { name: /Zurück/ }).click();
  await expect(sheet).toHaveCount(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

/**
 * Wischen zwischen den Reitern (docs/gremium-navigation.md, `useSwipeTabs.ts`).
 *
 * Eine echte Wischgeste als Zeiger-Sequenz. Wichtig: NICHT vorher tippen — ein
 * Tipp löst den Knopf darunter aus und die App springt in eine Detailansicht.
 * (Genau daran ist der erste Anlauf dieses Tests gescheitert.)
 */
async function swipe(page: Page, fromX: number, toX: number, y = 300) {
  await page.evaluate(
    ([fx, tx, yy]) => {
      const send = (type: string, x: number) => {
        const el = document.elementFromPoint(Math.max(2, Math.min(388, x)), yy);
        el?.dispatchEvent(
          new PointerEvent(type, {
            pointerId: 1,
            pointerType: 'touch',
            clientX: x,
            clientY: yy,
            bubbles: true,
            cancelable: true,
          }),
        );
      };
      send('pointerdown', fx);
      for (let i = 1; i <= 14; i++) send('pointermove', fx + ((tx - fx) * i) / 14);
      send('pointerup', tx);
    },
    [fromX, toX, y],
  );
  await page.waitForTimeout(420);
}

const activeTab = (page: Page) =>
  page.locator('nav[aria-label="Hauptbereiche"] [aria-current="page"]').innerText();

test('swiping moves between tabs, and respects the browser edge gesture', async ({ page }) => {
  await page.goto('/');
  expect(await activeTab(page)).toBe('Heute');

  // nach links wischen → nächster Reiter, zweimal hintereinander
  await swipe(page, 300, 90);
  expect(await activeTab(page)).toBe('Lernen');
  await swipe(page, 300, 90);
  expect(await activeTab(page)).toBe('Gespräche');

  // nach rechts zurück
  await swipe(page, 90, 300);
  expect(await activeTab(page)).toBe('Lernen');

  // Aus der RANDZONE darf nichts passieren: dort gehört die Geste dem Browser
  // („zurück"). Sonst löst ein Wisch beides gleichzeitig aus.
  await swipe(page, 8, 300);
  expect(await activeTab(page), 'Randzone darf nicht greifen').toBe('Lernen');

  // Zu kurzer Wisch federt zurück statt umzuschalten.
  await swipe(page, 300, 262);
  expect(await activeTab(page), 'kurzer Wisch darf nicht umschalten').toBe('Lernen');

  // Am ersten Reiter nach rechts: Gummiband, kein Absturz, kein Wechsel.
  await swipe(page, 90, 300);
  await swipe(page, 90, 300);
  expect(await activeTab(page)).toBe('Heute');
  await swipe(page, 90, 340);
  expect(await activeTab(page), 'am Anfang bleibt es beim ersten Reiter').toBe('Heute');
});

// Stufe B: Sprechen statt Tippen (P2, docs/gremium-sprachpartner.md §9).
// Geprüft wird das, was die eine Design-Regel verlangt: Das Mikrofon ist ein
// ZWEITER Weg neben dem Tippen (beides da), es liegt vollständig im Bild, und es
// erscheint nur, wenn der Browser wirklich zuhören kann.
test('speaking is offered next to typing in a dialogue, fully on screen', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await openLearn(page);
  await page.getByRole('button', { name: /Essen & Café/ }).click();
  await page.getByRole('button', { name: /Im Restaurant/ }).first().click();
  await page.getByRole('button', { name: /Im Restaurant: Tisch, bestellen, zahlen/ }).click();

  await page.getByRole('button', { name: 'Aufdecken' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await expect(page.getByText('Du bist dran')).toBeVisible();

  // Tippen bleibt vollwertig …
  await expect(page.getByRole('textbox', { name: 'Antwort auf Schwedisch' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Prüfen' })).toBeVisible();

  // … und daneben steht das Mikrofon (in diesem Browser vorhanden).
  const mic = page.getByRole('button', { name: 'Sprich es auf Schwedisch' });
  await expect(mic).toBeVisible();

  // Kein Überstand über den Bildschirmrand (der Fehler von zuvor).
  const box = await mic.boundingBox();
  const width = page.viewportSize()?.width ?? 0;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(width);

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: Sparringspartner (P4/P5, docs/gremium-sprachpartner.md §9).
// Zwei Regeln werden hier festgenagelt: (1) ohne eigenen KI-Zugang ist der
// Einstieg SICHTBAR und erklärt, was fehlt — versteckt fand ihn niemand;
// (2) wenn nichts fällig ist, sagt die Fläche ausdrücklich, dass nichts
// gemessen wird.
test('sparring says what it needs when no key is set, and works when one is', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await openTab(page, 'Gespräche');
  await expect(page.getByRole('heading', { name: 'Gespräche' })).toBeVisible();

  // Ohne Schlüssel ist der Einstieg SICHTBAR und sagt selbst, was ihm fehlt.
  // (Zuerst war er versteckt — gefunden hat ihn dann niemand, 2026-07-25.)
  const entryWithoutKey = page.getByRole('button', { name: /Rede mit jemandem/ });
  await expect(entryWithoutKey).toBeVisible();
  await expect(entryWithoutKey).toContainText(/eigenen KI-Zugang/);
  await entryWithoutKey.click();
  await expect(page.getByText(/Dafür brauchst du deinen eigenen KI-Zugang/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Einstellungen öffnen' })).toBeVisible();
  await page.getByRole('button', { name: 'Sparring verlassen' }).click();

  // Mit eigenem Schlüssel führt derselbe Einstieg ins Gespräch.
  await openTab(page, 'Heute');
  await configureCloud(page);
  await openTab(page, 'Gespräche');

  const entry = page.getByRole('button', { name: /Rede mit jemandem/ });
  await expect(entry).toBeVisible();
  await entry.click();

  // Kulissenwahl mit ehrlichem Hinweis (frisches Gerät: nichts fällig).
  await expect(page.getByRole('heading', { name: 'Wo soll geredet werden?' })).toBeVisible();
  await expect(page.getByText(/nichts gemessen/)).toBeVisible();
  await expect(page.getByRole('button', { name: /Im Café/ })).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: Der Abschluss eines Sparring-Gesprächs (Ausbau nach P5).
// Ein Gespräch, das nie endet, kann auch nie ehrlich abrechnen. Geprüft wird
// deshalb: „Gespräch beenden" führt zu einer Bilanz, die bei nichts Fälligem
// ausdrücklich sagt, dass nichts gemessen wurde — und man weiterreden kann.
test('a sparring conversation can be ended and accounts for itself honestly', async ({ page }) => {
  const pageErrors: string[] = [];
  // Der Netzwerkfehler zur Cloud-KI ist hier ERWARTET (kein echter Schlüssel) —
  // geprüft wird die Fläche, nicht der Anbieter.
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await configureCloud(page);

  // Einstieg direkt von „Heute" (Sprechen gehört auf die erste Seite).
  await page.getByRole('button', { name: /Sparring · sprechen/ }).click();
  await page.getByRole('button', { name: /Im Café/ }).click();

  // Freihändig ist wählbar und ausdrücklich NICHT voreingestellt.
  const handsFree = page.getByRole('button', { name: 'Freihändig', exact: true });
  await expect(handsFree).toHaveAttribute('aria-pressed', 'false');
  await handsFree.click();
  await expect(page.getByRole('button', { name: 'Freihändig an' })).toBeVisible();

  await page.getByRole('button', { name: 'Gespräch beenden' }).click();
  await expect(page.getByText('Gespräch beendet.')).toBeVisible();
  await expect(page.getByText(/keine Zahl/)).toBeVisible();

  // Weiterreden bringt die Eingabe zurück — „beendet" ist keine Sackgasse.
  await page.getByRole('button', { name: 'Weiterreden' }).click();
  await expect(page.getByRole('textbox', { name: 'Deine Antwort auf Schwedisch' })).toBeVisible();

  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: Prüf-Stand des Inhalts (Stufe 4 der Prüfkette).
// Die App darf über ihren eigenen Stoff nicht mehr behaupten, als geprüft ist.
// Geprüft wird deshalb beides: dass die auffällige Wendung markiert ist, UND
// dass der Fortschritt die Grenze des Inhalts als SATZ benennt (seit 2026-07-25
// ohne Zähler: eine Skala, auf der man nie vorankommt, ist keine Auskunft).
test('content verification is stated honestly, down to the single phrase', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await openLearn(page);
  await page.getByRole('button', { name: /Einkaufen/ }).first().click();
  await page.getByRole('button', { name: /Im Geschäft/ }).first().click();

  // Die auffällige Wendung trägt ihren Grund sichtbar bei sich …
  await expect(page.getByText(/selten belegt/).first()).toBeVisible();
  // … und die unauffälligen tragen KEIN Siegel (146 Haken wären ein Versprechen,
  // das die maschinelle Prüfung nicht decken kann).
  expect(await page.getByText(/selten belegt/).count()).toBe(1);

  await openTab(page, 'Fortschritt');
  await expect(page.getByText('Wie geprüft ist der Inhalt?')).toBeVisible();
  await expect(page.getByText('Was hier niemand geprüft hat')).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: „Deine Daten" — der Burggraben aus docs/gremium-einstellungen.md §2.1.
// Geprüft wird der ganze Weg: sichern → löschen → wieder einlesen. Wenn dieser
// Weg bricht, ist der Lernstand eines Menschen weg; deshalb steht er im e2e.
test('a learner can take their memory out as a file and read it back in', async ({ page }, info) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await page.getByRole('button', { name: 'Einstellungen' }).click();

  // Sichern — die Datei muss wirklich herunterkommen.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /^Sichern/ }).click(),
  ]);
  const file = info.outputPath('backup.json');
  await download.saveAs(file);
  expect(download.suggestedFilename()).toMatch(/^neurolang-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(page.getByText(/Gesichert:/)).toBeVisible();

  // Alles löschen …
  await page.getByRole('button', { name: 'Alles löschen' }).click();
  await page.getByRole('button', { name: 'Ja, alles löschen' }).click();

  // … und aus der Datei zurückholen.
  await page.getByRole('button', { name: 'Sicherung einlesen' }).click();
  await page.setInputFiles('input[type=file]', file);
  await expect(page.getByText(/Eingelesen:/)).toBeVisible();
  await expect(page.getByText(/weitergeführt/)).toBeVisible();

  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: „Warum jetzt?" — die Selbstauskunft der Engine.
// Eine App, die behauptet, ihre Zahlen seien wahr, muss ihre eigene Entscheidung
// offenlegen können. Geprüft wird, dass die Auskunft erscheint, den Beweis-Stand
// nennt und beim Wechsel der Wendung wieder zu ist (kein Zustand, der klebt).
test('the session explains why this phrase is up right now', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await startSession(page);

  // Standardmäßig zu — die Auskunft drängt sich nicht auf.
  await expect(page.getByText('Bewiesen stabil:')).toHaveCount(0);
  await page.getByRole('button', { name: 'Warum jetzt?' }).click();

  await expect(page.getByText(/zum ersten Mal|Fällig seit|jetzt fällig/)).toBeVisible();
  await expect(page.getByText('Bewiesen stabil:')).toBeVisible();
  await expect(page.getByText('noch nicht')).toBeVisible();
  // Was zum Beweis fehlt, steht ausdrücklich da.
  await expect(page.getByText(/du sagst sie selbst/)).toBeVisible();

  // Nächste Wendung → wieder zu.
  await page.getByRole('button', { name: 'Auflösen' }).click();
  await page.getByRole('button', { name: 'Selbsteinschätzung: Sitzt' }).click();
  await expect(page.getByText('Bewiesen stabil:')).toHaveCount(0);

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: Die App muss eine hochgestellte SYSTEM-SCHRIFTGRÖSSE überstehen.
//
// Der gemeldete Fehler (2026-07-25): „bei Notfällen im Dialog überlappen sich die
// Bereiche". Ursache war nicht das Thema Notfall, sondern die Schriftskalierung
// des Geräts: Die Reiterleiste wuchs mit, „Fortschritt" lief über den rechten
// Rand hinaus, und der feste Abstand darüber reichte nicht mehr — die letzten
// Zeilen verschwanden hinter der Leiste.
test('the app survives a raised system font size', async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.style.fontSize = '24px';
    });
  });
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  const width = page.viewportSize()?.width ?? 0;

  for (const t of ['Heute', 'Lernen', 'Gespräche', 'Fortschritt']) {
    await openTab(page, t);

    // 1. Keine Reiter-Beschriftung läuft über den Bildschirmrand.
    const labels = await page
      .getByRole('navigation', { name: 'Hauptbereiche' })
      .getByRole('button')
      .all();
    for (const l of labels) {
      const box = await l.boundingBox();
      expect(box, `Reiter ohne Kasten in ${t}`).not.toBeNull();
      expect(box!.x, `Reiter links außerhalb in ${t}`).toBeGreaterThanOrEqual(-0.5);
      expect(box!.x + box!.width, `Reiter rechts außerhalb in ${t}`).toBeLessThanOrEqual(width + 0.5);
    }

    // 2. Ganz nach unten scrollen: Nichts bleibt hinter der Leiste liegen.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(350);
    const hidden = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Hauptbereiche"]');
      if (!nav) return null;
      const top = nav.getBoundingClientRect().top;
      for (const el of document.querySelectorAll('main p, main h1, main h2, main span, main button')) {
        const b = el.getBoundingClientRect();
        if (b.height < 6 || b.width < 6) continue;
        if (el.closest('[aria-hidden="true"]')) continue;
        if (!(el.textContent || '').trim()) continue;
        if (b.bottom - top > 2) return (el.textContent || '').trim().slice(0, 40);
      }
      return null;
    });
    expect(hidden, `hinter der Reiterleiste verdeckt in ${t}`).toBeNull();

    // 3. Die Seite darf sich NICHT seitwärts schieben lassen.
    //
    // Gemessen (2026-07-25): Acht Elemente ragen über die rechte Kante — alle
    // gehören zur Hintergrund-Grafik, die mit `inset: -8%` bewusst größer als
    // der Bildschirm ist, damit ihre langsame Drift nie eine Kante zeigt. Sie
    // ist `position: fixed` und zählt daher nicht zum Scrollbereich. Der Test
    // prüft nicht die Elemente, sondern den Schaden: Sobald echter Inhalt
    // überläuft, wackelt die Seite seitwärts — und genau das fällt hier auf.
    const seitwaerts = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(seitwaerts, `Seite lässt sich in ${t} seitwärts schieben`).toBeLessThanOrEqual(1);
  }
});

// Die Einstellungen waren nur ein `div`. Gemessen landeten 15 von 42
// Tabulator-Sprüngen HINTER der Fläche — die Eingabetaste startete dort eine
// Lern-Sitzung unter dem offenen Fenster (Barrierefreiheits-Audit 2026-07-25).
test('eine offene Überlagerung hält Tastatur und Escape fest', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  await page.getByRole('button', { name: 'Einstellungen' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // 1. Der Fokus steht IN der Fläche, nicht mehr auf dem verdeckten Auslöser.
  await expect(async () => {
    const inside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return !!d && d.contains(document.activeElement);
    });
    expect(inside).toBe(true);
  }).toPass({ timeout: 2000 });

  // 2. 30 Tabulator-Sprünge verlassen die Fläche kein einziges Mal.
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return !!d && d.contains(document.activeElement);
    });
    expect(inside, `Sprung ${i + 1} landete hinter der Fläche`).toBe(true);
  }

  // 3. Escape schließt — vorher tat die Taste nirgends etwas.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

// Die wichtigste Fläche der App hatte gemessen 0 Überschriften.
test('jede Fläche hat genau eine Überschrift erster Ebene', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  for (const t of ['Heute', 'Lernen', 'Gespräche', 'Fortschritt']) {
    await openTab(page, t);
    const count = await page.locator('main h1').count();
    expect(count, `Überschriften erster Ebene in ${t}`).toBe(1);
  }

  // Auch die Lern-Sitzung — dort war es vorher keine.
  await openTab(page, 'Heute');
  await page.getByRole('button', { name: /Weiterlernen|Loslegen|Lernen starten/ }).first().click();
  await expect(page.locator('main h1')).toHaveCount(1);
});

// Befund E-1 der Prüfkaskade (2026-07-25): Der Fokusfang lief bei JEDEM Rendern
// der Elternfläche neu, weil `onClose` als Inline-Funktion in der
// Abhängigkeitsliste stand. Ein getipptes Zeichen ließ die Fläche rendern, der
// Fokus sprang auf „Fertig" — von „Andreas" kam ein „A" an. Gemessen, nicht
// vermutet. Dieser Test hält die Reparatur fest.
test('in einer Überlagerung bleibt der Fokus beim Tippen im Feld', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  await page.getByRole('button', { name: 'Einstellungen' }).click();
  const field = page.locator('#pref-name');
  await expect(field).toBeVisible();
  await field.click();

  await page.keyboard.type('Andreas');
  // Der ganze Name muss ankommen — nicht nur das erste Zeichen.
  await expect(field).toHaveValue('Andreas');
  await expect(field).toBeFocused();

  // Und der Fokus muss beim Schließen auf den Auslöser zurück.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Einstellungen' })).toBeFocused();
});

// Stufe B: Ein Wort mit zwei Bedeutungen wird als solches BENANNT.
//
// Der Rückübersetzungs-Bericht führt 38 Wörter, die im Inhalt verschieden
// glossiert sind. Bei den meisten ist das kein Fehler, sondern Schwedisch:
// `vad` heißt „was" und „wie", `kort` „Karte" und „kurz". Ohne Hinweis erlebt
// der Lerner das als Widerspruch — und sucht den Fehler bei sich. Der Hinweis
// hängt an der Dekodierung: Wer Wort-für-Wort-Hilfe zieht, bekommt sie ganz.
test('ein mehrdeutiges Wort wird im Lern-Loop als mehrdeutig erklärt', async ({ page }) => {
  await page.goto('/');
  // Gezielt in ein Thema mit mehrdeutigen Wörtern: Seit es den Startpiloten gibt,
  // beginnt eine frische Sitzung bei „hej"/„tack" — Ein-Wort-Äußerungen ohne
  // zweite Bedeutung. Ein Fokus macht den Test wieder aussagekräftig.
  await openLearn(page);
  await page.getByRole('button', { name: /Erste Schritte/ }).click();
  await page.getByRole('button', { name: /Begrüßen & Kennenlernen/ }).click();
  await page.getByRole('button', { name: 'Fokus setzen' }).click();
  await openTab(page, 'Heute');
  await startSession(page);

  let gefunden = '';
  for (let i = 0; i < 12 && !gefunden; i++) {
    const zu = page.getByRole('button', { name: 'Dekodierung', exact: true });
    if (await zu.count()) await zu.click();
    const hinweis = page.locator('p', { hasText: 'es heißt auch' });
    if (await hinweis.count()) {
      gefunden = (await hinweis.first().innerText()).replace(/\s+/g, ' ');
      break;
    }
    const aufloesen = page.getByRole('button', { name: 'Auflösen' }).first();
    if (!(await aufloesen.count())) break;
    await aufloesen.click();
    const sitzt = page.getByRole('button', { name: 'Selbsteinschätzung: Sitzt' }).first();
    if (!(await sitzt.count())) break;
    await sitzt.click();
    await sitzt.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
  }

  expect(gefunden, 'kein Mehrdeutigkeits-Hinweis in den ersten Karten').not.toBe('');
  // Der Hinweis sagt BEIDE Bedeutungen und ordnet die aktuelle ein.
  expect(gefunden).toMatch(/heißt hier „[^"]+" — es heißt auch „[^"]+"/);
});

// Stufe G (Stabilität): Die App verspricht „kein Backend, offline nutzbar".
//
// Das ist kein Nebensatz, sondern die Bedingung dafür, dass jemand im Zug oder
// im Ausland weiterlernt — und genau dort bricht Erhalt sonst ab. Eine einzige
// Laufzeit-Abfrage ins Netz würde das Versprechen still kassieren; nichts an
// der Oberfläche würde es zeigen, solange der Entwickler online ist.
//
// Gemessen wird deshalb der ganze Weg ohne Netz: neu laden, die NACHGELADENEN
// Gespräche öffnen (sie kommen aus einem eigenen Bündel) und eine Session
// starten.
test('ohne Netz bleibt die App vollständig benutzbar', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  // Der Service Worker muss die Auslieferung übernommen haben, sonst prüft der
  // Test nur den Browser-Cache und nicht das Versprechen.
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  // Beweis, dass hier der Service Worker ausliefert und nicht der Browser-Cache:
  // Ohne einen kontrollierenden Worker prüfte dieser Test gar nichts.
  expect(
    await page.evaluate(() => !!navigator.serviceWorker.controller),
    'kein Service Worker in Kontrolle — der Test würde nur den Browser-Cache prüfen',
  ).toBe(true);

  await context.setOffline(true);
  try {
    await page.reload();
    await expect(page.getByText('bewiesen stabil')).toBeVisible();

    // Eine Adresse, die es so noch nie gab — jemand öffnet einen Link oder lädt
    // mit einem Anhängsel neu. Nur `navigateFallback` des Service Workers kann
    // das ohne Netz beantworten. (Ein `fetch` darauf scheitert korrekt: Der
    // Fallback gilt für Seitenaufrufe, nicht für einzelne Abfragen.)
    await page.goto('/?nie-zuvor=1');
    await expect(page.getByText('bewiesen stabil')).toBeVisible();

    // Gespräche liegen in einem eigenen Bündel und werden erst bei Bedarf geholt.
    await openTab(page, 'Gespräche');
    await expect(page.getByRole('button', { name: /Im Restaurant/ })).toBeVisible();

    // Und der Lern-Loop selbst.
    await openTab(page, 'Heute');
    await startSession(page);
    await expect(page.getByRole('button', { name: 'Auflösen' })).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});

// Stufe B: Der Hinweis auf die fehlende Sicherung — und seine Bedingung.
//
// Der gesamte Lernstand liegt in EINEM Browser. Dass er mit ihm verschwindet,
// stand ehrlich in den Einstellungen — nur sieht dort niemand hinein, bevor es
// zu spät ist. Der Hinweis steht deshalb neben der bewiesenen Zahl, ist aber
// keine Dauer-Mahnung: Er nennt eine gemessene Menge und verschwindet, sobald
// sie null ist. Geprüft wird beides — dass er bei nichts zu verlieren SCHWEIGT
// und nach dem Sichern wieder verschwindet.
test('der Sicherungs-Hinweis erscheint nur, wenn es etwas zu verlieren gibt', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  // Frischer Stand: nichts bewiesen, also kein Hinweis.
  await openTab(page, 'Fortschritt');
  await expect(page.getByText(/in keiner Sicherung/)).toHaveCount(0);

  // Einen Stand einspielen, in dem etwas bewiesen ist.
  const bewiesen = Date.now() - 5 * 24 * 3600 * 1000;
  const backup = {
    app: 'neurolang',
    version: 1,
    exportedAt: Date.now(),
    name: '',
    preferences: {},
    states: ['c-hej', 'c-tack', 'c-hejda'].map((chunkId) => ({
      chunkId,
      status: 'review',
      stage: 'production',
      intervalDays: 120,
      stability: 120,
      difficulty: 5,
      dueAt: Date.now() + 60 * 24 * 3600 * 1000,
      lastReviewedAt: bewiesen,
      successStreak: 6,
      provenStableAt: bewiesen,
      maturedAt: bewiesen,
      lapsedAt: null,
      history: [{ at: bewiesen, result: 'good', stage: 'production', intervalDays: 120 }],
    })),
  };
  const datei = info.outputPath('bewiesen.json');
  await writeFile(datei, JSON.stringify(backup));

  await openTab(page, 'Heute');
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await page.getByRole('button', { name: 'Sicherung einlesen' }).click();
  await page.setInputFiles('input[type=file]', datei);
  await expect(page.getByText(/Eingelesen:/)).toBeVisible();
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();

  // Jetzt gibt es etwas zu verlieren — und der Hinweis sagt WIE VIEL.
  await openTab(page, 'Fortschritt');
  await expect(page.getByText(/bewiesene Wendungen stehen in keiner Sicherung/)).toBeVisible();

  // Sichern — danach ist die Menge null und der Hinweis weg.
  await page.getByRole('button', { name: 'Zu „Deine Daten"' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /^Sichern/ }).click(),
  ]);
  await download.saveAs(info.outputPath('nachher.json'));
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();

  await openTab(page, 'Fortschritt');
  await expect(page.getByText(/in keiner Sicherung/)).toHaveCount(0);
});

// Stufe B: Die Anti-Klippe an der einzelnen Wendung (CLAUDE.md, nicht verhandelbar).
//
// „Wird etwas zu hart, nicht durchdrücken: erst mehr verständlichen Input +
// leichtere Variante nachschieben, dann neu annähern."
//
// Gemessen 2026-07-26: Wer „Nochmal" drückte, bekam die Wendung in der Sitzung
// zurück — mit ZUGEKLAPPTER Dekodierung und in einem NEUEN Satz. Beim
// Wiedersehen war sie also schwerer als beim Scheitern. Dieser Test hält die
// Gegenrichtung fest: derselbe Satz, offene Hilfe.
test('nach einem „Nochmal" kommt derselbe Satz zurück, mit offener Hilfe', async ({
  page,
}) => {
  // Ein Stand, in dem die Wendung schon einmal saß — sonst steht die Hilfe
  // ohnehin offen (neuer Stoff) und der Test bewiese nichts.
  const frueher = Date.now() - 30 * 24 * 3600 * 1000;
  const backup = {
    app: 'neurolang',
    version: 1,
    exportedAt: Date.now(),
    name: '',
    preferences: {},
    states: [
      {
        chunkId: 'c-hej',
        status: 'review',
        stage: 'production',
        intervalDays: 10,
        stability: 10,
        difficulty: 5,
        dueAt: Date.now() - 3600 * 1000, // jetzt fällig
        lastReviewedAt: frueher,
        successStreak: 2,
        provenStableAt: null,
        maturedAt: null,
        lapsedAt: null,
        seenSegmentIds: [],
        history: [{ at: frueher, result: 'good', segmentId: 's-hej1' }],
      },
    ],
  };
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await page.getByRole('button', { name: 'Sicherung einlesen' }).click();
  await page.setInputFiles('input[type=file]', {
    name: 'faellig.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await expect(page.getByText(/Eingelesen:/)).toBeVisible();
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();

  await startSession(page);

  // Karte 1 ist die eingespielte, fällige Wendung — sie steht in der Produktion.
  // Dort sind die Hilfen bis zum Auflösen ausgeblendet (man soll die Lösung
  // nicht sehen, während man sie bilden soll). Also erst falsch antworten.
  await page.getByLabel('Antwort auf Schwedisch').fill('fel svar');
  await page.getByRole('button', { name: 'Prüfen' }).click();
  // Nach der Prüfung kommt erst das formative Feedback, dann die Lösung.
  await page.getByRole('button', { name: 'Auflösen' }).click();

  // Jetzt liegt alles offen — den KONTEXT ablesen, um ihn später zu vergleichen.
  await page.getByRole('button', { name: 'Übersetzung', exact: true }).click();
  const kontextVorher = (await page.locator('main p.italic').first().innerText()).trim();
  expect(kontextVorher.length, 'kein Kontext ablesbar').toBeGreaterThan(3);

  const nochmal = page.getByRole('button', { name: 'Selbsteinschätzung: Nochmal' }).first();
  await nochmal.click();
  await nochmal.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});

  // Die restlichen Karten abräumen, bis die gescheiterte Wendung wiederkommt.
  // Erkannt am KONTEXT, nicht an der offenen Hilfe: Bei neuem Stoff steht die
  // ohnehin offen — daran hätte der Test die falsche Karte gepackt.
  const kontextJetzt = () =>
    page
      .locator('main p.italic')
      .first()
      .innerText()
      .then((t) => t.trim())
      .catch(() => '');

  let wieder = (await kontextJetzt()) === kontextVorher;
  for (let i = 0; i < 12 && !wieder; i++) {
    const feld = page.getByLabel('Antwort auf Schwedisch');
    if (await feld.count()) {
      await feld.fill('fel');
      await page.getByRole('button', { name: 'Prüfen' }).click();
    }
    const aufloesen = page.getByRole('button', { name: 'Auflösen' }).first();
    if (!(await aufloesen.count())) break;
    await aufloesen.click();
    const g = page.getByRole('button', { name: 'Selbsteinschätzung: Sitzt' }).first();
    if (!(await g.count())) break;
    await g.click();
    await g.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
    wieder = (await kontextJetzt()) === kontextVorher;
  }

  // 1. Sie kommt im SELBEN Satz zurück — eine neue Verpackung wäre nach dem
  //    Scheitern schwerer statt leichter (Kontextvariation ist Schritt 4).
  expect(wieder, 'die gescheiterte Wendung kam nicht im selben Satz zurück').toBe(true);

  // 2. Und die Hilfe steht von selbst offen — ohne dass jemand sie aufziehen muss.
  await expect(
    page.getByRole('button', { name: 'Dekodierung ausblenden' }),
    'die Hilfe war beim Nachlernen wieder zugeklappt',
  ).toBeVisible();
});

// Stufe B: Der Startpilot — der erste Weg für jemanden ohne ein einziges Wort.
//
// Der Inhalt begann bisher bei „hur mår du?". Wer noch nie Schwedisch gesehen
// hat, steht davor wie vor einer Wand. Der Startpilot führt durch sechzehn
// Ein-Wort-Äußerungen und prüft nach je vier kurz nach.
//
// Zwei Dinge prüft dieser Test, weil sie die Regel der App tragen:
//   1. Der Abschluss nennt das Ergebnis und sagt im selben Atemzug, dass es
//      KEIN Beweis ist (Wiedererkennen aus drei Möglichkeiten).
//   2. Die Einladung verschwindet nach dem Durchlauf — ein Angebot, das
//      stehen bleibt, ist kein Angebot mehr.
test('der Startpilot führt durch die ersten Wörter und wird danach unsichtbar', async ({
  page,
}) => {
  const seitenFehler: string[] = [];
  page.on('pageerror', (e) => seitenFehler.push(String(e)));

  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await page.getByRole('button', { name: /Startpilot starten/ }).click();

  // Erstes Wort: schwedisch groß, deutsche Bedeutung, und wann man es sagt.
  await expect(page.getByText('Wort 1 von 16')).toBeVisible();
  await expect(page.locator('section [lang="sv"]').first()).toHaveText('hej');

  // Vier Begegnungen, dann die erste Probe.
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Verstanden' }).click();
  await expect(page.getByText(/Kleine Probe · 1 von 4/)).toBeVisible();
  await expect(page.locator('section button[lang="sv"]')).toHaveCount(3);

  // Komplett durchspielen — immer die erste Möglichkeit, also mal richtig, mal falsch.
  for (let i = 0; i < 90; i++) {
    if (await page.getByRole('button', { name: /Los geht/ }).count()) break;
    const weiter = page.getByRole('button', { name: 'Weiter' });
    const verstanden = page.getByRole('button', { name: 'Verstanden' });
    if (await weiter.count()) await weiter.click();
    else if (await verstanden.count()) await verstanden.click();
    else await page.locator('section button[lang="sv"]').first().click();
  }

  // Der Abschluss zählt — und ordnet das Gezählte sofort ein.
  await expect(page.getByText(/wiedererkannt/)).toBeVisible();
  await expect(page.getByText(/nicht als Beweis/)).toBeVisible();

  await page.getByRole('button', { name: /Los geht/ }).click();
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await expect(page.getByRole('button', { name: /Startpilot starten/ })).toHaveCount(0);

  // Und er bleibt in den Einstellungen erreichbar.
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await expect(page.getByRole('button', { name: 'Noch einmal durchgehen' })).toBeVisible();

  expect(seitenFehler, seitenFehler.join('\n')).toHaveLength(0);
});

// Stufe B: Der Startpilot wird NUR Anfängern angeboten.
//
// BEFUND 2026-07-26: Die Einladung hing allein an „noch nicht gelaufen". Wer
// seinen Lernstand von einem anderen Gerät einliest, hat vielleicht hundert
// Wendungen hinter sich — „Fang hier an, die ersten sechzehn Wörter" wäre für
// den schlicht falsch. Angeboten wird er nur, solange kein einziger Abruf
// gelungen ist.
test('wer schon etwas kann, bekommt den Startpiloten nicht mehr angeboten', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Startpilot starten/ })).toBeVisible();

  const frueher = Date.now() - 40 * 24 * 3600 * 1000;
  const backup = {
    app: 'neurolang',
    version: 1,
    exportedAt: Date.now(),
    name: '',
    preferences: {},
    states: [
      {
        chunkId: 'c-hej',
        status: 'review',
        stage: 'production',
        intervalDays: 20,
        stability: 20,
        difficulty: 5,
        dueAt: Date.now() + 10 * 24 * 3600 * 1000,
        lastReviewedAt: frueher,
        successStreak: 3,
        provenStableAt: null,
        maturedAt: frueher,
        lapsedAt: null,
        seenSegmentIds: [],
        history: [{ at: frueher, result: 'good', segmentId: 's-hej1' }],
      },
    ],
  };

  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await page.getByRole('button', { name: 'Sicherung einlesen' }).click();
  await page.setInputFiles('input[type=file]', {
    name: 'stand.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await expect(page.getByText(/Eingelesen:/)).toBeVisible();
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();

  // Ein einziger gelungener Abruf reicht: Dieser Mensch ist kein Anfänger mehr.
  await expect(page.getByRole('button', { name: /Startpilot starten/ })).toHaveCount(0);
  // Erreichbar bleibt er trotzdem.
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await expect(page.getByRole('button', { name: 'Startpilot öffnen' })).toBeVisible();
});

// Stufe B: Zurückgehen muss JEDERZEIT gehen (gemeldet 2026-07-26).
//
// „Dieses Thema üben" baute dieselbe Warteschlange wie der Tagesplan. Ist im
// Thema nichts fällig und nichts neu, kam eine LEERE Sitzung heraus — ein
// Knopf, der nichts tut. Jetzt folgt freiwillige Wiederholung, und an genau der
// Stelle steht, was das für die Messung bedeutet: nichts Gutes und nichts
// Schlimmes, aber der Beweis wird dadurch nicht schneller.
test('ein Thema lässt sich auch dann üben, wenn nichts fällig ist', async ({ page }) => {
  const frueher = Date.now() - 5 * 24 * 3600 * 1000;
  const weitWeg = Date.now() + 60 * 24 * 3600 * 1000;
  const ids = ['c-hej', 'c-heter', 'c-marbra', 'c-hejda', 'c-vises', 'c-varifran'];
  const backup = {
    app: 'neurolang',
    version: 1,
    exportedAt: Date.now(),
    name: '',
    preferences: {},
    states: ids.map((chunkId, i) => ({
      chunkId,
      status: 'maintenance',
      stage: 'production',
      intervalDays: 60,
      stability: 60,
      difficulty: 5,
      dueAt: weitWeg,
      lastReviewedAt: frueher - i * 24 * 3600 * 1000,
      successStreak: 4,
      provenStableAt: null,
      maturedAt: frueher,
      lapsedAt: null,
      seenSegmentIds: [],
      history: [{ at: frueher - i * 24 * 3600 * 1000, result: 'good', segmentId: 's' }],
    })),
  };

  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await page.getByRole('button', { name: 'Sicherung einlesen' }).click();
  await page.setInputFiles('input[type=file]', {
    name: 'stand.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await expect(page.getByText(/Eingelesen:/)).toBeVisible();
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();

  await openLearn(page);
  await page.getByRole('button', { name: /Erste Schritte/ }).click();
  await page.getByRole('button', { name: /Begrüßen & Kennenlernen/ }).click();
  await page.getByRole('button', { name: /Dieses Thema üben/ }).click();

  // Nicht leer: alle sechs Wendungen stehen zur Wiederholung bereit.
  await expect(page.getByText('Sitzung erledigt.')).toHaveCount(0);
  await expect(page.getByText('1 / 6')).toBeVisible();

  // Und die Einordnung steht da, wo sie hingehört.
  await expect(page.getByText(/Freiwillige Wiederholung/i)).toBeVisible();
  await expect(page.getByText(/nicht kürzer, sondern länger/)).toBeVisible();
});

// Stufe B: Der Startpilot ist DAUERHAFT erreichbar, nicht nur beim ersten Mal.
test('der Startpilot steht dauerhaft im Reiter „Lernen"', async ({ page }) => {
  await page.goto('/');
  await openLearn(page);
  const einstieg = page.getByRole('button', { name: /Startpilot — die ersten sechzehn Wörter/ });
  await expect(einstieg).toBeVisible();
  await einstieg.click();
  await expect(page.getByText('Wort 1 von 16')).toBeVisible();

  // Auch nach dem Verlassen bleibt er stehen — er ist kein einmaliges Angebot.
  await page.getByRole('button', { name: 'Startpilot verlassen' }).click();
  await openLearn(page);
  await expect(einstieg).toBeVisible();
});

// ── Das Tor für KI-erzeugte Sätze (docs/08-content-pipeline.md) ───────────────
//
// Der Anbieter wird hier abgefangen und antwortet nach Drehbuch. Das ist der
// einzige Weg, den Fall zu zeigen, auf den es ankommt: ein Modell, das etwas
// Kaputtes liefert. Er lässt sich nicht bestellen, indem man wartet.

/**
 * Fängt die Anthropic-API ab und baut die Antwort aus der Ziel-Wendung, die im
 * Anfrage-Text steht. Dadurch ist der Test unabhängig davon, welche Wendung die
 * Sitzung gerade vorlegt.
 */
async function stubGenerator(page: Page, art: 'kaputt' | 'sauber') {
  await page.route('**/api.anthropic.com/**', async (route) => {
    const kopf = {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': '*',
    };
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: kopf, body: '' });
      return;
    }
    const body = route.request().postData() ?? '';
    const treffer = /Ziel-Wendung[^„]*„([^\\"]+)\\?" \(Bedeutung: „([^\\"]+)\\?"\)/.exec(body);
    const sv = treffer?.[1] ?? 'hej';
    const de = treffer?.[2] ?? 'hallo';
    // kaputt: Satz ohne jede Wort-für-Wort-Bedeutung — die interlineare Zeile
    // wäre leer, der Birkenbihl-Schritt fiele aus. Harter Fall, egal welche
    // Wendung gerade dran ist.
    // sauber: die Wendung plus EIN erfundenes Wort, damit auch der offene
    // Befund („nicht im geprüften Bestand") sichtbar wird.
    const antwort =
      art === 'kaputt'
        ? { sv, de, decoding: [] }
        : {
            sv: `${sv} zzz`,
            de: `${de} zzz`,
            decoding: [
              { sv, de },
              { sv: 'zzz', de: 'zzz' },
            ],
          };
    await route.fulfill({
      status: 200,
      headers: kopf,
      body: JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(antwort) }] }),
    });
  });
}

test('ein KI-Satz ohne Dekodierung wird verworfen statt beschriftet', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await configureCloud(page);
  await stubGenerator(page, 'kaputt');
  await startSession(page);

  await page.getByRole('button', { name: /Neuer Kontext/ }).click();

  // Der Satz erscheint NICHT — und die App sagt, woran es lag.
  await expect(page.getByText(/keine Wort-für-Wort-Dekodierung/)).toBeVisible();
  await expect(page.getByText(/geprüfte Satz oben gilt weiter/)).toBeVisible();
  await expect(page.getByText(/Neuer Kontext · KI-erzeugt/)).toHaveCount(0);
});

test('ein bestandener KI-Satz sagt, was geprüft ist — und was nicht', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await configureCloud(page);
  await stubGenerator(page, 'sauber');
  await startSession(page);

  await page.getByRole('button', { name: /Neuer Kontext/ }).click();

  await expect(page.getByText(/Neuer Kontext · KI-erzeugt · maschinell geprüft/)).toBeVisible();
  await expect(page.getByText(/Maschinell geprüft: jedes Wort hat eine Bedeutung/)).toBeVisible();
  // Das erfundene Wort wird beim Namen genannt, nicht verschwiegen …
  await expect(page.getByText(/Neu für die App: zzz/)).toBeVisible();
  // … und die Grenze der Maschine steht im selben Absatz.
  await expect(page.getByText(/dafür bräuchte es einen Muttersprachler/)).toBeVisible();
});

// ── Der Vorrat (docs/08-content-pipeline.md §Der Vorrat) ──────────────────────
//
// Der Vorrat ist die einzige Stelle der App, die Geld ausgibt, ohne dass jemand
// klickt. Beide Tests hier prüfen die Zusage, unter der das erlaubt ist: OHNE
// Einwilligung passiert nichts, MIT Einwilligung liegt der Satz sofort bereit.

/** Wie `stubGenerator`, zählt aber die Aufrufe — darum geht es hier. */
async function stubMitZaehler(page: Page): Promise<{ rufe: number }> {
  const zaehler = { rufe: 0 };
  await page.route('**/api.anthropic.com/**', async (route) => {
    const kopf = {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': '*',
    };
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: kopf, body: '' });
      return;
    }
    zaehler.rufe++;
    const body = route.request().postData() ?? '';
    const t = /Ziel-Wendung[^„]*„([^\\"]+)\\?" \(Bedeutung: „([^\\"]+)\\?"\)/.exec(body);
    const sv = t?.[1] ?? 'hej';
    const de = t?.[2] ?? 'hallo';
    await route.fulfill({
      status: 200,
      headers: kopf,
      body: JSON.stringify({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              sv: `${sv} zzz`,
              de: `${de} zzz`,
              decoding: [{ sv, de }, { sv: 'zzz', de: 'zzz' }],
            }),
          },
        ],
      }),
    });
  });
  return zaehler;
}

async function schalteVorratEin(page: Page) {
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await page.getByRole('checkbox', { name: 'Sätze auf Vorrat schreiben' }).check();
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();
}

test('ohne Einwilligung schreibt die App nichts vor', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await configureCloud(page); // Cloud AN, Vorrat aber NICHT eingeschaltet
  const zaehler = await stubMitZaehler(page);
  await startSession(page);

  // Lange genug, dass ein Nachschub sichtbar geworden wäre.
  await page.waitForTimeout(1500);
  expect(zaehler.rufe, 'Die App darf ohne Einwilligung keinen Aufruf auslösen').toBe(0);
});

test('mit Vorrat liegt der nächste Kontext sofort bereit', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await configureCloud(page);
  await schalteVorratEin(page);
  const zaehler = await stubMitZaehler(page);
  await startSession(page);

  // Der Nachschub läuft im Hintergrund an, ohne dass jemand etwas gedrückt hat.
  await expect.poll(() => zaehler.rufe, { timeout: 10_000 }).toBeGreaterThan(0);

  // Erste Wendung beantworten, damit die zweite dran ist — für DIE wurde
  // vorgesorgt (die laufende wird bewusst übersprungen).
  await page.getByRole('button', { name: 'Auflösen' }).first().click();
  await page.getByRole('button', { name: 'Selbsteinschätzung: Sitzt' }).first().click();
  await expect(page.getByText('2 /')).toBeVisible();

  const vorher = zaehler.rufe;
  await page.getByRole('button', { name: /Neuer Kontext/ }).click();
  await expect(page.getByText(/Lag im Vorrat bereit/)).toBeVisible();
  // Und zwar OHNE neuen Aufruf — genau das ist der Gewinn.
  expect(zaehler.rufe).toBe(vorher);
});

test('der Vorrat ist sichtbar und lässt sich wegwerfen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await configureCloud(page);
  await schalteVorratEin(page);
  const zaehler = await stubMitZaehler(page);
  await startSession(page);
  await expect.poll(() => zaehler.rufe, { timeout: 10_000 }).toBeGreaterThan(0);

  await page.getByRole('button', { name: /Übersicht/ }).first().click();
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await expect(page.getByText(/Vorrat: \d+ (Satz|Sätze) bereit/)).toBeVisible();

  await page.getByRole('button', { name: 'Vorrat leeren' }).click();
  await expect(page.getByText('Vorrat: leer')).toBeVisible();
});

// ── Die Rückkehr nach einer Pause (docs/03-method.md §Rückkehr) ───────────────
//
// Der Befund, gegen den dieser Test steht: Wer 30 Tage weg war, bekam
// „Weiterlernen · 120 Wendungen" — und darin die schwächsten zuerst. Das ist die
// Klippe, gegen die diese App gebaut ist, im verletzlichsten Moment überhaupt.
//
// Der Lernstand kommt über die Sicherungs-Datei herein: Das ist der einzige Weg,
// im echten Browser einen Rückkehrer zu erzeugen, ohne an der Speicherschicht
// vorbeizugreifen — und er benutzt genau den Pfad, den ein echter Gerätewechsel
// auch nimmt.
async function lernstandEinlesen(page: Page, datei: string) {
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  await page.getByRole('button', { name: 'Sicherung einlesen' }).click();
  await page.setInputFiles('input[type=file]', datei);
  await expect(page.getByText(/Eingelesen:/)).toBeVisible();
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();
}

test('nach einer langen Pause wird portioniert statt abgeladen', async ({ page }, info) => {
  const TAG = 86_400_000;
  const jetzt = Date.now();

  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();

  // Die ECHTEN Wendungs-Kennungen kommen aus der App selbst — über ihren eigenen
  // Sicherungs-Export. Kein Import aus `src`: Der e2e-Build sieht den Quellcode
  // der App bewusst nicht, und ein Test, der sich daran vorbeimogelt, prüft
  // etwas anderes als das ausgelieferte Programm.
  await page.getByRole('button', { name: 'Einstellungen' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /^Sichern/ }).click(),
  ]);
  const roh = info.outputPath('roh.json');
  await download.saveAs(roh);
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();

  const original = JSON.parse(await readFile(roh, 'utf-8')) as {
    states: Record<string, unknown>[];
  };

  // 60 Wendungen zu einem Rückkehrer machen: seit 90 Tagen nicht angefasst.
  // Die Hälfte ist noch gut abrufbar (Stabilität 60 Tage → rund 86 % Abrufchance),
  // die andere praktisch weg. 90 und nicht 40: Bei 40 Tagen wären die stabilen
  // Wendungen noch gar nicht fällig gewesen — der Prüfstand hätte den Fall gar
  // nicht hergestellt, den er prüfen soll.
  const zuletzt = jetzt - 90 * TAG;
  const states = original.states.slice(0, 60).map((s, i) => {
    const stark = i % 2 === 0;
    return {
      ...s,
      status: 'maintenance',
      stage: 'recognition',
      intervalDays: stark ? 60 : 1,
      stability: stark ? 60 : 0.3,
      difficulty: 5,
      dueAt: zuletzt + (stark ? 60 : 1) * TAG,
      lastReviewedAt: zuletzt,
      successStreak: 2,
      history: [{ at: zuletzt, result: 'good', segmentId: 'x' }],
    };
  });

  const datei = info.outputPath('rueckkehrer.json');
  await writeFile(datei, JSON.stringify({ ...original, states }));

  await lernstandEinlesen(page, datei);

  // Die Zahl wird NICHT geschönt — 60 sind fällig, und das steht da.
  await expect(page.getByText(/60 Wendungen sind fällig/)).toBeVisible();
  await expect(page.getByText('Willkommen zurück')).toBeVisible();
  await expect(page.getByText(/kein Rückstand/)).toBeVisible();
  // Aber die Sitzung trägt eine Portion, nicht den Berg: 20 zum Retten plus
  // GENAU EINE neue Wendung. Solange ein Rückstand da ist, geht Retten vor
  // Nachlegen — sonst wächst der Berg von morgen, während der von heute steht.
  const knopf = page.getByRole('button', { name: /Weiterlernen · \d+ Wendungen/ });
  await expect(knopf).toBeVisible();
  const anzahl = Number(/· (\d+) /.exec((await knopf.innerText()) ?? '')?.[1]);
  expect(anzahl).toBeGreaterThanOrEqual(20);
  expect(anzahl).toBe(21);
  // Und es wird gesagt, was mit dem Rest passiert.
  await expect(page.getByText(/stark verblasst/)).toBeVisible();
});

test('an einem normalen Tag sagt niemand „willkommen zurück"', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  // Frisches Gerät, nichts angesammelt: Die Rückkehr-Ansprache wäre Theater.
  await expect(page.getByText('Willkommen zurück')).toHaveCount(0);
});

// ── Die ersten Wochen (docs/07-measurement.md §Die kleinste ehrliche Stufe) ───
//
// Befund 2026-07-26: Wer täglich übt und fast nichts falsch macht, sah sechs
// Wochen lang nur „Noch nichts bewiesen". Die große Zahl bleibt zu Recht auf 0 —
// gefüllt wird nur die Leere darunter, und zwar mit einem wahren Satz.
test('nach der ersten Woche steht dort etwas Wahres statt einer Leere', async ({ page }, info) => {
  const TAG = 86_400_000;
  const jetzt = Date.now();

  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  // Frisch: Es gibt noch nichts zu sagen, und die App sagt genau das.
  await expect(page.getByText(/Noch nichts bewiesen/)).toBeVisible();

  await page.getByRole('button', { name: 'Einstellungen' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /^Sichern/ }).click(),
  ]);
  const roh = info.outputPath('roh-anfang.json');
  await download.saveAs(roh);
  await page.getByRole('button', { name: /Einstellungen schließen/ }).click();
  const original = JSON.parse(await readFile(roh, 'utf-8')) as { states: Record<string, unknown>[] };

  // Eine Woche fleißig: 23 Wendungen haben eine ECHTE Pause von vier Tagen
  // überstanden — zwei Abrufe im Abstand von vier Tagen, der zweite gelungen.
  const states = original.states.map((s, i) =>
    i >= 23
      ? s
      : {
          ...s,
          status: 'maintenance',
          stage: 'recognition',
          intervalDays: 4,
          stability: 4,
          difficulty: 5,
          dueAt: jetzt + 2 * TAG,
          lastReviewedAt: jetzt - TAG,
          successStreak: 2,
          history: [
            { at: jetzt - 5 * TAG, result: 'good', segmentId: 'x' },
            { at: jetzt - TAG, result: 'good', segmentId: 'y' },
          ],
        },
  );
  const datei = info.outputPath('anfaenger.json');
  await writeFile(datei, JSON.stringify({ ...original, states }));
  await lernstandEinlesen(page, datei);

  // Die große Zahl bleibt bei 0 — der Beweis braucht weiter über 90 Tage.
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  // Darunter steht jetzt aber etwas, das WAHR ist und sich bewegt.
  await expect(page.getByText(/23 Wendungen halten schon eine Pause von drei Tagen/)).toBeVisible();
  // Und der Satz nennt seine eigene Grenze im selben Atemzug.
  await expect(page.getByText(/ein Anfang, kein Beweis/)).toBeVisible();
});

// ── Die zähe Wendung (docs/03-method.md §Die zähe Wendung) ───────────────────
//
// Der Befund war aus dem Code beweisbar: Bei jedem „Nochmal" wuchsen
// Warteschlange UND Position um eins — der Abstand blieb konstant, „Sitzung
// erledigt." konnte nie erscheinen. Wer eine Wendung heute nicht hinbekam, saß
// fest, bis er aufgab. Dieser Test spielt genau das im Browser durch.
test('wer eine Wendung nie hinbekommt, kommt trotzdem ans Ende der Sitzung', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await expect(page.getByText('bewiesen stabil')).toBeVisible();
  await startSession(page);

  // Immer „Nochmal" — der Lerner bekommt heute gar nichts hin. Ohne den Deckel
  // liefe diese Schleife bis zum Zeitlimit.
  let schritte = 0;
  while (schritte < 40) {
    if (await page.getByText('Sitzung erledigt.').isVisible()) break;
    const reveal = page.getByRole('button', { name: 'Auflösen' });
    await reveal.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    if (!(await reveal.count())) break;
    await reveal.first().click();
    const nochmal = page.getByRole('button', { name: 'Selbsteinschätzung: Nochmal' }).first();
    await nochmal.click();
    await nochmal.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
    schritte++;
  }

  // Sie endet. Das ist der ganze Punkt.
  await expect(page.getByText('Sitzung erledigt.')).toBeVisible();
  // Und was heute nicht saß, wird benannt statt verschwiegen.
  await expect(page.getByText(/heute\s+nicht sitzen/)).toBeVisible();
  await expect(page.getByText(/hätte nichts gebracht/)).toBeVisible();

  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});
