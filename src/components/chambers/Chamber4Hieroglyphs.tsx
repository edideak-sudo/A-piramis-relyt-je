import { useState } from 'react';
import { Check, AlertCircle, RotateCcw, Delete } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface Chamber4Props {
  onSolved: () => void;
  onMistake: () => void;
}

interface HieroglyphKey {
  id: string;
  letter: string;
  name: string;
}

const KEY_ITEMS: HieroglyphKey[] = [
  { id: 'owl', letter: 'M', name: 'Bagoly' },
  { id: 'chick', letter: 'U', name: 'Fürjfióka' },
  { id: 'sun', letter: 'R', name: 'Napkorong' },
  { id: 'water', letter: 'N', name: 'Víz hulláma' },
  { id: 'cloth', letter: 'S', name: 'Összehajtott kendő' },
  { id: 'hill', letter: 'K', name: 'Kődomb' },
  { id: 'lion', letter: 'L', name: 'Fekvő oroszlán' },
  { id: 'reed', letter: 'I', name: 'Nádlevél' },
];

const CARTOUCHE_SEQUENCE = ['water', 'reed', 'lion', 'chick', 'cloth']; // N I L U S

interface SacredSymbol {
  id: string;
  label: string;
}

const SACRED_SYMBOLS: SacredSymbol[] = [
  { id: 'scarab', label: 'Skarabeusz' },
  { id: 'ankh', label: 'Ankh (füles kereszt)' },
  { id: 'cartouche', label: 'Kartus' },
  { id: 'udjat', label: 'Udzsat (Hórusz szeme)' },
];

const SYMBOL_SLOTS = [
  { id: 'sym1', expected: 'udjat', meaning: 'Védelem és gyógyulás jelképe' },
  { id: 'sym2', expected: 'cartouche', meaning: 'A fáraó nevét védő ovális keret' },
  { id: 'sym3', expected: 'ankh', meaning: 'Az élet kulcsa' },
  { id: 'sym4', expected: 'scarab', meaning: 'Újjászületés és a felkelő nap' },
];

function HieroglyphSvg({ id }: { id: string }) {
  switch (id) {
    case 'water':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M4 18 L11 11 L18 25 L25 11 L32 25 L39 11 L44 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'reed':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M22 32 V10 C22 5 29 5 29 14 C29 20 25 22 22 22" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.18" />
        </svg>
      );
    case 'lion':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M10 27 H39 M14 27 C14 19 22 17 28 19 C31 15 37 15 38 19 C38 22 35 24 33 24 L39 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chick':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <circle cx="29" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M33 12 L37 13 M26 15 C20 15 16 20 18 25 H30 C32 21 31 17 29 15 M23 25 V31 M27 25 V31" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      );
    case 'cloth':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M20 30 V10 C20 6 28 6 28 10 V22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'owl':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M18 10 C18 6 30 6 30 10 L32 25 H18 Z" stroke="currentColor" strokeWidth="2" />
          <circle cx="22" cy="13" r="1.5" fill="currentColor" />
          <circle cx="27" cy="13" r="1.5" fill="currentColor" />
          <path d="M22 25 V31 M27 25 V31" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <circle cx="24" cy="18" r="9" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.16" />
          <circle cx="24" cy="18" r="2.5" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M10 27 L24 10 L38 27 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
        </svg>
      );
  }
}

