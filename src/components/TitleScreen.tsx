import { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { TITLE_HERO_IMAGE } from '../data/pyramidData';
import { PyramidImage } from './PyramidImage';
import { soundEngine } from '../utils/sound';

interface TitleScreenProps {
  onStart: (explorerName: string) => void;
  onOpenHandbook: () => void;
}

export function TitleScreen({ onStart, onOpenHandbook }: TitleScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playUnlock();
    onStart(name.trim() || 'Ifjú Régész');
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#14110F] text-[#F5EFE2]">
      <div className="max-w-6xl w-full mx-auto px-6 py-10 md:py-16 space-y-12 flex-1 flex flex-col justify-center">
        {/* Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="text-xs font-semibold tracking-wide text-[#D4A24C]">
              5. osztály · Ókori egyiptomi művészet · Szabadulószoba
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F5EFE2] leading-[1.12] [text-wrap:balance]">
              A Piramis Titka: Szabadulás a Fáraó Kamráiból
            </h1>

            <p className="text-base text-[#D6C8AE] leading-relaxed max-w-xl">
              Régészcsapatoddal egy ősi gízai piramis mélyén rekedtél, miután a mészkőkapu lezárult mögöttetek. Oldd meg az 5 terem építészeti, festészeti, szobrászati és hieroglifa-rejtvényeit, gyűjtsd össze az 5 szent ereklyét, és juss ki a csillagos sivatagba!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md pt-1">
              <div>
                <label htmlFor="explorer-name" className="block text-xs font-semibold text-[#C7B99E] mb-1.5">
                  Régész vagy csapat neve (az oklevélhez)
                </label>
                <input
                  id="explorer-name"
                  type="text"
                  maxLength={32}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pl. 5.B Expedíció vagy Dóri"
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-lg bg-[#1F1914] border border-[#4D3E2E] text-sm text-[#F5EFE2] placeholder:text-[#8E7F66] focus:outline-none focus:border-[#D4A24C]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 min-h-[48px] rounded-lg bg-[#D4A24C] text-[#1A130B] text-sm font-bold hover:bg-[#E2B45E] inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5EFE2]"
                >
                  Belépés a piramisba
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    onOpenHandbook();
                  }}
                  className="px-5 py-3 min-h-[48px] rounded-lg border border-[#4D3E2E] text-[#E5DAC5] text-sm font-semibold hover:bg-[#211B15] inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4A24C]"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  Kézikönyv megnyitása
                </button>
              </div>
            </form>
          </div>

          {/* Right Artwork */}
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-[#3B3024] min-h-[280px] lg:min-h-[420px] relative">
            <PyramidImage
              src={TITLE_HERO_IMAGE}
              alt="A gízai nagy piramisok aranyló alkonyatban, fáklyákkal megvilágított bejárattal"
              aspectClass="w-full h-full"
              className="lg:h-full"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#14110F]/95 via-[#14110F]/50 to-transparent">
              <p className="text-xs font-medium text-[#E8C073]">
                Gízai fennsík · 5 egymásra épülő próba
              </p>
            </div>
          </div>
        </div>

        {/* Clean 4-column overview strip below split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-[#2E251C]">
          <div>
            <div className="font-mono text-2xl font-bold text-[#D4A24C] tabular-nums">5 kamra</div>
            <p className="text-xs text-[#B8AD98] mt-1">Építészettől Ma’at mérlegéig</p>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#D4A24C] tabular-nums">5 ereklye</div>
            <p className="text-xs text-[#B8AD98] mt-1">Összegyűjthető királyi kulcsok</p>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#D4A24C] tabular-nums">3 tipp / szoba</div>
            <p className="text-xs text-[#B8AD98] mt-1">Fokozatos segítség elakadás esetére</p>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#D4A24C] tabular-nums">Kézikönyv</div>
            <p className="text-xs text-[#B8AD98] mt-1">Bármikor megnyitható tananyag-segédlet</p>
          </div>
        </div>
      </div>
    </main>
  );
}
