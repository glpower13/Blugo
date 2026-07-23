// Bildsprache (docs/gremium-design-weltklasse.md): eine schemenhafte, edle
// Nordlicht-Szene hinter dem Glas — Polarlicht-Bänder über einer feinen
// Bergsilhouette. Rein als SVG (offline-sicher, gestochen scharf, kByte statt
// MByte), sehr zurückhaltend. Reine Atmosphäre, nie Inhalt (die eine Design-Regel).

import { useEffect, useRef } from 'react';

export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  // Sanfte Parallaxe: die Szene wandert beim Scrollen langsamer als der Inhalt
  // (Tiefe). rAF-gedrosselt; bei reduced-motion aus.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${window.scrollY * 0.06}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="backdrop-art" aria-hidden="true" ref={ref}>
      <svg
        className="backdrop-svg"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ribbon-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7fe8c8" stopOpacity="0" />
            <stop offset="45%" stopColor="#5fd7ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9a7bff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ribbon-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8f7bff" stopOpacity="0" />
            <stop offset="50%" stopColor="#6ad0b4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e6a04e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mountains" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2440" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a0d18" stopOpacity="0.9" />
          </linearGradient>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* Polarlicht-Bänder über die ganze Höhe — weich, tief unscharf, driftend.
            So brechen die Milchglas-Karten die Bildsprache (iPhone-Wallpaper-Effekt). */}
        <g filter="url(#soft)" className="ribbons">
          <path
            d="M-40 120 C 90 40, 190 210, 300 110 S 470 70, 470 140 L 470 250 C 360 170, 200 300, 60 220 S -40 220, -40 220 Z"
            fill="url(#ribbon-a)"
          />
          <path
            d="M-40 300 C 120 240, 210 400, 320 310 S 470 270, 470 330 L 470 440 C 340 370, 190 490, 70 400 S -40 400, -40 400 Z"
            fill="url(#ribbon-b)"
          />
          <path
            d="M-40 500 C 110 440, 220 600, 330 510 S 470 470, 470 540 L 470 650 C 330 580, 180 690, 60 600 S -40 600, -40 600 Z"
            fill="url(#ribbon-a)"
          />
        </g>

        {/* Feine Bergsilhouette am Horizont — kaum sichtbar, gibt Tiefe */}
        <path
          d="M0 700 L60 655 L120 690 L190 625 L250 685 L320 640 L400 690 L400 800 L0 800 Z"
          fill="url(#mountains)"
          opacity="0.5"
        />
        <path
          d="M0 745 L80 715 L160 750 L240 710 L320 755 L400 725 L400 800 L0 800 Z"
          fill="#070a14"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}
