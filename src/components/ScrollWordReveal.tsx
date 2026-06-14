import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollWordRevealProps {
  text: string;
  className?: string;
  highlights?: string[];
}

export const ScrollWordReveal: React.FC<ScrollWordRevealProps> = ({ text, className = "", highlights = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 25%"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={`${className} flex flex-wrap`}>
      {words.map((word, idx) => {
        // Map word position to a scroll window segment
        const start = idx / words.length;
        const end = Math.min(1, (idx + 1.5) / words.length);
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        
        // Match highlights
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()—]/g, "").toLowerCase();
        const isHighlight = highlights.map(h => h.toLowerCase()).includes(cleanWord);

        return (
          <motion.span
            key={idx}
            style={{ opacity }}
            className={`inline-block mr-[0.25em] transition-colors duration-200 ${
              isHighlight 
                ? 'text-foreground font-semibold' 
                : 'text-neutral-500 font-normal'
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
};
