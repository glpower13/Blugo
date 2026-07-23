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

// Stufe B: Drill-down — eine Themen-Kachel öffnet das Detail (Wendungen, ehrliche
// Abdeckung); dort lässt sich der Fokus setzen und man kommt zurück zur Übersicht.
test('theme drill-down shows its phrases and a focus can be set', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Themen' })).toBeVisible();

  // In ein Thema hineinklicken → Detail mit den Wendungen
  await page.getByRole('button', { name: /Begrüßen & Kennenlernen/ }).click();
  await expect(page.getByRole('heading', { name: 'Begrüßen & Kennenlernen' })).toBeVisible();
  await expect(page.getByText(/bewiesen stabil/).first()).toBeVisible();

  // Fokus für neuen Stoff setzen
  await page.getByRole('button', { name: 'Als Fokus für neuen Stoff' }).click();
  await expect(page.getByRole('button', { name: /Im Fokus für neuen Stoff/ })).toBeVisible();

  // Zurück zur Übersicht → dort erscheint die Fokus-Zeile
  await page.getByRole('button', { name: 'Zurück zur Übersicht' }).click();
  await expect(page.getByText(/Fokus: Begrüßen & Kennenlernen/)).toBeVisible();

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
