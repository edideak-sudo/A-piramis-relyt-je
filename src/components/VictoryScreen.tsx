import { RotateCcw, Award } from 'lucide-react';
import { CHAMBERS } from '../data/pyramidData';
import { soundEngine } from '../utils/sound';

interface VictoryScreenProps {
  explorerName: string;
  elapsedSeconds: number;
  hintsUsed: number;
  mistakes: number;
  onRestart: () => void;
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function VictoryScreen({
  explorerName,
  elapsedSeconds,
  hintsUsed,
  mistakes,
  onRestart,
}: VictoryScreenProps) {
  const rank =
    hintsUsed === 0 && mistakes <= 2
      ? 'A Fáraó Kinevezett Főépítésze'
      : hintsUsed <= 3
        ? 'Királyi Művészettörténész'
        : 'Bátor Piramiskutató';

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#14110F] text-[#F5EFE2]">
      <div className="w-full max-w-3xl rounded-xl bg-[#1D1712] border border-[#D4A24C]/50 p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#2B2218] border border-[#D4A24C] text-[#D4A24C] mx-auto">
            <Award className="w-7 h-7" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold tracking-wide text-[#D4A24C]">
            Expedíció teljesítve · Szabadulás sikeres
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F5EFE2] [text-wrap:balance]">
            Gratulálunk, {explorerName}!
          </h1>
          <p className="text-sm sm:text-base text-[#D6C8AE] max-w-xl mx-auto leading-relaxed">
            Kijutottál a piramis minden kamrájából, és bebizonyítottad, hogy kiválóan ismered az ókori egyiptomi művészet titkait.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-[#3B3024]">
          <div>
            <div className="text-xs text-[#B8AD98]">Kijutási idő</div>
            <div className="font-mono text-2xl font-bold text-[#F5EFE2] tabular-nums mt-1">
              {formatTime(elapsedSeconds)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#B8AD98]">Kért tippek</div>
            <div className="font-mono text-2xl font-bold text-[#F5EFE2] tabular-nums mt-1">
              {hintsUsed} db
            </div>
          </div>
          <div>
            <div className="text-xs text-[#B8AD98]">Téves próbálkozás</div>
            <div className="font-mono text-2xl font-bold text-[#F5EFE2] tabular-nums mt-1">
              {mistakes} db
            </div>
          </div>
          <div>
            <div className="text-xs text-[#B8AD98]">Elnyert rang</div>
            <div className="text-sm font-bold text-[#E8C073] mt-1.5 leading-snug">{rank}</div>
          </div>
        </div>

        {/* Collected Relics */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-[#F5EFE2]">
            Összegyűjtött szent ereklyék (5 / 5)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHAMBERS.map((ch) => (
              <div
                key={ch.id}
                className="p-3.5 rounded-lg bg-[#14100C] border border-[#3B3024]"
              >
                <div className="text-xs font-mono text-[#D4A24C]">0{ch.id}. Kamra</div>
                <div className="text-sm font-bold text-[#F5EFE2] mt-0.5">{ch.relicName}</div>
                <p className="text-xs text-[#B8AD98] mt-1 leading-snug">{ch.relicDescription}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onRestart();
            }}
            className="px-6 py-3 min-h-[48px] rounded-lg bg-[#D4A24C] text-[#1A130B] text-sm font-bold hover:bg-[#E2B45E] inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[#F5EFE2]"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Új játék indítása
          </button>
        </div>
      </div>
    </main>
  );
}
