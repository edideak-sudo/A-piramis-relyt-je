import { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { KNOWLEDGE_SECTIONS } from '../data/pyramidData';
import { soundEngine } from '../utils/sound';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSectionId?: string;
}

export function HandbookModal({ isOpen, onClose, initialSectionId }: HandbookModalProps) {
  const [activeId, setActiveId] = useState(initialSectionId || KNOWLEDGE_SECTIONS[0].id);

  useEffect(() => {
    if (initialSectionId) {
      setActiveId(initialSectionId);
    }
  }, [initialSectionId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const current = KNOWLEDGE_SECTIONS.find((s) => s.id === activeId) || KNOWLEDGE_SECTIONS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handbook-title"
    >
      <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col bg-[#F4ECD8] text-[#231A12] rounded-xl border border-[#B88B3A] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[#E9DEC3] border-b border-[#CBB88D]">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-5 h-5 text-[#7A5317] shrink-0" aria-hidden="true" />
            <h2 id="handbook-title" className="font-display text-lg md:text-xl font-bold text-[#231A12] truncate">
              Expedíciós Kézikönyv · Ókori Egyiptom Művészete
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-[#4B3A26] hover:bg-[#D9C9A3] focus-visible:outline-2 focus-visible:outline-[#8A5B14] transition-colors shrink-0"
            aria-label="Kézikönyv bezárása"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-3 bg-[#EFE5CC] border-b border-[#D6C59E] overflow-x-auto">
          {KNOWLEDGE_SECTIONS.map((sec) => {
            const isActive = sec.id === current.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveId(sec.id);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-[#8A5B14] ${
                  isActive
                    ? 'bg-[#2B2118] text-[#F5EFE2]'
                    : 'bg-transparent text-[#4B3A26] hover:bg-[#E1D3B2]'
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#7A5317]">{current.subtitle}</p>
            <h3 className="font-display text-2xl font-bold text-[#231A12] mt-1">{current.title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.facts.map((fact) => (
              <div
                key={fact.term}
                className="p-4 rounded-lg bg-[#FBF7EC] border border-[#D8C9A6]"
              >
                <h4 className="font-bold text-base text-[#231A12] mb-1.5">{fact.term}</h4>
                <p className="text-sm text-[#433424] leading-relaxed">{fact.detail}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-[#E9DEC3] border border-[#C5AF7E]">
            <p className="text-xs font-bold text-[#6E4912] mb-1">Régész megjegyzés</p>
            <p className="text-sm text-[#2C2014] leading-relaxed">{current.tip}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-[#E9DEC3] border-t border-[#CBB88D]">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#2B2118] text-[#F5EFE2] text-sm font-semibold hover:bg-[#3F3123] focus-visible:outline-2 focus-visible:outline-[#8A5B14] transition-colors whitespace-nowrap shrink-0"
          >
            Vissza a kamrába
          </button>
        </div>
      </div>
    </div>
  );
}
