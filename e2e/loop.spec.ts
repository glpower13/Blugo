import { test, expect, type ConsoleMessage } from '@playwright/test';

// Stufe B: der Comprehension-Loop real im Browser — rendert, läuft bis
// "Session erledigt." durch, ohne Konsolen-/Seitenfehler.
test('comprehension loop runs to completion without errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');

  // App-Shell
  await expect(page.locator('h1')).toHaveText('neurolang');
  await expect(page.getByText('reift', { exact: true })).toBeVisible();
  await expect(page.getByText(/Verständnis-Abdeckung/)).toBeVisible();

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
// "KI-Dekodierung" UND "Neuer Kontext" (der Moat) im Lern-Loop. Kein echter Aufruf
// (nicht geklickt), also kein Netz.
test('AI decode and generate buttons appear in the loop once a cloud provider is configured', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });

  await page.goto('/');
  await expect(page.getByText(/Verständnis-Abdeckung/)).toBeVisible();

  // Standard (auf dem Gerät): keine KI-Knöpfe
  await expect(page.getByRole('button', { name: /KI-Dekodierung/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Neuer Kontext/ })).toHaveCount(0);

  // Cloud einrichten: Claude wählen, (Test-)Schlüssel eintragen, speichern
  await page.getByRole('button', { name: 'KI-Einstellungen' }).click();
  await page.getByText('Claude (Cloud)').click();
  await page.getByPlaceholder('sk-ant-…').fill('sk-ant-test-000');
  await page.getByRole('button', { name: 'Speichern' }).click();

  // Jetzt sind beide On-Demand-KI-Knöpfe im Loop sichtbar
  await expect(page.getByRole('button', { name: /KI-Dekodierung/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Neuer Kontext/ })).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
});

// Stufe B: die Themen-Übersicht zeigt ehrliche Abdeckung pro Kategorie und der
// Fokus lässt sich setzen (Autonomie für neuen Stoff), ohne Fehler.
test('theme overview shows honest coverage and a focus can be set', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');

  // Themen-Übersicht mit ehrlicher Formulierung ("bewiesen stabil", nicht "erledigt")
  await expect(page.getByRole('heading', { name: 'Themen' })).toBeVisible();
  await expect(page.getByText('Begrüßen & Kennenlernen')).toBeVisible();
  await expect(page.getByText(/bewiesen stabil/).first()).toBeVisible();

  // Fokus setzen → Erklärzeile erscheint, „Fokus aufheben" wird sichtbar
  await page.getByRole('button', { name: 'Fokus', exact: true }).first().click();
  await expect(page.getByText(/Neuer Stoff kommt bevorzugt/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fokus aufheben' })).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});

// Stufe B: die On-device-Aussprache-Hilfe öffnet und zeigt Hinweise, ohne Fehler.
test('pronunciation help toggles open in the loop', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto('/');
  await expect(page.getByText(/Verständnis-Abdeckung/)).toBeVisible();

  await page.getByRole('button', { name: /Aussprache/ }).click();
  await expect(page.getByRole('button', { name: 'Aussprache ausblenden' })).toBeVisible();

  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});
