import { useState } from 'react';
import { Check, AlertCircle, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface Chamber3Props {
  onSolved: () => void;
  onMistake: () => void;
}

interface SculptureQuestion {
  id: string;
  title: string;
  prompt: string;
  options: string[];
  correctIdx: number;
}

const SCULPTURE_QUESTIONS: SculptureQuestion[] = [
  {
    id: 'q1',
    title: 'Nofertiti mellszobra',
    prompt: 'Milyen anyagból készült ez a világhírű királynéportré?',
    options: ['Égetett agyagból', 'Öntött bronzból', 'Festett mészkőből'],
    correctIdx: 2,
  },
  {
    id: 'q2',
    title: 'Tutanhamon halotti maszkja',
    prompt: 'Milyen értékes anyagokkal díszítették a fáraó maszkját?',
    options: ['Színarany és kék lazúrkő', 'Ezüst és vörös márvány', 'Faragott cédrusfa'],
    correctIdx: 0,
  },
  {
    id: 'q3',
    title: 'Királyi szobrok tartása',
    prompt: 'Mi jellemzi a legtöbb ókori egyiptomi királyszobrot?',
    options: [
      'Mozgalmas, táncoló testtartás',
      'Szigorú szimmetria és szemből néző tartás',
      'Aszimmetrikus oldalra hajlás',
    ],
    correctIdx: 1,
  },
];

interface EmblemItem {
  id: string;
  name: string;
  role: string;
}

const EMBLEMS: EmblemItem[] = [
  { id: 'beard', name: 'Álszakáll', role: 'Isteni méltóság jele' },
  { id: 'crook', name: 'Pásztorbot és ostor', role: 'Uralkodói hatalom' },
  { id: 'uraeus', name: 'Ureusz kígyó', role: 'Védelmező kobra' },
  { id: 'nemes', name: 'Nemesz fejkendő', role: 'Csíkos királyi kendő' },
];

const STATUE_SLOTS = [
  { id: 'forehead', label: '1. Homlok', expected: 'uraeus', y: 42 },
  { id: 'headcover', label: '2. Fejfedő', expected: 'nemes', y: 78 },
  { id: 'chin', label: '3. Áll', expected: 'beard', y: 120 },
  { id: 'hands', label: '4. Kezek', expected: 'crook', y: 170 },
];

export function Chamber3Sculpture({ onSolved, onMistake }: Chamber3Props) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
  });

  const [selectedEmblem, setSelectedEmblem] = useState<string | null>(null);
  const [slotEmblems, setSlotEmblems] = useState<Record<string, string | null>>({
    forehead: null,
    headcover: null,
    chin: null,
    hands: null,
  });

  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const placedEmblemIds = new Set(Object.values(slotEmblems).filter(Boolean) as string[]);

  const selectQuestionAnswer = (qId: string, idx: number) => {
    soundEngine.playTap();
    setFeedback(null);
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleEmblemClick = (id: string) => {
    soundEngine.playTap();
    setFeedback(null);
    if (placedEmblemIds.has(id)) {
      setSlotEmblems((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === id) next[k] = null;
        }
        return next;
      });
      setSelectedEmblem(id);
      return;
    }
    setSelectedEmblem((prev) => (prev === id ? null : id));
  };

  const handleSlotClick = (slotId: string) => {
    soundEngine.playTap();
    setFeedback(null);
    if (selectedEmblem) {
      setSlotEmblems((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === selectedEmblem) next[k] = null;
        }
        next[slotId] = selectedEmblem;
        return next;
      });
      setSelectedEmblem(null);
    } else if (slotEmblems[slotId]) {
      setSlotEmblems((prev) => ({ ...prev, [slotId]: null }));
    }
  };

  const handleVerify = () => {
    const unanswered = SCULPTURE_QUESTIONS.filter((q) => answers[q.id] === null);
    const emptySlots = STATUE_SLOTS.filter((s) => !slotEmblems[s.id]);

    if (unanswered.length > 0 || emptySlots.length > 0) {
      soundEngine.playError();
      setFeedback({
        type: 'error',
        text: 'Válaszolj mind a 3 szobrászati kérdésre, és helyezd fel a fáraó 4 jelképét!',
      });
      return;
    }

    const wrongQs = SCULPTURE_QUESTIONS.filter((q) => answers[q.id] !== q.correctIdx);
    const wrongSlots = STATUE_SLOTS.filter((s) => slotEmblems[s.id] !== s.expected);

    if (wrongQs.length === 0 && wrongSlots.length === 0) {
      soundEngine.playUnlock();
      setFeedback({
        type: 'success',
        text: 'A királyi szobor minden jelvénye a helyén ragyog! A szobrászműhely kapuja kitárul!',
      });
      setTimeout(onSolved, 700);
    } else {
      soundEngine.playError();
      onMistake();
      setFeedback({
        type: 'error',
        text: `Még ${wrongQs.length} szobrászati válasz és ${wrongSlots.length} királyi jelkép helye javításra szorul.`,
      });
    }
  };

  const handleReset = () => {
    soundEngine.playTap();
    setAnswers({ q1: null, q2: null, q3: null });
    setSelectedEmblem(null);
    setSlotEmblems({ forehead: null, headcover: null, chin: null, hands: null });
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Part A: Masterpiece inspection */}
      <section aria-labelledby="ch3-parta" className="space-y-4">
        <h3 id="ch3-parta" className="font-display text-lg font-bold text-[#F5EFE2]">
          1. feladat · Híres szobrok vizsgálata
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SCULPTURE_QUESTIONS.map((q) => (
            <div key={q.id} className="p-4 rounded-lg bg-[#1C1611] border border-[#3B3024] flex flex-col justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#D4A24C] mb-1">{q.title}</div>
                <p className="text-sm font-medium text-[#F5EFE2] leading-snug">{q.prompt}</p>
              </div>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const chosen = answers[q.id] === idx;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => selectQuestionAnswer(q.id, idx)}
                      className={`w-full min-h-[42px] px-3 py-2 rounded-lg border text-left text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                        chosen
                          ? 'bg-[#D4A24C] border-[#D4A24C] text-[#1A130B] font-bold'
                          : 'bg-[#14100C] border-[#3B3024] text-[#DFD3BD] hover:border-[#D4A24C]/60'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[#3B3024]" />

      {/* Part B: Royal Statue Emblem Placement */}
      <section aria-labelledby="ch3-partb" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ch3-partb" className="font-display text-lg font-bold text-[#F5EFE2]">
            2. feladat · A fáraó hatalmi jelvényei
          </h3>
          <span className="text-xs text-[#C7B99E]">
            Válassz ki egy jelvényt, majd helyezd a szobor megfelelő pontjára!
          </span>
        </div>

        {/* Emblems Palette */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EMBLEMS.map((em) => {
            const isSelected = selectedEmblem === em.id;
            const isPlaced = placedEmblemIds.has(em.id);
            return (
              <button
                key={em.id}
                type="button"
                onClick={() => handleEmblemClick(em.id)}
                className={`min-h-[64px] p-3 rounded-lg border text-left transition-all focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                  isSelected
                    ? 'bg-[#3A2D1D] border-[#D4A24C] ring-2 ring-[#D4A24C]/40'
                    : isPlaced
                      ? 'bg-[#1D1813] border-[#4A3D2E] opacity-55 hover:opacity-90'
                      : 'bg-[#261F17] border-[#4F4030] hover:border-[#D4A24C]/70'
                }`}
              >
                <div className="text-xs font-bold text-[#F5EFE2]">{em.name}</div>
                <div className="text-[11px] text-[#B8AD98] mt-0.5">{em.role}</div>
              </button>
            );
          })}
        </div>

        {/* Statue Silhouette + 4 Target Slots */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#1A140F] border border-[#3B3024] rounded-lg p-4">
          <div className="md:col-span-5 flex justify-center">
            <svg viewBox="0 0 200 220" className="w-48 h-52" aria-label="Fáraó szobor vázlat négy jelölt hellyel">
              {/* Pedestal */}
              <rect x="44" y="196" width="112" height="16" rx="2" fill="#3B3024" stroke="#D4A24C" strokeWidth="1.2" />
              {/* Shoulders and torso */}
              <path d="M52 126 H148 L142 196 H58 Z" fill="#2B2219" stroke="#C59B49" strokeWidth="1.5" />
              {/* Nemes headdress outline */}
              <path
                d="M72 52 C72 30 128 30 128 52 L144 126 H56 Z"
                fill={slotEmblems.headcover ? '#1D6396' : '#241C14'}
                stroke="#D4A24C"
                strokeWidth="1.6"
              />
              {/* Face */}
              <ellipse cx="100" cy="84" rx="22" ry="26" fill="#C6894A" stroke="#2B1D12" strokeWidth="1.5" />
              {/* Forehead Uraeus indicator */}
              <circle
                cx="100"
                cy="52"
                r="7"
                fill={slotEmblems.forehead ? '#D4A24C' : '#14100C'}
                stroke="#D4A24C"
                strokeWidth="1.5"
              />
              {/* Chin Beard indicator */}
              <rect
                x="95"
                y="110"
                width="10"
                height="24"
                rx="3"
                fill={slotEmblems.chin ? '#D4A24C' : '#14100C'}
                stroke="#D4A24C"
                strokeWidth="1.4"
              />
              {/* Crossed arms / hands indicator */}
              <circle
                cx="100"
                cy="162"
                r="14"
                fill={slotEmblems.hands ? '#D4A24C' : '#14100C'}
                stroke="#D4A24C"
                strokeWidth="1.5"
              />
              {/* Number markers */}
              <text x="100" y="55" textAnchor="middle" fontSize="9" fontWeight="bold" fill={slotEmblems.forehead ? '#1A130B' : '#D4A24C'}>1</text>
              <text x="128" y="82" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F5EFE2">2</text>
              <text x="100" y="125" textAnchor="middle" fontSize="9" fontWeight="bold" fill={slotEmblems.chin ? '#1A130B' : '#D4A24C'}>3</text>
              <text x="100" y="165" textAnchor="middle" fontSize="9" fontWeight="bold" fill={slotEmblems.hands ? '#1A130B' : '#D4A24C'}>4</text>
            </svg>
          </div>

          <div className="md:col-span-7 space-y-2.5">
            {STATUE_SLOTS.map((slot) => {
              const placed = EMBLEMS.find((e) => e.id === slotEmblems[slot.id]);
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSlotClick(slot.id)}
                  className={`w-full min-h-[52px] px-4 py-2.5 rounded-lg border flex items-center justify-between gap-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                    placed
                      ? 'bg-[#2B2218] border-[#D4A24C]/80'
                      : selectedEmblem
                        ? 'bg-[#211B15] border-dashed border-[#D4A24C]/70 hover:bg-[#2A2219]'
                        : 'bg-[#14100C] border-[#3B3024] hover:border-[#6D5A45]'
                  }`}
                >
                  <span className="text-sm font-semibold text-[#F5EFE2]">{slot.label}</span>
                  <span className="text-xs font-semibold text-[#E8C073]">
                    {placed ? placed.name : 'Kattints a felhelyezéshez'}
                  </span>
                </button>
              );
            })}
          </div>
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
          Szobor ellenőrzése
        </button>
      </div>
    </div>
  );
}
