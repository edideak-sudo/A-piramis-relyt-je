import { useState, useEffect } from 'react';
import { BookOpen, Lightbulb, Volume2, VolumeX, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { CHAMBERS } from './data/pyramidData';
import { PyramidImage } from './components/PyramidImage';
import { HandbookModal } from './components/HandbookModal';
import { TitleScreen } from './components/TitleScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { Chamber1Architecture } from './components/chambers/Chamber1Architecture';
import { Chamber2FrescoCanon } from './components/chambers/Chamber2FrescoCanon';
import { Chamber3Sculpture } from './components/chambers/Chamber3Sculpture';
import { Chamber4Hieroglyphs } from './components/chambers/Chamber4Hieroglyphs';
import { Chamber5BurialScale } from './components/chambers/Chamber5BurialScale';
import { soundEngine } from './utils/sound';

type GamePhase = 'TITLE_MENU' | 'PLAYING' | 'CHAMBER_UNLOCKED' | 'VICTORY';

const CHAMBER_TO_HANDBOOK: Record<number, string> = {
  1: 'architecture',
  2: 'painting',
  3: 'sculpture',
  4: 'hieroglyphs',
  5: 'afterlife',
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('TITLE_MENU');
  const [explorerName, setExplorerName] = useState<string>('Ifjú Régész');
  const [currentChamberIndex, setCurrentChamberIndex] = useState<number>(0);
  const [unlockedCount, setUnlockedCount] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalHintsUsed, setTotalHintsUsed] = useState<number>(0);
  const [revealedHintsPerChamber, setRevealedHintsPerChamber] = useState<Record<number, number>>({});
  const [mistakes, setMistakes] = useState<number>(0);
  const [handbookOpen, setHandbookOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Elapsed time counter while playing
  useEffect(() => {
    if (phase !== 'PLAYING' && phase !== 'CHAMBER_UNLOCKED') return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [phase]);

  const currentChamber = CHAMBERS[currentChamberIndex];
  const currentHintsRevealed = revealedHintsPerChamber[currentChamber.id] || 0;

  const handleStart = (name: string) => {
    setExplorerName(name);
    setCurrentChamberIndex(0);
    setUnlockedCount(0);
    setElapsedSeconds(0);
    setTotalHintsUsed(0);
    setRevealedHintsPerChamber({});
    setMistakes(0);
    setPhase('PLAYING');
  };

  const handleRestart = () => {
    setPhase('TITLE_MENU');
    setCurrentChamberIndex(0);
    setUnlockedCount(0);
    setElapsedSeconds(0);
    setTotalHintsUsed(0);
    setRevealedHintsPerChamber({});
    setMistakes(0);
  };

  const handleChamberSolved = () => {
    const newUnlocked = Math.max(unlockedCount, currentChamberIndex + 1);
    setUnlockedCount(newUnlocked);
    if (currentChamberIndex === CHAMBERS.length - 1) {
      setPhase('VICTORY');
    } else {
      setPhase('CHAMBER_UNLOCKED');
    }
  };

  const handleAdvanceChamber = () => {
    soundEngine.playTap();
    setCurrentChamberIndex((prev) => Math.min(prev + 1, CHAMBERS.length - 1));
    setPhase('PLAYING');
  };

  const handleRevealHint = () => {
    if (currentHintsRevealed >= 3) return;
    soundEngine.playTap();
    setRevealedHintsPerChamber((prev) => ({
      ...prev,
      [currentChamber.id]: (prev[currentChamber.id] || 0) + 1,
    }));
    setTotalHintsUsed((prev) => prev + 1);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) soundEngine.playTap();
  };

  const handleMistake = () => {
    setMistakes((prev) => prev + 1);
  };

  if (phase === 'TITLE_MENU') {
    return (
      <>
        <TitleScreen
          onStart={handleStart}
          onOpenHandbook={() => setHandbookOpen(true)}
        />
        <HandbookModal
          isOpen={handbookOpen}
          onClose={() => setHandbookOpen(false)}
          initialSectionId="architecture"
        />
      </>
    );
  }

  if (phase === 'VICTORY') {
    return (
      <VictoryScreen
        explorerName={explorerName}
        elapsedSeconds={elapsedSeconds}
        hintsUsed={totalHintsUsed}
        mistakes={mistakes}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#14110F] text-[#F5EFE2]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="border-b border-[#2E251C] bg-[#191410]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Title */}
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#F5EFE2] whitespace-nowrap shrink-0">
            A Piramis Titka
          </span>

          {/* Zone 2: 5 Chamber Navigation Links */}
          <nav aria-label="Kamrák előrehaladása" className="hidden md:flex items-center gap-5">
            {CHAMBERS.map((ch, idx) => {
              const isCurrent = idx === currentChamberIndex;
              const isReachable = idx <= unlockedCount;
              return (
                <button
                  key={ch.id}
                  type="button"
                  disabled={!isReachable}
                  onClick={() => {
                    if (!isReachable) return;
                    soundEngine.playTap();
                    setCurrentChamberIndex(idx);
                    setPhase('PLAYING');
                  }}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] pb-0.5 border-b-2 ${
                    isCurrent
                      ? 'text-[#E8C073] border-[#D4A24C] font-semibold'
                      : isReachable
                        ? 'text-[#C7B99E] border-transparent hover:text-[#F5EFE2]'
                        : 'text-[#6A5D4B] border-transparent cursor-not-allowed'
                  }`}
                >
                  0{ch.id}. Kamra
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setHandbookOpen(true);
            }}
            className="px-4 py-2 min-h-[40px] rounded-lg bg-[#D4A24C] text-[#1A130B] text-xs sm:text-sm font-bold hover:bg-[#E2B45E] inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5EFE2]"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Kézikönyv
          </button>
        </div>
      </header>

      {/* Workspace Sub-toolbar (Compact unboxed metadata + utility buttons) */}
      <div className="border-b border-[#2A221A] bg-[#16120E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#C7B99E]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-semibold text-[#F5EFE2]">{explorerName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Idő: {formatTimer(elapsedSeconds)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Ereklyék: {unlockedCount} / 5</span>
            <span aria-hidden="true">·</span>
            <span className="md:hidden font-mono tabular-nums">Kamra: {currentChamberIndex + 1}/5</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMute}
              className="px-3 py-1.5 min-h-[36px] rounded border border-[#3B3024] text-[#D6C8AE] hover:bg-[#241D16] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
              aria-label={isMuted ? 'Hang bekapcsolása' : 'Hang némítása'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" aria-hidden="true" /> : <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />}
              <span>{isMuted ? 'Némítva' : 'Hang be'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                handleRestart();
              }}
              className="px-3 py-1.5 min-h-[36px] rounded border border-[#3B3024] text-[#D6C8AE] hover:bg-[#241D16] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Újrakezdés</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Escape Room Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Chamber Scene, Narrative, Hints & Relics */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-xl overflow-hidden border border-[#3B3024] bg-[#211B16]">
              <div className="relative">
                <PyramidImage
                  src={currentChamber.image}
                  alt={currentChamber.imageAlt}
                  aspectClass="aspect-video"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#14110F] via-[#14110F]/70 to-transparent">
                  <div className="text-xs font-semibold text-[#E8C073]">
                    {currentChamber.subtitle}
                  </div>
                  <h1 className="font-display text-xl font-bold text-[#F5EFE2] mt-0.5">
                    {currentChamber.title}
                  </h1>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-sm text-[#DFD3BD] leading-relaxed">
                  {currentChamber.story}
                </p>

                {/* Progressive 3-Tier Hint Box */}
                <div className="pt-3 border-t border-[#3B3024] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#C7B99E] font-mono tabular-nums">
                      Tippek ({currentHintsRevealed}/3)
                    </span>
                    <button
                      type="button"
                      disabled={currentHintsRevealed >= 3}
                      onClick={handleRevealHint}
                      className={`px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C] ${
                        currentHintsRevealed >= 3
                          ? 'bg-[#191410] text-[#7D705B] border border-[#2E251C] cursor-not-allowed'
                          : 'bg-[#2B2218] text-[#E8C073] border border-[#5A4732] hover:bg-[#3A2E20]'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                      {currentHintsRevealed >= 3 ? 'Minden tipp megnyitva' : 'Tipp kérése'}
                    </button>
                  </div>

                  {currentHintsRevealed > 0 && (
                    <div className="space-y-2">
                      {currentChamber.hints.slice(0, currentHintsRevealed).map((hint, idx) => (
                        <div
                          key={hint}
                          className="p-3 rounded-lg bg-[#F4ECD8] text-[#231A12] border border-[#C5AF7E] text-xs leading-relaxed"
                        >
                          <span className="font-bold">{idx + 1}. Tipp: </span>
                          {hint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sacred Relics Progress List */}
            <div className="rounded-xl bg-[#1A1510] border border-[#3B3024] p-4 space-y-2.5">
              <div className="text-xs font-semibold text-[#C7B99E]">
                Összegyűjtött ereklyék
              </div>
              <ul className="space-y-1.5">
                {CHAMBERS.map((ch, idx) => {
                  const isCollected = idx < unlockedCount;
                  return (
                    <li
                      key={ch.id}
                      className={`text-xs flex items-center justify-between gap-2 py-1 border-b border-[#292119] last:border-b-0 ${
                        isCollected ? 'text-[#B7F4D1] font-semibold' : 'text-[#8C7E67]'
                      }`}
                    >
                      <span className="truncate">0{ch.id}. {ch.relicName}</span>
                      <span className="shrink-0">
                        {isCollected ? 'Megszerezve' : 'Zárva'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Right Column: Active Interactive Puzzle Stage */}
          <section
            aria-label="Kamra rejtvénye"
            className="lg:col-span-8 rounded-xl bg-[#211B16] border border-[#3B3024] p-5 sm:p-6"
          >
            {phase === 'CHAMBER_UNLOCKED' ? (
              <div className="py-10 px-4 text-center space-y-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#173024] border border-[#38A169] text-[#B7F4D1]">
                  <Check className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#E8C073]">
                    0{currentChamber.id}. Kamra teljesítve · Új ereklye megszerezve
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5EFE2]">
                    {currentChamber.relicName}
                  </h2>
                  <p className="text-sm text-[#D6C8AE] max-w-lg mx-auto leading-relaxed">
                    {currentChamber.relicDescription}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAdvanceChamber}
                    className="px-7 py-3 min-h-[48px] rounded-lg bg-[#D4A24C] text-[#1A130B] text-sm font-bold hover:bg-[#E2B45E] inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[#F5EFE2]"
                  >
                    Tovább a következő kamrába
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {currentChamber.id === 1 && (
                  <Chamber1Architecture onSolved={handleChamberSolved} onMistake={handleMistake} />
                )}
                {currentChamber.id === 2 && (
                  <Chamber2FrescoCanon onSolved={handleChamberSolved} onMistake={handleMistake} />
                )}
                {currentChamber.id === 3 && (
                  <Chamber3Sculpture onSolved={handleChamberSolved} onMistake={handleMistake} />
                )}
                {currentChamber.id === 4 && (
                  <Chamber4Hieroglyphs onSolved={handleChamberSolved} onMistake={handleMistake} />
                )}
                {currentChamber.id === 5 && (
                  <Chamber5BurialScale onSolved={handleChamberSolved} onMistake={handleMistake} />
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <HandbookModal
        isOpen={handbookOpen}
        onClose={() => setHandbookOpen(false)}
        initialSectionId={CHAMBER_TO_HANDBOOK[currentChamber.id]}
      />
    </div>
  );
}

