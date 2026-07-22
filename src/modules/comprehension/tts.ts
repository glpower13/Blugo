// Minimal TTS via the Web Speech API. Swedish voice availability varies by
// device — this is a placeholder until the real schwedisches TTS of the
// Content-Pipeline lands (docs/08-content-pipeline.md, docs/10-open-questions.md).

export function speakSwedish(text: string, rate = 0.9): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sv-SE';
  u.rate = rate;
  const sv = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('sv'));
  if (sv) u.voice = sv;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
