// Aussprache-Anleitung (docs/gremium-aussprache.md, Feedback-Schritt 3a).
// DETERMINISTISCH aus den Laut-Schreib-Regeln des Schwedischen abgeleitet —
// on-device, ohne KI/ASR, ohne Irrtums-/Fehl-Hör-Risiko. Beschreibt die für
// Deutsch-Muttersprachler kniffligen Muster (sje-/tje-Laut, weiches g,
// Retroflexe, o≈u, rundes u, å, y) und häufige stumme/reduzierte Wörter.
//
// Ehrlich: Es sind gut belegte Regelmäßigkeiten, keine Garantie — Aussprache
// variiert regional (Quellen im Gremium-Dokument). Kein IPA-Volltranskript
// (das wäre fehleranfällig), nur belastbare Einzel-Hinweise.

export interface PronTip {
  id: string;
  label: string; // kurzer Titel
  hint: string; // deutschfreundliche Erklärung
}

// Weiche (vordere) Vokale lösen die "weiche" Aussprache von g/k/sk aus.
const SOFT = 'eiyäöé';

// Konsonanten-/Vokal-Muster, in Prioritätsreihenfolge (kniffligste zuerst).
const DETECTORS: { id: string; label: string; re: RegExp; hint: string }[] = [
  {
    id: 'sje',
    label: 'sje-Laut /ɧ/',
    re: new RegExp(`skj|stj|sj|sch|sk[${SOFT}]|tion`),
    hint: 'Der schwedische „sje"-Laut: ein tiefes, gehauchtes „sch" ohne genaue deutsche Entsprechung. Auch „sk" vor e/i/y/ä/ö und die Endung „-tion". (Regional verschieden.)',
  },
  {
    id: 'tje',
    label: 'tje-Laut /ɕ/',
    re: new RegExp(`tj|kj|k[${SOFT}]`),
    hint: 'Der weiche „tje"-Laut: wie „ch" in „ich", eher Richtung „sch". Auch „k" vor e/i/y/ä/ö — z. B. „köpa" ≈ „tschöpa".',
  },
  {
    id: 'g-soft',
    label: 'weiches g',
    re: new RegExp(`gj|g[${SOFT}]`),
    hint: '„g" vor e/i/y/ä/ö klingt wie „j": „ge" ≈ „je", „göra" ≈ „jöra".',
  },
  {
    id: 'rs',
    label: 'rs = sch',
    re: /rs/,
    hint: '„rs" verschmilzt zu einem „sch"-Laut [ʂ] — „kurs" ≈ „kursch".',
  },
  {
    id: 'retroflex',
    label: 'retroflexe Laute',
    re: /r[dtnl]/,
    hint: '„rd, rt, rn, rl": r + Folgekonsonant werden mit zurückgebogener Zunge zu EINEM Laut verschmolzen (im Süden ohne diese Verschmelzung).',
  },
  {
    id: 'o-u',
    label: 'o klingt oft wie u',
    re: /o/,
    hint: 'Achtung: schwedisches „o" klingt oft (nicht immer) wie deutsches „u" — „bok" ≈ „buuk", „sol" ≈ „suul".',
  },
  {
    id: 'u',
    label: 'rundes u',
    re: /u/,
    hint: '„u" ist sehr rund und weit vorne im Mund — kein deutsches „u". Lippen wie zum Pfeifen.',
  },
  {
    id: 'aa',
    label: 'å klingt wie o',
    re: /å/,
    hint: '„å" klingt wie ein langes deutsches „o" — „på" ≈ „poo".',
  },
  {
    id: 'y',
    label: 'y klingt wie ü',
    re: /y/,
    hint: '„y" klingt wie deutsches „ü".',
  },
];

// Häufige Wörter mit stummen/reduzierten Lauten (wort-genau, sehr nützlich).
const REDUCTIONS: Record<string, string> = {
  jag: '„jag" → das „g" fällt meist weg: „jaa".',
  och: '„och" → oft nur „ok" oder „o".',
  det: '„det" → gesprochen „de" (t stumm).',
  de: '„de" → gesprochen „dom".',
  mig: '„mig" → „mej".',
  dig: '„dig" → „dej".',
  sig: '„sig" → „sej".',
  vad: '„vad" → „vaa" (d stumm).',
  med: '„med" → „me(d)".',
};

/**
 * Aussprache-Hinweise für einen schwedischen Text (rein, deterministisch).
 * Wort-genaue Reduktionen zuerst, dann die kniffligen Laut-Muster; dedupliziert
 * und auf `max` begrenzt, damit es nicht überfrachtet.
 */
export function pronunciationTips(sv: string, max = 5): PronTip[] {
  const text = sv.toLowerCase();
  const tips: PronTip[] = [];

  // 1) Wort-genaue Reduktionen.
  const words = text.split(/[^a-zåäöé]+/).filter(Boolean);
  const seenWords = new Set<string>();
  for (const w of words) {
    if (REDUCTIONS[w] && !seenWords.has(w)) {
      seenWords.add(w);
      tips.push({ id: 'red:' + w, label: `Wort „${w}"`, hint: REDUCTIONS[w] });
    }
  }

  // 2) Laut-Muster in Prioritätsreihenfolge.
  for (const d of DETECTORS) {
    if (d.re.test(text)) tips.push({ id: d.id, label: d.label, hint: d.hint });
  }

  return tips.slice(0, max);
}
