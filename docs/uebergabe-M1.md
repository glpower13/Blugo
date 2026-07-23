# Übergabe M1 — die zwei letzten Schritte (für dich)

Der M1-Code ist fertig und geprüft (44 Unit-Tests + E2E + CI, ISTQB- und
Gremium-Review grün). Es fehlen nur noch **zwei externe Schritte**, die nicht
autonom machbar sind.

---

## Schritt 1 — Live schalten (GitHub Pages, ~5 Min)

1. **Nach `main` mergen.** Branch `claude/neurolang-concept-docs-czsfnk` per
   Pull Request nach `main` mergen (18 Commits, konfliktfrei — `main` hatte nur
   den Stub).
2. **Pages aktivieren:** GitHub → Repo `glpower13/Blugo` → **Settings → Pages**
   → bei „Build and deployment" **Source = „GitHub Actions"**.
3. Der Merge auf `main` löst den Workflow **„Deploy PWA to GitHub Pages"**
   automatisch aus (er läuft vorher Lint + Tests). Alternativ manuell:
   **Actions**-Tab → Workflow → **Run workflow**.
4. Danach live unter **`https://glpower13.github.io/Blugo/`** (HTTPS).
   Auf dem Handy öffnen → **„Zum Startbildschirm hinzufügen"** (Android/Chrome
   zeigt zusätzlich den In-App-Button; iOS: Teilen → Zum Home-Bildschirm).

**Falls der Deploy an Rechten scheitert:** Settings → Actions → General →
„Workflow permissions" prüfen. Der Workflow setzt seine Rechte selbst eng
(`contents: read`, `pages: write`, `id-token: write`).

---

## Schritt 2 — Muttersprache-Prüfung der Segmente

Die 21 Segmente / 11 Chunks sind ein **Platzhalter-Entwurf** und brauchen ein
schwedisches Muttersprachurteil, bevor sie „geprüft" heißen.

1. `docs/content-review-schwedisch.md` öffnen (fertige Prüftabellen).
2. Eine schwedischsprachige Person hakt je Zeile **OK** ab oder notiert die
   **Korrektur** (Kriterien und Zweifelsfälle stehen im Dokument, z. B.
   `tack → bitte/danke`, `mår → befinde`, `hej då → tschüss`).
3. Korrekturen in `src/modules/content/seedSegments.ts` einpflegen; danach den
   Platzhalter-Hinweis im Dateikopf entfernen und in `docs/09-roadmap.md` den
   M1-Punkt „~20 handgeprüfte Segmente" abhaken.

---

## Danach

Ist beides erledigt, steht der **eigentliche M1-Beweis**: den Loop über
mehrere Wochen an *einem echten Lerner* zeigen (Erfolgskriterium in
`docs/09-roadmap.md`). Alles Weitere (schwedisches TTS, ASR, KI-Content-Pipeline)
ist **post-M1** und wird per Live-Recherche mit Anbieter-Entscheidung gestartet.

*Offene, bewusst vertagte Punkte: `docs/10-open-questions.md`.
Priorisierter Maßnahmenkatalog: `docs/gremium-review-M1.md`.*
