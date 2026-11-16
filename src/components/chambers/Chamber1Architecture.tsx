import { useState } from 'react';
import { Check, RotateCcw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface Chamber1Props {
  onSolved: () => void;
  onMistake: () => void;
}

interface ArchTile {
  id: string;
  label: string;
}

interface ArchSlot {
  slotId: string;
  expectedTileId: string;
  clue: string;
}

const ARCH_TILES: ArchTile[] = [
  { id: 'sphinx', label: 'Nagy Szfinx' },
  { id: 'step-pyramid', label: 'Lépcsős piramis' },
  { id: 'lotus-pillar', label: 'Növényfejezetes oszlop' },
  { id: 'giza-pyramid', label: 'Gízai gúlapiramis' },
];

const ARCH_SLOTS: ArchSlot[] = [
  {
    slotId: 's1',
    expectedTileId: 'lotus-pillar',
    clue: 'Templomi tartóoszlop, amelynek teteje lótuszt vagy papiruszt mintáz.',
  },
  {
    slotId: 's2',
    expectedTileId: 'giza-pyramid',
    clue: 'Sima oldalú, négyzet alapú gúla alakú királyi síremlék.',
  },
  {
    slotId: 's3',
    expectedTileId: 'step-pyramid',
    clue: 'Imhotep tervezte Dzsószer fáraónak egymásra rakott szintekből.',
  },
  {
    slotId: 's4',
    expectedTileId: 'sphinx',
    clue: 'Oroszlántestű, emberfejű hatalmas kőszobor, amely a bejáratot őrzi.',
  },
];

interface DialConfig {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const DIALS: DialConfig[] = [
  {
    id: 'd1',
    question: 'Melyik fáraó építtette a legmagasabb gízai piramist?',
    options: ['Dzsószer', 'Kheopsz', 'Tutanhamon'],
    correctIndex: 1,
  },
  {
    id: 'd2',
    question: 'Milyen alakú a gízai piramisok alaplapja?',
    options: ['Háromszög', 'Kör', 'Négyzet'],
    correctIndex: 2,
  },
  {
    id: 'd3',
    question: 'Mi védte a sírkamrát a piramis belsejében?',
    options: ['Nyitott márványablakok', 'Rejtett folyosók és álajtók', 'Vasrácsos felvonóhíd'],
    correctIndex: 1,
  },
];

function ArchGlyph({ id }: { id: string }) {
  switch (id) {
    case 'step-pyramid':
      return (
        <svg viewBox="0 0 80 48" className="w-16 h-10 text-[#D4A24C]" fill="none" aria-hidden="true">
          <rect x="8" y="36" width="64" height="8" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.14" />
          <rect x="16" y="27" width="48" height="8" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.14" />
          <rect x="24" y="18" width="32" height="8" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.14" />
          <rect x="32" y="9" width="16" height="8" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'giza-pyramid':
      return (
        <svg viewBox="0 0 80 48" className="w-16 h-10 text-[#D4A24C]" fill="none" aria-hidden="true">
          <polygon points="40,6 70,42 10,42" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.15" />
          <line x1="40" y1="6" x2="50" y2="42" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
        </svg>
      );
    case 'sphinx':
      return (
        <svg viewBox="0 0 80 48" className="w-16 h-10 text-[#D4A24C]" fill="none" aria-hidden="true">
          <path d="M12 40 H64 V32 H46 L40 20 C40 13 32 10 26 14 L22 22 L12 30 Z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15" />
          <circle cx="31" cy="18" r="2" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 48" className="w-16 h-10 text-[#D4A24C]" fill="none" aria-hidden="true">
          <rect x="34" y="18" width="12" height="24" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.12" />
          <path d="M26 10 C30 18 50 18 54 10 L46 18 H34 Z" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.22" />
          <line x1="28" y1="42" x2="52" y2="42" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

export function Chamber1Architecture({ onSolved, onMistake }: Chamber1Props) {
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string | null>>({
    s1: null,
    s2: null,
    s3: null,
    s4: null,
  });
  const [dialValues, setDialValues] = useState<number[]>([0, 0, 0]);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [slotErrors, setSlotErrors] = useState<string[]>([]);
  const [dialErrors, setDialErrors] = useState<number[]>([]);

  const placedTileIds = new Set(Object.values(placements).filter(Boolean) as string[]);

  const handleTileClick = (tileId: string) => {
    soundEngine.playTap();
    setFeedback(null);
    setSlotErrors([]);
    if (placedTileIds.has(tileId)) {
      // Remove from its current slot
      setPlacements((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === tileId) next[k] = null;
        }
        return next;
      });
      setSelectedTileId(tileId);
      return;
    }
    setSelectedTileId((prev) => (prev === tileId ? null : tileId));
  };

  const handleSlotClick = (slotId: string) => {
    soundEngine.playTap();
    setFeedback(null);
    setSlotErrors([]);

    if (selectedTileId) {
      setPlacements((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === selectedTileId) next[k] = null;
        }
        next[slotId] = selectedTileId;
        return next;
      });
      setSelectedTileId(null);
    } else if (placements[slotId]) {
      setPlacements((prev) => ({ ...prev, [slotId]: null }));
    }
  };

  const cycleDial = (dialIdx: number, dir: -1 | 1) => {
    soundEngine.playTap();
    setFeedback(null);
    setDialErrors([]);
    setDialValues((prev) => {
      const next = [...prev];
      const len = DIALS[dialIdx].options.length;
      next[dialIdx] = (next[dialIdx] + dir + len) % len;
      return next;
    });
  };

  const handleVerify = () => {
    const emptySlots = ARCH_SLOTS.filter((s) => !placements[s.slotId]);
    if (emptySlots.length > 0) {
      soundEngine.playError();
      setFeedback({
        type: 'error',
        text: 'Először helyezd el mind a 4 építészeti kőtáblát a talapzatokon!',
      });
      return;
    }

    const wrongSlots = ARCH_SLOTS.filter((s) => placements[s.slotId] !== s.expectedTileId).map((s) => s.slotId);
    const wrongDials = DIALS.map((d, idx) => (dialValues[idx] !== d.correctIndex ? idx : -1)).filter((i) => i !== -1);

    if (wrongSlots.length === 0 && wrongDials.length === 0) {
      soundEngine.playUnlock();
      setFeedback({
        type: 'success',
        text: 'A kőtáblák és a tárcsák a helyükre kattantak! A mészkőkapu feltárul!',
      });
      setTimeout(onSolved, 700);
    } else {
      soundEngine.playError();
      onMistake();
      setSlotErrors(wrongSlots);
      setDialErrors(wrongDials);
      setFeedback({
        type: 'error',
        text: `Még nem nyílik a zár: ${wrongSlots.length} kőtábla és ${wrongDials.length} kőtárcsa javításra szorul.`,
      });
    }
  };

  const handleReset = () => {
    soundEngine.playTap();
    setSelectedTileId(null);
    setPlacements({ s1: null, s2: null, s3: null, s4: null });
    setDialValues([0, 0, 0]);
    setFeedback(null);
    setSlotErrors([]);
    setDialErrors([]);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Architecture matching */}
      <section aria-labelledby="ch1-step1-title" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ch1-step1-title" className="font-display text-lg font-bold text-[#F5EFE2]">
            1. feladat · Építészeti kőtáblák párosítása
          </h3>
          <span className="text-xs text-[#C7B99E]">
            Kattints egy kőtáblára, majd a hozzá tartozó leírásra!
          </span>
        </div>

        {/* Selectable Stone Tablets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ARCH_TILES.map((tile) => {
            const isSelected = selectedTileId === tile.id;
            const isPlaced = placedTileIds.has(tile.id);
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleTileClick(tile.id)}
                className={`min-h-[88px] p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  isSelected
                    ? 'bg-[#3A2D1D] border-[#D4A24C] ring-2 ring-[#D4A24C]/40 -translate-y-0.5'
                    : isPlaced
                      ? 'bg-[#1D1813] border-[#4A3D2E] opacity-55 hover:opacity-90'
                      : 'bg-[#261F17] border-[#4F4030] hover:border-[#D4A24C]/70'
                }`}
              >
                <ArchGlyph id={tile.id} />
                <span className="text-xs font-semibold text-[#F5EFE2] leading-tight">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Target Pedestals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ARCH_SLOTS.map((slot, index) => {
            const placedId = placements[slot.slotId];
            const placedTile = ARCH_TILES.find((t) => t.id === placedId);
            const hasError = slotErrors.includes(slot.slotId);
            return (
              <button
                key={slot.slotId}
                type="button"
                onClick={() => handleSlotClick(slot.slotId)}
                className={`min-h-[92px] p-3.5 rounded-lg border text-left flex items-center justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  hasError
                    ? 'bg-[#361B1A] border-[#E06C65]'
                    : placedTile
                      ? 'bg-[#2B2218] border-[#D4A24C]/70'
                      : selectedTileId
                        ? 'bg-[#211B15] border-dashed border-[#D4A24C]/70 hover:bg-[#2A2219]'
                        : 'bg-[#1C1611] border-[#3B3024] hover:border-[#6D5A45]'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-mono text-[#D4A24C] tabular-nums">
                    0{index + 1}. Talapzat {hasError && '· Hibás párosítás'}
                  </div>
                  <p className="text-sm text-[#E5DAC5] leading-snug">{slot.clue}</p>
                </div>
                <div className="shrink-0 w-28 min-h-[60px] rounded border border-[#4D3E2E] bg-[#16120E] flex flex-col items-center justify-center p-1.5 text-center">
                  {placedTile ? (
                    <>
                      <ArchGlyph id={placedTile.id} />
                      <span className="text-[11px] font-semibold text-[#F5EFE2] leading-tight mt-0.5">
                        {placedTile.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-[#9E8F76]">Üres hely</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <hr className="border-[#3B3024]" />

      {/* Step 2: 3 Rotating Stone Dials */}
      <section aria-labelledby="ch1-step2-title" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ch1-step2-title" className="font-display text-lg font-bold text-[#F5EFE2]">
            2. feladat · A mészkőkapu 3 kőtárcsája
          </h3>
          <span className="text-xs text-[#C7B99E]">Állítsd be a helyes választ a nyilakkal!</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DIALS.map((dial, idx) => {
            const hasErr = dialErrors.includes(idx);
            const currentOpt = dial.options[dialValues[idx]];
            return (
              <div
                key={dial.id}
                className={`p-4 rounded-lg border flex flex-col justify-between gap-3 ${
                  hasErr ? 'bg-[#361B1A] border-[#E06C65]' : 'bg-[#1C1611] border-[#3B3024]'
                }`}
              >
                <p className="text-sm font-medium text-[#F5EFE2] leading-snug">{dial.question}</p>
                <div className="flex items-center justify-between gap-2 bg-[#130F0C] border border-[#4A3D2E] rounded-lg p-1.5">
                  <button
                    type="button"
                    onClick={() => cycleDial(idx, -1)}
                    className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded bg-[#261F17] text-[#F5EFE2] hover:bg-[#3A2E22] focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
                    aria-label={`Előző válasz: ${dial.question}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-[#E8C073] text-center px-1 leading-tight">
                    {currentOpt}
                  </span>
                  <button
                    type="button"
                    onClick={() => cycleDial(idx, 1)}
                    className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded bg-[#261F17] text-[#F5EFE2] hover:bg-[#3A2E22] focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
                    aria-label={`Következő válasz: ${dial.question}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feedback & Actions */}
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

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
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
          Zár ellenőrzése
        </button>
      </div>
    </div>
  );
}
