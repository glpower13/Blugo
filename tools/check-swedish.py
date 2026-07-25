#!/usr/bin/env python3
"""
Maschinelle Vorprüfung des schwedischen Seed-Inhalts (docs/gremium-content-pruefung.md).

WAS DIESES WERKZEUG BEWEIST
    Jedes schwedische Wort im Inhalt ist ein **echtes, real verwendetes**
    schwedisches Wort — belegt über korpusbasierte Häufigkeiten (`wordfreq`,
    Zipf-Skala 0..8) und gegengeprüft an einem Wörterbuch mit 152.719
    Einträgen (Hunspell `dictionary-sv`). Tippfehler, erfundene Wörter und
    fehlende å/ä/ö fallen dabei zuverlässig auf.

WAS ES AUSDRÜCKLICH NICHT BEWEIST
    * Wortstellung und Satzbau
    * Idiomatik („sagt man das so?")
    * Register/Situationspassung (Kellner-Floskeln, Du/Sie)
    * die Birkenbihl-Dekodierungen (Wort-für-Wort-Glossen)
    Dafür bleibt eine menschliche Prüfung nötig — dieses Werkzeug macht sie
    nur klein genug, um machbar zu sein (Stufe 3 der Prüfkette).

    Ein grüner Bericht heißt also: „alle Wörter sind echtes Schwedisch",
    NICHT „der Satz ist geprüft". Diese Unterscheidung ist der ganze Punkt
    (die eine Design-Regel: kein Indikator darf mehr behaupten, als er misst).

BENUTZUNG
    pip install wordfreq
    npm install dictionary-sv          # liefert index.dic
    python3 tools/check-swedish.py     # schreibt docs/content-pruefbericht.md
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

try:
    from wordfreq import zipf_frequency
except ImportError:  # pragma: no cover - Hinweis statt Absturz
    sys.exit("Fehlt: pip install wordfreq")

ROOT = Path(__file__).resolve().parent.parent
SEED_FILES = [
    ROOT / "src/modules/content/seedSegments.ts",
    ROOT / "src/modules/content/seedDialogs.ts",
]
REPORT = ROOT / "docs/content-pruefbericht.md"
# Maschinenlesbares Ergebnis für Stufe 4 der Prüfkette (der Prüf-Stand je
# Wendung in der App). Der Bericht ist für Menschen, diese Datei für
# `tools/build-verification.ts` — beide entstehen aus demselben Lauf, damit sie
# sich nie widersprechen können.
VERDICTS = ROOT / "tools/flagged-words.json"

# Schwellen auf der Zipf-Skala (log10 Vorkommen pro Milliarde Wörter).
ZIPF_COMMON = 3.0  # ab hier alltagshäufig
ZIPF_RARE = 1.5  # darunter: kaum belegt → verdächtig

# Wörter, die in einer Lern-App vorkommen dürfen, aber selten sind bzw. als
# Eigenname/Interjektion gelten. Bewusst kurz und begründet gehalten.
ALLOWLIST = {
    # Eigennamen / Orte
    "anna", "erik", "stockholm", "malmö", "göteborg", "tyskland", "svenska",
    # Interjektionen und Floskeln, die Korpora selten sauber erfassen
    "hej", "javisst", "varsågod", "ursäkta", "förlåt", "oj", "åh", "okej",
}


def find_dictionary() -> set[str]:
    """Lädt die Grundformen aus dictionary-sv (falls installiert)."""
    for candidate in [
        ROOT / "node_modules/dictionary-sv/index.dic",
        Path("/tmp/dictcheck/node_modules/dictionary-sv/index.dic"),
    ]:
        if candidate.exists():
            words: set[str] = set()
            with candidate.open(encoding="utf-8", errors="ignore") as fh:
                next(fh, None)  # erste Zeile ist die Anzahl
                for line in fh:
                    words.add(line.split("/", 1)[0].strip().lower())
            return words
    return set()


# `sv: '…'` bzw. `sv: "…"` — erfasst Chunks, Segmente, Dialogzeilen und Glossen.
SV_RE = re.compile(r"""\bsv:\s*(['"])(.*?)\1""", re.S)
SUGGEST_RE = re.compile(r"""suggestions:\s*\[(.*?)\]""", re.S)
STRING_RE = re.compile(r"""(['"])(.*?)\1""", re.S)
TOKEN_RE = re.compile(r"[A-Za-zÅÄÖåäöÉéÜüß]+")


def collect_sentences() -> list[tuple[str, str]]:
    """Alle schwedischen Zeichenketten samt Herkunftsdatei."""
    out: list[tuple[str, str]] = []
    for path in SEED_FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for _, value in SV_RE.findall(text):
            out.append((path.name, value))
        for block in SUGGEST_RE.findall(text):
            for _, value in STRING_RE.findall(block):
                out.append((path.name, value))
    return out


def check_word(word: str, dictionary: set[str]) -> tuple[str, float, bool]:
    """Ampel, Häufigkeit und Wörterbuch-Treffer für ein Wort."""
    low = word.lower()
    zipf = zipf_frequency(low, "sv")
    in_dict = low in dictionary
    if low in ALLOWLIST:
        return "ok", zipf, in_dict
    if zipf >= ZIPF_COMMON:
        return "ok", zipf, in_dict
    if zipf >= ZIPF_RARE or in_dict:
        return "selten", zipf, in_dict
    return "unbelegt", zipf, in_dict


def main() -> int:
    dictionary = find_dictionary()
    # Fail-closed (Prüf-Standard §3.2, Befund D-2 der Kaskade 2026-07-25):
    # Fehlt das Wörterbuch, lief die Prüfung bisher trotzdem durch — mit einem
    # leeren Satz. Der Bericht meldete dann „0 Einträge", und die App hätte in
    # ihrem Ehrlichkeits-Abschnitt „gegen ein Wörterbuch mit 0 Einträgen"
    # angezeigt: eine Prüfung behaupten, die nicht stattgefunden hat. Lieber
    # laut abbrechen als leise weniger prüfen.
    if len(dictionary) < 1000:
        sys.exit(
            "Wörterbuch nicht gefunden oder zu klein "
            f"({len(dictionary)} Einträge). `npm ci` ausführen — die Prüfung "
            "braucht node_modules/dictionary-sv/index.dic."
        )
    sentences = collect_sentences()
    if not sentences:
        sys.exit("Keine schwedischen Zeichenketten gefunden — Pfade prüfen.")

    # Wort → (Ampel, Zipf, im Wörterbuch, Beispielsätze)
    words: dict[str, tuple[str, float, bool]] = {}
    examples: dict[str, set[str]] = defaultdict(set)
    flagged_sentences: list[tuple[str, str, list[str]]] = []

    for _file, sentence in sentences:
        clean = sentence.replace("{name}", " ")
        bad_here: list[str] = []
        for raw in TOKEN_RE.findall(clean):
            if len(raw) < 2:
                continue
            # Groß-/Kleinschreibung normalisieren: „Smaklig" am Satzanfang ist
            # dasselbe Wort wie „smaklig" — sonst zählt der Bericht doppelt.
            token = raw.lower()
            if token not in words:
                words[token] = check_word(token, dictionary)
            verdict = words[token][0]
            if verdict != "ok":
                examples[token].add(sentence)
                bad_here.append(token)
        if bad_here:
            flagged_sentences.append((sentence, "", sorted(set(bad_here))))

    total_words = len(words)
    ok = sum(1 for v in words.values() if v[0] == "ok")
    rare = sum(1 for v in words.values() if v[0] == "selten")
    unproven = sum(1 for v in words.values() if v[0] == "unbelegt")

    lines: list[str] = []
    lines.append("# Prüfbericht — schwedischer Inhalt (maschinelle Vorprüfung)")
    lines.append("")
    lines.append(
        "> **Automatisch erzeugt** von `tools/check-swedish.py`. Nicht von Hand ändern — "
        "Skript erneut laufen lassen."
    )
    lines.append("")
    lines.append("## Was dieser Bericht beweist — und was nicht")
    lines.append("")
    # Tausenderpunkt nur auf der ZAHL bilden — nicht auf dem Satz, sonst werden
    # auch die Kommas des Fließtexts zu Punkten.
    entries = f"{len(dictionary):,}".replace(",", ".")
    lines.append(
        "**Geprüft:** Jedes schwedische **Wort** ist ein echtes, real verwendetes "
        "schwedisches Wort. Grundlage: korpusbasierte Häufigkeiten (`wordfreq`, "
        "Zipf-Skala 0–8) plus Abgleich mit einem Wörterbuch "
        f"({entries} Einträge, Hunspell `dictionary-sv`)."
    )
    lines.append("")
    lines.append(
        '**NICHT geprüft:** Wortstellung, Satzbau, Idiomatik („sagt man das so?"), '
        "Register/Situationspassung und die Birkenbihl-Dekodierungen. Dafür bleibt eine "
        "**menschliche Prüfung** nötig (`content-review-schwedisch.md`) — dieser Bericht "
        "macht sie nur klein genug, um machbar zu sein."
    )
    lines.append("")
    lines.append("## Ergebnis")
    lines.append("")
    lines.append(f"- Geprüfte schwedische Zeichenketten: **{len(sentences)}**")
    lines.append(f"- Verschiedene Wörter: **{total_words}**")
    lines.append(f"- ✅ alltagshäufig belegt (Zipf ≥ {ZIPF_COMMON}): **{ok}**")
    lines.append(f"- ⚠️ selten belegt: **{rare}**")
    lines.append(f"- ❌ nicht belegt (Tippfehler-Verdacht): **{unproven}**")
    lines.append("")

    def table(kind: str, title: str, note: str) -> None:
        rows = sorted(
            ((w, v) for w, v in words.items() if v[0] == kind),
            key=lambda item: item[1][1],
        )
        lines.append(f"## {title}")
        lines.append("")
        if not rows:
            lines.append("Keine. ✅")
            lines.append("")
            return
        lines.append(note)
        lines.append("")
        lines.append("| Wort | Zipf | im Wörterbuch | kommt vor in |")
        lines.append("|---|---|---|---|")
        for word, (_verdict, zipf, in_dict) in rows:
            sample = sorted(examples[word])[:2]
            shown = " · ".join(f'„{s}"' for s in sample)
            lines.append(f"| **{word}** | {zipf:.2f} | {'ja' if in_dict else '—'} | {shown} |")
        lines.append("")

    table(
        "unbelegt",
        "❌ Nicht belegt — zuerst anschauen",
        "Diese Wörter tauchen weder im Korpus noch im Wörterbuch auf. Meist "
        "Tippfehler, falsche Beugung oder ein fehlendes å/ä/ö.",
    )
    table(
        "selten",
        "⚠️ Selten belegt — kurz gegenlesen",
        "Existiert, ist aber ungewöhnlich. Für Anfänger-Inhalt oft ein Zeichen, dass "
        "es ein geläufigeres Wort gäbe.",
    )

    lines.append("## Sätze mit auffälligen Wörtern")
    lines.append("")
    if flagged_sentences:
        lines.append("| Schwedisch | auffällige Wörter |")
        lines.append("|---|---|")
        seen: set[str] = set()
        for sentence, _f, bad in sorted(flagged_sentences):
            if sentence in seen:
                continue
            seen.add(sentence)
            lines.append(f"| {sentence} | {', '.join(bad)} |")
    else:
        lines.append("Keine. ✅")
    lines.append("")

    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    # Stufe 4: die auffälligen Wörter maschinenlesbar ablegen. Nur die
    # auffälligen — „ok" ist die Regel und braucht keinen Eintrag.
    flagged = {
        word: {"verdict": verdict, "zipf": round(zipf, 2), "inDict": in_dict}
        for word, (verdict, zipf, in_dict) in sorted(words.items())
        if verdict != "ok"
    }
    VERDICTS.write_text(
        json.dumps(
            {
                "dictionaryEntries": len(dictionary),
                "wordsChecked": len(words),
                "stringsChecked": len(sentences),
                "flagged": flagged,
            },
            ensure_ascii=False,
            indent=2,
            sort_keys=False,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"Bericht geschrieben: {REPORT.relative_to(ROOT)}")
    print(f"Prüfdaten geschrieben: {VERDICTS.relative_to(ROOT)}")
    print(f"  {len(sentences)} Zeichenketten · {total_words} Wörter")
    print(f"  ok {ok} · selten {rare} · unbelegt {unproven}")
    return 1 if unproven else 0


if __name__ == "__main__":
    raise SystemExit(main())
