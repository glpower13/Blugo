import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

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
  await page.getByRole('button', { name: 'KI-Einstellungen' }).click();
  await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();
  await page.getByText('Claude (Cloud)').click();
  await page.getByPlaceholder('sk-ant-…').fill('sk-ant-test-000');
  await page.getByRole('button', { name: 'Speichern' }).click();
  await page.getByRole('button', { name: 'Einstellungen schließen' }).click();
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
    if (await page.getByText('Session erledigt.').isVisible()) {
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
  await expect(page.getByText('Session erledigt.')).toBeVisible();
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

  await page.getByRole('button', { name: 'KI-Einstellungen' }).click();
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
  await page.getByRole('button', { name: 'Einstellungen schließen' }).click();
  await expect(page.getByText('Dein Claude-Zugangs-Schlüssel')).toHaveCount(0);

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
  await page.getByRole('button', { name: 'Als Fokus für neuen Stoff' }).click();
  await expect(page.getByRole('button', { name: /Im Fokus für neuen Stoff/ })).toBeVisible();

  // Eine Ebene zurück zum Bereich → dort erscheint die Fokus-Zeile
  await page.getByRole('button', { name: 'Zurück zum Bereich' }).click();
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
  await expect(page.getByText(/Verständnis-Abdeckung/)).toBeVisible();
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

  const sheet = page.getByRole('dialog', { name: 'Sprachpaar und Richtung' });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByText('sprichst du selbst', { exact: true })).toBeVisible();
  await expect(sheet.getByText('verstehst du', { exact: true })).toBeVisible();
  // Frischer Stand: alles ist „noch nicht begegnet" — nichts wird als verstanden ausgegeben.
  await expect(sheet.getByText('noch nicht begegnet')).toBeVisible();
  await expect(sheet.getByText(/Warum du die Richtung nicht umstellen kannst/)).toBeVisible();

  await sheet.getByRole('button', { name: 'Zurück' }).click();
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
  const mic = page.getByRole('button', { name: 'Sag es auf Schwedisch' });
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
// dass im Fortschritt eine ehrliche 0 für „muttersprachlich geprüft" steht.
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
  await expect(page.getByText('0 muttersprachlich geprüft')).toBeVisible();

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
  await page.getByRole('button', { name: 'KI-Einstellungen' }).click();

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