function SacredSymbolSvg({ id }: { id: string }) {
  switch (id) {
    case 'ankh':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <ellipse cx="20" cy="12" rx="6" ry="7.5" stroke="currentColor" strokeWidth="2.4" />
          <line x1="20" y1="19.5" x2="20" y2="36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="10" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'udjat':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M7 18 Q20 9 33 18 Q20 26 7 18 Z" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="20" cy="18" r="3.5" fill="currentColor" />
          <path d="M17 24 L14 33 M23 24 C27 28 29 33 25 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'scarab':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <ellipse cx="20" cy="21" rx="8" ry="10" stroke="currentColor" strokeWidth="2.1" fill="currentColor" fillOpacity="0.16" />
          <line x1="20" y1="16" x2="20" y2="31" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 18 L6 14 M12 22 L6 23 M12 26 L7 30 M28 18 L34 14 M28 22 L34 23 M28 26 L33 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#D4A24C]" fill="none" aria-hidden="true">
          <rect x="11" y="6" width="18" height="27" rx="9" stroke="currentColor" strokeWidth="2.2" />
          <line x1="8" y1="35" x2="32" y2="35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function Chamber4Hieroglyphs({ onSolved, onMistake }: Chamber4Props) {
  const [codeLetters, setCodeLetters] = useState<(string | null)[]>([null, null, null, null, null]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [symbolMatches, setSymbolMatches] = useState<Record<string, string | null>>({
    sym1: null,
    sym2: null,
    sym3: null,
    sym4: null,
  });
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const placedSymbols = new Set(Object.values(symbolMatches).filter(Boolean) as string[]);

  const handleLetterPress = (letter: string) => {
    soundEngine.playTap();
    setFeedback(null);
    setCodeLetters((prev) => {
      const next = [...prev];
      const emptyIdx = next.findIndex((c) => c === null);
      if (emptyIdx !== -1) {
        next[emptyIdx] = letter;
      }
      return next;
    });
  };

  const clearCodeSlot = (idx: number) => {
    soundEngine.playTap();
    setFeedback(null);
    setCodeLetters((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  };

  const clearLastLetter = () => {
    soundEngine.playTap();
    setFeedback(null);
    setCodeLetters((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i] !== null) {
          next[i] = null;
          break;
        }
      }
      return next;
    });
  };

  const handleSymbolClick = (id: string) => {
    soundEngine.playTap();
    setFeedback(null);
    if (placedSymbols.has(id)) {
      setSymbolMatches((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === id) next[k] = null;
        }
        return next;
      });
      setSelectedSymbol(id);
      return;
    }
    setSelectedSymbol((prev) => (prev === id ? null : id));
  };

  const handleSlotClick = (slotId: string) => {
    soundEngine.playTap();
    setFeedback(null);
    if (selectedSymbol) {
      setSymbolMatches((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === selectedSymbol) next[k] = null;
        }
        next[slotId] = selectedSymbol;
        return next;
      });
      setSelectedSymbol(null);
    } else if (symbolMatches[slotId]) {
      setSymbolMatches((prev) => ({ ...prev, [slotId]: null }));
    }
  };

  const handleVerify = () => {
    if (codeLetters.some((c) => c === null)) {
      soundEngine.playError();
      setFeedback({
        type: 'error',
        text: 'Fejtsd meg a kartus mind az 5 hieroglifáját!',
      });
      return;
    }

    if (SYMBOL_SLOTS.some((s) => !symbolMatches[s.id])) {
      soundEngine.playError();
      setFeedback({
        type: 'error',
        text: 'Párosítsd mind a 4 szent szimbólumot a jelentésével!',
      });
      return;
    }

    const decodedWord = codeLetters.join('');
    const isWordCorrect = decodedWord === 'NILUS';
    const wrongSymbols = SYMBOL_SLOTS.filter((s) => symbolMatches[s.id] !== s.expected);

    if (isWordCorrect && wrongSymbols.length === 0) {
      soundEngine.playUnlock();
      setFeedback({
        type: 'success',
        text: 'NILUS! A királyi kartus és a szent szimbólumok feltárták a Sírkamra ajtaját!',
      });
      setTimeout(onSolved, 700);
    } else {
      soundEngine.playError();
      onMistake();
      const parts: string[] = [];
      if (!isWordCorrect) parts.push('a kartus 5 betűs szava');
      if (wrongSymbols.length > 0) parts.push(`${wrongSymbols.length} szimbólum párosítása`);
      setFeedback({
        type: 'error',
        text: `Ellenőrizd még: ${parts.join(' és ')}.`,
      });
    }
  };

  const handleReset = () => {
    soundEngine.playTap();
    setCodeLetters([null, null, null, null, null]);
    setSelectedSymbol(null);
    setSymbolMatches({ sym1: null, sym2: null, sym3: null, sym4: null });
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Part A: Cartouche Cipher */}
      <section aria-labelledby="ch4-parta" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ch4-parta" className="font-display text-lg font-bold text-[#F5EFE2]">
            1. feladat · A királyi kartus megfejtése
          </h3>
          <span className="text-xs text-[#C7B99E]">
            Olvasd le az 5 jelet a kulcstábla segítségével, majd üsd be a betűket!
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Carved Cartouche */}
          <div className="lg:col-span-6 p-4 rounded-lg bg-[#1A140F] border border-[#4D3E2E] flex flex-col items-center justify-between gap-4">
            <div className="text-xs font-semibold text-[#D4A24C]">Titkos kőkartus</div>

            <div className="w-full max-w-md px-4 py-4 rounded-full border-2 border-[#D4A24C] bg-[#251D15] flex items-center justify-around gap-2">
              {CARTOUCHE_SEQUENCE.map((glyphId, i) => (
                <div key={`${glyphId}-${i}`} className="flex flex-col items-center gap-1.5">
                  <HieroglyphSvg id={glyphId} />
                  <button
                    type="button"
                    onClick={() => clearCodeSlot(i)}
                    className="w-10 h-10 rounded-md border border-[#6E5634] bg-[#14100C] font-mono text-lg font-bold text-[#F5EFE2] hover:border-[#D4A24C] focus-visible:outline-2 focus-visible:outline-[#D4A24C] tabular-nums"
                    aria-label={`${i + 1}. betű helye: ${codeLetters[i] || 'üres'}`}
                  >
                    {codeLetters[i] || '—'}
                  </button>
                </div>
              ))}
            </div>

            {/* Letter Input Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['K', 'S', 'I', 'R', 'N', 'M', 'U', 'L'].map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleLetterPress(letter)}
                  className="w-11 h-11 rounded-lg bg-[#2B2218] border border-[#5A4835] font-mono text-base font-bold text-[#F5EFE2] hover:bg-[#3A2E20] hover:border-[#D4A24C] focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
                >
                  {letter}
                </button>
              ))}
              <button
                type="button"
                onClick={clearLastLetter}
                className="px-3 h-11 rounded-lg bg-[#1C1611] border border-[#4A3D2E] text-xs font-semibold text-[#D6C8AE] hover:bg-[#261F17] inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
                aria-label="Utolsó betű törlése"
              >
                <Delete className="w-4 h-4" aria-hidden="true" />
                Törlés
              </button>
            </div>
          </div>

          {/* Rosetta Key */}
          <div className="lg:col-span-6 p-4 rounded-lg bg-[#F4ECD8] text-[#231A12] border border-[#B88B3A]">
            <div className="text-xs font-bold text-[#6E4912] mb-3">
              Írnokok hangjel-kulcsa
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {KEY_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded bg-[#FBF7EC] border border-[#D8C9A6] flex flex-col items-center text-center gap-1"
                >
                  <div className="bg-[#231A12] rounded p-1 w-full flex justify-center">
                    <HieroglyphSvg id={item.id} />
                  </div>
                  <div className="font-mono text-base font-bold text-[#231A12]">{item.letter}</div>
                  <div className="text-[11px] text-[#5B4834] leading-tight">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-[#3B3024]" />

      {/* Part B: Sacred Symbols Matching */}
      <section aria-labelledby="ch4-partb" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ch4-partb" className="font-display text-lg font-bold text-[#F5EFE2]">
            2. feladat · Szent szimbólumok jelentése
          </h3>
          <span className="text-xs text-[#C7B99E]">
            Válassz ki egy szimbólumot, majd kattints a jelentésére!
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SACRED_SYMBOLS.map((sym) => {
            const isSelected = selectedSymbol === sym.id;
            const isPlaced = placedSymbols.has(sym.id);
            return (
              <button
                key={sym.id}
                type="button"
                onClick={() => handleSymbolClick(sym.id)}
                className={`min-h-[82px] p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-center transition-all focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  isSelected
                    ? 'bg-[#3A2D1D] border-[#D4A24C] ring-2 ring-[#D4A24C]/40'
                    : isPlaced
                      ? 'bg-[#1D1813] border-[#4A3D2E] opacity-55 hover:opacity-90'
                      : 'bg-[#261F17] border-[#4F4030] hover:border-[#D4A24C]/70'
                }`}
              >
                <SacredSymbolSvg id={sym.id} />
                <span className="text-xs font-semibold text-[#F5EFE2] leading-tight">{sym.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SYMBOL_SLOTS.map((slot) => {
            const placed = SACRED_SYMBOLS.find((s) => s.id === symbolMatches[slot.id]);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleSlotClick(slot.id)}
                className={`min-h-[64px] p-3.5 rounded-lg border flex items-center justify-between gap-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  placed
                    ? 'bg-[#2B2218] border-[#D4A24C]/70'
                    : selectedSymbol
                      ? 'bg-[#211B15] border-dashed border-[#D4A24C]/70 hover:bg-[#2A2219]'
                      : 'bg-[#1C1611] border-[#3B3024] hover:border-[#6D5A45]'
                }`}
              >
                <span className="text-sm text-[#E5DAC5]">{slot.meaning}</span>
                <span className="shrink-0 px-3 py-1.5 rounded bg-[#14100C] border border-[#4A3D2E] text-xs font-semibold text-[#E8C073]">
                  {placed ? placed.label : 'Üres hely'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-lg border flex items-center gap-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-[#173024] border-[#38A169] text-[#B7F4D1]'
              : 'bg-[#361B1A] border-[#E06C65] text-[#FBC5C2]'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[#4D3E2E] text-sm font-medium text-[#D6C8AE] hover:bg-[#261F17] inline-flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Alaphelyzet
        </button>

        <button
          type="button"
          onClick={handleVerify}
          className="px-6 py-2.5 min-h-[44px] rounded-lg bg-[#D4A24C] text-[#1A130B] text-sm font-bold hover:bg-[#E2B45E] inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5EFE2]"
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          Kartus ellenőrzése
        </button>
      </div>
    </div>
  );
}
