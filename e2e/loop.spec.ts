import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

// Von der Übersicht in eine Lern-Session wechseln (neue Navigation).
async function startSession(page: Page) {
  await page.getByRole('button', { name: /Weiterlernen/ }).click();
  await expect(page.getByText(/Begegnung ·/)).toBeVisible();
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

  // App-Shell (Übersicht)
  await expect(page.locator('h1')).toHaveText('neurolang');
  await expect(page.getByText('reift', { exact: true })).toBeVisible();
  await expect(page.getByText(/Verständnis-Abdeckung/)).toBeVisible();

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
  await expect(page.getByRole('heading', { name: 'KI-Einstellungen' })).toBeVisible();

  // Claude wählen → Schlüssel-Eingabe (Login) erscheint
  await page.getByText('Claude (Cloud)').click();
  await expect(page.getByPlaceholder('sk-ant-…')).toBeVisible();

  // schließen → Overlay verschwindet
  await page.getByRole('button', { name: 'Abbrechen' }).click();
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
  await expect(page.getByText(/Verständnis-Abdeckung/)).toBeVisible();

  // Cloud einrichten: Claude wählen, (Test-)Schlüssel eintragen, speichern
  await page.getByRole('button', { name: 'KI-Einstellungen' }).click();
  await page.getByText('Claude (Cloud)').click();
  await page.getByPlaceholder('sk-ant-…').fill('sk-ant-test-000');
  await page.getByRole('button', { name: 'Speichern' }).click();

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
  await expect(page.getByRole('heading', { name: 'Bereiche' })).toBeVisible();

  // Ebene 1 → 2: in einen Bereich hineinklicken
  await page.getByRole('button', { name: /Erste Schritte/ }).click();
  await expect(page.getByRole('heading', { name: 'Erste Schritte' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Themen' })).toBeVisible();

  // Ebene 2 → 3: in ein Thema hineinklicken → Detail mit den Wendungen
  await page.getByRole('button', { name: /Begrüßen & Kennenlernen/ }).click();
  await expect(page.getByRole('heading', { name: 'Begrüßen & Kennenlernen' })).toBeVisible();
  await expect(page.getByText(/bewiesen stabil/).first()).toBeVisible();

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

  // Übersicht → Bereich → Thema → Gespräch
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

  // Vorname eintragen
  await page.getByRole('button', { name: /Dein Name/ }).click();
  await page.getByLabel('Dein Vorname').fill('Andreas');
  await page.getByRole('button', { name: 'Speichern' }).click();

  // Begrüßung auf der Übersicht
  await expect(page.getByText(/Hej, Andreas!/)).toBeVisible();

  // Im Gespräch wird man mit Namen angesprochen (erste Zeile ist Hör-zuerst)
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
