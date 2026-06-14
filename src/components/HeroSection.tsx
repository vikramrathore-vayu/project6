import { useState, useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface HeroSectionProps {
  contactEmail?: string;
}

export function HeroSection({ contactEmail = 'hello@thevrcasa.com' }: HeroSectionProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [copied, setCopied] = useState(false);

  const typewriterText = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
  const { displayed, done } = useTypewriter(typewriterText, 38, 600);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const whitePills = [
    "Pitch us an idea",
    "Come work here",
    "Send a brief hello",
    "See how we operate"
  ];

  return (
    <section className="relative w-full h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden z-10">
      <div className="max-w-xl w-full text-left relative z-10">
        
        {/* Blurred Intro Label */}
        <div 
          className="pointer-events-none select-none mb-5 sm:mb-6 leading-[1.3] font-normal text-black"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            filter: 'blur(4px)',
          }}
        >
          Hey there, meet A.R.I.A,
          <br />
          the VR casa's Adaptive Response Interface Agent
        </div>

        {/* Typewriter Text */}
        <p 
          className="text-black mb-5 sm:mb-6 font-normal tracking-tight font-body"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: '1.35',
            minHeight: '54px',
          }}
        >
          {displayed}
          {!done && (
            <span 
              className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"
              style={{
                animation: 'blink 1s step-end infinite'
              }}
            />
          )}
        </p>

        {/* Action Pill Buttons */}
        <div 
          className={`flex flex-wrap gap-y-1 transition-all duration-500 ease-out ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* White Pills */}
          {whitePills.map((label) => (
            <button
              key={label}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 font-body font-normal shadow-sm"
            >
              {label}
            </button>
          ))}

          {/* Outline Pill Button */}
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center justify-center bg-transparent text-white border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 font-body font-normal gap-2 sm:gap-3 group"
          >
            <span>
              Reach us:{' '}
              <span className="underline underline-offset-2 decoration-1">
                {contactEmail}
              </span>
            </span>
            {copied ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 text-emerald-400 group-hover:text-emerald-600 transition-colors"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 opacity-80 group-hover:opacity-100"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
