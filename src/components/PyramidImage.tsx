import { useState } from 'react';

interface PyramidImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
}

export function PyramidImage({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-video',
}: PyramidImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative overflow-hidden bg-gradient-to-br from-[#2B2219] via-[#1C1611] to-[#120E0B] flex flex-col items-center justify-center p-6 text-center border border-[#D4A24C]/25 ${aspectClass} ${className}`}
      >
        <svg
          viewBox="0 0 120 80"
          className="w-24 h-16 text-[#D4A24C]/60 mb-3"
          fill="none"
          aria-hidden="true"
        >
          <polygon
            points="60,8 108,70 12,70"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <line x1="60" y1="8" x2="72" y2="70" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx="94" cy="22" r="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <p className="text-xs text-[#C7B99E] max-w-xs">{alt}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#18130F] ${aspectClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
