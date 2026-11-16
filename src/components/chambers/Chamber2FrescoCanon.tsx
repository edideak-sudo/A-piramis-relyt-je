import { useState } from 'react';
import { Check, AlertCircle, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface Chamber2Props {
  onSolved: () => void;
  onMistake: () => void;
}

type ViewMode = 'front' | 'profile';

interface BodyPartRule {
  key: 'head' | 'eye' | 'torso' | 'legs';
  label: string;
  expected: ViewMode;
}

const BODY_PARTS: BodyPartRule[] = [
  { key: 'legs', label: 'Lábak és lábfejek', expected: 'profile' },
  { key: 'eye', label: 'Szem', expected: 'front' },
  { key: 'head', label: 'Fej', expected: 'profile' },
  { key: 'torso', label: 'Vállak és mellkas', expected: 'front' },
];

interface PigmentBowl {
  id: string;
  label: string;
  swatchHex: string;
}

const PIGMENTS: PigmentBowl[] = [
  { id: 'green', label: 'Zöld', swatchHex: '#2E8B57' },
  { id: 'ochre', label: 'Okkervörös', swatchHex: '#B84A27' },
  { id: 'gold', label: 'Arany', swatchHex: '#D4A24C' },
  { id: 'black', label: 'Fekete', swatchHex: '#1F1B18' },
];

const PIGMENT_SLOTS = [
  { id: 'p1', expected: 'black', meaning: 'Termékeny Nílus-iszap és újjászületés' },
  { id: 'p2', expected: 'gold', meaning: 'Isteni fény és örökkévalóság' },
  { id: 'p3', expected: 'ochre', meaning: 'Férfiak ereje és életerő' },
  { id: 'p4', expected: 'green', meaning: 'Élet, természet és növekedés' },
];

export function Chamber2FrescoCanon({ onSolved, onMistake }: Chamber2Props) {
  // Start scrambled so student actively fixes the canon
  const [views, setViews] = useState<Record<'head' | 'eye' | 'torso' | 'legs', ViewMode>>({
    head: 'front',
    eye: 'profile',
    torso: 'profile',
    legs: 'front',
  });
  const [hierarchyBigger, setHierarchyBigger] = useState<boolean>(false);

  const [selectedPigment, setSelectedPigment] = useState<string | null>(null);
  const [pigmentSlots, setPigmentSlots] = useState<Record<string, string | null>>({
    p1: null,
    p2: null,
    p3: null,
    p4: null,
  });

  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const placedPigments = new Set(Object.values(pigmentSlots).filter(Boolean) as string[]);

  const togglePartView = (key: 'head' | 'eye' | 'torso' | 'legs', mode: ViewMode) => {
    soundEngine.playTap();
    setFeedback(null);
    setViews((prev) => ({ ...prev, [key]: mode }));
  };

  const handlePigmentClick = (pigmentId: string) => {
    soundEngine.playTap();
    setFeedback(null);
    if (placedPigments.has(pigmentId)) {
      setPigmentSlots((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === pigmentId) next[k] = null;
        }
        return next;
      });
      setSelectedPigment(pigmentId);
      return;
    }
    setSelectedPigment((prev) => (prev === pigmentId ? null : pigmentId));
  };

  const handleSlotClick = (slotId: string) => {
    soundEngine.playTap();
    setFeedback(null);
    if (selectedPigment) {
      setPigmentSlots((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === selectedPigment) next[k] = null;
        }
        next[slotId] = selectedPigment;
        return next;
      });
      setSelectedPigment(null);
    } else if (pigmentSlots[slotId]) {
      setPigmentSlots((prev) => ({ ...prev, [slotId]: null }));
    }
  };

  const handleVerify = () => {
    const wrongParts = BODY_PARTS.filter((bp) => views[bp.key] !== bp.expected);
    const emptyPigments = PIGMENT_SLOTS.filter((ps) => !pigmentSlots[ps.id]);
    const wrongPigments = PIGMENT_SLOTS.filter((ps) => pigmentSlots[ps.id] !== ps.expected);

    if (emptyPigments.length > 0) {
      soundEngine.playError();
      setFeedback({
        type: 'error',
        text: 'Helyezd el mind a 4 festéktégelyt a színszimbolika mezőkön!',
      });
      return;
    }

    if (wrongParts.length === 0 && hierarchyBigger && wrongPigments.length === 0) {
      soundEngine.playUnlock();
      setFeedback({
        type: 'success',
        text: 'Tökéletes egyiptomi kánon és színpaletta! A falfestmény mögött feltárul az átjáró!',
      });
      setTimeout(onSolved, 700);
    } else {
      soundEngine.playError();
      onMistake();
      const issues: string[] = [];
      if (wrongParts.length > 0) {
        issues.push(`${wrongParts.length} testrész nézete`);
      }
      if (!hierarchyBigger) {
        issues.push('a mérethierarchia');
      }
      if (wrongPigments.length > 0) {
        issues.push(`${wrongPigments.length} festéktégely jelentése`);
      }
      setFeedback({
        type: 'error',
        text: `Ellenőrizd még: ${issues.join(', ')}. Tipp: a Kézikönyvben megnézheted a szemtörvényt!`,
      });
    }
  };

  const handleReset = () => {
    soundEngine.playTap();
    setViews({ head: 'front', eye: 'profile', torso: 'profile', legs: 'front' });
    setHierarchyBigger(false);
    setSelectedPigment(null);
    setPigmentSlots({ p1: null, p2: null, p3: null, p4: null });
    setFeedback(null);
  };

  const isCanonComplete =
    views.head === 'profile' &&
    views.eye === 'front' &&
    views.torso === 'front' &&
    views.legs === 'profile' &&
    hierarchyBigger;

  return (
    <div className="space-y-6">
      {/* Part A: Live Egyptian Relief Reconstruction */}
      <section aria-labelledby="ch2-parta" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ch2-parta" className="font-display text-lg font-bold text-[#F5EFE2]">
            1. feladat · Az egyiptomi kánon helyreállítása
          </h3>
          <span className="text-xs text-[#C7B99E]">
            Állítsd be minden testrésznél a „legjellemzőbb nézetet”!
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Interactive Live SVG Fresco Preview */}
          <div className="lg:col-span-5 rounded-lg bg-[#E6D6B8] border-2 border-[#A68346] p-4 flex flex-col items-center justify-between text-[#231A12]">
            <div className="w-full flex items-center justify-between text-xs font-semibold text-[#5E4520] mb-2">
              <span>Élő falfestmény-terv</span>
              <span>{isCanonComplete ? 'Helyes kánon' : 'Állítás alatt'}</span>
            </div>

            <svg viewBox="0 0 240 240" className="w-full max-w-[230px] h-auto" aria-label="Egyiptomi falfestmény előnézet">
              {/* Limestone wall background */}
              <rect x="6" y="6" width="228" height="228" rx="6" fill="#EFE2C6" stroke="#B69458" strokeWidth="2" />
              {/* Ground register line */}
              <line x1="16" y1="212" x2="224" y2="212" stroke="#7A5A2B" strokeWidth="3" />

              {/* Servant figure (right side) demonstrating size hierarchy */}
              <g transform={hierarchyBigger ? 'translate(166, 118) scale(0.55)' : 'translate(152, 42) scale(1)'}>
                <circle cx="24" cy="24" r="11" fill="#C97C4B" stroke="#2B1D12" strokeWidth="2" />
                <path d="M14 38 L34 38 L30 92 L18 92 Z" fill="#F8F3E6" stroke="#2B1D12" strokeWidth="2" />
                <line x1="20" y1="92" x2="14" y2="165" stroke="#C97C4B" strokeWidth="7" strokeLinecap="round" />
                <line x1="28" y1="92" x2="36" y2="165" stroke="#C97C4B" strokeWidth="7" strokeLinecap="round" />
              </g>

              {/* Pharaoh figure (left/center) */}
              <g transform="translate(36, 26)">
                {/* Nemes headdress base */}
                <path d="M40 20 C40 6 70 6 70 22 L76 48 L34 48 Z" fill="#1D6396" stroke="#D4A24C" strokeWidth="2" />
                {/* Head */}
                {views.head === 'profile' ? (
                  <path d="M44 20 H64 L68 31 L64 35 L64 44 H44 Z" fill="#C66D3B" stroke="#2B1D12" strokeWidth="2" />
                ) : (
                  <ellipse cx="55" cy="32" rx="12" ry="14" fill="#C66D3B" stroke="#2B1D12" strokeWidth="2" />
                )}

                {/* Eye */}
                {views.eye === 'front' ? (
                  <g>
                    <ellipse cx="57" cy="29" rx="4.5" ry="2.6" fill="#FFFFFF" stroke="#1E1710" strokeWidth="1.3" />
                    <circle cx="57" cy="29" r="1.4" fill="#1E1710" />
                  </g>
                ) : (
                  <line x1="60" y1="29" x2="65" y2="29" stroke="#1E1710" strokeWidth="2" strokeLinecap="round" />
                )}

                {/* Torso / Shoulders */}
                {views.torso === 'front' ? (
                  <g>
                    {/* Broad frontal shoulders */}
                    <path d="M26 50 H84 L70 112 H40 Z" fill="#C66D3B" stroke="#2B1D12" strokeWidth="2" />
                    {/* Collar necklace */}
                    <path d="M36 50 Q55 66 74 50" fill="none" stroke="#D4A24C" strokeWidth="5" />
                    {/* White kilt */}
                    <path d="M40 100 H70 L74 128 H36 Z" fill="#FAF6EB" stroke="#2B1D12" strokeWidth="2" />
                    {/* Arms holding staff */}
                    <path d="M26 54 L16 86 L28 96" fill="none" stroke="#C66D3B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M84 54 L94 84 L82 96" fill="none" stroke="#C66D3B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ) : (
                  <g>
                    {/* Narrow profile torso */}
                    <path d="M45 50 H65 L66 112 H44 Z" fill="#C66D3B" stroke="#2B1D12" strokeWidth="2" />
                    <path d="M44 100 H66 L68 128 H42 Z" fill="#FAF6EB" stroke="#2B1D12" strokeWidth="2" />
                    <path d="M55 56 L68 92" fill="none" stroke="#C66D3B" strokeWidth="7" strokeLinecap="round" />
                  </g>
                )}

                {/* Legs */}
                {views.legs === 'profile' ? (
                  <g>
                    {/* Striding profile legs */}
                    <path d="M46 128 L32 182 H22" fill="none" stroke="#C66D3B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M64 128 L78 182 H88" fill="none" stroke="#C66D3B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ) : (
                  <g>
                    {/* Static front-facing legs */}
                    <line x1="47" y1="128" x2="47" y2="182" stroke="#C66D3B" strokeWidth="9" strokeLinecap="round" />
                    <line x1="63" y1="128" x2="63" y2="182" stroke="#C66D3B" strokeWidth="9" strokeLinecap="round" />
                    <ellipse cx="47" cy="183" rx="5" ry="3" fill="#C66D3B" stroke="#2B1D12" strokeWidth="1.2" />
                    <ellipse cx="63" cy="183" rx="5" ry="3" fill="#C66D3B" stroke="#2B1D12" strokeWidth="1.2" />
                  </g>
                )}
              </g>
            </svg>

            <p className="text-xs text-[#4E3B23] text-center mt-2">
              {hierarchyBigger
                ? 'A fáraó nagyobbnak látszik a szolgánál (mérethierarchia).'
                : 'Figyeld a jobb oldali alakot: jelenleg ugyanolyan magas, mint a fáraó!'}
            </p>
          </div>

          {/* Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3">
            {BODY_PARTS.map((bp) => {
              const current = views[bp.key];
              return (
                <div
                  key={bp.key}
                  className="p-3.5 rounded-lg bg-[#1C1611] border border-[#3B3024] flex flex-wrap items-center justify-between gap-3"
                >
                  <span className="text-sm font-semibold text-[#F5EFE2]">{bp.label}</span>
                  <div className="flex items-center gap-1.5 bg-[#120E0B] p-1 rounded-lg border border-[#3B3024]">
                    <button
                      type="button"
                      onClick={() => togglePartView(bp.key, 'front')}
                      className={`px-3.5 py-2 min-h-[40px] rounded text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                        current === 'front'
                          ? 'bg-[#D4A24C] text-[#1A130B]'
                          : 'text-[#C7B99E] hover:text-[#F5EFE2]'
                      }`}
                    >
                      Szemből
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePartView(bp.key, 'profile')}
                      className={`px-3.5 py-2 min-h-[40px] rounded text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                        current === 'profile'
                          ? 'bg-[#D4A24C] text-[#1A130B]'
                          : 'text-[#C7B99E] hover:text-[#F5EFE2]'
                      }`}
                    >
                      Oldalnézet
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Hierarchy rule toggle */}
            <div className="p-3.5 rounded-lg bg-[#1C1611] border border-[#3B3024] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-sm font-semibold text-[#F5EFE2] block">Mérethierarchia</span>
                <span className="text-xs text-[#B8AD98]">Mekkora a fáraó a szolgákhoz képest?</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#120E0B] p-1 rounded-lg border border-[#3B3024]">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setFeedback(null);
                    setHierarchyBigger(false);
                  }}
                  className={`px-3 py-2 min-h-[40px] rounded text-xs font-semibold whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                    !hierarchyBigger ? 'bg-[#D4A24C] text-[#1A130B]' : 'text-[#C7B99E] hover:text-[#F5EFE2]'
                  }`}
                >
                  Egyformák
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setFeedback(null);
                    setHierarchyBigger(true);
                  }}
                  className={`px-3 py-2 min-h-[40px] rounded text-xs font-semibold whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                    hierarchyBigger ? 'bg-[#D4A24C] text-[#1A130B]' : 'text-[#C7B99E] hover:text-[#F5EFE2]'
                  }`}
                >
                  A fáraó nagyobb
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-[#3B3024]" />

      {/* Part B: Color Symbolism */}
      <section aria-labelledby="ch2-partb" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ch2-partb" className="font-display text-lg font-bold text-[#F5EFE2]">
            2. feladat · A szent festékek jelentése
          </h3>
          <span className="text-xs text-[#C7B99E]">
            Válassz egy festéktégelyt, majd kattints a jelentésére!
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PIGMENTS.map((pig) => {
            const isSelected = selectedPigment === pig.id;
            const isPlaced = placedPigments.has(pig.id);
            return (
              <button
                key={pig.id}
                type="button"
                onClick={() => handlePigmentClick(pig.id)}
                className={`min-h-[56px] p-3 rounded-lg border flex items-center gap-3 transition-all focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  isSelected
                    ? 'bg-[#3A2D1D] border-[#D4A24C] ring-2 ring-[#D4A24C]/40'
                    : isPlaced
                      ? 'bg-[#1D1813] border-[#4A3D2E] opacity-55 hover:opacity-90'
                      : 'bg-[#261F17] border-[#4F4030] hover:border-[#D4A24C]/70'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full border border-white/30 shrink-0"
                  style={{ backgroundColor: pig.swatchHex }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[#F5EFE2] whitespace-nowrap">{pig.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PIGMENT_SLOTS.map((slot) => {
            const placed = PIGMENTS.find((p) => p.id === pigmentSlots[slot.id]);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleSlotClick(slot.id)}
                className={`min-h-[64px] p-3.5 rounded-lg border flex items-center justify-between gap-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  placed
                    ? 'bg-[#2B2218] border-[#D4A24C]/70'
                    : selectedPigment
                      ? 'bg-[#211B15] border-dashed border-[#D4A24C]/70 hover:bg-[#2A2219]'
                      : 'bg-[#1C1611] border-[#3B3024] hover:border-[#6D5A45]'
                }`}
              >
                <span className="text-sm text-[#E5DAC5]">{slot.meaning}</span>
                <span className="shrink-0 px-3 py-1.5 rounded bg-[#14100C] border border-[#4A3D2E] text-xs font-semibold text-[#F5EFE2] inline-flex items-center gap-2">
                  {placed ? (
                    <>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: placed.swatchHex }}
                        aria-hidden="true"
                      />
                      {placed.label}
                    </>
                  ) : (
                    <span className="text-[#9E8F76]">Válassz színt</span>
                  )}
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
          Festmény ellenőrzése
        </button>
      </div>
    </div>
  );
}
