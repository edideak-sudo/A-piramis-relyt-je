import { useState } from 'react';
import { Check, AlertCircle, Lock, Unlock } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface Chamber5Props {
  onSolved: () => void;
  onMistake: () => void;
}

interface TruthSeal {
  id: string;
  sealTitle: string;
  question: string;
  options: string[];
  correctIdx: number;
}

const TRUTH_SEALS: TruthSeal[] = [
  {
    id: 'seal1',
    sealTitle: '1. Kőpecsét · Kanópusz edények',
    question: 'Mit őriztek a négy, istenfejes kupakkal lezárt kanópusz edényben?',
    options: [
      'A mumifikálás során kiemelt belső szerveket',
      'A fáraó aranypénzeit és ékszereit',
      'Az írnokok nádtollait és tintáját',
    ],
    correctIdx: 0,
  },
  {
    id: 'seal2',
    sealTitle: '2. Kőpecsét · Usébti szobrocskák',
    question: 'Miért helyeztek apró usébti szobrocskákat a sírkamrába?',
    options: [
      'Hogy játékok legyenek a gyermekeknek',
      'Hogy ajtókitámasztóként szolgáljanak',
      'Hogy a túlvilági munkákban segítsék az elhunytat',
    ],
    correctIdx: 2,
  },
  {
    id: 'seal3',
    sealTitle: '3. Kőpecsét · Halottak Könyve',
    question: 'Mire szolgált a díszesen festett papirusztekercs, a Halottak Könyve?',
    options: [
      'Adószedési névsort tartalmazott a Nílus mentéről',
      'Varázsigékkel segítette a lelket a túlvilági próbákon',
      'Piramisépítési költségvetést rögzített',
    ],
    correctIdx: 1,
  },
  {
    id: 'seal4',
    sealTitle: '4. Kőpecsét · Összegző művészeti próba',
    question: 'Miért ábrázolták a fáraót a faliképeken sokkal nagyobbnak a szolgáinál?',
    options: [
      'Mert az ókori festők nem ismerték a méretarányt',
      'Mert a fáraó mindig egy magas létrán állt',
      'A mérethierarchia az isteni rangot és hatalmat mutatta',
    ],
    correctIdx: 2,
  },
];

export function Chamber5BurialScale({ onSolved, onMistake }: Chamber5Props) {
  const [solvedSeals, setSolvedSeals] = useState<string[]>([]);
  const [activeSealId, setActiveSealId] = useState<string>(TRUTH_SEALS[0].id);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const solvedCount = solvedSeals.length;
  const allBalanced = solvedCount === TRUTH_SEALS.length;

  // Beam tilts from +16deg (right side heavier with Ma'at feather) down to 0deg (perfectly balanced)
  const tiltDeg = 16 - solvedCount * 4;

  const activeSeal = TRUTH_SEALS.find((s) => s.id === activeSealId) || TRUTH_SEALS[0];

  const handleAnswer = (optIdx: number) => {
    if (solvedSeals.includes(activeSeal.id)) return;

    if (optIdx === activeSeal.correctIdx) {
      soundEngine.playSuccess();
      const nextSolved = [...solvedSeals, activeSeal.id];
      setSolvedSeals(nextSolved);
      setFeedback({
        type: 'success',
        text: `${activeSeal.sealTitle} feloldva! A kősúly a mérlegre került.`,
      });
      const nextUnsolved = TRUTH_SEALS.find((s) => !nextSolved.includes(s.id));
      if (nextUnsolved) {
        setActiveSealId(nextUnsolved.id);
      }
      if (nextSolved.length === TRUTH_SEALS.length) {
        soundEngine.playUnlock();
      }
    } else {
      soundEngine.playError();
      onMistake();
      setFeedback({
        type: 'error',
        text: 'Ez a válasz még nem egyensúlyozza ki Ma’at mérlegét. Gondold át újra vagy nézd meg a Kézikönyvet!',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Ma'at Balance Scale Visualization */}
      <div className="p-5 rounded-lg bg-[#1A140F] border border-[#4D3E2E] flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <svg viewBox="0 0 280 185" className="w-full max-w-[280px] h-auto" aria-label="Ma'at igazságmérlege">
            {/* Base and Central Pillar */}
            <rect x="96" y="164" width="88" height="12" rx="3" fill="#8C672A" stroke="#E8C073" strokeWidth="1.2" />
            <rect x="135" y="42" width="10" height="122" fill="#B5873B" stroke="#E8C073" strokeWidth="1.2" />
            <circle cx="140" cy="36" r="8" fill="#D4A24C" />

            {/* Rotating Balance Beam */}
            <g
              style={{
                transform: `rotate(${tiltDeg}deg)`,
                transformOrigin: '140px 44px',
                transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <rect x="44" y="41" width="192" height="6" rx="3" fill="#D4A24C" />

              {/* Left Pan (Truth Seals) */}
              <line x1="56" y1="47" x2="36" y2="104" stroke="#C59B49" strokeWidth="1.4" />
              <line x1="56" y1="47" x2="76" y2="104" stroke="#C59B49" strokeWidth="1.4" />
              <path d="M28 104 Q56 122 84 104 Z" fill="#8C672A" stroke="#E8C073" strokeWidth="1.3" />
              {/* Placed Stone Weights on Left Pan */}
              {solvedSeals.map((id, idx) => (
                <rect
                  key={id}
                  x={38 + idx * 10}
                  y={90}
                  width="8"
                  height="13"
                  rx="1.5"
                  fill="#2B9E96"
                  stroke="#A8F0EA"
                  strokeWidth="1"
                />
              ))}

              {/* Right Pan (Ma'at's Feather) */}
              <line x1="224" y1="47" x2="204" y2="104" stroke="#C59B49" strokeWidth="1.4" />
              <line x1="224" y1="47" x2="244" y2="104" stroke="#C59B49" strokeWidth="1.4" />
              <path d="M196 104 Q224 122 252 104 Z" fill="#8C672A" stroke="#E8C073" strokeWidth="1.3" />
              {/* Feather of Truth */}
              <path
                d="M224 103 C224 85 234 72 242 64 C236 78 232 90 226 103 Z"
                fill="#F5EFE2"
                stroke="#D4A24C"
                strokeWidth="1.2"
              />
            </g>
          </svg>

          <div className="text-xs font-mono text-[#E8C073] tabular-nums mt-1">
            Egyensúly: {solvedCount} / {TRUTH_SEALS.length} kőpecsét ·{' '}
            {allBalanced ? 'EGYENSÚLYBAN' : 'MÉRLEGELÉS ALATT'}
          </div>
        </div>

        {/* Seal Selector List */}
        <div className="w-full md:w-1/2 space-y-2">
          {TRUTH_SEALS.map((seal) => {
            const isSolved = solvedSeals.includes(seal.id);
            const isActive = activeSeal.id === seal.id;
            return (
              <button
                key={seal.id}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setFeedback(null);
                  setActiveSealId(seal.id);
                }}
                className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border flex items-center justify-between gap-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  isSolved
                    ? 'bg-[#173024] border-[#38A169] text-[#B7F4D1]'
                    : isActive
                      ? 'bg-[#2B2218] border-[#D4A24C] text-[#F5EFE2]'
                      : 'bg-[#14100C] border-[#3B3024] text-[#C7B99E] hover:border-[#6D5A45]'
                }`}
              >
                <span className="text-xs sm:text-sm font-semibold truncate">{seal.sealTitle}</span>
                {isSolved ? (
                  <Unlock className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Lock className="w-4 h-4 shrink-0 text-[#D4A24C]" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Seal Question or Escape Gate Action */}
      {!allBalanced ? (
        <div className="p-5 rounded-lg bg-[#1C1611] border border-[#3B3024] space-y-4">
          <div className="text-xs font-semibold text-[#D4A24C]">{activeSeal.sealTitle}</div>
          <h3 className="font-display text-lg font-bold text-[#F5EFE2]">{activeSeal.question}</h3>

          {solvedSeals.includes(activeSeal.id) ? (
            <div className="text-sm text-[#B7F4D1] font-medium flex items-center gap-2">
              <Check className="w-4 h-4" aria-hidden="true" />
              Ez a kőpecsét már a mérleg serpenyőjén van. Válassz egy másik zárt pecsétet!
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeSeal.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(idx)}
                  className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-[#14100C] border border-[#4A3D2E] text-left text-sm font-medium text-[#F5EFE2] hover:border-[#D4A24C] hover:bg-[#261F17] transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-lg bg-[#173024] border border-[#38A169] text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-[#F5EFE2]">
            A Napkapu feltárult előtted!
          </h3>
          <p className="text-sm text-[#D1F5E0] max-w-xl mx-auto leading-relaxed">
            Ma’at mérlege tökéletes egyensúlyba került. A csillagos sivatagi égbolt és a szabadság már csak egy lépésre van.
          </p>
          <button
            type="button"
            onClick={() => {
              soundEngine.playVictory();
              onSolved();
            }}
            className="px-8 py-3 min-h-[48px] rounded-lg bg-[#D4A24C] text-[#1A130B] text-base font-bold hover:bg-[#E2B45E] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5EFE2] whitespace-nowrap"
          >
            Kijutás a Piramisból
          </button>
        </div>
      )}

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
    </div>
  );
}
